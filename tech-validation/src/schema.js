// 表结构定义：字段类型、必填项、唯一键、枚举与引用完整性校验。
// 文档为唯一事实来源，此文件只做“把文档翻译成可校验的契约”。
// 玩法已切换为“单路径拦截 + 金币成长 + 循环 Boss”，已移除炮台/词条/羁绊/波次表。
export const TABLES = [
  {
    name: 'endless_config',
    file: '02-数值与配置/csv/endless_config.csv',
    key: ['param_name'],
    fields: {
      param_name: 'string',
      default_value: 'float',
      unit: 'string',
      description: 'string',
    },
    required: ['param_name', 'default_value'],
    check(rows) {
      const errors = [];
      const expected = new Set([
        'hp_step_waves', 'hp_step_growth', 'boss_wave_step_extra', 'wave_interval',
        'elite_every_waves', 'boss_every_waves', 'gold_growth_rate', 'base_spawn_count',
        'spawn_count_growth', 'boss_damage_cycle_bonus', 'soft_growth_reserve',
        'soft_dmg_per_gold', 'soft_dmg_cap', 'soft_aspd_per_gold', 'soft_aspd_cap',
      ]);
      const actual = new Set(rows.map((r) => r.param_name));
      for (const p of expected) {
        if (!actual.has(p)) errors.push(`endless_config: 缺少必填参数 ${p}`);
      }
      for (const row of rows) {
        if (row.default_value < 0) errors.push(`endless_config ${row.param_name}: default_value 不能为负`);
        if (row.param_name === 'hp_step_waves' && !(Number.isInteger(row.default_value) && row.default_value >= 1)) {
          errors.push('endless_config hp_step_waves: 必须为 >= 1 的整数');
        }
        if (row.param_name === 'boss_wave_step_extra' && !(Number.isInteger(row.default_value) && row.default_value >= 0)) {
          errors.push('endless_config boss_wave_step_extra: 必须为 >= 0 的整数');
        }
      }
      return errors;
    },
  },
  {
    name: 'monsters',
    file: '02-数值与配置/csv/monsters.csv',
    key: ['monster_id'],
    fields: {
      monster_id: 'string',
      name: 'string',
      hp_base: 'float',
      speed: 'float',
      armor: 'float',
      gold_drop: 'int',
      exp_drop: 'int',
      spawn_weight: 'float',
      special: 'string',
      leak_damage: 'int',
    },
    required: ['monster_id', 'name', 'hp_base', 'speed', 'armor', 'gold_drop', 'exp_drop', 'spawn_weight', 'special', 'leak_damage'],
    enums: { special: ['none', 'armor', 'fly', 'explode', 'elite_armor', 'boss'] },
    check(rows) {
      const errors = [];
      for (const row of rows) {
        if (!(row.hp_base > 0)) errors.push(`monsters ${row.monster_id}: hp_base 必须 > 0`);
        if (!(row.speed > 0)) errors.push(`monsters ${row.monster_id}: speed 必须 > 0`);
        if (row.armor < 0) errors.push(`monsters ${row.monster_id}: armor 不能为负`);
        if (row.leak_damage < 0) errors.push(`monsters ${row.monster_id}: leak_damage 不能为负`);
        if (row.spawn_weight < 0) errors.push(`monsters ${row.monster_id}: spawn_weight 不能为负`);
      }
      const bossCount = rows.filter((r) => r.special === 'boss').length;
      if (bossCount !== 1) errors.push(`monsters: Boss 数量必须为 1，实际 ${bossCount}`);
      return errors;
    },
  },
  {
    name: 'map_paths',
    file: '02-数值与配置/csv/map_paths.csv',
    key: ['node_index'],
    fields: {
      node_index: 'int',
      x: 'float',
      y: 'float',
      node_type: 'string',
    },
    required: ['node_index', 'x', 'y', 'node_type'],
    enums: { node_type: ['spawn', 'path', 'core'] },
    check(rows) {
      const errors = [];
      const sorted = [...rows].sort((a, b) => a.node_index - b.node_index);
      if (sorted.length === 0) return ['map_paths: 表为空'];
      sorted.forEach((row, index) => {
        if (row.node_index !== index) errors.push('map_paths: node_index 必须从 0 连续递增');
        if (row.x < 0 || row.x > 1 || row.y < 0 || row.y > 1) {
          errors.push(`map_paths 节点 ${row.node_index}: 坐标超出 0-1 归一化范围`);
        }
      });
      const types = sorted.map((n) => n.node_type);
      if (types[0] !== 'spawn') errors.push('map_paths: 第一个节点必须是 spawn');
      if (types[types.length - 1] !== 'core') errors.push('map_paths: 最后一个节点必须是 core');
      if (types.filter((t) => t === 'spawn').length !== 1) errors.push('map_paths: 必须有且仅有一个 spawn');
      if (types.filter((t) => t === 'core').length !== 1) errors.push('map_paths: 必须有且仅有一个 core');
      return errors;
    },
  },
  {
    name: 'player_zone',
    file: '02-数值与配置/csv/player_zone.csv',
    key: ['zone_id'],
    fields: {
      zone_id: 'string',
      x_min: 'float',
      x_max: 'float',
      y_min: 'float',
      y_max: 'float',
      note: 'string',
    },
    required: ['zone_id', 'x_min', 'x_max', 'y_min', 'y_max'],
    check(rows) {
      const errors = [];
      if (rows.length !== 1) errors.push(`player_zone: 必须且只能有 1 个区域，实际 ${rows.length}`);
      for (const row of rows) {
        for (const f of ['x_min', 'x_max', 'y_min', 'y_max']) {
          if (row[f] < 0 || row[f] > 1) errors.push(`player_zone ${row.zone_id}: ${f} 超出 0-1 归一化范围`);
        }
        if (row.x_min >= row.x_max) errors.push(`player_zone ${row.zone_id}: x_min 必须 < x_max`);
        if (row.y_min >= row.y_max) errors.push(`player_zone ${row.zone_id}: y_min 必须 < y_max`);
      }
      return errors;
    },
  },
  {
    name: 'weapons',
    file: '02-数值与配置/csv/weapons.csv',
    key: ['weapon_id'],
    fields: {
      weapon_id: 'string',
      name: 'string',
      cost_gold: 'int',
      damage: 'float',
      pellets: 'int',
      fire_interval: 'float',
      range: 'float',
      pierce: 'int',
      note: 'string',
    },
    required: ['weapon_id', 'name', 'cost_gold', 'damage', 'pellets', 'fire_interval', 'range', 'pierce'],
    check(rows) {
      const errors = [];
      if (rows.length === 0) errors.push('weapons: 表为空');
      for (const row of rows) {
        if (!(row.cost_gold > 0)) errors.push(`weapons ${row.weapon_id}: cost_gold 必须 > 0`);
        if (!(row.damage > 0)) errors.push(`weapons ${row.weapon_id}: damage 必须 > 0`);
        if (!(row.pellets >= 1)) errors.push(`weapons ${row.weapon_id}: pellets 必须 >= 1`);
        if (!(row.fire_interval > 0)) errors.push(`weapons ${row.weapon_id}: fire_interval 必须 > 0`);
        if (!(row.range > 0)) errors.push(`weapons ${row.weapon_id}: range 必须 > 0`);
        if (!(row.pierce >= 1)) errors.push(`weapons ${row.weapon_id}: pierce 必须 >= 1`);
      }
      return errors;
    },
  },
  {
    name: 'char_weapons',
    file: '02-数值与配置/csv/char_weapons.csv',
    key: ['weapon_id', 'level'],
    fields: {
      weapon_id: 'string',
      name: 'string',
      bullet_type: 'string',
      unlock_cost_gold: 'int',
      level: 'int',
      fire_interval: 'float',
      damage: 'float',
      pellets: 'int',
      pierce: 'int',
      explosion_radius: 'float',
      range: 'float',
      bullet_speed: 'float',
      spread_angle: 'float',
      upgrade_cost_gold: 'int',
      note: 'string',
    },
    required: [
      'weapon_id', 'name', 'bullet_type', 'unlock_cost_gold', 'level', 'fire_interval',
      'damage', 'pellets', 'pierce', 'explosion_radius', 'range', 'bullet_speed',
      'spread_angle', 'upgrade_cost_gold',
    ],
    enums: { bullet_type: ['circle', 'spread', 'laser', 'missile'] },
    check(rows) {
      const errors = [];
      if (rows.length !== 16) errors.push(`char_weapons: 必须 4 武器 × 4 等级共 16 行，实际 ${rows.length}`);
      const byId = new Map();
      for (const row of rows) {
        if (![1, 2, 3, 4].includes(row.level)) errors.push(`char_weapons ${row.weapon_id}: level 必须为 1-4`);
        if (!(row.fire_interval > 0)) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: fire_interval 必须 > 0`);
        if (!(row.damage > 0)) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: damage 必须 > 0`);
        // 边界 3：任何配置不能突破 7 发上限
        if (!(row.pellets >= 1 && row.pellets <= 7)) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: pellets 必须在 1-7`);
        }
        if (!(row.pierce >= 1)) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: pierce 必须 >= 1`);
        if (row.explosion_radius < 0) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: explosion_radius 不能为负`);
        if (!(row.range > 0)) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: range 必须 > 0`);
        if (!(row.bullet_speed > 0)) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: bullet_speed 必须 > 0`);
        if (row.spread_angle < 0) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: spread_angle 不能为负`);
        if (row.unlock_cost_gold < 0) errors.push(`char_weapons ${row.weapon_id}: unlock_cost_gold 不能为负`);
        if (row.upgrade_cost_gold < 0) errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: upgrade_cost_gold 不能为负`);
        // 跨字段约束：只有导弹有爆炸半径，只有霰弹有散射角，满级升级费用为 0
        if (row.bullet_type === 'missile' && !(row.explosion_radius > 0)) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: missile 的 explosion_radius 必须 > 0`);
        }
        if (row.bullet_type !== 'missile' && row.explosion_radius !== 0) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: 非 missile 的 explosion_radius 必须为 0`);
        }
        if (row.bullet_type === 'spread' && row.spread_angle <= 0) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: spread 的 spread_angle 必须 > 0`);
        }
        if (row.bullet_type !== 'spread' && row.spread_angle !== 0) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: 非 spread 的 spread_angle 必须为 0`);
        }
        if (row.level === 4 && row.upgrade_cost_gold !== 0) {
          errors.push(`char_weapons ${row.weapon_id} Lv4: 满级 upgrade_cost_gold 必须为 0`);
        }
        if (row.level < 4 && !(row.upgrade_cost_gold > 0)) {
          errors.push(`char_weapons ${row.weapon_id} Lv${row.level}: 未满级 upgrade_cost_gold 必须 > 0`);
        }
        if (!byId.has(row.weapon_id)) byId.set(row.weapon_id, []);
        byId.get(row.weapon_id).push(row.level);
      }
      // 每把武器等级 1-4 连续；RW01 初始解锁（费用 0），其余需购买
      for (const [id, levels] of byId) {
        const sorted = [...levels].sort((a, b) => a - b);
        if (sorted.join(',') !== '1,2,3,4') errors.push(`char_weapons ${id}: 必须包含 Lv1-Lv4 且等级连续`);
      }
      const rw01 = rows.find((r) => r.weapon_id === 'RW01' && r.level === 1);
      if (rw01 && rw01.unlock_cost_gold !== 0) errors.push('char_weapons RW01: 初始解锁武器 unlock_cost_gold 必须为 0');
      return errors;
    },
  },
  {
    name: 'upgrade_equipment',
    file: '02-数值与配置/csv/upgrade_equipment.csv',
    key: ['upgrade_id', 'level'],
    fields: {
      upgrade_id: 'string',
      name: 'string',
      level: 'int',
      cost_gold: 'int',
      effect_value: 'float',
      effect_desc: 'string',
    },
    required: ['upgrade_id', 'name', 'level', 'cost_gold', 'effect_value'],
    check: upgradeCheck,
  },
  {
    name: 'upgrade_skill',
    file: '02-数值与配置/csv/upgrade_skill.csv',
    key: ['upgrade_id', 'level'],
    fields: {
      upgrade_id: 'string',
      name: 'string',
      level: 'int',
      cost_gold: 'int',
      effect_value: 'float',
      effect_desc: 'string',
    },
    required: ['upgrade_id', 'name', 'level', 'cost_gold', 'effect_value'],
    check: upgradeCheck,
  },
  {
    name: 'upgrade_ultimate',
    file: '02-数值与配置/csv/upgrade_ultimate.csv',
    key: ['upgrade_id', 'level'],
    fields: {
      upgrade_id: 'string',
      name: 'string',
      level: 'int',
      cost_gold: 'int',
      effect_value: 'float',
      effect_desc: 'string',
    },
    required: ['upgrade_id', 'name', 'level', 'cost_gold', 'effect_value'],
    check: upgradeCheck,
  },
  {
    name: 'skills',
    file: '02-数值与配置/csv/skills.csv',
    key: ['skill_id'],
    fields: {
      skill_id: 'string',
      name: 'string',
      type: 'string',
      base_coeff: 'float',
      cooldown: 'float',
      unlock_level: 'int',
      effect_desc: 'string',
    },
    required: ['skill_id', 'name', 'type', 'base_coeff', 'cooldown', 'unlock_level'],
    enums: { type: ['active', 'ultimate'] },
    check(rows) {
      const errors = [];
      for (const row of rows) {
        if (row.base_coeff < 0) errors.push(`skills ${row.skill_id}: base_coeff 不能为负`);
        if (row.cooldown < 0) errors.push(`skills ${row.skill_id}: cooldown 不能为负`);
        if (row.unlock_level < 1) errors.push(`skills ${row.skill_id}: unlock_level 必须 >= 1`);
      }
      return errors;
    },
  },
  {
    name: 'feedback_config',
    file: '02-数值与配置/csv/feedback_config.csv',
    key: ['param_name'],
    fields: {
      param_name: 'string',
      default_value: 'float',
      unit: 'string',
      description: 'string',
    },
    required: ['param_name', 'default_value', 'unit'],
    check(rows) {
      const errors = [];
      for (const row of rows) {
        if (row.default_value < 0) errors.push(`feedback_config ${row.param_name}: default_value 不能为负`);
      }
      return errors;
    },
  },
  {
    name: 'level_multiplier',
    file: '02-数值与配置/csv/level_multiplier.csv',
    key: ['level_id'],
    fields: {
      level_id: 'int',
      hp_multiplier: 'float',
      gold_multiplier: 'float',
      note: 'string',
    },
    required: ['level_id', 'hp_multiplier', 'gold_multiplier'],
    check(rows) {
      const errors = [];
      const sorted = [...rows].sort((a, b) => a.level_id - b.level_id);
      if (sorted.length === 0) return ['level_multiplier: 表为空'];
      sorted.forEach((row, index) => {
        if (row.level_id !== index + 1) errors.push('level_multiplier: level_id 必须从 1 连续递增');
        if (!(row.hp_multiplier >= 1)) errors.push(`level_multiplier 关卡 ${row.level_id}: hp_multiplier 必须 >= 1`);
        if (!(row.gold_multiplier >= 1)) errors.push(`level_multiplier 关卡 ${row.level_id}: gold_multiplier 必须 >= 1`);
      });
      return errors;
    },
  },
  {
    name: 'boss_phase_events',
    file: '03-Boss设计/csv/boss_phase_events.csv',
    key: ['boss_id', 'phase', 'event_time'],
    fields: {
      boss_id: 'string',
      phase: 'int',
      event_time: 'float',
      event_type: 'string',
      skill_id: 'string',
      param: 'numOrEmpty',
      warning: 'float',
      note: 'string',
    },
    required: ['boss_id', 'phase', 'event_time', 'event_type', 'warning'],
    enums: { event_type: ['transition', 'skill', 'summon', 'enrage'] },
    check(rows, all) {
      const errors = [];
      const skills = new Set((all.boss_skill_timeline ?? []).map((s) => s.skill_id));
      const phases = new Map();

      for (const row of rows) {
        if (!/^B0[1-3]$/.test(row.boss_id)) errors.push(`boss_phase_events: 非法 boss_id ${row.boss_id}`);
        if (![1, 2, 3].includes(row.phase)) errors.push(`boss_phase_events ${row.boss_id}: phase 必须为 1-3`);
        if (row.event_time < 0) errors.push(`boss_phase_events ${row.boss_id}: event_time 不能为负`);
        if (row.warning < 0) errors.push(`boss_phase_events ${row.boss_id}: warning 不能为负`);
        if (row.event_type === 'skill') {
          if (!row.skill_id) errors.push(`boss_phase_events ${row.boss_id}: skill 事件缺少 skill_id`);
          else if (!skills.has(row.skill_id)) errors.push(`boss_phase_events ${row.boss_id}: 引用了不存在的技能 ${row.skill_id}`);
        }
        if (row.event_type === 'transition' && row.event_time !== 0) {
          errors.push(`boss_phase_events ${row.boss_id} P${row.phase}: transition 必须发生在阶段内 t=0`);
        }
        const phaseKey = `${row.boss_id}-${row.phase}`;
        if (!phases.has(phaseKey)) phases.set(phaseKey, []);
        phases.get(phaseKey).push(row.event_time);
      }

      for (const [phaseKey, times] of phases) {
        const sorted = [...times].sort((a, b) => a - b);
        if (sorted.join(',') !== times.join(',')) {
          errors.push(`boss_phase_events ${phaseKey}: 事件时间必须升序`);
        }
      }
      return errors;
    },
  },
  {
    name: 'boss_skill_timeline',
    file: '03-Boss设计/csv/boss_skill_timeline.csv',
    key: ['skill_id'],
    fields: {
      skill_id: 'string',
      name: 'string',
      cast_time: 'float',
      active_time: 'float',
      cooldown: 'float',
      damage_coeff: 'float',
      effect_desc: 'string',
    },
    required: ['skill_id', 'name', 'cast_time', 'active_time', 'cooldown', 'damage_coeff'],
    check(rows) {
      const errors = [];
      for (const row of rows) {
        if (row.cast_time < 0 || row.active_time < 0 || row.cooldown < 0) {
          errors.push(`boss_skill_timeline ${row.skill_id}: 时间字段不能为负`);
        }
        if (row.damage_coeff < 0) errors.push(`boss_skill_timeline ${row.skill_id}: damage_coeff 不能为负`);
      }
      return errors;
    },
  },
  {
    name: 'boss_growth',
    file: '03-Boss设计/csv/boss_growth.csv',
    key: ['level_range'],
    fields: {
      level_range: 'range',
      hp_multiplier: 'float',
      damage_multiplier: 'float',
      note: 'string',
    },
    required: ['level_range', 'hp_multiplier', 'damage_multiplier'],
    check(rows) {
      const errors = [];
      const ranges = [...rows].sort((a, b) => a.level_range.start - b.level_range.start);
      if (ranges.length === 0) return ['boss_growth: 表为空'];
      if (ranges[0].level_range.start !== 1) errors.push('boss_growth: 等级区间必须从 1 开始');
      for (let i = 1; i < ranges.length; i += 1) {
        const prev = ranges[i - 1].level_range;
        const cur = ranges[i].level_range;
        if (prev.end !== Infinity && prev.end + 1 !== cur.start) {
          errors.push('boss_growth: 等级区间必须连续');
        }
      }
      for (const row of rows) {
        if (row.hp_multiplier < 1 || row.damage_multiplier < 1) {
          errors.push('boss_growth: 倍率必须 >= 1');
        }
      }
      return errors;
    },
  },
  {
    name: 'meta_progression',
    file: '02-数值与配置/csv/meta_progression.csv',
    key: ['type', 'level'],
    fields: {
      type: 'string',
      level: 'int',
      cost_gold: 'int',
      effect_value: 'float',
      effect_desc: 'string',
    },
    required: ['type', 'level', 'cost_gold', 'effect_value'],
    check(rows) {
      const errors = [];
      const byType = new Map();
      for (const row of rows) {
        if (!byType.has(row.type)) byType.set(row.type, []);
        byType.get(row.type).push(row);
        if (row.cost_gold < 0) errors.push(`meta_progression ${row.type} Lv${row.level}: cost_gold 不能为负`);
      }
      for (const [type, list] of byType) {
        const levels = list.map((r) => r.level).sort((a, b) => a - b);
        const expected = Array.from({ length: levels.length }, (_, i) => i + 1);
        if (levels.join(',') !== expected.join(',')) {
          errors.push(`meta_progression ${type}: 等级必须从 1 连续递增`);
        }
      }
      return errors;
    },
  },
  {
    name: 'economy_sources',
    file: '02-数值与配置/csv/economy_sources.csv',
    key: ['source_id'],
    fields: {
      source_id: 'string',
      source_type: 'string',
      amount_formula: 'string',
      cap: 'string',
      daily_limit: 'string',
      note: 'string',
    },
    required: ['source_id', 'source_type', 'amount_formula'],
  },
  {
    name: 'economy_loop',
    file: '02-数值与配置/csv/economy_loop.csv',
    key: ['currency'],
    fields: {
      currency: 'string',
      earn_from: 'string',
      spend_on: 'string',
      carry_over: 'string',
      note: 'string',
    },
    required: ['currency', 'earn_from', 'spend_on', 'carry_over'],
  },
];

// 三条升级线（装备/技能/大招）共用同一套校验规则。
function upgradeCheck(rows) {
  const errors = [];
  const byId = new Map();
  for (const row of rows) {
    if (![1, 2, 3].includes(row.level)) errors.push(`${row.upgrade_id}: level 必须为 1-3`);
    if (row.cost_gold < 0) errors.push(`${row.upgrade_id} Lv${row.level}: cost_gold 不能为负`);
    if (row.effect_value < 0) errors.push(`${row.upgrade_id} Lv${row.level}: effect_value 不能为负`);
    if (!byId.has(row.upgrade_id)) byId.set(row.upgrade_id, []);
    byId.get(row.upgrade_id).push(row.level);
  }
  for (const [id, levels] of byId) {
    const sorted = [...levels].sort((a, b) => a - b);
    if (sorted.join(',') !== '1,2,3') errors.push(`${id}: 必须包含 Lv1-Lv3 且等级连续`);
  }
  return errors;
}

const TYPE_PARSERS = {
  string: (raw) => raw,
  int: (raw) => Number(raw),
  float: (raw) => Number(raw),
  stringList: (raw) => (raw === '' ? [] : raw.split(';').map((s) => s.trim()).filter(Boolean)),
  intList: (raw) => (raw === '' ? [] : raw.split(';').map((s) => s.trim()).filter(Boolean).map(Number)),
  numOrEmpty: (raw) => (raw === '' ? null : Number(raw)),
  range: (raw) => {
    const match = /^(\d+)-(\d+)$/.exec(raw);
    if (match) return { start: Number(match[1]), end: Number(match[2]) };
    const open = /^(\d+)\+$/.exec(raw);
    if (open) return { start: Number(open[1]), end: Infinity };
    return null;
  },
};

function convertValue(raw, type, def, field, line, errors) {
  const value = TYPE_PARSERS[type](raw);
  if (['int', 'float', 'numOrEmpty'].includes(type) && value !== null) {
    if (!Number.isFinite(value)) {
      errors.push(`${def.name} 第${line}行 字段 ${field}: 不是有效数字 (${raw})`);
      return null;
    }
    if (type === 'int' && !Number.isInteger(value)) {
      errors.push(`${def.name} 第${line}行 字段 ${field}: 应为整数 (${raw})`);
      return null;
    }
  }
  if (type === 'intList' && value.some((v) => !Number.isInteger(v))) {
    errors.push(`${def.name} 第${line}行 字段 ${field}: 应为整数列表 (${raw})`);
  }
  if (type === 'range' && value === null) {
    errors.push(`${def.name} 第${line}行 字段 ${field}: 区间格式应为 a-b 或 a+ (${raw})`);
  }
  return value;
}

export function convertRows(def, rawRows, errors) {
  const rows = [];
  const seen = new Map();

  rawRows.forEach((raw, index) => {
    const line = index + 2;
    const row = {};
    for (const [field, type] of Object.entries(def.fields)) {
      const rawValue = raw[field];
      if (rawValue === undefined) {
        errors.push(`${def.name} 第${line}行: 缺少列 ${field}`);
        row[field] = null;
        continue;
      }
      const text = rawValue.trim();
      const required = (def.required ?? []).includes(field) || (def.key ?? []).includes(field);
      if (required && text === '') {
        errors.push(`${def.name} 第${line}行 字段 ${field}: 不能为空`);
      }
      row[field] = convertValue(text, type, def, field, line, errors);
    }

    if (def.enums) {
      for (const [field, allowed] of Object.entries(def.enums)) {
        if (row[field] !== null && row[field] !== '' && !allowed.includes(row[field])) {
          errors.push(`${def.name} 第${line}行 字段 ${field}: 非法值 ${row[field]}，允许 ${allowed.join('/')}`);
        }
      }
    }

    if (def.key) {
      const keyValue = JSON.stringify(def.key.map((field) => row[field]));
      if (seen.has(keyValue)) {
        errors.push(`${def.name} 第${line}行: 主键重复 (${keyValue})，与第 ${seen.get(keyValue)} 行冲突`);
      } else {
        seen.set(keyValue, line);
      }
    }

    rows.push(row);
  });

  return rows;
}
