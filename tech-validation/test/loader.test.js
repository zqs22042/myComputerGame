import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAllTables } from '../src/loader.js';
import { TABLES, convertRows } from '../src/schema.js';

const { tables, counts, errors } = loadAllTables();

test('加载器：全部 18 张 CSV 均被读入且无错误', () => {
  assert.deepEqual(errors, []);
  assert.equal(Object.keys(counts).length, 18);
  assert.equal(counts.endless_config, 15);
  assert.equal(counts.monsters, 6);
  assert.equal(counts.map_paths, 6);
  assert.equal(counts.player_zone, 1);
  assert.equal(counts.weapons, 3);
  assert.equal(counts.char_weapons, 16);
  assert.equal(counts.upgrade_equipment, 12);
  assert.equal(counts.upgrade_skill, 9);
  assert.equal(counts.upgrade_ultimate, 9);
  assert.equal(counts.skills, 2);
  assert.equal(counts.feedback_config, 13);
  assert.equal(counts.level_multiplier, 15);
  assert.equal(counts.boss_phase_events, 18);
  assert.equal(counts.boss_skill_timeline, 2);
  assert.equal(counts.boss_growth, 5);
  assert.equal(counts.meta_progression, 17);
  assert.equal(counts.economy_sources, 7);
  assert.equal(counts.economy_loop, 4);
});

test('加载器：字段类型已转换（数字/区间）', () => {
  const firstMonster = tables.monsters[0];
  assert.equal(typeof firstMonster.hp_base, 'number');
  assert.equal(typeof firstMonster.spawn_weight, 'number');

  const endless = tables.endless_config.find((r) => r.param_name === 'hp_step_growth');
  assert.equal(typeof endless.default_value, 'number');

  const openRange = tables.boss_growth[tables.boss_growth.length - 1].level_range;
  assert.equal(openRange.start, 21);
  assert.equal(openRange.end, Infinity);
});

test('加载器：map_paths 坐标超出 0-1 会被发现', () => {
  const def = TABLES.find((table) => table.name === 'map_paths');
  const broken = tables.map_paths.map((row) =>
    row.node_index === 0 ? { ...row, x: 1.5 } : row,
  );
  const found = def.check(broken, tables);
  assert.ok(found.some((message) => message.includes('坐标超出 0-1')));
});

test('加载器：char_weapons 弹数突破 7 发上限会被发现', () => {
  const def = TABLES.find((table) => table.name === 'char_weapons');
  const broken = [
    {
      weapon_id: 'RW01', name: 'X', bullet_type: 'circle', unlock_cost_gold: 0,
      level: 1, fire_interval: 1, damage: 10, pellets: 9, pierce: 1,
      explosion_radius: 0, range: 0.5, bullet_speed: 400, spread_angle: 0, upgrade_cost_gold: 50,
    },
  ];
  const found = def.check(broken, tables);
  assert.ok(found.some((message) => message.includes('pellets 必须在 1-7')));
});

test('加载器：char_weapons 等级不连续会被发现', () => {
  const def = TABLES.find((table) => table.name === 'char_weapons');
  const found = def.check(tables.char_weapons.filter((r) => r.level !== 3), tables);
  assert.ok(found.some((message) => message.includes('等级连续')));
});

test('加载器：boss 事件引用不存在的技能会被发现', () => {
  const def = TABLES.find((table) => table.name === 'boss_phase_events');
  const broken = [
    { ...tables.boss_phase_events[1], event_type: 'skill', skill_id: 'BS99_unknown' },
  ];
  const found = def.check(broken, tables);
  assert.ok(found.some((message) => message.includes('BS99_unknown')));
});

test('加载器：主键重复会被发现', () => {
  const def = TABLES.find((table) => table.name === 'monsters');
  const duplicated = [
    {
      monster_id: 'M01', name: 'A', hp_base: '1', speed: '1',
      armor: '0', gold_drop: '1', exp_drop: '1', spawn_weight: '1',
      special: 'none', leak_damage: '1',
    },
    {
      monster_id: 'M01', name: 'B', hp_base: '1', speed: '1',
      armor: '0', gold_drop: '1', exp_drop: '1', spawn_weight: '1',
      special: 'none', leak_damage: '1',
    },
  ];
  const localErrors = [];
  convertRows(def, duplicated, localErrors);
  assert.ok(localErrors.some((message) => message.includes('主键重复')));
});
