/**
 * VFXManager.ts —— Cocos Creator 3.8.x / 2D 特效播放管理器
 *
 * 能力：
 *  1. resources 目录批量预加载序列帧（SpriteFrame）
 *  2. 对象池复用，避免战斗高峰频繁实例化
 *  3. 代码驱动序列帧播放（不入 AnimationClip，方便配表与池化）
 *  4. 加法叠加材质切换（发光类特效）
 *  5. 同屏并发上限 + 全局总上限，防止低端机卡顿
 *  6. 自动跟随节点（子弹拖尾、护盾挂点）
 *
 * 用法：
 *   VFXManager.init(4 个 VFXLayer 节点)  // 4 层: 1 地面 / 2 角色怪物 / 3 命中 / 4 UI之上
 *   VFXManager.play('VFX_Hit_Monster', worldPos)
 *   const h = VFXManager.play('VFX_Core_Shield', coreNode.worldPosition, { follow: coreNode })
 *   h.stop()
 */

import {
    _decorator, Component, Node, Sprite, SpriteFrame, Material, resources,
    UITransform, Vec3, director, math, Size,
} from 'cc';
import { VFX_LIST, VFXDef } from './VFXConfig';

const { ccclass, property } = _decorator;

/** 一次播放实例的句柄 */
export class VFXHandle {
    node: Node = null!;
    def: VFXDef = null!;
    finished = false;
    private _mgr: VFXManager = null!;

    constructor(mgr: VFXManager, node: Node, def: VFXDef) {
        this._mgr = mgr;
        this.node = node;
        this.def = def;
    }

    /** 手动停止并回收 */
    stop(): void {
        if (this.finished) return;
        this.finished = true;
        this._mgr.recycle(this.node, this.def);
    }
}

interface RunningVFX {
    handle: VFXHandle;
    frames: SpriteFrame[];
    sprite: Sprite;
    elapsed: number;
    frameDur: number;
    follow: Node | null;
}

@ccclass('VFXManager')
export class VFXManager extends Component {
    private static _inst: VFXManager | null = null;
    public static get inst(): VFXManager | null { return this._inst; }

    /** 4 个渲染层级根节点（1 地面 / 2 角色怪物 / 3 命中 / 4 UI之上） */
    private _layers: Node[] = [];
    /** 加法叠加材质 */
    private _matAdd: Material | null = null;

    private _cache: Map<string, SpriteFrame[]> = new Map();
    private _pools: Map<string, Node[]> = new Map();
    private _active: Map<string, number> = new Map();
    private _running: RunningVFX[] = [];
    private _loaded = false;

    /** 全局同时活跃特效上限（低端机建议 40，中高端 80） */
    public globalMax: number = 60;

    // ---------------- 生命周期 ----------------

    /**
     * 初始化（建议在游戏启动场景调用一次）
     * @param layerRoots 4 个层级根节点，顺序不可乱
     */
    public static init(layerRoots: Node[]): void {
        if (VFXManager._inst) return;
        const node = new Node('VFXManager');
        director.getScene()!.addChild(node);
        director.addPersistRootNode(node);
        const mgr = node.addComponent(VFXManager);
        mgr._layers = layerRoots.slice(0, 4);
        VFXManager._inst = mgr;
        mgr._preloadAll();
    }

    onDestroy(): void {
        if (VFXManager._inst === this) VFXManager._inst = null;
    }

    // ---------------- 资源加载 ----------------

    private _preloadAll(): void {
        // 加法材质：resources/materials/mat_vfx_add.mtl
        resources.load('materials/mat_vfx_add', Material, (err, mat) => {
            if (!err) this._matAdd = mat;
        });

        let pending = VFX_LIST.length;
        for (const def of VFX_LIST) {
            const dir = `vfx/${def.dir}`;
            resources.loadDir(dir, SpriteFrame, (err, assets: SpriteFrame[]) => {
                if (!err && assets && assets.length > 0) {
                    // 按文件名末尾数字排序，保证 001→002→... 顺序播放
                    assets.sort((a, b) => this._frameIndex(a.name) - this._frameIndex(b.name));
                    this._cache.set(def.id, assets);
                    this._pools.set(def.id, []);
                } else {
                    console.warn(`[VFX] 序列帧加载失败: ${dir}`, err);
                }
                pending--;
                if (pending === 0) this._loaded = true;
            });
        }
    }

    private _frameIndex(name: string): number {
        const m = name.match(/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
    }

    public isLoaded(): boolean { return this._loaded; }

    // ---------------- 播放 ----------------

    /**
     * 播放一个特效
     * @param id      配置表里的特效 ID
     * @param worldPos 世界坐标（锚点中心）
     * @param opts    follow: 跟随节点（每帧同步位置）；offset: 相对偏移
     */
    public static play(id: string, worldPos: Vec3,
                      opts?: { follow?: Node | null; offset?: Vec3 }): VFXHandle | null {
        return VFXManager._inst ? VFXManager._inst.doPlay(id, worldPos, opts) : null;
    }

    private doPlay(id: string, worldPos: Vec3,
                    opts?: { follow?: Node | null; offset?: Vec3 }): VFXHandle | null {
        const def = VFX_LIST.find(v => v.id === id);
        const frames = this._cache.get(id);
        if (!def) { console.warn(`[VFX] 未配置的特效: ${id}`); return null; }
        if (!frames || frames.length === 0) { console.warn(`[VFX] 资源未就绪: ${id}`); return null; }

        // 全局上限：达到上限时先回收最旧的一个
        if (this._running.length >= this.globalMax && !this._evictOldest()) return null;

        // 单个特效并发上限
        const active = this._active.get(id) || 0;
        if (active >= def.maxConcurrent) {
            this._evictOldestOf(id);
        }

        const node = this._obtain(id, def);
        const parent = this._layers[math.clamp(def.layer - 1, 0, 3)] || this._layers[0] || this.node;
        if (node.parent !== parent) parent.addChild(node);

        const transform = node.getComponent(UITransform)!;
        const sprite = node.getComponent(Sprite)!;
        const frame0 = frames[0];
        sprite.spriteFrame = frame0;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const w = def.size ? def.size[0] : frame0.originalSize.width;
        const h = def.size ? def.size[1] : frame0.originalSize.height;
        transform.setContentSize(new Size(w, h));

        sprite.customMaterial = def.blend === 'add' ? this._matAdd : null;
        node.active = true;

        this._placeNode(node, worldPos, opts);
        node.setSiblingIndex(node.parent!.children.length - 1);

        const handle = new VFXHandle(this, node, def);
        const item: RunningVFX = {
            handle, frames, sprite,
            elapsed: 0,
            frameDur: 1 / Math.max(1, def.fps),
            follow: opts?.follow ?? null,
        };
        this._running.push(item);
        this._active.set(id, active + 1);
        return handle;
    }

    private _placeNode(node: Node, worldPos: Vec3, opts?: { follow?: Node | null; offset?: Vec3 }): void {
        const offset = opts?.offset ?? new Vec3(0, 0, 0);
        if (opts?.follow && opts.follow.isValid) {
            node.setWorldPosition(opts.follow.worldPosition.clone().add(offset));
        } else {
            node.setWorldPosition(worldPos.clone().add(offset));
        }
    }

    // ---------------- 每帧驱动 ----------------

    update(dt: number): void {
        for (let i = this._running.length - 1; i >= 0; i--) {
            const it = this._running[i];
            const def = it.handle.def;

            // 跟随
            if (it.follow) {
                if (!it.follow.isValid) { this._finishAt(i); continue; }
                it.handle.node.setWorldPosition(it.follow.worldPosition);
            }

            it.elapsed += dt;
            let frameIdx = Math.floor(it.elapsed / it.frameDur);

            if (frameIdx >= it.frames.length) {
                if (def.loop) {
                    it.elapsed = 0;
                    frameIdx = 0;
                } else {
                    this._finishAt(i);
                    continue;
                }
            }
            const sf = it.frames[frameIdx];
            if (sf && it.sprite.spriteFrame !== sf) it.sprite.spriteFrame = sf;
        }
    }

    private _finishAt(i: number): void {
        const it = this._running[i];
        this._running.splice(i, 1);
        const id = it.handle.def.id;
        this._active.set(id, Math.max(0, (this._active.get(id) || 1) - 1));
        it.handle.finished = true;
        this.recycle(it.handle.node, it.handle.def);
    }

    // ---------------- 池 ----------------

    private _obtain(id: string, def: VFXDef): Node {
        const pool = this._pools.get(id);
        if (pool && pool.length > 0) {
            const n = pool.pop()!;
            n.active = true;
            return n;
        }
        const node = new Node(`vfx_${id}`);
        node.addComponent(UITransform);
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.trim = false;
        sprite.type = Sprite.Type.SIMPLE;
        node.active = false;
        return node;
    }

    public recycle(node: Node, def: VFXDef): void {
        node.active = false;
        node.setParent(this.node);
        const sprite = node.getComponent(Sprite);
        if (sprite) sprite.spriteFrame = null;
        const pool = this._pools.get(def.id);
        if (pool) {
            if (pool.length < 40) pool.push(node);
            else node.destroy();
        }
    }

    /** 回收最旧的一个（全局超限时用） */
    private _evictOldest(): boolean {
        if (this._running.length === 0) return false;
        this._finishAt(0);
        return true;
    }

    /** 回收指定特效最旧的一个 */
    private _evictOldestOf(id: string): void {
        for (let i = 0; i < this._running.length; i++) {
            if (this._running[i].handle.def.id === id) { this._finishAt(i); return; }
        }
    }

    /** 清空所有正在播放的特效（切换关卡 / 战斗结束调用） */
    public static clearAll(): void {
        if (!VFXManager._inst) return;
        while (VFXManager._inst._running.length > 0) VFXManager._inst._finishAt(0);
    }
}
//（注：内容由AI生成）
