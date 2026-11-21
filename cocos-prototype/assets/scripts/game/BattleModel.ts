// BattleModel.ts — Cocos 侧薄包装，逻辑全部委托 BattleModelCore
// 纯逻辑由 tools/sync-logic.mjs 从 tech-validation 同步到 assets/scripts/logic。
import { BattleModelCore } from '../logic/battleModelCore';

// 配置结构与 tech-validation 的 CSV 表集合一致。
export interface BattleConfig {
  endless_config: Array<{ param_name: string; default_value: number }>;
  map_paths: Array<{ node_index: number; x: number; y: number; node_type: string }>;
  player_zone: Array<{ zone_id: string; x_min: number; x_max: number; y_min: number; y_max: number }>;
  upgrade_equipment: any[];
  upgrade_skill: any[];
  upgrade_ultimate: any[];
  weapons: any[];
  monsters: any[];
  [key: string]: any;
}

export interface UpgradeOption {
  upgrade_id: string;
  name: string;
  nextLevel: number;
  cost_gold: number;
  effect_value: number;
  effect_desc: string;
}

export class BattleModel {
  private core: BattleModelCore;

  constructor(config: BattleConfig) {
    this.core = new BattleModelCore(config);
  }

  // ---------- 渲染层只读状态 ----------
  get coreHp() { return this.core.core.hp; }
  get coreMaxHp() { return this.core.core.maxHp; }
  get player() { return this.core.player; }
  get playerZone() { return this.core.playerZone; }
  get path() { return this.core.path; }
  get monsters() { return this.core.monsters; }
  get boss() { return this.core.boss; }
  get bullets() { return this.core.bullets; }
  get gold() { return this.core.gold; }
  get survivalSec() { return this.core.survivalSec; }
  get waveIndex() { return this.core.waveIndex; }
  get cycleIndex() { return this.core.cycleIndex; }
  get killCount() { return this.core.killCount; }
  get waveState() { return this.core.waveState; }
  get hpTier() { return this.core.hpTier; }
  get softGrowth() { return this.core.softGrowth; }
  get effectiveAtkPct() { return this.core.effectiveAtkPct(); }
  get effectiveAspdPct() { return this.core.effectiveAspdPct(); }
  get pendingUpgrade() { return this.core.pendingUpgrade; }
  get pendingUpgradeOptions(): UpgradeOption[] { return this.core.pendingUpgrade?.options ?? []; }
  get pendingUpgradeLine(): 'equipment' | 'skill' | 'ultimate' | null { return this.core.pendingUpgrade?.line ?? null; }
  get upgradeState() { return this.core.upgradeState; }
  get bonuses() { return this.core.bonuses; }
  /** 该线当前最低可升级价格；全满级为 null */
  cheapestUpgradeCost(line: 'equipment' | 'skill' | 'ultimate') { return this.core.cheapestUpgradeCost(line); }
  /** 技能/大招冷却剩余秒数与释放特效 */
  get skillDef() { return this.core.activeSkill; }
  get ultimateDef() { return this.core.ultimateSkill; }
  get skillCdLeft(): number { return this.core.skillCdLeft; }
  get ultCdLeft(): number { return this.core.ultCdLeft; }
  get ultActive(): boolean { return this.core.isUltActive(); }
  get fx() { return this.core.fx; }
  get runOver() { return this.core.runOver; }
  get events() { return this.core.events; }
  get weapons() { return this.core.weapons; }
  get weaponTable() { return this.core.weaponTable; }
  get pendingWeaponSlot(): 'left' | 'right' | null { return this.core.pendingWeaponSlot; }

  // ---------- 角色武器 ----------
  get charWeaponTable() { return this.core.charWeaponTable; }
  get charWeapons() { return this.core.charWeapons; }
  get currentCharWeapon(): string { return this.core.currentCharWeapon; }
  get charWeaponSelected(): string { return this.core.charWeaponSelected; }
  get pendingCharWeaponPanel(): boolean { return this.core.pendingCharWeaponPanel; }
  /** 角色武器 ID 列表（按表内出现顺序） */
  get charWeaponIds(): string[] {
    const ids = this.core.charWeaponTable.map((r: any) => String(r.weapon_id));
    // 不用 [...new Set()]：Cocos 降级转译会得到 [].concat(Set)，返回 Set 对象而不是 ID 数组
    return Array.from(new Set<string>(ids));
  }
  /** 取某武器当前等級的属性行 */
  charWeaponRow(weaponId: string, level?: number) {
    const lv = level ?? this.charWeapons[weaponId]?.level;
    return this.core.charWeaponTable.find((r: any) => r.weapon_id === weaponId && r.level === lv) ?? null;
  }

  // ---------- 生命周期 ----------
  start() { this.core.start(); }
  reset() { this.core.reset(); }
  update(dt: number) { this.core.update(dt); }

  // ---------- 操作 ----------
  movePlayer(x: number, y: number) { this.core.movePlayer(x, y); }
  openUpgrade(line: 'equipment' | 'skill' | 'ultimate') { return this.core.openUpgrade(line); }
  pickUpgrade(id: string) { this.core.pickUpgrade(id); }
  refreshUpgradeOptions(method: 'coin' | 'ad') { this.core.refreshUpgradeOptions(method); }

  // ---------- 武器槽 ----------
  openWeaponPanel(slot: 'left' | 'right') { return this.core.openWeaponPanel(slot); }
  closeWeaponPanel() { this.core.closeWeaponPanel(); }
  buyWeapon(slot: 'left' | 'right', weaponId: string) { return this.core.buyWeapon(slot, weaponId); }
  sellWeapon(slot: 'left' | 'right') { return this.core.sellWeapon(slot); }
  weaponCost(slot: 'left' | 'right') { return this.core.weaponCost(slot); }

  // ---------- 角色武器 ----------
  openCharWeaponPanel() { return this.core.openCharWeaponPanel(); }
  closeCharWeaponPanel() { this.core.closeCharWeaponPanel(); }
  selectCharWeapon(weaponId: string) { return this.core.selectCharWeapon(weaponId); }
  buyCharWeapon(weaponId: string) { return this.core.buyCharWeapon(weaponId); }
  upgradeCharWeapon(weaponId: string) { return this.core.upgradeCharWeapon(weaponId); }
  switchCharWeapon(weaponId: string) { return this.core.switchCharWeapon(weaponId); }

  // ---------- 结算 ----------
  getRunSummary() { return this.core.getRunSummary(); }
}
