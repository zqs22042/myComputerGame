// @ts-nocheck
// 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
// core/softGrowth.js — 满级后溢出金币转局内软成长（纯函数，无引擎依赖）
// 设计：溢出金币进入同一个累计池，伤害/射速各自用饱和曲线换算，边际递减并封顶。
// bonus = cap × (1 - exp(-gold × perGold / cap))

export function initSoftGrowth() {
  return { gold: 0, dmgPct: 0, aspdPct: 0 };
}

/** 饱和软成长：gold=0 时加成为 0，gold→∞ 时趋近 cap，初始斜率 = perGold */
export function softCapBonus(gold, perGold, cap) {
  if (!(gold > 0) || !(perGold > 0) || !(cap > 0)) return 0;
  return cap * (1 - Math.exp(-gold * perGold / cap));
}

/** 当前携带武器达到满级后，才允许把溢出金币转为软成长 */
export function isSoftGrowthUnlocked(weaponState, maxLevel) {
  return !!(weaponState && weaponState.owned && weaponState.level >= maxLevel);
}

/**
 * 把 gold 中超过 reserve 的部分全部转入软成长池。
 * 返回新状态、保留后的金币、本次转化量；不修改入参。
 */
export function convertOverflowGold(state, gold, cfg) {
  const reserve = Math.max(0, cfg.soft_growth_reserve ?? 0);
  const overflow = Math.max(0, gold - reserve);
  if (overflow <= 0) return { state, gold, converted: 0 };

  const next = { gold: state.gold + overflow };
  next.dmgPct = softCapBonus(next.gold, cfg.soft_dmg_per_gold, cfg.soft_dmg_cap);
  next.aspdPct = softCapBonus(next.gold, cfg.soft_aspd_per_gold, cfg.soft_aspd_cap);
  return { state: next, gold: reserve, converted: overflow };
}
