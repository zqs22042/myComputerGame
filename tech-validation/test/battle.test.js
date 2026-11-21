import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BattleModelCore } from '../src/battleModelCore.js';
import { loadAllTables } from '../src/loader.js';

const { tables: config } = loadAllTables();

test('start: 第 1 波生成普通怪，waveIndex=1', () => {
  const m = new BattleModelCore(config);
  m.start();
  assert.equal(m.waveIndex, 1);
  assert.ok(m.monsters.length > 0 || m.spawnQueue.length > 0);
});

test('Boss 波只生成 Boss，不伴随小怪', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10;
  m.spawnWave(10);
  assert.ok(m.boss);
  assert.equal(m.monsters.length, 0);
  assert.equal(m.spawnQueue.length, 0);
});

test('Boss 击杀后 cycleIndex 递增，进入下一循环', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10; m.spawnWave(10);
  m.boss.hp = 0; m.onBossKilled();
  m.waveIndex = 11; m.spawnWave(11);
  assert.equal(m.cycleIndex, 2);
});

test('Boss 血量吃循环加成：循环 2 高于循环 1', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10; m.spawnWave(10);
  const hp1 = m.boss.maxHp;
  m.onBossKilled();
  m.waveIndex = 20; m.spawnWave(20);
  assert.ok(m.boss.maxHp > hp1);
});

test('三选一打开时 update 完全暂停', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.openUpgrade('equipment');
  const t0 = m.survivalSec;
  m.update(1.0);
  assert.equal(m.survivalSec, t0);
});

test('升级后 bonuses 更新', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 999;
  m.openUpgrade('equipment');
  const id = m.pendingUpgrade.options[0].upgrade_id;
  m.pickUpgrade(id);
  assert.ok(Object.values(m.bonuses).some(v => v > 0));
});

test('核心归零触发 run_end，summary 正确', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.core.hp = 0;
  m.update(0.016);
  assert.equal(m.runOver, true);
  const s = m.getRunSummary();
  assert.equal(s.result, 'defeat');
  assert.equal(s.core_hp_left, 0);
});

test('movePlayer 限制在 player_zone 内', () => {
  const m = new BattleModelCore(config);
  m.movePlayer(-1, -1);
  assert.equal(m.player.x, m.playerZone.x_min);
  assert.equal(m.player.y, m.playerZone.y_min);
  m.movePlayer(2, 2);
  assert.equal(m.player.x, m.playerZone.x_max);
  assert.equal(m.player.y, m.playerZone.y_max);
});

test('武器槽：购买扣金币并放入对应槽位', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 500;
  assert.equal(m.buyWeapon('left', 'W01'), true);
  assert.equal(m.gold, 380);
  assert.equal(m.weapons.find(w => w.slot === 'left').weaponId, 'W01');
  assert.equal(m.weapons.find(w => w.slot === 'right').weaponId, null);
});

test('武器槽：替换时旧武器按 50% 抵扣', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 1000;
  m.buyWeapon('left', 'W01');          // 120
  assert.equal(m.gold, 880);
  m.buyWeapon('left', 'W02');          // 260 - 60 = 200
  assert.equal(m.gold, 680);
  assert.equal(m.weapons.find(w => w.slot === 'left').weaponId, 'W02');
});

test('武器槽：拆除返还 50% 并清空槽位', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 1000;
  m.buyWeapon('right', 'W01');
  assert.equal(m.sellWeapon('right'), true);
  assert.equal(m.gold, 940);
  assert.equal(m.weapons.find(w => w.slot === 'right').weaponId, null);
});

test('武器槽：金币不足购买失败且不扣钱', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 100;
  assert.equal(m.buyWeapon('left', 'W02'), false);
  assert.equal(m.gold, 100);
});

test('武器槽：面板打开时 update 完全暂停', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.openWeaponPanel('left');
  const t0 = m.survivalSec;
  m.update(1.0);
  assert.equal(m.survivalSec, t0);
});

test('武器槽：槽内有武器时按射程自动开火', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.gold = 500;
  m.buyWeapon('right', 'W01');
  m.monsters = [{
    id: 999, monsterId: 'M01', hp: 100, maxHp: 100,
    x: 0.6, y: 0.75, pathIndex: 0, speed: 0, armor: 0,
    goldDrop: 1, leakDamage: 0, special: 'none',
    slowUntil: 0, burningUntil: 0, burnDps: 0,
  }];
  m.spawnQueue = [];
  m.update(0.3);
  assert.ok(m.bullets.some(b => b.damage === 16));
});

test('角色子弹朝上直射（vx≈0, vy>0）', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.survivalSec = 1;
  m.autoFire();
  const b = m.bullets[m.bullets.length - 1];
  assert.ok(Math.abs(b.vx) < 1e-9);
  assert.ok(b.vy > 0);
  assert.equal(b.kind, 'circle');
});

test('击杀怪物 emit kill 事件（monster_id/gold_drop/wave_index），金币同步到账', () => {
  const m = new BattleModelCore(config);
  m.start();
  const mon = m.monsters[0] ?? m.spawnQueue[0];
  const gold0 = m.gold;
  m.onMonsterKilled(mon);
  const ev = m.events.find(e => e.type === 'kill');
  assert.ok(ev, '应有 kill 事件');
  assert.equal(ev.params.monster_id, mon.monsterId);
  assert.equal(ev.params.gold_drop, mon.goldDrop);
  assert.equal(ev.params.wave_index, m.waveIndex);
  assert.equal(m.gold, gold0 + mon.goldDrop);
});

test('crit_kill 只在暴击击杀时触发，且带真实伤害', () => {
  const m = new BattleModelCore(config);
  m.start();
  const mon = m.monsters[0] ?? m.spawnQueue[0];
  m.onMonsterKilled(mon);
  assert.equal(m.events.filter(e => e.type === 'crit_kill').length, 0);

  m.onMonsterKilled(mon, { isCrit: true, damage: 37 });
  const crit = m.events.filter(e => e.type === 'crit_kill');
  assert.equal(crit.length, 1);
  assert.equal(crit[0].params.damage, 37);
});

test('Boss 击杀发 kill、金币入账并记入 boss_kill_count', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10; m.spawnWave(10);
  const boss = m.boss;
  const drop = boss.goldDrop;
  const gold0 = m.gold;
  const kills0 = m.killCount;
  m.onBossKilled();

  const kill = m.events.find(e => e.type === 'kill' && e.params.monster_id === boss.monsterId);
  assert.ok(kill, 'Boss 击杀应有 kill 事件');
  assert.equal(kill.params.gold_drop, drop);
  assert.equal(m.gold, gold0 + drop);
  assert.equal(m.killCount, kills0 + 1);
  assert.equal(m.bossKillCount, 1);
  assert.equal(m.totalGoldEarned, drop);
  assert.ok(m.events.some(e => e.type === 'cycle_end'));
});

test('Boss 阶段时序：P1 内按 1/4/7 秒触发 BS01', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10; m.spawnWave(10);
  m.boss.invulnerableUntil = Infinity;   // 只验证时序，排除自动开火对 Boss 的伤害
  for (let i = 0; i < 352; i++) m.update(0.02);   // 7.04 秒

  const skills = m.events.filter(e => e.type === 'boss_skill' && e.params.phase === 1);
  assert.equal(skills.length, 3);
  assert.deepEqual(skills.map(e => e.params.skill_id), ['BS01_charge', 'BS01_charge', 'BS01_charge']);
  assert.ok(Math.abs(skills[0].t - 1.0) < 0.05);
  assert.ok(Math.abs(skills[1].t - 4.0) < 0.05);
  assert.ok(Math.abs(skills[2].t - 7.0) < 0.05);
});

test('Boss 阶段切换：1.5 秒转场无敌，phase_duration 为上一阶段真实时长', () => {
  const m = new BattleModelCore(config);
  m.start();
  m.waveIndex = 10; m.spawnWave(10);
  m.boss.invulnerableUntil = 0;   // 跳过出场无敌，专注验证转场
  m.boss.phaseElapsed = 7.0;
  m.update(0.02);

  const phase2 = m.events.filter(e => e.type === 'boss_phase').pop();
  assert.equal(phase2.params.phase, 2);
  assert.ok(phase2.params.phase_duration >= 7.0);
  assert.ok(m.isBossInvulnerable());

  const hp0 = m.boss.hp;
  m.resolveBulletHit({
    x: m.boss.x, y: m.boss.y, vx: 0, vy: 0, travel: 0,
    pierceLeft: 1, hitIds: [], kind: 'bullet', damage: 999, dmgFormula: 'flat',
  });
  assert.equal(m.boss.hp, hp0, '转场无敌期间 Boss 不应掉血');
});

test('导出汇总：gold_earned 不含初始 50，rng_seed 与 boss_kill_count 有值', () => {
  const m = new BattleModelCore(config);
  m.start();
  const mon = m.monsters[0] ?? m.spawnQueue[0];
  m.onMonsterKilled(mon);
  const s = m.getRunSummary();
  assert.equal(s.gold_earned, mon.goldDrop);
  assert.equal(typeof s.rng_seed, 'number');
  assert.equal(s.boss_kill_count, 0);
});

