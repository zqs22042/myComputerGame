// 入口：配置校验 + 无头战斗冒烟（当前「单路径拦截 + 金币成长 + 循环 Boss」模型）。
// 校验失败时不产出任何运行时配置；冒烟只用于确认 CSV → 模型链路可跑通。
import { loadAllTables } from './src/loader.js';
import { BattleModelCore } from './src/battleModelCore.js';
import { hpStepMultiplier } from './src/core/endless.js';

const { tables, counts, errors } = loadAllTables();

console.log('=== 配置表加载 ===');
for (const [name, count] of Object.entries(counts)) {
  console.log(`${name.padEnd(22, ' ')} ${String(count).padStart(3, ' ')} 行`);
}

if (errors.length > 0) {
  console.error('\n=== 校验失败（不会产出 config.json）===');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('\n校验通过：字段类型、枚举、主键与引用完整性均无错误');

const cfg = Object.fromEntries(tables.endless_config.map((r) => [r.param_name, r.default_value]));

// ---------- 无头战斗冒烟 ----------
const SEED = 20261119;
const DT = 1 / 30;
const MAX_SECONDS = 1200;
const model = new BattleModelCore(tables, { seed: SEED });
model.start();

const bossPhaseEvents = [];
let upgrades = 0;
let bossMinY = 1;
let bossMaxY = 0;
let bossSeen = false;

while (!model.runOver && model.survivalSec < MAX_SECONDS) {
  // 自动把当前携带武器升到 Lv4，覆盖升级与满级后的软成长链路
  const state = model.charWeapons[model.currentCharWeapon];
  if (state.owned && state.level < 4) {
    const row = model.charWeaponRow(model.currentCharWeapon, state.level);
    if (row && model.gold >= row.upgrade_cost_gold && model.upgradeCharWeapon(model.currentCharWeapon)) {
      upgrades += 1;
    }
  }
  model.update(DT);
  if (model.boss) {
    bossSeen = true;
    bossMinY = Math.min(bossMinY, model.boss.y);
    bossMaxY = Math.max(bossMaxY, model.boss.y);
  }
}

console.log(`\n=== 无头冒烟（种子 ${SEED} / 固定步长 ${DT.toFixed(3)}s）===`);
console.log(
  `结果：${model.runOver ? '核心被击破' : `存活至 ${MAX_SECONDS}s 上限`} ｜ 存活 ${model.survivalSec.toFixed(1)}s ｜ 波次 ${model.waveIndex} ｜ 循环 ${model.cycleIndex}`,
);
console.log(
  `核心 ${model.core.hp}/${model.core.maxHp} ｜ 击杀 ${model.killCount} ｜ Boss 击杀 ${model.bossKillCount} ｜ 金币 ${model.gold} ｜ 武器升级 ${upgrades} 次`,
);

// 血量台阶：直接按配置表推算，确认每 5 波 ×1.35、Boss 波额外跳档
console.log('\n血量台阶（普通怪 M01 / hp_base=30）');
for (const wave of [1, 5, 6, 10, 11, 15, 20]) {
  const tier = Math.floor((wave - 1) / Math.max(1, Math.floor(cfg.hp_step_waves)));
  const mult = hpStepMultiplier(tier, cfg);
  const isBoss = wave % cfg.boss_every_waves === 0;
  console.log(
    `  第 ${String(wave).padStart(2, ' ')} 波  档位 ${tier + (isBoss ? cfg.boss_wave_step_extra : 0) + 1}  血量倍率 ×${mult.toFixed(4)}${isBoss ? '（Boss 额外跳档）' : ''}`,
  );
}

// Boss 阶段时长：由 boss_phase_events.csv 的末事件时间驱动
if (bossSeen) {
  const phases = model.events.filter((e) => e.type === 'boss_phase');
  console.log('\nBoss 阶段时长（事件表末事件驱动）');
  for (const ev of phases) {
    console.log(`  P${ev.params.phase} 起于 t=${ev.t.toFixed(2)}s ｜ 上一阶段实测 ${ev.params.phase_duration.toFixed(2)}s`);
  }
  console.log(`  Boss 驻留 y 范围 ${bossMinY.toFixed(2)}–${bossMaxY.toFixed(2)}（固定点位，不沿路径前进）`);
  const skills = model.events.filter((e) => e.type === 'boss_skill');
  console.log(`  Boss 技能事件 ${skills.length} 条：${skills.map((e) => `${e.params.skill_id}@P${e.params.phase}`).join(' / ')}`);
} else {
  console.log('\n未观察到 Boss（冒烟局在到达第 10 波前结束）');
}

// ---------- 软成长自检（不依赖长局是否攒到 1000 金）----------
const probe = new BattleModelCore(tables, { seed: SEED });
probe.start();
probe.charWeapons.RW01.level = 4;
probe.gold = 1600;
probe.update(DT);
const soft = probe.softGrowth;
console.log('\n软成长自检（RW01 Lv4 / 金币 1600）');
console.log(
  `  转化 ${Math.round(soft.gold)} 金 → 伤害 +${(soft.dmgPct * 100).toFixed(2)}% ｜ 射速 +${(soft.aspdPct * 100).toFixed(2)}% ｜ 保留金币 ${probe.gold}`,
);

// ---------- 升级三线样本局：技能线 / 大招线各至少 3 次 ----------
// 策略：装备→技能→大招轮转开三选一，每次取第一张卡（等价于玩家点击底部图标后点卡片）
const sample = new BattleModelCore(tables, { seed: SEED });
sample.start();
const rotate = ['equipment', 'skill', 'ultimate'];
const openedByLine = { equipment: 0, skill: 0, ultimate: 0 };
let rotateIndex = 0;

while (!sample.runOver && sample.survivalSec < 600) {
  // 与冒烟局一致：优先把当前武器升到 Lv4，保证样本局能进入长局
  const weaponState = sample.charWeapons[sample.currentCharWeapon];
  if (weaponState.owned && weaponState.level < 4) {
    const row = sample.charWeaponRow(sample.currentCharWeapon, weaponState.level);
    if (row && sample.gold >= row.upgrade_cost_gold) sample.upgradeCharWeapon(sample.currentCharWeapon);
  }
  if (!sample.pendingUpgrade && !sample.pendingCharWeaponPanel && !sample.pendingWeaponSlot) {
    for (let i = 0; i < rotate.length; i += 1) {
      const line = rotate[(rotateIndex + i) % rotate.length];
      if (sample.cheapestUpgradeCost(line) === null) continue;
      if (!sample.openUpgrade(line)) continue;
      if (sample.pendingUpgrade.options.length === 3) openedByLine[line] += 1;
      sample.pickUpgrade(sample.pendingUpgrade.options[0].upgrade_id);
      rotateIndex = (rotateIndex + i + 1) % rotate.length;
      break;
    }
  }
  sample.update(DT);
}

const picks = sample.events.filter((e) => e.type === 'upgrade_pick');
const pickCount = (line) => picks.filter((e) => e.params.line === line).length;
const skillCasts = sample.events.filter((e) => e.type === 'skill_cast');
const ultCasts = sample.events.filter((e) => e.type === 'ult_cast');
const firstSkill = skillCasts[0];
const lastSkill = skillCasts[skillCasts.length - 1];
const firstUlt = ultCasts[0];
const lastUlt = ultCasts[ultCasts.length - 1];
const rwRow = sample.charWeaponRow('RW01', sample.charWeapons.RW01.level);

console.log('\n=== 升级三线样本局（600s 上限 / 三线轮转选择）===');
console.log(
  `结果：${sample.runOver ? '核心被击破' : '存活至 600s'} ｜ 存活 ${sample.survivalSec.toFixed(1)}s ｜ 波次 ${sample.waveIndex} ｜ 击杀 ${sample.killCount}`,
);
console.log(
  `三选一：技能线 ${pickCount('skill')} 次 ｜ 大招线 ${pickCount('ultimate')} 次 ｜ 装备线 ${pickCount('equipment')} 次 ｜ 3 张卡的弹层 ${Object.values(openedByLine).reduce((a, b) => a + b, 0)} 次`,
);
console.log(
  `自动释放：技能 ${skillCasts.length} 次 ｜ 大招 ${ultCasts.length} 次`,
);
if (firstSkill && lastSkill) {
  console.log(
    `技能伤害 ${firstSkill.params.damage} → ${lastSkill.params.damage}（攻击力 ${sample.playerAttack().toFixed(1)} × 系数 1.8 × 技能加成 ×${(1 + sample.bonuses.skillDmgPct).toFixed(2)}）｜ 半径 ${firstSkill.params.radius} → ${lastSkill.params.radius} ｜ 冷却 ${(10 / (1 + sample.bonuses.skillCdPct)).toFixed(2)}s`,
  );
}
if (firstUlt && lastUlt) {
  console.log(
    `大招爆发 ${firstUlt.params.damage} → ${lastUlt.params.damage}（攻击力 ${sample.playerAttack().toFixed(1)} × 系数 1.0 × 大招加成 ×${(1 + sample.bonuses.ultDmgPct).toFixed(2)}）｜ 半径 ${firstUlt.params.radius} → ${lastUlt.params.radius} ｜ 冷却 ${(40 / (1 + sample.bonuses.ultCdPct)).toFixed(2)}s`,
  );
}
console.log(
  `加成汇总：技能伤害 +${(sample.bonuses.skillDmgPct * 100).toFixed(0)}% ｜ 技能冷却 -${(sample.bonuses.skillCdPct * 100).toFixed(0)}% ｜ 技能范围 +${(sample.bonuses.skillRangePct * 100).toFixed(0)}% `
  + `｜ 大招伤害 +${(sample.bonuses.ultDmgPct * 100).toFixed(0)}% ｜ 大招冷却 -${(sample.bonuses.ultCdPct * 100).toFixed(0)}% ｜ 大招范围 +${(sample.bonuses.ultRangePct * 100).toFixed(0)}%`,
);
if (rwRow) {
  const normalInterval = rwRow.fire_interval / (1 + sample.effectiveAspdPct());
  console.log(
    `弹幕风暴期间攻速：${normalInterval.toFixed(2)}s → ${(normalInterval / 3).toFixed(2)}s 一发（×3），穿透 ${rwRow.pierce + (sample.bonuses.pierce || 0)} → 99`,
  );
}
