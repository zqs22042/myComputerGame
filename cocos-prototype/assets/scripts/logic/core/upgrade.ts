// @ts-nocheck
// 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
// core/upgrade.js — 三条升级线状态与加成汇总（纯函数）

export const LINES = ['equipment', 'skill', 'ultimate'];

/**
 * 初始化升级状态
 * state = { equipment: {EQ_ATK:0, ...}, skill: {...}, ultimate: {...} }
 */
export function initUpgradeState(tables) {
  const state = {};
  for (const line of LINES) {
    state[line] = {};
    const rows = tables[line] || [];
    for (const row of rows) {
      if (!(row.upgrade_id in state[line])) state[line][row.upgrade_id] = 0;
    }
  }
  return state;
}

/**
 * 获取某条线某升级项的当前等级
 */
export function getLevel(state, line, upgradeId) {
  return state[line]?.[upgradeId] ?? 0;
}

/**
 * 获取某条线可升级的项（未满级且金币足够）
 * 返回 [{ upgrade_id, name, nextLevel, cost_gold, effect_value, effect_desc }]
 */
export function getAvailableUpgrades(state, line, tables, gold) {
  const rows = tables[line] || [];
  const result = [];
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.upgrade_id)) continue;
    const current = getLevel(state, line, row.upgrade_id);
    if (current >= 3) { seen.add(row.upgrade_id); continue; }
    const next = rows.find(r => r.upgrade_id === row.upgrade_id && r.level === current + 1);
    if (!next) { seen.add(row.upgrade_id); continue; }
    if (next.cost_gold <= gold) {
      result.push({
        upgrade_id: row.upgrade_id,
        name: next.name,
        nextLevel: next.level,
        cost_gold: next.cost_gold,
        effect_value: next.effect_value,
        effect_desc: next.effect_desc,
      });
    }
    seen.add(row.upgrade_id);
  }
  // 三选一：单线候选最多 3 个；超出时随机取 3（刷新可重新抽），
  // 避免第 4 个候选项永远排在卡片区之外而无法被点到。
  if (result.length > 3) {
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result.slice(0, 3);
  }
  return result;
}

/**
 * 应用升级，返回 { state, cost, ok }
 * 满级、金币不足、非法 upgradeId 均返回 ok=false
 */
export function applyUpgrade(state, line, upgradeId, tables, gold) {
  const rows = tables[line] || [];
  const current = getLevel(state, line, upgradeId);
  if (current >= 3) return { state, cost: 0, ok: false, reason: 'max_level' };
  const next = rows.find(r => r.upgrade_id === upgradeId && r.level === current + 1);
  if (!next) return { state, cost: 0, ok: false, reason: 'not_found' };
  if (next.cost_gold > gold) return { state, cost: 0, ok: false, reason: 'insufficient_gold' };
  const newState = {
    ...state,
    [line]: { ...state[line], [upgradeId]: current + 1 },
  };
  return { state: newState, cost: next.cost_gold, ok: true, reason: null };
}

/**
 * 汇总所有加成
 * 返回 { atkPct, aspdPct, rangePct, pierce, skillDmgPct, skillCdPct, skillRangePct,
 *        ultDmgPct, ultCdPct, ultRangePct }
 * 同类效果按等级累加（加算），不同类之间乘算由使用方处理。
 */
export function sumBonuses(state, tables) {
  const sum = {
    atkPct: 0, aspdPct: 0, rangePct: 0, pierce: 0,
    skillDmgPct: 0, skillCdPct: 0, skillRangePct: 0,
    ultDmgPct: 0, ultCdPct: 0, ultRangePct: 0,
  };
  const map = {
    EQ_ATK: 'atkPct', EQ_ASPD: 'aspdPct', EQ_RANGE: 'rangePct', EQ_PIERCE: 'pierce',
    SK_DMG: 'skillDmgPct', SK_CD: 'skillCdPct', SK_RANGE: 'skillRangePct',
    UL_DMG: 'ultDmgPct', UL_CD: 'ultCdPct', UL_RANGE: 'ultRangePct',
  };
  for (const line of LINES) {
    for (const [id, level] of Object.entries(state[line] || {})) {
      if (level <= 0) continue;
      const key = map[id];
      if (!key) continue;
      const row = (tables[line] || []).find(r => r.upgrade_id === id && r.level === level);
      if (!row) continue;
      sum[key] += row.effect_value;
    }
  }
  return sum;
}
