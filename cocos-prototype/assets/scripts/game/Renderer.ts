// 渲染层：色块地图、HUD、升级图标、三选一弹层与结算页（全部运行时创建，无需预制体）。
// 模型坐标均为归一化 (0-1)，渲染时用 mapX/mapY 转为屏幕坐标。
import { Color, Graphics, Label, Layers, Node, UITransform } from 'cc';
import {
  BATTLE,
  BUY_PANEL,
  CARD_RECTS,
  CHAR_BUY_RECT,
  CHAR_CLOSE_RECT,
  CHAR_OPTION_RECTS,
  CHAR_PANEL,
  CHAR_UPGRADE_RECT,
  CHAR_WEAPON_ICON,
  CLOSE_RECT,
  CORE_POS,
  DEFENSE_LINE_Y,
  DESIGN_H,
  DESIGN_W,
  EXPORT_RECT,
  HALF_H,
  HALF_W,
  HUD,
  PLATFORM,
  REFRESH_RECT,
  RESTART_RECT,
  SELL_RECT,
  SLOT_POS,
  UPGRADE_ICONS,
  UPGRADE_LINE_LABEL,
  WEAPON_OPTION_RECTS,
  WIDEN_ZONE,
  inRect,
  mapX,
  mapY,
} from './Coords';
import type { BattleModel, UpgradeOption } from './BattleModel';

const MONSTER_COLOR: Record<string, string> = {
  M01: '#e05b5b',
  M02: '#c79a4a',
  M03: '#6fb3e0',
  M04: '#e08a3a',
  M05: '#a060c0',
  M06: '#ff4d6d',
};

function col(hex: string, alpha = 255): Color {
  const s = hex.replace('#', '');
  return new Color(parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16), alpha);
}

export class Renderer {
  private bg: Graphics;
  private world: Graphics;
  private hud: Graphics;
  private overlay: Graphics;

  private waveLabel: Label;
  private goldLabel: Label;
  private coreLabel: Label;
  private cycleLabel: Label;
  private timerLabel: Label;
  private hintLabel: Label;

  private cardLabels: Label[] = [];
  private refreshLabel: Label;
  private iconLabels: Label[] = [];
  private charIconLabel: Label;

  // 角色武器面板
  private charTitleLabel: Label;
  private charOptionLabels: Label[] = [];
  private charBuyLabel: Label;
  private charUpgradeLabel: Label;
  private charCloseLabel: Label;

  // 武器槽与购买面板
  private defenseLabel: Label;
  private slotLabels: Label[] = [];
  private buyTitleLabel: Label;
  private weaponLabels: Label[] = [];
  private sellLabel: Label;
  private closeLabel: Label;

  private titleLabel: Label;
  private bodyLabel: Label;
  private restartLabel: Label;
  private exportLabel: Label;

  // 导出按钮状态：idle 常态，exported 已导出（2 秒），failed 导出失败（2 秒）。
  exportState: 'idle' | 'exported' | 'failed' = 'idle';

  constructor(private root: Node) {
    this.bg = this.graphics('bg');
    this.world = this.graphics('world');
    this.hud = this.graphics('hud');

    this.waveLabel = this.label('wave', 24, 330, 40, Label.HorizontalAlign.LEFT);
    this.goldLabel = this.label('gold', 26, 180, 40, Label.HorizontalAlign.RIGHT);
    this.coreLabel = this.label('core', 22, 440, 34);
    this.cycleLabel = this.label('cycle', 22, 440, 30);
    this.timerLabel = this.label('timer', 20, 760, 34);
    this.hintLabel = this.label('hint', 20, 700, 30);

    this.waveLabel.node.setPosition(HUD.waveX, HUD.waveY);
    this.goldLabel.node.setPosition(HUD.goldX, HUD.goldY);
    this.coreLabel.node.setPosition(0, HUD.coreY);
    this.cycleLabel.node.setPosition(0, HUD.cycleY);
    this.timerLabel.node.setPosition(0, HUD.timerY);
    this.hintLabel.node.setPosition(0, -660);

    // 底部三个升级图标标签
    const lines: Array<'equipment' | 'skill' | 'ultimate'> = ['equipment', 'skill', 'ultimate'];
    for (const line of lines) {
      const rect = UPGRADE_ICONS[line];
      const label = this.label(`icon-${line}`, 20, rect.w, rect.h);
      label.node.setPosition(rect.x, rect.y);
      this.iconLabels.push(label);
    }
    // 第 4 个图标：角色武器入口
    this.charIconLabel = this.label('icon-char-weapon', 20, CHAR_WEAPON_ICON.w, CHAR_WEAPON_ICON.h);
    this.charIconLabel.node.setPosition(CHAR_WEAPON_ICON.x, CHAR_WEAPON_ICON.y);

    // 角色武器面板
    this.charTitleLabel = this.label('char-title', 26, 520, 50);
    this.charTitleLabel.node.setPosition(0, CHAR_PANEL.y + CHAR_PANEL.h / 2 - 55);
    for (let i = 0; i < CHAR_OPTION_RECTS.length; i += 1) {
      const label = this.label(`char-opt-${i}`, 17, 270, 160);
      label.node.setPosition(CHAR_OPTION_RECTS[i].x, CHAR_OPTION_RECTS[i].y);
      this.charOptionLabels.push(label);
    }
    this.charBuyLabel = this.label('char-buy', 20, 230, 70);
    this.charBuyLabel.node.setPosition(CHAR_BUY_RECT.x, CHAR_BUY_RECT.y);
    this.charUpgradeLabel = this.label('char-upgrade', 20, 230, 70);
    this.charUpgradeLabel.node.setPosition(CHAR_UPGRADE_RECT.x, CHAR_UPGRADE_RECT.y);
    this.charCloseLabel = this.label('char-close', 22, 460, 60);
    this.charCloseLabel.node.setPosition(CHAR_CLOSE_RECT.x, CHAR_CLOSE_RECT.y);
    this.charCloseLabel.string = '关闭';
    this.charCloseLabel.color = col('#cfe3ff');

    // 三选一弹层
    this.overlay = this.graphics('overlay');

    // 防线标注与左右武器槽文本
    this.defenseLabel = this.label('defense', 20, 140, 30);
    this.defenseLabel.node.setPosition(mapX(0.18), mapY(DEFENSE_LINE_Y) + 22);
    this.defenseLabel.string = '防 线';
    this.defenseLabel.color = col('#ff8fa3');
    const slots: Array<'left' | 'right'> = ['left', 'right'];
    for (const slot of slots) {
      const label = this.label(`slot-${slot}`, 18, 150, 54);
      label.node.setPosition(mapX(SLOT_POS[slot].x), mapY(SLOT_POS[slot].y) - 72);
      this.slotLabels.push(label);
    }

    // 武器购买面板
    this.buyTitleLabel = this.label('buy-title', 26, 520, 50);
    this.buyTitleLabel.node.setPosition(0, BUY_PANEL.y + BUY_PANEL.h / 2 - 60);
    for (let i = 0; i < WEAPON_OPTION_RECTS.length; i += 1) {
      const label = this.label(`weapon-${i}`, 18, 470, 110);
      label.node.setPosition(WEAPON_OPTION_RECTS[i].x, WEAPON_OPTION_RECTS[i].y);
      this.weaponLabels.push(label);
    }
    this.sellLabel = this.label('sell', 22, 210, 70);
    this.sellLabel.node.setPosition(SELL_RECT.x, SELL_RECT.y);
    this.closeLabel = this.label('close', 22, 210, 70);
    this.closeLabel.node.setPosition(CLOSE_RECT.x, CLOSE_RECT.y);

    for (let i = 0; i < 3; i += 1) {
      const label = this.label(`card-${i}`, 20, 178, 380);
      label.node.setPosition(CARD_RECTS[i].x, CARD_RECTS[i].y);
      this.cardLabels.push(label);
    }
    this.refreshLabel = this.label('refresh', 24, 260, 50);
    this.refreshLabel.node.setPosition(0, REFRESH_RECT.y);

    // 结算页
    this.titleLabel = this.label('title', 34, 620, 60);
    this.titleLabel.node.setPosition(0, 330);
    this.bodyLabel = this.label('body', 22, 560, 380);
    this.bodyLabel.node.setPosition(0, 30);
    this.restartLabel = this.label('restart', 22, 230, 84);
    this.restartLabel.node.setPosition(RESTART_RECT.x, RESTART_RECT.y);
    this.exportLabel = this.label('export', 22, 230, 84);
    this.exportLabel.node.setPosition(EXPORT_RECT.x, EXPORT_RECT.y);

    this.drawBackground();
  }

  private makeNode(name: string): Node {
    const node = new Node(name);
    node.layer = Layers.Enum.UI_2D;
    node.addComponent(UITransform);
    this.root.addChild(node);
    return node;
  }

  private graphics(name: string): Graphics {
    return this.makeNode(name).addComponent(Graphics);
  }

  private label(
    name: string,
    size: number,
    width: number,
    height: number,
    align: any = Label.HorizontalAlign.CENTER,
  ): Label {
    const node = this.makeNode(name);
    node.getComponent(UITransform)!.setContentSize(width, height);
    const label = node.addComponent(Label);
    label.fontSize = size;
    label.lineHeight = Math.round(size * 1.3);
    label.horizontalAlign = align;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.overflow = Label.Overflow.SHRINK;
    label.color = col('#e6ecf5');
    return label;
  }

  private drawBackground(): void {
    const g = this.bg;
    g.fillColor = col('#0d1018');
    g.rect(-HALF_W, -HALF_H, DESIGN_W, DESIGN_H);
    g.fill();

    g.fillColor = col('#161d2a');
    g.roundRect(BATTLE.left - 12, BATTLE.bottom - 12, BATTLE.right - BATTLE.left + 24, BATTLE.top - BATTLE.bottom + 24, 18);
    g.fill();

    g.fillColor = col('#1b2331');
    g.rect(-HALF_W, BATTLE.top + 14, DESIGN_W, HALF_H - BATTLE.top - 14);
    g.fill();

    g.fillColor = col('#0f1420');
    g.rect(-HALF_W, -HALF_H, DESIGN_W, BATTLE.bottom + HALF_H - 12);
    g.fill();
  }

  showError(message: string): void {
    this.hintLabel.string = `加载失败：${message}`;
    this.hintLabel.color = col('#ff7b7b');
  }

  draw(model: BattleModel): void {
    this.updateLabels(model);
    this.drawWorld(model);
    this.drawOverlay(model);
  }

  // ---------- HUD 文本 ----------
  private updateLabels(model: BattleModel): void {
    this.waveLabel.string = `波次 ${model.waveIndex} · 循环 ${model.cycleIndex} · 档位 ${model.hpTier + 1}`;
    this.goldLabel.string = `金币 ${model.gold}`;
    this.coreLabel.string = `核心 ${Math.max(0, Math.ceil(model.coreHp))} / ${model.coreMaxHp}`;
    this.cycleLabel.string = `循环 ${model.cycleIndex}`;
    const soft = model.softGrowth;
    const softText = soft.gold > 0
      ? ` · 软成长 伤害+${(soft.dmgPct * 100).toFixed(0)}% 射速+${(soft.aspdPct * 100).toFixed(0)}%`
      : '';
    this.timerLabel.string = `存活 ${model.survivalSec.toFixed(1)}s · 击杀 ${model.killCount}${softText}`;
    // 技能/大招状态放进现有提示行，不新增布局
    const skillTxt = model.skillDef
      ? `技能 ${model.skillCdLeft <= 0 ? '就绪' : `${Math.ceil(model.skillCdLeft)}s`}`
      : '';
    const ultTxt = model.ultimateDef
      ? `大招 ${model.ultActive ? '爆发中' : model.ultCdLeft <= 0 ? '就绪' : `${Math.ceil(model.ultCdLeft)}s`}`
      : '';
    const cdText = [skillTxt, ultTxt].filter(Boolean).join(' · ');
    this.hintLabel.string = `${cdText ? `${cdText} · ` : ''}拖动角色移动 · 满级后多余金币转软成长`;

    const cardsOpen = model.pendingUpgrade !== null;
    const charOpen = model.pendingCharWeaponPanel;
    const buyingSlot = model.pendingWeaponSlot !== null;
    const showResult = model.runOver;

    // 升级图标
    const lines: Array<'equipment' | 'skill' | 'ultimate'> = ['equipment', 'skill', 'ultimate'];
    lines.forEach((line, i) => {
      const state = model.upgradeState[line] ?? {};
      const totalLevels = Object.values(state).reduce((s: number, v: any) => s + (v || 0), 0);
      const minCost = model.cheapestUpgradeCost(line);
      const affordable = minCost !== null && model.gold >= minCost;
      const stateText = minCost === null ? 'MAX' : affordable ? '可升' : `${minCost}金`;
      this.iconLabels[i].string = `${UPGRADE_LINE_LABEL[line]}\nLv ${totalLevels} · ${stateText}`;
      this.iconLabels[i].color = col(affordable ? '#ffd479' : minCost === null ? '#5a6577' : '#8a93a3');
      this.iconLabels[i].node.active = !showResult && !charOpen && !buyingSlot;
    });

    // 角色武器入口图标：显示当前携带武器与等级
    {
      const cur = model.charWeaponRow(model.currentCharWeapon);
      const st = model.charWeapons[model.currentCharWeapon];
      this.charIconLabel.string = cur ? `武器\n${cur.name}\nLv ${st?.level ?? 1}` : '武器';
      this.charIconLabel.color = col('#ffd479');
      this.charIconLabel.node.active = !showResult && !charOpen && !buyingSlot;
    }

    // 武器槽文本：空槽显示最低价，已放置显示武器名
    const cheapest = model.weaponTable.reduce(
      (a: any, b: any) => (!a || b.cost_gold < a.cost_gold ? b : a),
      null as any,
    );
    (['left', 'right'] as Array<'left' | 'right'>).forEach((slot, i) => {
      const state = model.weapons.find((w: any) => w.slot === slot);
      const def = state?.weaponId
        ? model.weaponTable.find((w: any) => w.weapon_id === state.weaponId)
        : null;
      this.slotLabels[i].string = def ? def.name : `空槽\n${cheapest ? cheapest.cost_gold : 0} 金起`;
      this.slotLabels[i].color = col(def ? '#ffd479' : '#7f8ea3');
      this.slotLabels[i].node.active = !showResult && !cardsOpen && !charOpen && model.pendingWeaponSlot === null;
    });

    // 武器购买面板
    const buying = model.pendingWeaponSlot !== null && !showResult;
    this.buyTitleLabel.node.active = buying;
    this.sellLabel.node.active = buying;
    this.closeLabel.node.active = buying;
    // 关闭面板时必须整组隐藏，否则武器列表文字会残留在屏幕上
    for (const label of this.weaponLabels) label.node.active = buying;
    if (buying) {
      const slot = model.pendingWeaponSlot!;
      const state = model.weapons.find((w: any) => w.slot === slot);
      const current = state?.weaponId
        ? model.weaponTable.find((w: any) => w.weapon_id === state.weaponId)
        : null;
      this.buyTitleLabel.string = `武器部署区 · ${slot === 'left' ? '左' : '右'}`;
      this.buyTitleLabel.color = col('#cfe3ff');
      model.weaponTable.forEach((w: any, i: number) => {
        if (i >= this.weaponLabels.length) return;
        const cost = w.cost_gold - model.weaponCost(slot);
        const equipped = current && current.weapon_id === w.weapon_id;
        this.weaponLabels[i].string =
          `${w.name}${equipped ? '（已装备）' : ''}\n` +
          `伤害 ${w.damage} × ${w.pellets} 弹 · 间隔 ${w.fire_interval}s · 射程 ${w.range}\n` +
          `价格 ${cost} 金`;
        this.weaponLabels[i].color = col(model.gold >= cost && !equipped ? '#ffffff' : '#8a93a3');
        this.weaponLabels[i].node.active = true;
      });
      for (let i = model.weaponTable.length; i < this.weaponLabels.length; i += 1) {
        this.weaponLabels[i].node.active = false;
      }
      this.sellLabel.string = current ? `拆除 +${Math.floor(current.cost_gold * 0.5)} 金` : '空槽不可拆除';
      this.sellLabel.color = col(current ? '#ffd479' : '#5a6577');
      this.closeLabel.string = '关闭';
      this.closeLabel.color = col('#cfe3ff');
    }

    // 三选一弹层
    for (const label of this.cardLabels) label.node.active = cardsOpen && !showResult;
    this.refreshLabel.node.active = cardsOpen && !showResult;
    if (cardsOpen && !showResult) {
      const options = model.pendingUpgradeOptions;
      options.forEach((opt: UpgradeOption, i: number) => {
        this.cardLabels[i].string = `${opt.name}\n\n${opt.effect_desc}\n\n→ Lv.${opt.nextLevel}\n${opt.cost_gold} 金币`;
        this.cardLabels[i].color = col(model.gold >= opt.cost_gold ? '#ffffff' : '#9aa4b2');
        this.cardLabels[i].node.active = true;
      });
      for (let i = options.length; i < 3; i += 1) this.cardLabels[i].node.active = false;
      const canRefresh = model.gold >= 50;
      this.refreshLabel.string = `刷新 (50 金币)`;
      this.refreshLabel.color = col(canRefresh ? '#9fd0ff' : '#5a6577');
    }

    // 角色武器面板
    this.charTitleLabel.node.active = charOpen && !showResult;
    for (const label of this.charOptionLabels) label.node.active = charOpen && !showResult;
    this.charBuyLabel.node.active = charOpen && !showResult;
    this.charUpgradeLabel.node.active = charOpen && !showResult;
    this.charCloseLabel.node.active = charOpen && !showResult;
    if (charOpen && !showResult) {
      this.charTitleLabel.string = '角色武器';
      this.charTitleLabel.color = col('#cfe3ff');
      const weaponIds = model.charWeaponIds;
      const sel = model.charWeaponSelected;
      weaponIds.forEach((id: string, i: number) => {
        if (i >= this.charOptionLabels.length) return;
        const st = model.charWeapons[id];
        const lv1 = model.charWeaponRow(id, 1);
        const row = model.charWeaponRow(id, st?.level ?? 1);
        if (!lv1 || !row) return;
        const carrying = model.currentCharWeapon === id;
        const maxed = (st?.level ?? 1) >= 4;
        const stateText = st?.owned
          ? `Lv ${st.level}${maxed ? ' · MAX' : ''}${carrying ? ' · 携带中' : ''}`
          : `未解锁 · ${lv1.unlock_cost_gold} 金`;
        this.charOptionLabels[i].string =
          `${lv1.name}${st?.owned ? '' : ' 🔒'}\n` +
          `伤害 ${row.damage} · ${row.pellets} 发 · 间隔 ${row.fire_interval}s\n` +
          stateText;
        // 当前携带武器高亮（绿色）；未解锁置灰；已解锁白色
        this.charOptionLabels[i].color = col(
          carrying ? '#7be39a' : st?.owned ? '#e6ecf5' : '#6b7688',
        );
      });
      // 购买按钮：选中未解锁武器时可用
      const selState = model.charWeapons[sel];
      const canBuy = selState && !selState.owned
        && model.gold >= (model.charWeaponRow(sel, 1)?.unlock_cost_gold ?? 0);
      this.charBuyLabel.string = selState && !selState.owned
        ? `购买 ${model.charWeaponRow(sel, 1)?.unlock_cost_gold ?? 0} 金`
        : '已解锁';
      this.charBuyLabel.color = col(canBuy ? '#ffd479' : '#5a6577');
      // 升级按钮：选中已解锁武器且未满级、金币足够时可用；满级显示 MAX
      const selRow = model.charWeaponRow(sel);
      const canUpgrade = selState?.owned && (selState.level ?? 1) < 4
        && model.gold >= (selRow?.upgrade_cost_gold ?? 0);
      this.charUpgradeLabel.string = !selState?.owned
        ? '未解锁'
        : (selState.level ?? 1) >= 4
          ? 'MAX'
          : `升级 ${selRow?.upgrade_cost_gold ?? 0} 金`;
      this.charUpgradeLabel.color = col(
        canUpgrade ? '#7be39a' : (selState?.owned && (selState.level ?? 1) >= 4) ? '#ffd479' : '#5a6577',
      );
    }

    // 结算页
    this.titleLabel.node.active = showResult;
    this.bodyLabel.node.active = showResult;
    this.restartLabel.node.active = showResult;
    this.exportLabel.node.active = showResult;
    if (showResult) {
      const s = model.getRunSummary();
      this.titleLabel.string = '核心失守';
      this.titleLabel.color = col('#ff7b7b');
      this.bodyLabel.string =
        `存活 ${s.survival_time.toFixed(1)}s\n循环 ${s.cycle_index}\n波次 ${s.wave_index}\n` +
        `击杀 ${s.kill_count}\n核心剩余 ${s.core_hp_left}`;
      this.restartLabel.string = '再来一局';
      this.restartLabel.color = col('#c8f0d8');
      this.exportLabel.string =
        this.exportState === 'exported' ? '已导出' : this.exportState === 'failed' ? '导出失败' : '导出本局日志';
      this.exportLabel.color = col(this.exportState === 'idle' ? '#cfe3ff' : '#6b7484');
    }
  }

  // ---------- 世界渲染 ----------
  private drawWorld(model: BattleModel): void {
    const g = this.world;
    g.clear();

    // 站位区石台
    const platX = mapX(PLATFORM.xMin);
    const platW = mapX(PLATFORM.xMax) - platX;
    const platY = mapY(PLATFORM.yMin);
    const platH = mapY(PLATFORM.yMax) - platY;
    g.fillColor = col('#2a2f39');
    g.roundRect(platX, platY, platW, platH, 16);
    g.fill();
    g.lineWidth = 3;
    g.strokeColor = col('#55606f');
    g.roundRect(platX, platY, platW, platH, 16);
    g.stroke();

    // 纵向路径：窄通道 + 临近防线的加宽段
    const half = 0.08 * (BATTLE.right - BATTLE.left);   // 屏宽约 16%
    const yTop = mapY(1.0);
    const yWideTop = mapY(WIDEN_ZONE.yMax);
    const yWideBot = mapY(WIDEN_ZONE.yMin);
    const wideL = mapX(WIDEN_ZONE.xMin);
    const wideR = mapX(WIDEN_ZONE.xMax);
    const tracePath = () => {
      g.moveTo(-half, yTop);
      g.lineTo(half, yTop);
      g.lineTo(half, yWideTop);
      g.lineTo(wideR, yWideBot);
      g.lineTo(wideL, yWideBot);
      g.lineTo(-half, yWideTop);
      g.close();
    };
    g.fillColor = col('#463a2a');
    tracePath();
    g.fill();
    g.lineWidth = 3;
    g.strokeColor = col('#7a6647');
    tracePath();
    g.stroke();

    // 防线：横跨战场的红线
    const lineY = mapY(DEFENSE_LINE_Y);
    const lineL = mapX(0.12);
    const lineR = mapX(0.88);
    g.lineWidth = 14;
    g.strokeColor = col('#ff4d6d', 45);
    g.moveTo(lineL, lineY);
    g.lineTo(lineR, lineY);
    g.stroke();
    g.lineWidth = 5;
    g.strokeColor = col('#ff4d6d', 235);
    g.moveTo(lineL, lineY);
    g.lineTo(lineR, lineY);
    g.stroke();

    // 人物活动区：缩小后的蓝色矩形，角色只能在此移动
    const z = model.playerZone;
    if (z) {
      const zx = mapX(z.x_min);
      const zw = mapX(z.x_max) - zx;
      const zy = mapY(z.y_min);
      const zh = mapY(z.y_max) - zy;
      g.fillColor = col('#1f3a5f', 110);
      g.roundRect(zx, zy, zw, zh, 14);
      g.fill();
      g.lineWidth = 2;
      g.strokeColor = col('#3f7fc4', 190);
      g.roundRect(zx, zy, zw, zh, 14);
      g.stroke();
    }

    // 我方核心（站位区中央）
    const cx = mapX(CORE_POS.x);
    const cy = mapY(CORE_POS.y);
    const ratio = model.coreHp / model.coreMaxHp;
    const coreColor = ratio > 0.6 ? '#59d998' : ratio > 0.3 ? '#e0c05a' : '#e05b5b';
    g.fillColor = col('#5ac8ff', 40);
    g.circle(cx, cy, 52);
    g.fill();
    g.fillColor = col('#5ac8ff', 80);
    g.circle(cx, cy, 42);
    g.fill();
    g.fillColor = col(coreColor);
    g.circle(cx, cy, 30);
    g.fill();
    g.lineWidth = 3;
    g.strokeColor = col('#d9f7ff');
    g.circle(cx, cy, 36);
    g.stroke();

    // 左右武器槽
    const WEAPON_COLOR: Record<string, string> = { W01: '#8fd0ff', W02: '#ffb020', W03: '#a0e07a' };
    for (const state of model.weapons) {
      const pos = SLOT_POS[state.slot as 'left' | 'right'];
      const sx = mapX(pos.x);
      const sy = mapY(pos.y);
      if (state.weaponId) {
        g.fillColor = col(WEAPON_COLOR[state.weaponId] ?? '#8fd0ff', 70);
        g.circle(sx, sy, 40);
        g.fill();
        g.fillColor = col(WEAPON_COLOR[state.weaponId] ?? '#8fd0ff');
        g.circle(sx, sy, 26);
        g.fill();
        g.lineWidth = 3;
        g.strokeColor = col('#ffe9b0');
        g.circle(sx, sy, 33);
        g.stroke();
      } else {
        this.dashedRoundRect(g, sx - 44, sy - 44, 88, 88, 12, '#7f8ea3');
      }
    }

    // 怪物
    for (const m of model.monsters) {
      const mx = mapX(m.x);
      const my = mapY(m.y);
      const radius = m.special === 'elite_armor' ? 24 : 17;
      g.fillColor = col(MONSTER_COLOR[m.monsterId] ?? '#e05b5b');
      g.circle(mx, my, radius);
      g.fill();
      // 越线怪物加红色描边：提示已来不及拦截
      if (m.y < DEFENSE_LINE_Y) {
        g.lineWidth = 4;
        g.strokeColor = col('#ff2d55');
        g.circle(mx, my, radius + 5);
        g.stroke();
      }
      if (m.hp < m.maxHp) {
        const w = radius * 2.4;
        g.fillColor = col('#20263a');
        g.rect(mx - w / 2, my + radius + 8, w, 5);
        g.fill();
        g.fillColor = col('#7be0a3');
        g.rect(mx - w / 2, my + radius + 8, w * Math.max(0, m.hp / m.maxHp), 5);
        g.fill();
      }
    }

    // Boss
    const boss = model.boss;
    if (boss) {
      const bx = mapX(boss.x);
      const by = mapY(boss.y);
      const radius = 40;
      g.fillColor = col('#ff4d6d');
      g.circle(bx, by, radius);
      g.fill();
      g.lineWidth = 4;
      g.strokeColor = col('#ffb020');
      g.circle(bx, by, radius + 6);
      g.stroke();
      g.strokeColor = col('#ffb020', 160);
      g.circle(bx, by, radius + 12 + boss.phase * 4);
      g.stroke();
      if (boss.hp < boss.maxHp) {
        const w = radius * 2.6;
        g.fillColor = col('#2a1d26');
        g.rect(bx - w / 2, by + radius + 10, w, 7);
        g.fill();
        g.fillColor = col('#ff6b8a');
        g.rect(bx - w / 2, by + radius + 10, w * Math.max(0, boss.hp / boss.maxHp), 7);
        g.fill();
      }
    }

    // 玩家：朝上射击的光束（枪身微光随武器升级变亮，颜色随武器类型变化）
    const p = model.player;
    const px = mapX(p.x);
    const py = mapY(p.y);
    const beamColor: Record<string, string> = {
      RW01: '#6fe0c0', RW02: '#ffb020', RW03: '#5ac8ff', RW04: '#ff6b4a',
    };
    const glow = beamColor[model.currentCharWeapon] ?? '#6fe0c0';
    const weaponLevel = model.charWeapons[model.currentCharWeapon]?.level ?? 1;
    g.lineWidth = 10 + weaponLevel * 2;
    g.strokeColor = col(glow, 60 + weaponLevel * 15);
    g.moveTo(px, py + 14);
    g.lineTo(px, py + 88);
    g.stroke();
    g.lineWidth = 4;
    g.strokeColor = col(glow, 190);
    g.moveTo(px, py + 14);
    g.lineTo(px, py + 88);
    g.stroke();
    g.fillColor = col(glow);
    g.circle(px, py, 24);
    g.fill();
    g.lineWidth = 4;
    g.strokeColor = col('#c8fff0');
    g.circle(px, py, 32);
    g.stroke();

    // 子弹：按武器类型区分形态（文档 01-18）
    // circle 白色圆弹 / spread 橙色弹丸 / laser 蓝色光束 / missile 红色导弹+尾焰；武器槽保持黄色弹
    for (const b of model.bullets) {
      const bx = mapX(b.x);
      const by = mapY(b.y);
      if (b.source === 'char') {
        if (b.kind === 'laser') {
          const sp = Math.hypot(b.vx, b.vy) || 1;
          const dx = (b.vx / sp) * 30;
          const dy = (b.vy / sp) * 30;
          g.lineWidth = 7;
          g.strokeColor = col('#5ac8ff', 230);
          g.moveTo(bx - dx, by - dy);
          g.lineTo(bx + dx, by + dy);
          g.stroke();
          g.lineWidth = 2;
          g.strokeColor = col('#c8ecff');
          g.moveTo(bx - dx, by - dy);
          g.lineTo(bx + dx, by + dy);
          g.stroke();
        } else if (b.kind === 'missile') {
          const sp = Math.hypot(b.vx, b.vy) || 1;
          const tx = (b.vx / sp) * 14;
          const ty = (b.vy / sp) * 14;
          // 尾部粒子火焰
          g.fillColor = col('#ffb020', 150);
          g.circle(bx - tx, by - ty, 6);
          g.fill();
          g.fillColor = col('#ff6b4a');
          g.circle(bx, by, 7);
          g.fill();
        } else if (b.kind === 'spread') {
          g.fillColor = col('#ffb020');
          g.circle(bx, by, 5.5);
          g.fill();
        } else {
          // 基础步枪：白色小圆弹
          g.fillColor = col('#ffffff', 240);
          g.circle(bx, by, 5);
          g.fill();
        }
      } else if (b.vx === 0) {
        g.fillColor = col('#ffe08a', 230);
        g.rect(bx - 2.5, by - 8, 5, 16);
        g.fill();
      } else {
        g.fillColor = col('#ffe08a');
        g.circle(bx, by, 6);
        g.fill();
      }
    }

    // 技能/大招释放特效：0.35 秒的扩散圆环，让加成变化在战场上可见
    const mapW = BATTLE.right - BATTLE.left;
    for (const f of model.fx) {
      const fx = mapX(f.x);
      const fy = mapY(f.y);
      g.lineWidth = 5;
      g.strokeColor = col(f.color, 190);
      g.circle(fx, fy, f.radius * mapW);
      g.stroke();
    }
    // 大招弹幕期间：角色外圈金色脉冲
    if (model.ultActive) {
      const pl = model.player;
      const px2 = mapX(pl.x);
      const py2 = mapY(pl.y);
      g.lineWidth = 4;
      g.strokeColor = col('#ffd479', 160);
      g.circle(px2, py2, 40);
      g.stroke();
    }

    this.drawHudBars(model);
  }

  // 虚线圆角矩形：空武器槽的底座
  private dashedRoundRect(g: Graphics, x: number, y: number, w: number, h: number, r: number, color: string): void {
    g.lineWidth = 3;
    g.strokeColor = col(color, 170);
    const dash = 10;
    const gap = 7;
    const horizontal = Math.ceil(w / (dash + gap));
    const vertical = Math.ceil(h / (dash + gap));
    for (let i = 0; i < horizontal; i += 1) {
      const sx = x + i * (dash + gap);
      if (sx >= x + w) break;
      const len = Math.min(dash, x + w - sx);
      g.moveTo(sx, y);
      g.lineTo(sx + len, y);
      g.moveTo(sx, y + h);
      g.lineTo(sx + len, y + h);
    }
    for (let i = 0; i < vertical; i += 1) {
      const sy = y + i * (dash + gap);
      if (sy >= y + h) break;
      const len = Math.min(dash, y + h - sy);
      g.moveTo(x, sy);
      g.lineTo(x, sy + len);
      g.moveTo(x + w, sy);
      g.lineTo(x + w, sy + len);
    }
    g.stroke();
  }

  private drawHudBars(model: BattleModel): void {
    const g = this.hud;
    g.clear();
    const ratio = Math.max(0, model.coreHp / model.coreMaxHp);
    const barW = 440;
    const barX = -barW / 2;
    const barY = HUD.barY;
    g.fillColor = col('#242c3d');
    g.roundRect(barX, barY, barW, 20, 10);
    g.fill();
    g.fillColor = col(ratio > 0.6 ? '#59d998' : ratio > 0.3 ? '#e0c05a' : '#e05b5b');
    g.roundRect(barX, barY, Math.max(4, barW * ratio), 20, 10);
    g.fill();

    // Boss 血条
    if (model.boss) {
      const boss = model.boss;
      const br = Math.max(0, boss.hp / boss.maxHp);
      g.fillColor = col('#2a1d26');
      g.roundRect(-260, HUD.bossBarY, 520, 14, 7);
      g.fill();
      g.fillColor = col('#ff4d6d');
      g.roundRect(-260, HUD.bossBarY, Math.max(3, 520 * br), 14, 7);
      g.fill();
    }
  }

  // ---------- 弹层与按钮 ----------
  private drawOverlay(model: BattleModel): void {
    const g = this.overlay;
    g.clear();

    // 底部三个升级图标 + 角色武器入口（非结算、非弹层时显示）
    if (!model.runOver && !model.pendingUpgrade && !model.pendingCharWeaponPanel && model.pendingWeaponSlot === null) {
      const lines: Array<'equipment' | 'skill' | 'ultimate'> = ['equipment', 'skill', 'ultimate'];
      lines.forEach((line) => {
        const rect = UPGRADE_ICONS[line];
        const minCost = model.cheapestUpgradeCost(line);
        const canAfford = minCost !== null && model.gold >= minCost;
        g.fillColor = col(canAfford ? '#2a3550' : '#1c2130');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.fill();
        g.lineWidth = canAfford ? 3 : 2;
        g.strokeColor = col(canAfford ? '#ffd479' : '#3a4150');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.stroke();
      });
      // 角色武器入口：金色描边突出
      {
        const rect = CHAR_WEAPON_ICON;
        g.fillColor = col('#2a3040');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.fill();
        g.lineWidth = 2;
        g.strokeColor = col('#ffd479');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.stroke();
      }
    }

    // 角色武器面板（暂停式弹层）
    if (model.pendingCharWeaponPanel && !model.runOver) {
      g.fillColor = col('#05080f', 214);
      g.rect(-HALF_W, -HALF_H, DESIGN_W, DESIGN_H);
      g.fill();
      g.fillColor = col('#1b2434');
      g.roundRect(CHAR_PANEL.x - CHAR_PANEL.w / 2, CHAR_PANEL.y - CHAR_PANEL.h / 2, CHAR_PANEL.w, CHAR_PANEL.h, 22);
      g.fill();
      g.lineWidth = 3;
      g.strokeColor = col('#ffd479', 170);
      g.roundRect(CHAR_PANEL.x - CHAR_PANEL.w / 2, CHAR_PANEL.y - CHAR_PANEL.h / 2, CHAR_PANEL.w, CHAR_PANEL.h, 22);
      g.stroke();

      const weaponIds = model.charWeaponIds;
      const sel = model.charWeaponSelected;
      weaponIds.forEach((id: string, i: number) => {
        const rect = CHAR_OPTION_RECTS[i];
        if (!rect) return;
        const st = model.charWeapons[id];
        const carrying = model.currentCharWeapon === id;
        const selected = sel === id;
        g.fillColor = col(carrying ? '#233d2e' : st?.owned ? '#232c3e' : '#1a1f2b');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.fill();
        g.lineWidth = selected ? 4 : 2;
        g.strokeColor = col(carrying ? '#7be39a' : selected ? '#ffd479' : st?.owned ? '#4aa3ff' : '#3a4150');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.stroke();
      });

      const selState = model.charWeapons[sel];
      const canBuy = selState && !selState.owned
        && model.gold >= (model.charWeaponRow(sel, 1)?.unlock_cost_gold ?? 0);
      g.fillColor = col(canBuy ? '#3a4a30' : '#20242e');
      g.roundRect(CHAR_BUY_RECT.x - CHAR_BUY_RECT.w / 2, CHAR_BUY_RECT.y - CHAR_BUY_RECT.h / 2, CHAR_BUY_RECT.w, CHAR_BUY_RECT.h, 12);
      g.fill();
      const selRow = model.charWeaponRow(sel);
      const canUpgrade = selState?.owned && (selState.level ?? 1) < 4
        && model.gold >= (selRow?.upgrade_cost_gold ?? 0);
      const maxed = selState?.owned && (selState.level ?? 1) >= 4;
      g.fillColor = col(canUpgrade ? '#2e4a36' : maxed ? '#4a3f22' : '#20242e');
      g.roundRect(CHAR_UPGRADE_RECT.x - CHAR_UPGRADE_RECT.w / 2, CHAR_UPGRADE_RECT.y - CHAR_UPGRADE_RECT.h / 2, CHAR_UPGRADE_RECT.w, CHAR_UPGRADE_RECT.h, 12);
      g.fill();
      g.lineWidth = 2;
      g.strokeColor = col(maxed ? '#ffd479' : '#3a4150');
      g.roundRect(CHAR_UPGRADE_RECT.x - CHAR_UPGRADE_RECT.w / 2, CHAR_UPGRADE_RECT.y - CHAR_UPGRADE_RECT.h / 2, CHAR_UPGRADE_RECT.w, CHAR_UPGRADE_RECT.h, 12);
      g.stroke();
      g.fillColor = col('#2a3550');
      g.roundRect(CHAR_CLOSE_RECT.x - CHAR_CLOSE_RECT.w / 2, CHAR_CLOSE_RECT.y - CHAR_CLOSE_RECT.h / 2, CHAR_CLOSE_RECT.w, CHAR_CLOSE_RECT.h, 12);
      g.fill();
    }

    // 三选一弹层
    if (model.pendingUpgrade && !model.runOver) {
      g.fillColor = col('#05080f', 214);
      g.rect(-HALF_W, -HALF_H, DESIGN_W, DESIGN_H);
      g.fill();
      model.pendingUpgradeOptions.forEach((_, i) => {
        const rect = CARD_RECTS[i];
        g.fillColor = col('#1c2536');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 16);
        g.fill();
        g.lineWidth = 3;
        g.strokeColor = col('#4aa3ff');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 16);
        g.stroke();
      });
      g.fillColor = col('#2a3550');
      g.roundRect(REFRESH_RECT.x - REFRESH_RECT.w / 2, REFRESH_RECT.y - REFRESH_RECT.h / 2, REFRESH_RECT.w, REFRESH_RECT.h, 12);
      g.fill();
    }

    // 武器购买面板
    if (model.pendingWeaponSlot && !model.runOver) {
      g.fillColor = col('#05080f', 214);
      g.rect(-HALF_W, -HALF_H, DESIGN_W, DESIGN_H);
      g.fill();
      g.fillColor = col('#1b2434');
      g.roundRect(BUY_PANEL.x - BUY_PANEL.w / 2, BUY_PANEL.y - BUY_PANEL.h / 2, BUY_PANEL.w, BUY_PANEL.h, 22);
      g.fill();
      g.lineWidth = 3;
      g.strokeColor = col('#ffb020', 170);
      g.roundRect(BUY_PANEL.x - BUY_PANEL.w / 2, BUY_PANEL.y - BUY_PANEL.h / 2, BUY_PANEL.w, BUY_PANEL.h, 22);
      g.stroke();

      const slot = model.pendingWeaponSlot;
      const state = model.weapons.find((w: any) => w.slot === slot);
      model.weaponTable.forEach((w: any, i: number) => {
        const rect = WEAPON_OPTION_RECTS[i];
        if (!rect) return;
        const cost = w.cost_gold - model.weaponCost(slot);
        const equipped = state?.weaponId === w.weapon_id;
        const afford = model.gold >= cost && !equipped;
        g.fillColor = col(equipped ? '#2f4a3c' : afford ? '#232c3e' : '#1a1f2b');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.fill();
        g.lineWidth = 2;
        g.strokeColor = col(equipped ? '#59d998' : afford ? '#4aa3ff' : '#3a4150');
        g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
        g.stroke();
      });

      g.fillColor = col('#2a3550');
      g.roundRect(SELL_RECT.x - SELL_RECT.w / 2, SELL_RECT.y - SELL_RECT.h / 2, SELL_RECT.w, SELL_RECT.h, 12);
      g.fill();
      g.roundRect(CLOSE_RECT.x - CLOSE_RECT.w / 2, CLOSE_RECT.y - CLOSE_RECT.h / 2, CLOSE_RECT.w, CLOSE_RECT.h, 12);
      g.fill();
    }

    // 结算页
    if (model.runOver) {
      g.fillColor = col('#05080f', 220);
      g.rect(-HALF_W, -HALF_H, DESIGN_W, DESIGN_H);
      g.fill();
      g.fillColor = col('#1b2434');
      g.roundRect(-300, -400, 600, 820, 22);
      g.fill();
      g.lineWidth = 3;
      g.strokeColor = col('#e05b5b');
      g.roundRect(-300, -400, 600, 820, 22);
      g.stroke();
      g.fillColor = col('#2f4a3c');
      g.roundRect(RESTART_RECT.x - RESTART_RECT.w / 2, RESTART_RECT.y - RESTART_RECT.h / 2, RESTART_RECT.w, RESTART_RECT.h, 14);
      g.fill();
      const exportIdle = this.exportState === 'idle';
      g.fillColor = col(exportIdle ? '#2a3550' : '#262b34');
      g.roundRect(EXPORT_RECT.x - EXPORT_RECT.w / 2, EXPORT_RECT.y - EXPORT_RECT.h / 2, EXPORT_RECT.w, EXPORT_RECT.h, 14);
      g.fill();
      g.lineWidth = 2;
      g.strokeColor = col(exportIdle ? '#4a6a90' : '#3a4150');
      g.roundRect(EXPORT_RECT.x - EXPORT_RECT.w / 2, EXPORT_RECT.y - EXPORT_RECT.h / 2, EXPORT_RECT.w, EXPORT_RECT.h, 14);
      g.stroke();
    }
  }
}
