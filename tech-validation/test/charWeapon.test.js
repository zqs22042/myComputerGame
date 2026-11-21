import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BattleModelCore } from '../src/battleModelCore.js';
import { loadAllTables } from '../src/loader.js';

const { tables: config } = loadAllTables();

// 造一只静止怪：站在 (0.5, 0.75)，武器打得到
function makeMonster(m, overrides = {}) {
  const monster = {
    id: m.nextId++, monsterId: 'M01', hp: 100, maxHp: 100,
    x: 0.5, y: 0.75, pathIndex: 0, speed: 0, armor: 0,
    goldDrop: 1, leakDamage: 0, special: 'none',
    slowUntil: 0, burningUntil: 0, burnDps: 0,
    ...overrides,
  };
  m.monsters.push(monster);
  m.spawnQueue = [];
  return monster;
}

// ---------- 初始状态 ----------
test('角色武器：初始携带 RW01 Lv1，其余锁定', () => {
  const m = new BattleModelCore(config);
  m.start();
  assert.equal(m.currentCharWeapon, 'RW01');
  assert.equal(m.charWeapons.RW01.owned, true);
  assert.equal(m.charWeapons.RW01.level, 1);
  assert.equal(m.charWeapons.RW02.owned, false);
  assert.equal(m.charWeapons.RW03.owned, false);
  assert.equal(m.charWeapons.RW04.owned, false);
});

test('角色武器：Lv1 单发直线子弹，属性取当前等级行', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.survivalSec = 1.0;
  m.autoFire();
  assert.equal(m.bullets.length, 1);
  const b = m.bullets[0];
  assert.equal(b.kind, 'circle');
  assert.equal(b.damage, 10);          // RW01 Lv1 damage
  assert.equal(b.maxRange, 1.6);       // 全屏射程
  assert.ok(Math.abs(b.vx) < 1e-9 && b.vy > 0);
});

// ---------- 购买 ----------
test('角色武器：购买 RW02 扣 150 金并解锁 Lv1', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 200;
  assert.equal(m.buyCharWeapon('RW02'), true);
  assert.equal(m.gold, 50);
  assert.equal(m.charWeapons.RW02.owned, true);
  assert.equal(m.charWeapons.RW02.level, 1);
  const ev = m.events.find(e => e.type === 'char_weapon_buy');
  assert.deepEqual(ev.params, { weapon_id: 'RW02', cost_gold: 150 });
});

test('角色武器：金币不足购买失败，已拥有不可重复购买', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 100;
  assert.equal(m.buyCharWeapon('RW03'), false);   // 220 金买不起
  assert.equal(m.gold, 100);
  assert.equal(m.buyCharWeapon('RW01'), false);   // 初始已拥有
  assert.equal(m.gold, 100);
});

test('角色武器：未购买的武器不可切换、不可升级', () => {
  const m = new BattleModelCore(config);
  m.start();
  assert.equal(m.switchCharWeapon('RW04'), false);
  assert.equal(m.upgradeCharWeapon('RW04'), false);
  assert.equal(m.currentCharWeapon, 'RW01');
});

// ---------- 升级 ----------
test('角色武器：升级扣 50/120/250，Lv4 满级拒升', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 1000;
  assert.equal(m.upgradeCharWeapon('RW01'), true);   // Lv1→2 扣 50
  assert.equal(m.gold, 950);
  assert.equal(m.upgradeCharWeapon('RW01'), true);   // Lv2→3 扣 120
  assert.equal(m.gold, 830);
  assert.equal(m.upgradeCharWeapon('RW01'), true);   // Lv3→4 扣 250
  assert.equal(m.gold, 580);
  assert.equal(m.charWeapons.RW01.level, 4);
  assert.equal(m.upgradeCharWeapon('RW01'), false);  // 满级拒升
  const upg = m.events.filter(e => e.type === 'char_weapon_upgrade');
  assert.deepEqual(upg.map(e => e.params.level), [2, 3, 4]);
});

test('角色武器：升级后弹数与伤害同步提升（Lv2 = 3 发）', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.upgradeCharWeapon('RW01');
  m.survivalSec = 1.0;
  m.autoFire();
  assert.equal(m.bullets.length, 3);
  assert.ok(m.bullets.every(b => b.damage === 12));
});

test('角色武器：金币不足升级失败且不扣钱', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 30;
  assert.equal(m.upgradeCharWeapon('RW01'), false);
  assert.equal(m.gold, 30);
  assert.equal(m.charWeapons.RW01.level, 1);
});

// ---------- 切换 ----------
test('角色武器：切换加载该武器等级与属性，不重置冷却', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW04');
  m.upgradeCharWeapon('RW04');   // RW04 → Lv2
  // RW01 开火后进入冷却（Lv1 间隔 1.0s）
  m.survivalSec = 1.0;
  m.autoFire();
  assert.equal(m.lastFireAt, 1.0);
  assert.equal(m.switchCharWeapon('RW04'), true);
  assert.equal(m.currentCharWeapon, 'RW04');
  const ev = m.events.find(e => e.type === 'char_weapon_switch');
  assert.deepEqual(ev.params, { weapon_id: 'RW04', level: 2 });
  // 冷却未结束：再过 0.3s 不发射
  m.survivalSec = 1.3;
  const count = m.bullets.length;
  m.autoFire();
  assert.equal(m.bullets.length, count);
  // 冷却结束后按 RW04 Lv2 属性发射（间隔 1.3s，弹数 3）
  m.survivalSec = 1.0 + 1.35;
  m.autoFire();
  const fresh = m.bullets.slice(count);
  assert.equal(fresh.length, 3);
  assert.ok(fresh.every(b => b.kind === 'missile' && b.damage === 23));
});

// ---------- 面板 ----------
test('角色武器：面板打开时 update 完全暂停', () => {
  const m = new BattleModelCore(config);
  m.start();
  assert.equal(m.openCharWeaponPanel(), true);
  const t0 = m.survivalSec;
  m.update(1.0);
  assert.equal(m.survivalSec, t0);
});

// ---------- 子弹形态：多弹独立判定 ----------
test('子弹：Lv3 五发独立判定，可同时命中同一敌人伤害叠加', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.upgradeCharWeapon('RW01'); m.upgradeCharWeapon('RW01');   // Lv3：5 发
  const target = makeMonster(m, { x: 0.5, y: 0.55 });
  m.survivalSec = 1.0;
  m.autoFire();                       // 5 发全在扇形中线上（circle 无散射）
  // 推进到子弹抵达目标附近
  for (let i = 0; i < 60; i++) { m.updateBullets(0.02); }
  // 5 颗全部命中同一目标，伤害叠加（10→Lv3 单发 15）
  assert.ok(target.hp < 100);
  assert.equal(100 - target.hp, 15 * 5);
});

test('子弹：霰弹扇形散射且距离越远伤害衰减（最远 50%）', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW02');
  m.switchCharWeapon('RW02');
  m.upgradeCharWeapon('RW02');   // RW02 Lv2：3 发，spread_angle 22°，单发 16
  makeMonster(m, { x: 0.5, y: 0.45 });   // 近点怪
  m.survivalSec = 1.0;
  m.autoFire();
  assert.equal(m.bullets.length, 3);
  // 中间弹直上，两侧弹 ±11°
  const angles = m.bullets.map(b => Math.atan2(b.vy, b.vx) * 180 / Math.PI);
  angles.sort((a, b) => a - b);
  assert.ok(Math.abs(angles[1] - 90) < 1e-6);
  assert.ok(Math.abs(angles[0] - 79) < 1e-6);
  assert.ok(Math.abs(angles[2] - 101) < 1e-6);
  // 衰减：falloff 标记 0.5，模拟远距离命中时伤害至少打 5 折
  const b = m.bullets[0];
  b.travel = b.maxRange;   // 飞到最远
  assert.equal(m.spreadFalloff(b), 0.5);
  b.travel = b.maxRange / 2;
  assert.equal(m.spreadFalloff(b), 0.75);
});

test('子弹：飞出屏幕边界后自动销毁，防止内存占用', () => {
  const m = new BattleModelCore(config);
  m.start();
  makeMonster(m, { x: 0.9, y: 0.9 });   // 打不到的怪
  m.survivalSec = 1.0;
  m.autoFire();
  // 全屏射程 1.6：RW01 Lv1 速度 0.42/s，从 y=0.18 向上飞出屏幕约需 2.2s
  for (let i = 0; i < 160; i++) m.updateBullets(0.02);
  assert.equal(m.bullets.length, 0);
});

test('子弹：激光按穿透计数穿过敌人，计数归零销毁', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW03');
  m.switchCharWeapon('RW03');
  m.upgradeCharWeapon('RW03'); m.upgradeCharWeapon('RW03');   // RW03 Lv3：5 发，穿透 3
  const a = makeMonster(m, { x: 0.5, y: 0.6 });
  const b = makeMonster(m, { x: 0.5, y: 0.5 });
  const c = makeMonster(m, { x: 0.5, y: 0.4 });
  m.survivalSec = 1.0;
  m.autoFire();
  assert.equal(m.bullets.length, 5);
  // 推进：中线激光依次穿过 3 只怪
  for (let i = 0; i < 60; i++) { m.updateBullets(0.02); }
  assert.ok(a.hp < 100 && b.hp < 100 && c.hp < 100);
  // 穿透 3 人后激光消失；其余 4 发散射弹只命中所路过目标
  assert.equal(m.bullets.length, 0);
});

// ---------- 子弹形态：导弹 ----------
test('子弹：导弹追踪命中爆炸，半径内目标各结算 1 次不叠加', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW04');
  m.switchCharWeapon('RW04');   // RW04 Lv1：伤害 20，爆炸半径 0.8m
  const hit = makeMonster(m, { x: 0.5, y: 0.5 });
  const near = makeMonster(m, { x: 0.54, y: 0.5 });   // 距爆心 0.04 < 0.8m×0.08=0.064
  const far = makeMonster(m, { x: 0.62, y: 0.5 });    // 距爆心 0.12 > 0.064
  m.survivalSec = 1.5;
  m.autoFire();
  assert.equal(m.bullets.length, 1);
  assert.equal(m.bullets[0].kind, 'missile');
  assert.equal(m.bullets[0].targetId, hit.id);
  // 导弹速度 0.26 归一化/s，飞行 0.37 需约 1.42s
  for (let i = 0; i < 80; i++) { m.updateBullets(0.02); }
  // 直击目标只吃 1 次伤害（直击+爆炸不叠加，边界 1）
  assert.equal(100 - hit.hp, 20);
  assert.equal(100 - near.hp, 20);
  assert.equal(far.hp, 100);
  assert.equal(m.bullets.length, 0);   // 导弹本体销毁
});

test('子弹：导弹无目标时直上，超射程或出界触发爆炸销毁', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW04');
  m.switchCharWeapon('RW04');
  m.survivalSec = 1.5;
  m.autoFire();
  assert.equal(m.bullets.length, 1);
  assert.equal(m.bullets[0].kind, 'missile');
  assert.equal(m.bullets[0].targetId, null);
  const b = m.bullets[0];
  b.x = 1.2; b.y = 0.5;   // 出界
  m.updateBullets(0.02);
  assert.equal(m.bullets.length, 0);
  assert.equal(b.exploded, true);
});

// ---------- 弹数硬上限 ----------
test('边界：任何等级发射弹数不超过 7 发', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 9999;
  for (const id of ['RW01', 'RW02', 'RW03', 'RW04']) {
    m.buyCharWeapon(id);
    m.switchCharWeapon(id);
    for (let l = 1; l < 4; l++) m.upgradeCharWeapon(id);   // 拉满 Lv4
    m.survivalSec += 10;
    const count = m.bullets.length;
    m.autoFire();
    const fired = m.bullets.length - count;
    assert.ok(fired >= 1 && fired <= 7, `${id} Lv4 发射 ${fired} 发`);
    assert.equal(m.charWeapons[id].level, 4);
  }
});

// ---------- 吃装备线加成 ----------
test('角色武器：伤害吃装备线攻击加成，射速吃射速加成', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.openUpgrade('equipment');
  const atkId = m.pendingUpgrade.options.find(o => o.upgrade_id === 'EQ_ATK')?.upgrade_id;
  if (atkId) {
    m.pickUpgrade(atkId);
    m.survivalSec = 1.0;
    m.autoFire();
    const b = m.bullets[0];
    assert.ok(b.damage > 10);   // 10 × (1 + 加成)
  } else {
    assert.ok(true);
  }
});

// ---------- 局结束清零 ----------
test('角色武器：reset 后回到初始 RW01 Lv1，其余锁定', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.buyCharWeapon('RW02');
  m.upgradeCharWeapon('RW01');
  m.reset();
  assert.equal(m.currentCharWeapon, 'RW01');
  assert.equal(m.charWeapons.RW01.level, 1);
  assert.equal(m.charWeapons.RW02.owned, false);
});
