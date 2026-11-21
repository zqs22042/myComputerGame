import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAllTables } from '../src/loader.js';
import { TABLES } from '../src/schema.js';

const { tables } = loadAllTables();

test('配置：endless_config 包含全部 15 个必填参数', () => {
  const names = new Set(tables.endless_config.map((r) => r.param_name));
  for (const p of [
    'hp_step_waves', 'hp_step_growth', 'boss_wave_step_extra', 'wave_interval',
    'elite_every_waves', 'boss_every_waves', 'gold_growth_rate', 'base_spawn_count',
    'spawn_count_growth', 'boss_damage_cycle_bonus', 'soft_growth_reserve',
    'soft_dmg_per_gold', 'soft_dmg_cap', 'soft_aspd_per_gold', 'soft_aspd_cap',
  ]) {
    assert.ok(names.has(p), `缺少参数 ${p}`);
  }
});

test('配置：leak_damage 按怪物类型区分，Boss 与自爆怪为 0', () => {
  const byId = new Map(tables.monsters.map((m) => [m.monster_id, m]));
  assert.equal(byId.get('M01').leak_damage, 2);
  assert.equal(byId.get('M02').leak_damage, 4);
  assert.equal(byId.get('M05').leak_damage, 8);
  assert.equal(byId.get('M04').leak_damage, 0); // 自爆怪
  assert.equal(byId.get('M06').leak_damage, 0); // Boss
  assert.equal(byId.get('M06').special, 'boss');
});

test('配置：map_paths 首节点 spawn、末节点 core，坐标均在 0-1', () => {
  const sorted = [...tables.map_paths].sort((a, b) => a.node_index - b.node_index);
  assert.equal(sorted[0].node_type, 'spawn');
  assert.equal(sorted[sorted.length - 1].node_type, 'core');
  for (const node of sorted) {
    assert.ok(node.x >= 0 && node.x <= 1);
    assert.ok(node.y >= 0 && node.y <= 1);
  }
});

test('配置：player_zone 仅有一个区域且边界合法', () => {
  assert.equal(tables.player_zone.length, 1);
  const z = tables.player_zone[0];
  assert.ok(z.x_min < z.x_max);
  assert.ok(z.y_min < z.y_max);
});

test('配置：三条升级线每个 upgrade_id 均含 Lv1-Lv3', () => {
  for (const line of ['upgrade_equipment', 'upgrade_skill', 'upgrade_ultimate']) {
    const byId = new Map();
    for (const row of tables[line]) {
      if (!byId.has(row.upgrade_id)) byId.set(row.upgrade_id, []);
      byId.get(row.upgrade_id).push(row.level);
    }
    for (const [id, levels] of byId) {
      const sorted = [...levels].sort((a, b) => a - b);
      assert.deepEqual(sorted, [1, 2, 3], `${line} ${id} 等级不连续`);
    }
  }
});

test('配置：skills 类型仅 active / ultimate，冷却非负', () => {
  for (const skill of tables.skills) {
    assert.ok(['active', 'ultimate'].includes(skill.type));
    assert.ok(skill.cooldown >= 0);
    assert.ok(skill.unlock_level >= 1);
  }
});
