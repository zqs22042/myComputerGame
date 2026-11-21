import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initSoftGrowth, softCapBonus, convertOverflowGold, isSoftGrowthUnlocked,
} from '../src/core/softGrowth.js';

const cfg = {
  soft_growth_reserve: 1000,
  soft_dmg_per_gold: 0.0006,
  soft_dmg_cap: 3.0,
  soft_aspd_per_gold: 0.0003,
  soft_aspd_cap: 0.6,
};

test('softCapBonus: 0 金币为 0，且不超过上限', () => {
  assert.equal(softCapBonus(0, 0.0006, 3), 0);
  assert.ok(softCapBonus(1e9, 0.0006, 3) <= 3);
  assert.ok(softCapBonus(1e9, 0.0006, 3) > 2.99);
});

test('softCapBonus: 边际递减（等额金币的增量越来越小）', () => {
  const a = softCapBonus(1000, 0.0006, 3) - softCapBonus(0, 0.0006, 3);
  const b = softCapBonus(2000, 0.0006, 3) - softCapBonus(1000, 0.0006, 3);
  assert.ok(a > b && b > 0);
});

test('convertOverflowGold: 未超过保留线不转化', () => {
  const state = initSoftGrowth();
  const r = convertOverflowGold(state, 800, cfg);
  assert.equal(r.converted, 0);
  assert.equal(r.gold, 800);
  assert.equal(r.state.gold, 0);
});

test('convertOverflowGold: 只转化保留线以上金币，并保持保留线', () => {
  const state = initSoftGrowth();
  const r = convertOverflowGold(state, 1500, cfg);
  assert.equal(r.converted, 500);
  assert.equal(r.gold, 1000);
  assert.equal(r.state.gold, 500);
  assert.ok(r.state.dmgPct > 0 && r.state.aspdPct > 0);
  // 入参不被修改
  assert.equal(state.gold, 0);
});

test('convertOverflowGold: 累计池越大加成越高，但不超过封顶', () => {
  let state = initSoftGrowth();
  for (let i = 0; i < 100; i += 1) {
    state = convertOverflowGold(state, 10000, cfg).state;
  }
  assert.ok(state.dmgPct <= 3.0 && state.dmgPct > 2.9);
  assert.ok(state.aspdPct <= 0.6 && state.aspdPct > 0.55);
});

test('isSoftGrowthUnlocked: 仅当前武器满级且已解锁时开启', () => {
  assert.equal(isSoftGrowthUnlocked({ owned: true, level: 3 }, 4), false);
  assert.equal(isSoftGrowthUnlocked({ owned: true, level: 4 }, 4), true);
  assert.equal(isSoftGrowthUnlocked({ owned: false, level: 4 }, 4), false);
  assert.equal(isSoftGrowthUnlocked(null, 4), false);
});
