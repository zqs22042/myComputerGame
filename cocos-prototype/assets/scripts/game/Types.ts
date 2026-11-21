// 原型运行时类型：战斗实体、特效、词条与加成。
export interface Enemy {
  id: string;
  monsterId: string;
  name: string;
  hp: number;
  maxHp: number;
  speed: number;
  armor: number;
  goldDrop: number;
  expDrop: number;
  leakDamage: number;
  dist: number;
  isBoss: boolean;
  dead: boolean;
  slowUntil: number;
  slowFactor: number;
  burnDps: number;
  burnUntil: number;
  bonusSpeed: number;
  timeline: any;
}

export interface Tower {
  id: string;
  nodeIndex: number;
  order: number;
  cannonId: string;
  x: number;
  y: number;
  level: number;
  cooldown: number;
  disabledUntil: number;
  shots: number;
}

export interface Hero {
  x: number;
  y: number;
  cooldown: number;
}

export interface Beam {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  until: number;
  color: [number, number, number];
}

export interface FloatText {
  x: number;
  y: number;
  text: string;
  until: number;
  color: [number, number, number];
}

export interface CardOption {
  cardId: string;
  name: string;
  rarity: string;
  level: number;
  effectValue: number;
  effectDesc: string;
  synergyTag: string;
  category: string;
}

export interface Modifiers {
  pierce: number;
  ricochet: number;
  split: number;
  critRate: number;
  critDamage: number;
  heroIntervalMult: number;
  burn: number;
  explode: number;
  towerIntervalMult: number;
  towerRangeBonus: number;
  slowAura: number;
  frostSlow: number;
  tesla: number;
  towerSynergy: number;
  coreMaxBonus: number;
  healPerWave: number;
  dodge: number;
  thorns: number;
  emergency: number;
  goldBonus: number;
  expBonus: number;
  freeRefresh: number;
  interest: number;
  greed: number;
}

export interface TelemetryHooks {
  onTelemetry?: (event: string, payload: any) => void;
  onLog?: (line: string) => void;
}

// 本局事件流：t 为本局已过秒数（1 位小数）。
export interface BattleEvent {
  t: number;
  type: string;
  params: Record<string, any>;
}
