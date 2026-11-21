// @ts-nocheck
// 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
// core/endless.js — 无尽波次与血量计算（纯函数，无引擎依赖）

/**
 * 血量档位：每 hp_step_waves 波提升一档，档位从 0 开始。
 * Boss 波在普通档位基础上额外跳 boss_wave_step_extra 档。
 */
export function getHpStepTier(waveIndex, cfg, isBoss = false) {
  const width = Math.max(1, Math.floor(cfg.hp_step_waves));
  const baseTier = Math.floor((Math.max(1, waveIndex) - 1) / width);
  const bossSkip = isBoss ? Math.max(0, Math.floor(cfg.boss_wave_step_extra)) : 0;
  return baseTier + bossSkip;
}

/** 档位倍率：HP × (1 + hp_step_growth)^tier */
export function hpStepMultiplier(tier, cfg) {
  return Math.pow(1 + Math.max(0, cfg.hp_step_growth), Math.max(0, tier));
}

/**
 * 普通怪血量（分段台阶，不再随时间连续增长）
 * hp = hp_base × (1 + hp_step_growth)^floor((waveIndex - 1) / hp_step_waves)
 */
export function calcMonsterHp(hpBase, waveIndex, cfg) {
  return Math.round(hpBase * hpStepMultiplier(getHpStepTier(waveIndex, cfg), cfg));
}

/**
 * Boss 血量：在普通档位基础上额外跳档
 * hp = hp_base × (1 + hp_step_growth)^(普通档位 + boss_wave_step_extra)
 */
export function calcBossHp(hpBase, waveIndex, cfg) {
  return Math.round(hpBase * hpStepMultiplier(getHpStepTier(waveIndex, cfg, true), cfg));
}

/**
 * Boss 伤害
 * dmg = baseDamage × (1 + boss_damage_cycle_bonus × (cycleIndex - 1))
 */
export function calcBossDamage(baseDamage, cycleIndex, cfg) {
  const { boss_damage_cycle_bonus } = cfg;
  const cycleFactor = 1 + boss_damage_cycle_bonus * (cycleIndex - 1);
  return Math.round(baseDamage * cycleFactor * 100) / 100;
}

/**
 * 波次类型
 * 每循环 10 波，第 5 波精英，第 10 波 Boss，其余普通。
 * waveIndex 从 1 开始，连续递增（不按循环重置）。
 */
export function getWaveType(waveIndex, cfg) {
  const { elite_every_waves, boss_every_waves } = cfg;
  const withinCycle = ((waveIndex - 1) % boss_every_waves) + 1;
  if (withinCycle === boss_every_waves) return 'boss';
  if (withinCycle === elite_every_waves) return 'elite';
  return 'normal';
}

/**
 * 当前循环编号
 * cycleIndex = floor((waveIndex - 1) / boss_every_waves) + 1
 */
export function getCycleIndex(waveIndex, cfg) {
  return Math.floor((waveIndex - 1) / cfg.boss_every_waves) + 1;
}

/**
 * 当前波次数量
 * count = round(base_spawn_count × spawn_count_growth^(waveIndex - 1))
 */
export function calcSpawnCount(waveIndex, cfg) {
  const { base_spawn_count, spawn_count_growth } = cfg;
  return Math.max(1, Math.round(base_spawn_count * Math.pow(spawn_count_growth, waveIndex - 1)));
}
