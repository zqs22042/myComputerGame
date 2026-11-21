import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BattleModelCore } from '../src/battleModelCore.js';
import { loadAllTables } from '../src/loader.js';

const { tables: config } = loadAllTables();

// 站在角色脚下的静止靶子，用来观察技能/大招伤害
function makeTarget(m, overrides = {}) {
  const target = {
    id: m.nextId++, monsterId: 'M01', hp: 1e6, maxHp: 1e6,
    x: m.player.x, y: m.player.y, pathIndex: 0, speed: 0, armor: 0,
    goldDrop: 0, leakDamage: 0, special: 'none',
    slowUntil: 0, burningUntil: 0, burnDps: 0,
    ...overrides,
  };
  m.monsters = [target];
  m.spawnQueue = [];
  return target;
}

function lastEvent(m, type) {
  return [...m.events].reverse().find(e => e.type === type);
}

// ---------- 技能线 ----------
test('技能线：SK01 伤害/范围/冷却加成进入战斗结算', () => {
  const m = new BattleModelCore(config);
  m.start();
  makeTarget(m);

  // 未升级基准：RW01 Lv1 攻击力 10 × 系数 1.8 = 18，半径 0.18
  m.skillCdLeft = 0;
  m.updateSkills(0.01);
  const base = lastEvent(m, 'skill_cast');
  assert.ok(base, '应触发 skill_cast');
  assert.equal(base.params.hits, 1);
  assert.ok(Math.abs(base.params.damage - 18) < 1e-6);
  assert.ok(Math.abs(base.params.radius - 0.18) < 1e-6);
  assert.ok(Math.abs(m.skillCdLeft - 10) < 1e-9);

  // 升一级技能伤害(+20%)与技能范围(+15%)
  m.gold = 9999;
  assert.equal(m.openUpgrade('skill'), true);
  m.pickUpgrade('SK_DMG');
  assert.equal(m.upgradeState.skill.SK_DMG, 1);
  assert.equal(m.openUpgrade('skill'), true);
  m.pickUpgrade('SK_RANGE');

  m.skillCdLeft = 0;
  m.updateSkills(0.01);
  const boosted = lastEvent(m, 'skill_cast');
  assert.ok(Math.abs(boosted.params.damage - base.params.damage * 1.2) < 1e-6);
  assert.ok(Math.abs(boosted.params.radius - base.params.radius * 1.15) < 1e-6);

  // 技能冷却 -10%：10s → 9.0909s
  assert.equal(m.openUpgrade('skill'), true);
  m.pickUpgrade('SK_CD');
  m.skillCdLeft = 0;
  m.updateSkills(0.01);
  assert.ok(Math.abs(m.skillCdLeft - 10 / 1.1) < 1e-9);
});

// ---------- 大招线 ----------
test('大招线：UL_DMG/UL_RANGE 放大爆发伤害与范围', () => {
  const m = new BattleModelCore(config);
  m.start();
  makeTarget(m);
  m.gold = 9999;
  assert.equal(m.openUpgrade('ultimate'), true);
  m.pickUpgrade('UL_DMG');
  assert.equal(m.openUpgrade('ultimate'), true);
  m.pickUpgrade('UL_RANGE');

  m.ultCdLeft = 0;
  m.updateSkills(0.01);
  const ev = lastEvent(m, 'ult_cast');
  assert.ok(ev, '应触发 ult_cast');
  assert.equal(ev.params.hits, 1);
  assert.ok(Math.abs(ev.params.damage - 10 * 1.25) < 1e-6);   // 100% 攻击力 ×1.25
  assert.ok(Math.abs(ev.params.radius - 0.42 * 1.2) < 1e-6);
});

test('大招线：UL_CD 缩短冷却，弹幕期间攻速×3+无限穿透', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 9999;
  assert.equal(m.openUpgrade('ultimate'), true);
  m.pickUpgrade('UL_CD');

  m.ultCdLeft = 0;
  m.updateSkills(0.01);
  assert.ok(Math.abs(m.ultCdLeft - 40 / 1.12) < 1e-9);
  assert.equal(m.isUltActive(), true);

  // 弹幕期间：RW01 Lv1 间隔 1.0 → 0.333，0.4s 即可开火；穿透取满
  m.survivalSec = 0.4;
  m.lastFireAt = 0;
  m.autoFire();
  assert.equal(m.bullets.length, 1);
  assert.equal(m.bullets[0].damage, 10);
  assert.equal(m.bullets[0].pierceLeft, 99);

  // 非弹幕状态同一时刻不会开火（0.4 < 1.0）
  const plain = new BattleModelCore(config);
  plain.start();
  plain.survivalSec = 0.4;
  plain.lastFireAt = 0;
  plain.autoFire();
  assert.equal(plain.bullets.length, 0);
});

// ---------- 三选一入口 ----------
test('三选一：单线候选最多 3 个，装备线 4 项可轮换出现', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 9999;

  const seen = new Set();
  for (let i = 0; i < 120; i += 1) {
    m.openUpgrade('equipment');
    const ids = m.pendingUpgrade.options.map(o => o.upgrade_id);
    assert.equal(ids.length, 3);
    ids.forEach(id => seen.add(id));
    m.pendingUpgrade = null;
  }
  assert.deepEqual([...seen].sort(), ['EQ_ASPD', 'EQ_ATK', 'EQ_PIERCE', 'EQ_RANGE']);

  for (const line of ['skill', 'ultimate']) {
    assert.equal(m.openUpgrade(line), true);
    assert.equal(m.pendingUpgrade.options.length, 3);
    m.pendingUpgrade = null;
  }
});
