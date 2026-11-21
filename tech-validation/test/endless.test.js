import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcMonsterHp, calcBossHp, calcBossDamage,
  getWaveType, getCycleIndex, calcSpawnCount, getHpStepTier,
} from '../src/core/endless.js';

const cfg = {
  hp_step_waves: 5,
  hp_step_growth: 0.35,
  boss_wave_step_extra: 1,
  elite_every_waves: 5,
  boss_every_waves: 10,
  base_spawn_count: 8,
  spawn_count_growth: 1.15,
  boss_damage_cycle_bonus: 0.10,
};

test('getHpStepTier: 每 5 波一档，Boss 波额外跳档', () => {
  assert.equal(getHpStepTier(1, cfg), 0);
  assert.equal(getHpStepTier(5, cfg), 0);
  assert.equal(getHpStepTier(6, cfg), 1);
  assert.equal(getHpStepTier(10, cfg), 1);
  assert.equal(getHpStepTier(11, cfg), 2);
  assert.equal(getHpStepTier(10, cfg, true), 2);
  assert.equal(getHpStepTier(20, cfg, true), 4);
});

test('calcMonsterHp: 同一档位内血量不变', () => {
  assert.equal(calcMonsterHp(60, 1, cfg), 60);
  assert.equal(calcMonsterHp(60, 5, cfg), 60);
});

test('calcMonsterHp: 每跨 5 波乘一次 1.35', () => {
  // 60 × 1.35 = 81；60 × 1.35² = 109.35 → 109
  assert.equal(calcMonsterHp(60, 6, cfg), 81);
  assert.equal(calcMonsterHp(60, 10, cfg), 81);
  assert.equal(calcMonsterHp(60, 11, cfg), 109);
});

test('calcBossHp: Boss 波在普通档位基础上额外跳 1 档', () => {
  // 第10波：普通档位1 + 跳档1 = 2 → 6000 × 1.35² = 10935
  assert.equal(calcBossHp(6000, 10, cfg), 10935);
  // 第20波：普通档位3 + 跳档1 = 4 → 6000 × 1.35⁴ = 19929
  assert.equal(calcBossHp(6000, 20, cfg), 19929);
});

test('calcBossDamage: 循环 1 无额外加成', () => {
  assert.equal(calcBossDamage(15, 1, cfg), 15);
});

test('calcBossDamage: 循环 3 吃 1.2 倍', () => {
  // 15 × (1 + 0.1×2) = 18
  assert.equal(calcBossDamage(15, 3, cfg), 18);
});

test('getWaveType: 第 5 波精英、第 10 波 Boss、第 15 波精英', () => {
  assert.equal(getWaveType(5, cfg), 'elite');
  assert.equal(getWaveType(10, cfg), 'boss');
  assert.equal(getWaveType(15, cfg), 'elite');
  assert.equal(getWaveType(20, cfg), 'boss');
  assert.equal(getWaveType(1, cfg), 'normal');
});

test('getCycleIndex: 第 1–10 波循环 1，第 11 波起循环 2', () => {
  assert.equal(getCycleIndex(1, cfg), 1);
  assert.equal(getCycleIndex(10, cfg), 1);
  assert.equal(getCycleIndex(11, cfg), 2);
  assert.equal(getCycleIndex(20, cfg), 2);
  assert.equal(getCycleIndex(21, cfg), 3);
});

test('calcSpawnCount: 第 1 波 8，第 2 波 9（8×1.15 四舍五入）', () => {
  assert.equal(calcSpawnCount(1, cfg), 8);
  assert.equal(calcSpawnCount(2, cfg), 9);
  assert.equal(calcSpawnCount(3, cfg), 11);
});
