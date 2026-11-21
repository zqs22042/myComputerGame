/**
 * VFXConfig.ts —— 特效配置表（策划可直接改数值）
 * 适配：Cocos Creator 3.8.x / 2D
 *
 * 目录约定：resources/vfx/<dir>/ 下存放 VFX_xxx_001.png ... 序列帧
 * 美术只需按帧命名补零放图，程序侧配置表加一行即可接入。
 */

export type VFXBlend = 'add' | 'alpha';

export interface VFXDef {
    /** 特效唯一 ID，与美术命名一致 */
    id: string;
    /** resources/vfx 下的子目录名 */
    dir: string;
    /** 序列帧数量（必须与实际图片数量一致） */
    frames: number;
    /** 播放帧率 */
    fps: number;
    /** 是否循环播放（单次特效必须为 false） */
    loop: boolean;
    /** 叠加模式：add = 加法（发光类），alpha = 普通透明（烟雾/护盾/碎片） */
    blend: VFXBlend;
    /** 渲染层级：1 地面 / 2 角色怪物 / 3 子弹命中 / 4 UI之上（对应场景里 4 个 VFXLayer 节点） */
    layer: number;
    /** 同屏并发上限，超出后丢弃最旧的一个 */
    maxConcurrent: number;
    /** 建议显示尺寸（像素，@1080×1920 基准）；不填则按切图原始尺寸 */
    size?: [number, number];
    /** 触发时机说明 */
    note?: string;
}

export const VFX_LIST: VFXDef[] = [
    {
        id: 'VFX_Player_GunShot', dir: 'player_gunshot', frames: 6, fps: 24, loop: false,
        blend: 'add', layer: 3, maxConcurrent: 12, size: [160, 160],
        note: '玩家每一发子弹开火时触发，挂枪口，播完自动回收',
    },
    {
        id: 'VFX_Turret_MG_Shoot', dir: 'turret_mg_shoot', frames: 5, fps: 24, loop: false,
        blend: 'add', layer: 3, maxConcurrent: 6, size: [140, 140],
        note: '机枪塔每次射击触发一次，连射时高频复用',
    },
    {
        id: 'VFX_Turret_Cannon_Charge', dir: 'turret_cannon_charge', frames: 8, fps: 15, loop: true,
        blend: 'add', layer: 3, maxConcurrent: 2, size: [220, 220],
        note: '电磁炮开始充能时循环播放，充能结束手动 Stop',
    },
    {
        id: 'VFX_Turret_Cannon_Fire', dir: 'turret_cannon_fire', frames: 7, fps: 24, loop: false,
        blend: 'add', layer: 3, maxConcurrent: 3, size: [260, 260],
        note: '充能完成发射瞬间，建议同时把塔身做 1 帧位移抖动',
    },
    {
        id: 'VFX_Hit_Monster', dir: 'hit_monster', frames: 4, fps: 24, loop: false,
        blend: 'add', layer: 3, maxConcurrent: 20, size: [110, 110],
        note: '子弹命中怪物瞬间，可在命中点偏移随机 ±10px 避免完全重叠',
    },
    {
        id: 'VFX_Monster_Death', dir: 'monster_death', frames: 7, fps: 18, loop: false,
        blend: 'alpha', layer: 2, maxConcurrent: 12, size: [200, 200],
        note: '怪物死亡动画播完接此特效，红/蓝/紫三套配色同 ID，按怪物类型换图集',
    },
    {
        id: 'VFX_Core_Shield', dir: 'core_shield', frames: 12, fps: 15, loop: true,
        blend: 'alpha', layer: 2, maxConcurrent: 1, size: [320, 320],
        note: '护盾开启期间常驻循环，护盾值归零时 Stop 并播 ShieldBreak',
    },
    {
        id: 'VFX_Core_ShieldBreak', dir: 'core_shield_break', frames: 9, fps: 24, loop: false,
        blend: 'add', layer: 3, maxConcurrent: 1, size: [340, 340],
        note: '护盾破碎，同时触发屏幕轻震 + 短闪白',
    },
    {
        id: 'VFX_Monster_Spawn', dir: 'monster_spawn', frames: 6, fps: 24, loop: false,
        blend: 'add', layer: 1, maxConcurrent: 10, size: [180, 180],
        note: '顶部刷新点预警，先播特效再生成怪物（提前 0.3s）',
    },
    {
        id: 'VFX_Bullet_Trail', dir: 'bullet_trail', frames: 4, fps: 20, loop: true,
        blend: 'add', layer: 3, maxConcurrent: 30, size: [24, 300],
        note: '子弹飞行期间挂在子弹节点下循环，子弹销毁时一并回收',
    },
];

/** 按 id 快速取配置 */
export function getVFXDef(id: string): VFXDef | undefined {
    return VFX_LIST.find(v => v.id === id);
}
//（注：内容由AI生成）
