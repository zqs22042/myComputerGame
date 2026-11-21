import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initUpgradeState, getLevel, getAvailableUpgrades,
  applyUpgrade, sumBonuses,
} from '../src/core/upgrade.js';

const tables = {
  equipment: [
    { upgrade_id: 'EQ_ATK', name: '攻击力', level: 1, cost_gold: 50, effect_value: 0.15 },
    { upgrade_id: 'EQ_ATK', name: '攻击力', level: 2, cost_gold: 80, effect_value: 0.30 },
    { upgrade_id: 'EQ_ATK', name: '攻击力', level: 3, cost_gold: 120, effect_value: 0.50 },
    { upgrade_id: 'EQ_PIERCE', name: '穿透', level: 1, cost_gold: 80, effect_value: 1 },
    { upgrade_id: 'EQ_PIERCE', name: '穿透', level: 2, cost_gold: 130, effect_value: 2 },
    { upgrade_id: 'EQ_PIERCE', name: '穿透', level: 3, cost_gold: 200, effect_value: 3 },
  ],
  skill: [
    { upgrade_id: 'SK_DMG', name: '技能伤害', level: 1, cost_gold: 60, effect_value: 0.20 },
    { upgrade_id: 'SK_DMG', name: '技能伤害', level: 2, cost_gold: 100, effect_value: 0.40 },
    { upgrade_id: 'SK_DMG', name: '技能伤害', level: 3, cost_gold: 150, effect_value: 0.65 },
  ],
  ultimate: [
    { upgrade_id: 'UL_DMG', name: '大招伤害', level: 1, cost_gold: 100, effect_value: 0.25 },
    { upgrade_id: 'UL_DMG', name: '大招伤害', level: 2, cost_gold: 160, effect_value: 0.50 },
    { upgrade_id: 'UL_DMG', name: '大招伤害', level: 3, cost_gold: 240, effect_value: 0.80 },
  ],
};

test('initUpgradeState: 三条线所有 upgrade_id 初始为 0', () => {
  const state = initUpgradeState(tables);
  assert.equal(state.equipment.EQ_ATK, 0);
  assert.equal(state.equipment.EQ_PIERCE, 0);
  assert.equal(state.skill.SK_DMG, 0);
  assert.equal(state.ultimate.UL_DMG, 0);
});

test('getAvailableUpgrades: 金币不足时返回空', () => {
  const state = initUpgradeState(tables);
  const list = getAvailableUpgrades(state, 'equipment', tables, 30);
  assert.equal(list.length, 0);
});

test('getAvailableUpgrades: 金币足够时返回可升级项', () => {
  const state = initUpgradeState(tables);
  const list = getAvailableUpgrades(state, 'equipment', tables, 100);
  assert.ok(list.some(x => x.upgrade_id === 'EQ_ATK' && x.nextLevel === 1));
  assert.ok(list.some(x => x.upgrade_id === 'EQ_PIERCE' && x.nextLevel === 1));
});

test('applyUpgrade: 正常升级扣金币', () => {
  const state = initUpgradeState(tables);
  const r = applyUpgrade(state, 'equipment', 'EQ_ATK', tables, 100);
  assert.equal(r.ok, true);
  assert.equal(r.cost, 50);
  assert.equal(getLevel(r.state, 'equipment', 'EQ_ATK'), 1);
});

test('applyUpgrade: 金币不足返回 ok=false', () => {
  const state = initUpgradeState(tables);
  const r = applyUpgrade(state, 'equipment', 'EQ_ATK', tables, 10);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'insufficient_gold');
});

test('applyUpgrade: 满级后拒绝再升级', () => {
  let state = initUpgradeState(tables);
  state.equipment.EQ_ATK = 3;
  const r = applyUpgrade(state, 'equipment', 'EQ_ATK', tables, 9999);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'max_level');
});

test('sumBonuses: 升级后加成汇总正确', () => {
  let state = initUpgradeState(tables);
  state.equipment.EQ_ATK = 2;   // +0.30
  state.equipment.EQ_PIERCE = 1; // +1
  state.skill.SK_DMG = 1;        // +0.20
  state.ultimate.UL_DMG = 3;     // +0.80
  const sum = sumBonuses(state, tables);
  assert.equal(sum.atkPct, 0.30);
  assert.equal(sum.pierce, 1);
  assert.equal(sum.skillDmgPct, 0.20);
  assert.equal(sum.ultDmgPct, 0.80);
});

test('sumBonuses: 未升级时全为 0', () => {
  const state = initUpgradeState(tables);
  const sum = sumBonuses(state, tables);
  assert.equal(sum.atkPct, 0);
  assert.equal(sum.pierce, 0);
  assert.equal(sum.skillDmgPct, 0);
  assert.equal(sum.ultDmgPct, 0);
});
