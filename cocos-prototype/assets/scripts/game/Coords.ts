// 设计分辨率坐标与 UI 布局常量（UI 坐标系原点在屏幕中心）。
// 玩法已切换为单路径拦截 + 金币成长，已移除炮台建造节点相关常量。
export const DESIGN_W = 750;
export const DESIGN_H = 1334;
export const HALF_W = DESIGN_W / 2;
export const HALF_H = DESIGN_H / 2;

// 战斗区（地图归一化坐标映射到此矩形内）
export const BATTLE = { left: -350, right: 350, bottom: -450, top: 470 };

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ---------- 归一化 ↔ 屏幕坐标 ----------
// mapX/mapY 用于路径节点；normToScreenX/Y 用于玩家活动区域，映射规则一致。
export function mapX(nx: number): number {
  return BATTLE.left + nx * (BATTLE.right - BATTLE.left);
}

export function mapY(ny: number): number {
  return BATTLE.bottom + ny * (BATTLE.top - BATTLE.bottom);
}

export function normToScreenX(nx: number): number { return mapX(nx); }
export function normToScreenY(ny: number): number { return mapY(ny); }

export function screenToNormX(sx: number): number {
  return (sx - BATTLE.left) / (BATTLE.right - BATTLE.left);
}

export function screenToNormY(sy: number): number {
  return (sy - BATTLE.bottom) / (BATTLE.top - BATTLE.bottom);
}

export function inRect(px: number, py: number, rect: Rect): boolean {
  return Math.abs(px - rect.x) <= rect.w / 2 && Math.abs(py - rect.y) <= rect.h / 2;
}

// 兼容旧调用。
export function inside(px: number, py: number, rect: Rect): boolean {
  return inRect(px, py, rect);
}

// ---------- 新布局：纵向路径 + 防线 + 站位区 ----------
// 归一化坐标与文档 01-14 / battleModelCore.js 的空间常量保持一致。
export const DEFENSE_LINE_Y = 0.34;
export const CORE_POS = { x: 0.50, y: 0.24 };
export const SLOT_POS: Record<'left' | 'right', { x: number; y: number }> = {
  left: { x: 0.30, y: 0.22 },
  right: { x: 0.70, y: 0.22 },
};
export const PLATFORM = { xMin: 0.14, xMax: 0.86, yMin: 0.02, yMax: 0.30 };
export const WIDEN_ZONE = { xMin: 0.30, xMax: 0.70, yMin: 0.34, yMax: 0.40 };

// 武器槽点击热区（屏幕坐标）
export const SLOT_RECTS: Record<'left' | 'right', Rect> = {
  left: { x: mapX(SLOT_POS.left.x), y: mapY(SLOT_POS.left.y), w: 130, h: 130 },
  right: { x: mapX(SLOT_POS.right.x), y: mapY(SLOT_POS.right.y), w: 130, h: 130 },
};

// ---------- 武器购买面板 ----------
export const BUY_PANEL: Rect = { x: 0, y: -110, w: 580, h: 640 };
export const WEAPON_OPTION_RECTS: Rect[] = [
  { x: 0, y: 100, w: 500, h: 120 },
  { x: 0, y: -40, w: 500, h: 120 },
  { x: 0, y: -180, w: 500, h: 120 },
];
export const SELL_RECT: Rect = { x: -150, y: -320, w: 220, h: 74 };
export const CLOSE_RECT: Rect = { x: 150, y: -320, w: 220, h: 74 };

// ---------- 升级三选一弹层 ----------
export const CARD_RECTS: Rect[] = [
  { x: -245, y: 30, w: 200, h: 420 },
  { x: 0, y: 30, w: 200, h: 420 },
  { x: 245, y: 30, w: 200, h: 420 },
];
export const REFRESH_RECT: Rect = { x: 0, y: -360, w: 260, h: 70 };

// ---------- 底部四个图标（三升级线 + 角色武器入口，拇指热区） ----------
export const UPGRADE_ICONS: Record<'equipment' | 'skill' | 'ultimate', Rect> = {
  equipment: { x: -270, y: -590, w: 130, h: 110 },
  skill: { x: -90, y: -590, w: 130, h: 110 },
  ultimate: { x: 90, y: -590, w: 130, h: 110 },
};
export const CHAR_WEAPON_ICON: Rect = { x: 270, y: -590, w: 130, h: 110 };

// ---------- 角色武器面板（暂停式弹层） ----------
export const CHAR_PANEL: Rect = { x: 0, y: -60, w: 640, h: 780 };
export const CHAR_OPTION_RECTS: Rect[] = [
  { x: -155, y: 150, w: 290, h: 180 },
  { x: 155, y: 150, w: 290, h: 180 },
  { x: -155, y: -50, w: 290, h: 180 },
  { x: 155, y: -50, w: 290, h: 180 },
];
export const CHAR_BUY_RECT: Rect = { x: -155, y: -215, w: 240, h: 80 };
export const CHAR_UPGRADE_RECT: Rect = { x: 155, y: -215, w: 240, h: 80 };
export const CHAR_CLOSE_RECT: Rect = { x: 0, y: -320, w: 480, h: 74 };

export const UPGRADE_LINE_LABEL: Record<'equipment' | 'skill' | 'ultimate', string> = {
  equipment: '装备',
  skill: '技能',
  ultimate: '大招',
};

// ---------- 结算页双按钮 ----------
export const RESTART_RECT: Rect = { x: -130, y: -330, w: 240, h: 84 };
export const EXPORT_RECT: Rect = { x: 130, y: -330, w: 240, h: 84 };

// ---------- 顶部 HUD 文本位置 ----------
// 纵向顺序：波次/金币 → 核心文本 → 核心血条 → Boss 血条 → 循环 → 存活时间
export const HUD = {
  waveX: -240, waveY: 638,
  goldX: 200, goldY: 638,
  coreY: 612,
  barY: 574,
  bossBarY: 540,
  cycleY: 500,
  timerY: 460,
};
