// Cocos 原型入口：运行时搭建 Canvas/相机/渲染层，加载 config.json 后进入可玩战斗。
// 使用方式：新建场景 → 新建空节点 → 挂载 GameRoot → 运行预览。
import {
  _decorator,
  Camera,
  Canvas,
  Color,
  Component,
  EventTouch,
  JsonAsset,
  Layers,
  Node,
  ResolutionPolicy,
  resources,
  UITransform,
  Vec3,
  view,
} from 'cc';
import {
  CARD_RECTS,
  CHAR_BUY_RECT,
  CHAR_CLOSE_RECT,
  CHAR_OPTION_RECTS,
  CHAR_UPGRADE_RECT,
  CHAR_WEAPON_ICON,
  CLOSE_RECT,
  DESIGN_H,
  DESIGN_W,
  EXPORT_RECT,
  REFRESH_RECT,
  RESTART_RECT,
  SELL_RECT,
  SLOT_RECTS,
  UPGRADE_ICONS,
  WEAPON_OPTION_RECTS,
  inRect,
  screenToNormX,
  screenToNormY,
} from './game/Coords';
import { BattleModel } from './game/BattleModel';
import { Renderer } from './game/Renderer';

const { ccclass } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  private model: BattleModel | null = null;
  private renderer: Renderer | null = null;
  private dragging = false;
  private exportTimer: any = null;

  onLoad(): void {
    // 调试/验收钩子：暴露 GameRoot 实例供控制台只读检查（不影响玩法逻辑）
    if (typeof window !== 'undefined') {
      (window as any).__duskSentry = this;
    }
    view.setDesignResolutionSize(DESIGN_W, DESIGN_H, ResolutionPolicy.SHOW_ALL);
    const ui = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    ui.setContentSize(DESIGN_W, DESIGN_H);
    this.node.layer = Layers.Enum.UI_2D;
    this.ensureCanvas();

    this.renderer = new Renderer(this.node);
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    resources.load('config', JsonAsset, (err, asset) => {
      if (err || !asset) {
        this.renderer?.showError(err ? err.message : 'config.json 为空');
        return;
      }
      const tables = (asset.json as any)?.tables;
      if (!tables) {
        this.renderer?.showError('config.json 缺少 tables');
        return;
      }
      this.model = new BattleModel(tables);
      this.model.start();
      console.log('[dusk-sentry] 原型就绪：拖动角色，点击底部图标选择升级');
      this.renderer?.draw(this.model);
    });
  }

  update(dt: number): void {
    if (!this.model || !this.renderer) return;
    // 三选一、武器面板、角色武器面板期间完全暂停；结算后停止推进。
    if (
      !this.model.pendingUpgrade
      && !this.model.pendingWeaponSlot
      && !this.model.pendingCharWeaponPanel
      && !this.model.runOver
    ) {
      this.model.update(Math.min(dt, 0.05));
    }
    this.renderer.draw(this.model);
  }

  private ensureCanvas(): void {
    let parent = this.node.parent;
    let existing: Canvas | null = null;
    while (parent) {
      existing = parent.getComponent(Canvas);
      if (existing) break;
      parent = parent.parent;
    }
    if (existing) return;

    const cameraNode = new Node('UICamera');
    cameraNode.layer = Layers.Enum.UI_2D;
    cameraNode.setPosition(0, 0, 1000);
    this.node.addChild(cameraNode);
    const camera = cameraNode.addComponent(Camera);
    camera.projection = Camera.ProjectionType.ORTHO;
    camera.orthoHeight = DESIGN_H / 2;
    camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
    camera.clearColor = new Color(11, 13, 20, 255);
    camera.visibility = Layers.Enum.UI_2D;
    camera.near = 1;
    camera.far = 4000;

    const canvas = this.node.getComponent(Canvas) ?? this.node.addComponent(Canvas);
    canvas.cameraComponent = camera;
    canvas.alignCanvasWithScreen = true;
  }

  private toLocal(event: EventTouch): { x: number; y: number } {
    const ui = this.node.getComponent(UITransform)!;
    const location = event.getUILocation();
    const point = ui.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
    return { x: point.x, y: point.y };
  }

  private onTouchStart(event: EventTouch): void {
    const model = this.model;
    const renderer = this.renderer;
    if (!model || !renderer) return;
    const point = this.toLocal(event);

    // 结算页：只响应双按钮
    if (model.runOver) {
      this.dragging = false;
      if (inRect(point.x, point.y, EXPORT_RECT)) {
        this.exportLog();
        return;
      }
      if (inRect(point.x, point.y, RESTART_RECT)) {
        this.clearExportTimer();
        renderer.exportState = 'idle';
        model.start();
        renderer.draw(model);
      }
      return;
    }

    // 三选一弹层：响应卡片与刷新
    if (model.pendingUpgrade) {
      const options = model.pendingUpgradeOptions;
      for (let i = 0; i < CARD_RECTS.length; i += 1) {
        if (options[i] && inRect(point.x, point.y, CARD_RECTS[i])) {
          model.pickUpgrade(options[i].upgrade_id);
          renderer.draw(model);
          return;
        }
      }
      if (inRect(point.x, point.y, REFRESH_RECT)) {
        model.refreshUpgradeOptions('coin');
        renderer.draw(model);
      }
      return;
    }

    // 武器购买面板：选武器 / 拆除 / 关闭
    const buyingSlot = model.pendingWeaponSlot;
    if (buyingSlot) {
      model.weaponTable.forEach((w: any, i: number) => {
        if (WEAPON_OPTION_RECTS[i] && inRect(point.x, point.y, WEAPON_OPTION_RECTS[i])) {
          model.buyWeapon(buyingSlot, w.weapon_id);
        }
      });
      if (inRect(point.x, point.y, SELL_RECT)) model.sellWeapon(buyingSlot);
      else if (inRect(point.x, point.y, CLOSE_RECT)) model.closeWeaponPanel();
      renderer.draw(model);
      return;
    }

    // 角色武器面板：选武器 / 购买 / 升级 / 关闭
    if (model.pendingCharWeaponPanel) {
      const weaponIds = model.charWeaponIds;
      for (let i = 0; i < CHAR_OPTION_RECTS.length; i += 1) {
        if (weaponIds[i] && CHAR_OPTION_RECTS[i] && inRect(point.x, point.y, CHAR_OPTION_RECTS[i])) {
          model.selectCharWeapon(weaponIds[i]);   // 已解锁→切换携带；未解锁→仅选中
          renderer.draw(model);
          return;
        }
      }
      if (inRect(point.x, point.y, CHAR_BUY_RECT)) model.buyCharWeapon(model.charWeaponSelected);
      else if (inRect(point.x, point.y, CHAR_UPGRADE_RECT)) model.upgradeCharWeapon(model.charWeaponSelected);
      else if (inRect(point.x, point.y, CHAR_CLOSE_RECT)) model.closeCharWeaponPanel();
      renderer.draw(model);
      return;
    }

    // 左右武器槽：点开购买面板
    for (const slot of ['left', 'right'] as Array<'left' | 'right'>) {
      if (inRect(point.x, point.y, SLOT_RECTS[slot])) {
        model.openWeaponPanel(slot);
        renderer.draw(model);
        return;
      }
    }

    // 角色武器入口图标
    if (inRect(point.x, point.y, CHAR_WEAPON_ICON)) {
      model.openCharWeaponPanel();
      renderer.draw(model);
      return;
    }

    // 底部升级图标
    const lines: Array<'equipment' | 'skill' | 'ultimate'> = ['equipment', 'skill', 'ultimate'];
    for (const line of lines) {
      if (inRect(point.x, point.y, UPGRADE_ICONS[line])) {
        model.openUpgrade(line);
        renderer.draw(model);
        return;
      }
    }

    // 否则进入拖拽
    this.dragging = true;
    this.movePlayerFromScreen(point.x, point.y);
  }

  private onTouchMove(event: EventTouch): void {
    if (!this.dragging || !this.model) return;
    if (this.model.runOver || this.model.pendingUpgrade || this.model.pendingCharWeaponPanel) return;
    const point = this.toLocal(event);
    this.movePlayerFromScreen(point.x, point.y);
  }

  private onTouchEnd(): void {
    this.dragging = false;
  }

  private movePlayerFromScreen(sx: number, sy: number): void {
    const model = this.model;
    if (!model) return;
    const nx = screenToNormX(sx);
    const ny = screenToNormY(sy);
    model.movePlayer(nx, ny);
  }

  // 导出本局日志：Web 下载 JSON，小游戏兜底复制到剪贴板。
  private exportLog(): void {
    const model = this.model;
    const renderer = this.renderer;
    if (!model || !renderer) return;
    // 05-05 第五节：导出按钮本身打 log_export 事件
    const summary = model.getRunSummary();
    model.events.push({
      t: model.survivalSec,
      type: 'log_export',
      params: { result: summary.result, duration_sec: Math.round(summary.survival_time) },
    });
    const json = this.buildExportJson(model);
    const ok = this.downloadLog(json);
    renderer.exportState = ok ? 'exported' : 'failed';
    if (!ok) console.error('导出失败，已输出到控制台', json);
    this.scheduleExportReset();
    renderer.draw(model);
  }

  private buildExportJson(model: BattleModel): string {
    const summary = model.getRunSummary();
    const upgradesPicked: string[] = [];
    const weaponsBought: string[] = [];
    const refreshCount = { coin: 0, ad: 0 };
    let goldSpent = 0;
    for (const ev of model.events) {
      if (ev.type === 'upgrade_pick') {
        if (ev.params?.upgrade_id) upgradesPicked.push(ev.params.upgrade_id);
        goldSpent += ev.params?.cost ?? 0;
      } else if (ev.type === 'upgrade_refresh') {
        const method = ev.params?.method;
        if (method === 'coin') { refreshCount.coin += 1; goldSpent += 50; }
        else if (method === 'ad') refreshCount.ad += 1;
      } else if (ev.type === 'weapon_buy') {
        const cost = ev.params?.cost_gold ?? 0;
        goldSpent += cost;
        if (cost > 0 && ev.params?.weapon_id) weaponsBought.push(ev.params.weapon_id);
      } else if (ev.type === 'char_weapon_buy') {
        // 埋点 05-02：char_weapon_buy
        goldSpent += ev.params?.cost_gold ?? 0;
      } else if (ev.type === 'char_weapon_upgrade') {
        // 埋点 05-02：char_weapon_upgrade
        goldSpent += ev.params?.cost_gold ?? 0;
      }
    }
    // 05-05：gold_earned 只统计本局赚取，不再用“钱包余额 + 已花费”反推（会混入初始 50 金币）
    const goldEarned = summary.gold_earned;

    // 05-05 waves[]：按 wave_start 切分，聚合每波漏怪/击杀/金币/时长
    const waves: any[] = [];
    const waveStarts = model.events.filter(e => e.type === 'wave_start');
    for (let i = 0; i < waveStarts.length; i++) {
      const ws = waveStarts[i];
      const next = waveStarts[i + 1];
      const endT = next ? next.t : summary.survival_time;
      const inWave = model.events.filter(e => e.t >= ws.t && e.t < (next ? next.t : Infinity));
      const kills = inWave.filter(e => e.type === 'kill');
      waves.push({
        wave_index: ws.params?.wave_index,
        cycle_index: ws.params?.cycle_index,
        hp_percent_start: ws.params?.hp_percent,
        hp_percent_end: next ? next.params?.hp_percent : model.coreHp / model.coreMaxHp,
        leak_count: inWave.filter(e => e.type === 'leak').length,
        kill_count: kills.length,
        gold_earned: kills.reduce((a, e) => a + (e.params?.gold_drop ?? 0), 0),
        duration_sec: +(endT - ws.t).toFixed(1),
      });
    }

    return JSON.stringify(
      {
        meta: {
          version: '1.0',
          exported_at: new Date().toISOString(),
          result: summary.result,
          survival_time_sec: Math.round(summary.survival_time),
          cycle_index: summary.boss_kill_count,
          rng_seed: summary.rng_seed,
          client: 'cocos-prototype',
        },
        battle_summary: {
          kill_count: summary.kill_count,
          wave_index: summary.wave_index,
          core_hp_left: summary.core_hp_left,
          gold_earned: goldEarned,
          gold_spent: goldSpent,
          upgrades_picked: upgradesPicked,
          weapons_bought: weaponsBought,
          refresh_count: refreshCount,
        },
        waves,
        events: model.events,
      },
      null,
      2,
    );
  }

  private downloadLog(json: string): boolean {
    const fileName = `battle_${this.timeStamp(new Date())}.json`;
    if (typeof document !== 'undefined') {
      try {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return true;
      } catch (err) {
        return false;
      }
    }
    const wx = (globalThis as any).wx;
    if (wx && typeof wx.setClipboardData === 'function') {
      try {
        wx.setClipboardData({ data: json });
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  private timeStamp(date: Date): string {
    const pad = (v: number) => `${v}`.padStart(2, '0');
    return (
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
      `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
    );
  }

  private scheduleExportReset(): void {
    this.clearExportTimer();
    this.exportTimer = setTimeout(() => {
      this.exportTimer = null;
      if (this.renderer) this.renderer.exportState = 'idle';
    }, 2000);
  }

  private clearExportTimer(): void {
    if (this.exportTimer === null) return;
    clearTimeout(this.exportTimer);
    this.exportTimer = null;
  }
}
