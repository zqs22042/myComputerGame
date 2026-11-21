// battleModelCore.js — 单路径拦截 + 金币成长 + 循环 Boss 的纯逻辑核心
// 无引擎依赖，可在 Node 环境无头测试

import {
  calcMonsterHp, calcBossHp, calcBossDamage,
  getWaveType, getCycleIndex, calcSpawnCount, getHpStepTier,
} from './core/endless.js';
import {
  initUpgradeState, getLevel, getAvailableUpgrades,
  applyUpgrade, sumBonuses,
} from './core/upgrade.js';
import {
  initSoftGrowth, convertOverflowGold, isSoftGrowthUnlocked,
} from './core/softGrowth.js';
import { calcDamage } from './damage.js';

// 空间常量：与文档 01-14 / Coords.ts 保持一致（归一化坐标，y 自下而上）
export const DEFENSE_LINE_Y = 0.34;
export const CORE_POS = { x: 0.50, y: 0.24 };
export const WEAPON_SLOTS = [
  { slot: 'left', x: 0.30, y: 0.22 },
  { slot: 'right', x: 0.70, y: 0.22 },
];
// 子弹速度（归一化单位/秒）与命中半径
const BULLET_SPEED = 1.5;
const MONSTER_HIT_R = 0.030;
const BOSS_HIT_R = 0.055;
// Boss 驻留在防线前的固定点位（路径 x=0.5 上、核心 y=0.24 之前），不再沿路径前进
const BOSS_HOLD_Y = 0.68;
// 角色武器（文档 01-18）
const CHAR_PELLETS_CAP = 7;      // 边界 3：子弹数量硬上限，任何逻辑不可突破
const METER = 0.08;              // 1 米 ≈ 0.08 归一化单位（爆炸半径换算）
const SPREAD_FALLOFF_MIN = 0.5;  // 霰弹最远射程处伤害比例（近点 50% 衰减）
const CHAR_MAX_LEVEL = 4;
// 技能/大招（文档 01-11）：技能线与大招线的加成在这里真正落地
const SKILL_BASE_RADIUS = 0.18;    // 震荡波基础半径（归一化）
const ULT_BASE_RADIUS = 0.42;      // 弹幕风暴释放瞬间的爆发半径（归一化）
const ULT_BURST_COEFF = 1.0;       // 大招爆发基准：100% 攻击力（skills.csv base_coeff=0 表示不参与持续循环）
const ULT_BARRAGE_DURATION = 3.0;  // 弹幕风暴持续 3 秒
const ULT_BARRAGE_ASPD = 3;        // 弹幕风暴期间攻速 ×3
const ULT_BARRAGE_PIERCE = 99;     // 弹幕风暴期间无限穿透（取足够大的有限值，避免 Infinity 进日志）

export class BattleModelCore {
  constructor(config, options = {}) {
    this.config = config;
    // 本局随机种子：未显式传入时生成一次，写进 run_start 与导出 meta，保证可复现
    const injectedSeed = options.seed ?? config.seed;
    this.rngSeed = Number.isFinite(injectedSeed)
      ? (injectedSeed >>> 0)
      : ((Math.random() * 0xffffffff) >>> 0);
    this.cfg = Object.fromEntries(
      config.endless_config.map(r => [r.param_name, r.default_value])
    );
    this.path = [...config.map_paths].sort((a, b) => a.node_index - b.node_index);
    this.playerZone = config.player_zone[0];
    this.weaponTable = config.weapons ?? [];
    this.charWeaponTable = config.char_weapons ?? [];
    this.upgradeTables = {
      equipment: config.upgrade_equipment,
      skill: config.upgrade_skill,
      ultimate: config.upgrade_ultimate,
    };
    // 技能线/大招线的加成消费者：skills.csv 里的主动技与大招
    this.skillTable = config.skills ?? [];
    this.activeSkill = this.skillTable.find(s => s.type === 'active') || null;
    this.ultimateSkill = this.skillTable.find(s => s.type === 'ultimate') || null;
    this.reset();
  }

  // ---------- 生命周期 ----------
  reset() {
    this.core = { hp: 100, maxHp: 100, x: CORE_POS.x, y: CORE_POS.y };
    this.player = { x: 0.5, y: 0.13, hp: 100, invincibleUntil: 0 };
    this.monsters = [];
    this.boss = null;
    this.bullets = [];
    this.gold = 50;
    this.survivalSec = 0;
    this.waveIndex = 0;
    this.cycleIndex = 1;
    this.killCount = 0;
    this.bossKillCount = 0;
    this.totalGoldEarned = 0;   // 本局累计赚取（不含初始 50 金币），导出 gold_earned 直接取此值
    this.runOver = false;
    this.upgradeState = initUpgradeState(this.upgradeTables);
    this.bonuses = sumBonuses(this.upgradeState, this.upgradeTables);
    // 技能/大招：冷却用剩余秒数表示，便于 UI 直接展示
    this.skillCdLeft = this.activeSkill ? this.activeSkill.cooldown : 0;
    this.ultCdLeft = this.ultimateSkill ? this.ultimateSkill.cooldown : 0;
    this.ultActiveUntil = 0;
    this.fx = [];
    this.softGrowth = initSoftGrowth();
    this.softEventBucket = 0;
    this.hpTier = 0;
    this.pendingUpgrade = null;
    this.pendingWeaponSlot = null;
    this.pendingCharWeaponPanel = false;
    // 左右武器槽：weaponId 为 null 表示空槽
    this.weapons = WEAPON_SLOTS.map(s => ({ slot: s.slot, weaponId: null, timer: 0 }));
    // 角色武器：RW01 初始解锁 Lv1，其余锁定；各武器等级独立，局结束清零
    this.charWeapons = {};
    for (const id of new Set(this.charWeaponTable.map(r => r.weapon_id))) {
      this.charWeapons[id] = { owned: id === 'RW01', level: 1 };
    }
    this.currentCharWeapon = 'RW01';
    this.charWeaponSelected = 'RW01';   // 面板内选中武器（用于购买/升级）
    this.events = [];
    this.nextId = 1;
    this.waveTimer = 0;
    this.waveState = 'clearing';
    this.spawnQueue = [];
    this.lastFireAt = 0;
  }

  start() {
    this.reset();
    this.emit('run_start', { rng_seed: this.rngSeed });
    this.waveIndex = 1;
    this.spawnWave(1);
  }

  update(dt) {
    if (this.pendingUpgrade || this.pendingWeaponSlot || this.pendingCharWeaponPanel) return;   // 弹层期间完全暂停
    if (this.runOver) return;

    this.survivalSec += dt;
    this.updateWaveDriver(dt);
    this.updateSpawnQueue(dt);
    this.updateMonsters(dt);
    this.updateBoss(dt);
    this.updateWeapons(dt);
    this.updateBullets(dt);
    this.updateSkills(dt);
    this.applyOverflowSoftGrowth();
    this.checkRunEnd();
  }

  // ---------- 波次驱动 ----------
  updateWaveDriver(dt) {
    if (this.waveState === 'clearing' && this.monsters.length === 0 && !this.boss) {
      this.waveTimer += dt;
      if (this.waveTimer >= this.cfg.wave_interval) {
        this.waveTimer = 0;
        this.waveIndex++;
        this.spawnWave(this.waveIndex);
      }
    }
  }

  spawnWave(waveIndex) {
    const type = getWaveType(waveIndex, this.cfg);
    const cycle = getCycleIndex(waveIndex, this.cfg);
    this.cycleIndex = cycle;
    this.hpTier = getHpStepTier(waveIndex, this.cfg, type === 'boss');
    this.emit('wave_start', {
      wave_index: waveIndex, cycle_index: cycle, hp_tier: this.hpTier,
      hp_percent: this.core.hp / this.core.maxHp,
    });

    if (type === 'boss') {
      this.spawnQueue = [];        // Boss 波清空未生成的小怪队列
      this.spawnBoss(cycle);          // Boss 波只生成 Boss
      this.waveState = 'spawning';
      return;
    }

    const count = calcSpawnCount(waveIndex, this.cfg);
    const pool = type === 'elite'
      ? this.config.monsters.filter(m => m.special === 'elite_armor')
      : this.config.monsters.filter(m => m.special !== 'boss' && m.special !== 'elite_armor');
    this.spawnQueue = [];
    for (let i = 0; i < count; i++) {
      this.spawnQueue.push(this.makeMonster(this.weightedPick(pool), waveIndex));
    }
    this.waveState = 'spawning';
  }

  updateSpawnQueue(dt) {
    if (this.spawnQueue.length === 0) {
      if (this.waveState === 'spawning' && this.monsters.length > 0) this.waveState = 'clearing';
      return;
    }
    this.waveTimer += dt;
    const window = 3.0;
    const interval = window / (this.spawnQueue.length + 1);
    if (this.waveTimer >= interval) {
      this.waveTimer = 0;
      this.monsters.push(this.spawnQueue.shift());
    }
  }

  spawnBoss(cycleIndex) {
    const row = this.config.monsters.find(m => m.special === 'boss');
    const hp = calcBossHp(row.hp_base, this.waveIndex, this.cfg);
    // 驻留点：路径上第一个不高于 BOSS_HOLD_Y 的节点
    const holdIndex = Math.max(0, this.path.findIndex(p => p.y <= BOSS_HOLD_Y));
    const start = this.path[holdIndex] ?? this.path[0];
    const timelineId = this.bossTimelineId(row.monster_id);
    this.boss = {
      id: this.nextId++, monsterId: row.monster_id, timelineId,
      hp, maxHp: hp, x: start.x, y: start.y, pathIndex: holdIndex,
      speed: row.speed, armor: row.armor, goldDrop: row.gold_drop,
      leakDamage: 0, special: 'boss',
      slowUntil: 0, burningUntil: 0, burnDps: 0,
      phase: 1, cycleIndex,
      damageMultiplier: calcBossDamage(1, cycleIndex, this.cfg),
      phaseElapsed: 0,
      // 03-05 时序：阶段内事件游标 + 转场无敌截止时间
      eventIndex: 0,
      invulnerableUntil: this.survivalSec + this.bossPhaseWarning(timelineId, 1),
    };
    this.emit('boss_phase', { boss_id: row.monster_id, phase: 1, phase_duration: 0 });
  }

  // 时序表用 B01，怪物表用 M06：当前只有一只 Boss 时按唯一 boss_id 对齐
  bossTimelineId(monsterId) {
    // 用 Array.from 而不是 [...new Set(...)]：Cocos 降级转译会把 Set 展开成 [].concat(Set)，
    // 得到 [Set] 而不是 id 数组，导致 timelineId 变成 Set、阶段事件全部匹配失败。
    const ids = Array.from(new Set((this.config.boss_phase_events ?? []).map(r => r.boss_id)));
    if (ids.includes(monsterId)) return monsterId;
    return ids.length === 1 ? ids[0] : monsterId;
  }

  bossPhaseWarning(bossId, phase) {
    const row = (this.config.boss_phase_events ?? []).find(
      r => r.boss_id === bossId && r.phase === phase && r.event_type === 'transition'
    );
    return row?.warning ?? 1.5;
  }

  bossPhaseRows(phase) {
    return (this.config.boss_phase_events ?? [])
      .filter(r => r.boss_id === this.boss.timelineId && r.phase === phase)
      .sort((a, b) => a.event_time - b.event_time);
  }

  // 阶段时长下限 = 该阶段时序表里的最后一个事件时间
  bossPhaseLength(phase) {
    const rows = this.bossPhaseRows(phase);
    return rows.length ? rows[rows.length - 1].event_time : 0;
  }

  // 阶段时长未到之前，Boss 血量按阶段下限锁住（P1≥70%、P2≥35%、P3≥1），
  // 避免高 DPS 把三阶段直接打穿
  bossHpFloor(phase) {
    const b = this.boss;
    if (b.phaseElapsed >= this.bossPhaseLength(phase)) return 0;
    if (phase === 1) return b.maxHp * 0.7;
    if (phase === 2) return b.maxHp * 0.35;
    return 1;
  }

  damageBoss(dmg) {
    const b = this.boss;
    if (!b) return;
    b.hp = Math.max(this.bossHpFloor(b.phase), b.hp - dmg);
  }

  // 阶段内按 03-05 的绝对秒数逐个触发技能事件
  fireBossPhaseEvents() {
    const b = this.boss;
    const rows = this.bossPhaseRows(b.phase);
    while (b.eventIndex < rows.length && rows[b.eventIndex].event_time <= b.phaseElapsed + 1e-9) {
      const ev = rows[b.eventIndex++];
      if (ev.event_type !== 'skill') continue;
      this.emit('boss_skill', {
        boss_id: b.monsterId, phase: b.phase, skill_id: ev.skill_id,
        param: ev.param ?? 0, warning: ev.warning ?? 0,
      });
    }
  }

  enterBossPhase(phase) {
    const b = this.boss;
    const phaseDuration = Math.round(b.phaseElapsed * 1000) / 1000;
    b.phase = phase;
    b.phaseElapsed = 0;
    b.eventIndex = 0;
    b.invulnerableUntil = this.survivalSec + this.bossPhaseWarning(b.timelineId, phase);
    this.emit('boss_phase', { boss_id: b.monsterId, phase, phase_duration: phaseDuration });
    this.fireBossPhaseEvents();
  }

  isBossInvulnerable() {
    return !!this.boss && this.survivalSec < this.boss.invulnerableUntil;
  }

  onBossKilled(hit = {}) {
    if (!this.boss) return;
    const b = this.boss;
    this.killCount++;
    this.bossKillCount++;
    this.gold += b.goldDrop;
    this.totalGoldEarned += b.goldDrop;
    this.emit('kill', { monster_id: b.monsterId, gold_drop: b.goldDrop, wave_index: this.waveIndex });
    if (hit.isCrit) this.emit('crit_kill', { damage: hit.damage ?? 0, target_type: 'boss' });
    this.emit('cycle_end', {
      cycle_index: this.cycleIndex,
      survival_time: this.survivalSec,
      kill_count: this.killCount,
    });
    this.boss = null;
    this.waveState = 'clearing';
    this.waveTimer = 0;
  }

  // ---------- 怪物 ----------
  makeMonster(row, waveIndex) {
    const hp = calcMonsterHp(row.hp_base, waveIndex, this.cfg);
    const start = this.path[0];
    return {
      id: this.nextId++, monsterId: row.monster_id,
      hp, maxHp: hp, x: start.x, y: start.y, pathIndex: 0,
      speed: row.speed, armor: row.armor, goldDrop: row.gold_drop,
      leakDamage: row.leak_damage, special: row.special,
      slowUntil: 0, burningUntil: 0, burnDps: 0,
    };
  }

  updateMonsters(dt) {
    for (const m of this.monsters) {
      this.advanceAlongPath(m, dt);
      if (this.reachedCore(m)) this.onMonsterLeaked(m);
    }
    this.monsters = this.monsters.filter(m => m.hp > 0 && !this.reachedCore(m));
  }

  updateBoss(dt) {
    if (!this.boss) return;
    const b = this.boss;
    b.phaseElapsed += dt;
    this.fireBossPhaseEvents();
    const length = this.bossPhaseLength(b.phase);
    if (b.phaseElapsed < length) return;
    // 到点才转阶段：阶段时长下限生效，血量提前打空也不会跳阶段
    if (b.phase === 1) {
      b.hp = Math.min(b.hp, b.maxHp * 0.7);
      this.enterBossPhase(2);
    } else if (b.phase === 2) {
      b.hp = Math.min(b.hp, b.maxHp * 0.35);
      this.enterBossPhase(3);
    } else if (b.hp <= 1) {
      this.onBossKilled({});
    }
  }

  updateBullets(dt) {
    if (!this.pendingUpgrade) this.autoFire();
    for (const b of this.bullets) {
      // 追踪导弹：每帧重新锁定目标当前位置（目标死亡则保持最后航向）
      if (b.kind === 'missile' && b.targetId !== null) {
        const t = this.findTargetById(b.targetId);
        if (t) {
          const sp = Math.hypot(b.vx, b.vy);
          const ang = Math.atan2(t.y - b.y, t.x - b.x);
          b.vx = Math.cos(ang) * sp;
          b.vy = Math.sin(ang) * sp;
        }
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.travel += Math.hypot(b.vx, b.vy) * dt;
      if (b.kind === 'missile') {
        // 导弹命中敌人/超射程/出界都视为"命中或落地"，触发爆炸
        const out = b.x < -0.05 || b.x > 1.05 || b.y < -0.05 || b.y > 1.05;
        if (b.travel >= b.maxRange || out) { this.explodeMissile(b); continue; }
      }
      this.resolveBulletHit(b);
    }
    this.bullets = this.bullets.filter(b =>
      b.pierceLeft > 0 && !b.exploded
      && b.travel <= b.maxRange
      && b.x > -0.1 && b.x < 1.1 && b.y > -0.1 && b.y < 1.1
    );
  }

  // ---------- 技能线 / 大招线（文档 01-11） ----------
  // 攻击力基准：当前携带武器当前等级的单发伤害，吃装备线加成
  playerAttack() {
    const state = this.charWeaponState(this.currentCharWeapon);
    const row = state?.owned ? this.charWeaponRow(this.currentCharWeapon, state.level) : null;
    const base = row ? row.damage : 10;
    return base * (1 + this.effectiveAtkPct());
  }

  isUltActive() {
    return this.survivalSec < this.ultActiveUntil;
  }

  // 技能/大招自动释放：冷却时间吃技能线/大招线的冷却加成
  updateSkills(dt) {
    this.fx = this.fx.filter(f => f.until > this.survivalSec);

    if (this.activeSkill) {
      this.skillCdLeft = Math.max(0, this.skillCdLeft - dt);
      if (this.skillCdLeft <= 0) {
        this.skillCdLeft = this.activeSkill.cooldown / (1 + (this.bonuses.skillCdPct || 0));
        this.castSkill(this.activeSkill);
      }
    }
    if (this.ultimateSkill) {
      this.ultCdLeft = Math.max(0, this.ultCdLeft - dt);
      if (this.ultCdLeft <= 0) {
        this.ultCdLeft = this.ultimateSkill.cooldown / (1 + (this.bonuses.ultCdPct || 0));
        this.castUltimate(this.ultimateSkill);
      }
    }
  }

  // 主动技：以角色为中心的环形伤害，范围与伤害分别吃技能线范围/伤害加成
  castSkill(def) {
    const radius = SKILL_BASE_RADIUS * (1 + (this.bonuses.skillRangePct || 0));
    const damage = this.playerAttack() * def.base_coeff * (1 + (this.bonuses.skillDmgPct || 0));
    const hits = this.damageArea(this.player.x, this.player.y, radius, damage);
    this.pushFx(this.player.x, this.player.y, radius, '#7fd1ff');
    this.emit('skill_cast', {
      skill_id: def.skill_id,
      damage: Math.round(damage * 100) / 100,
      radius: Math.round(radius * 1000) / 1000,
      hits,
    });
  }

  // 大招：释放瞬间的爆发伤害吃大招线伤害/范围加成，随后 3 秒攻速×3 + 无限穿透
  castUltimate(def) {
    const radius = ULT_BASE_RADIUS * (1 + (this.bonuses.ultRangePct || 0));
    const damage = this.playerAttack() * ULT_BURST_COEFF * (1 + (this.bonuses.ultDmgPct || 0));
    const hits = this.damageArea(this.player.x, this.player.y, radius, damage);
    this.ultActiveUntil = this.survivalSec + ULT_BARRAGE_DURATION;
    this.pushFx(this.player.x, this.player.y, radius, '#ffd479');
    this.emit('ult_cast', {
      skill_id: def.skill_id,
      damage: Math.round(damage * 100) / 100,
      radius: Math.round(radius * 1000) / 1000,
      hits,
      duration: ULT_BARRAGE_DURATION,
    });
  }

  // 范围伤害：技能/大招为固定伤害减护甲；转场无敌期间 Boss 不参与
  damageArea(x, y, radius, damage) {
    let hits = 0;
    const targets = [];
    if (this.boss && !this.isBossInvulnerable()) targets.push(this.boss);
    targets.push(...this.monsters);
    for (const t of targets) {
      if (t.hp <= 0) continue;
      const hitR = t === this.boss ? BOSS_HIT_R : MONSTER_HIT_R;
      if (this.distance({ x, y }, t) > radius + hitR) continue;
      const dmg = Math.max(1, damage - (t.armor || 0));
      if (t === this.boss) this.damageBoss(dmg);
      else t.hp -= dmg;
      hits++;
      if (t.hp <= 0) this.killTarget(t, { isCrit: false, damage: dmg });
    }
    return hits;
  }

  pushFx(x, y, radius, color) {
    this.fx.push({ x, y, radius, color, until: this.survivalSec + 0.35 });
  }

  // 该线当前最低可升级价格；全满级返回 null。UI 用它判断图标是否可升
  cheapestUpgradeCost(line) {
    const rows = this.upgradeTables[line] || [];
    const state = this.upgradeState?.[line] || {};
    let min = Infinity;
    for (const [id, level] of Object.entries(state)) {
      if (level >= 3) continue;
      const next = rows.find(r => r.upgrade_id === id && r.level === level + 1);
      if (next && next.cost_gold < min) min = next.cost_gold;
    }
    return Number.isFinite(min) ? min : null;
  }

  findTargetById(id) {
    if (this.boss && this.boss.id === id) return this.boss;
    return this.monsters.find(m => m.id === id) || null;
  }

  // 霰弹距离衰减：伤害随飞行距离线性下降，最远射程处为近点的 50%
  spreadFalloff(b) {
    if (b.falloff <= 0) return 1;
    const t = Math.min(1, b.travel / b.maxRange);
    return Math.max(SPREAD_FALLOFF_MIN, 1 - (1 - SPREAD_FALLOFF_MIN) * t);
  }

  // 命中判定：每颗子弹独立做碰撞检测；直线/散射碰第一目标销毁，激光按穿透计数穿过
  resolveBulletHit(b) {
    // 转场无敌期间 Boss 不参与命中判定，子弹可以继续打小怪
    const targets = this.boss && !this.isBossInvulnerable() ? [this.boss, ...this.monsters] : this.monsters;
    for (const t of targets) {
      if (b.pierceLeft <= 0) return;
      if (b.hitIds.includes(t.id)) continue;
      const r = t === this.boss ? BOSS_HIT_R : MONSTER_HIT_R;
      if (this.distance(b, t) > r) continue;
      if (b.kind === 'missile') { this.explodeMissile(b, t); return; }
      let dmg;
      let isCrit = false;
      if (b.dmgFormula === 'flat') {
        dmg = Math.max(1, b.damage * this.spreadFalloff(b) - t.armor);
      } else {
        const res = calcDamage({ attack: b.damage }, { armor: t.armor }, {});
        dmg = res.final;
        isCrit = res.isCrit;
      }
      if (t === this.boss) this.damageBoss(dmg);
      else t.hp -= dmg;
      b.pierceLeft--;
      b.hitIds.push(t.id);
      if (t.hp <= 0) this.killTarget(t, { isCrit, damage: dmg });
    }
  }

  // 导弹爆炸：半径内所有目标各结算 1 次（同一发导弹对单个目标不叠加伤害，边界 1）
  explodeMissile(b, directHit = null) {
    b.exploded = true;
    if (directHit && !b.hitIds.includes(directHit.id)) {
      b.hitIds.push(directHit.id);
      const dmg = Math.max(1, b.damage - directHit.armor);
      if (directHit === this.boss) this.damageBoss(dmg);
      else directHit.hp -= dmg;
      if (directHit.hp <= 0) this.killTarget(directHit, { isCrit: false, damage: dmg });
    }
    const targets = this.boss && !this.isBossInvulnerable() ? [this.boss, ...this.monsters] : this.monsters;
    for (const t of targets) {
      if (b.hitIds.includes(t.id)) continue;
      if (this.distance(b, t) > b.explodeRadius) continue;
      b.hitIds.push(t.id);
      const dmg = Math.max(1, b.damage - t.armor);
      if (t === this.boss) this.damageBoss(dmg);
      else t.hp -= dmg;
      if (t.hp <= 0) this.killTarget(t, { isCrit: false, damage: dmg });
    }
  }

  killTarget(t, hit = {}) {
    if (t === this.boss) this.onBossKilled(hit);
    else this.onMonsterKilled(t, hit);
  }

  // ---------- 武器槽 ----------
  // 打开购买面板（空槽买武器，已有武器时可替换或拆除）
  openWeaponPanel(slot) {
    if (this.runOver || this.pendingUpgrade) return false;
    if (!this.weapons.some(w => w.slot === slot)) return false;
    this.pendingWeaponSlot = slot;
    return true;
  }

  closeWeaponPanel() {
    this.pendingWeaponSlot = null;
  }

  weaponDef(weaponId) {
    return this.weaponTable.find(w => w.weapon_id === weaponId) || null;
  }

  // 替换时旧武器按 50% 折价抵扣；返回实际花费（可能为负，表示抵扣后反而赚）
  weaponCost(slot) {
    const state = this.weapons.find(w => w.slot === slot);
    const old = state?.weaponId ? this.weaponDef(state.weaponId) : null;
    return old ? Math.floor(old.cost_gold * 0.5) : 0;
  }

  buyWeapon(slot, weaponId) {
    if (this.runOver) return false;
    const state = this.weapons.find(w => w.slot === slot);
    const def = this.weaponDef(weaponId);
    if (!state || !def) return false;
    const cost = def.cost_gold - this.weaponCost(slot);
    if (this.gold < cost) return false;
    this.gold -= cost;
    state.weaponId = weaponId;
    state.timer = 0;
    this.emit('weapon_buy', { weapon_id: weaponId, slot, cost_gold: cost });
    this.pendingWeaponSlot = null;
    return true;
  }

  sellWeapon(slot) {
    const state = this.weapons.find(w => w.slot === slot);
    const def = state?.weaponId ? this.weaponDef(state.weaponId) : null;
    if (!state || !def) return false;
    const refund = Math.floor(def.cost_gold * 0.5);
    this.gold += refund;
    state.weaponId = null;
    state.timer = 0;
    this.emit('weapon_buy', { weapon_id: def.weapon_id, slot, cost_gold: -refund });
    this.pendingWeaponSlot = null;
    return true;
  }

  updateWeapons(dt) {
    const atkPct = this.effectiveAtkPct();
    const aspdPct = this.effectiveAspdPct();
    for (const state of this.weapons) {
      if (!state.weaponId) continue;
      const def = this.weaponDef(state.weaponId);
      if (!def) continue;
      const slotPos = WEAPON_SLOTS.find(s => s.slot === state.slot);
      const interval = def.fire_interval / (1 + aspdPct);
      state.timer += dt;
      if (state.timer < interval) continue;
      state.timer = 0;
      const target = this.nearestTarget(slotPos.x, slotPos.y, def.range);
      if (!target) continue;
      const baseAngle = Math.atan2(target.y - slotPos.y, target.x - slotPos.x);
      const pellets = Math.max(1, def.pellets);
      for (let i = 0; i < pellets; i++) {
        const offset = (i - (pellets - 1) / 2) * 0.14;
        const angle = baseAngle + offset;
        this.bullets.push({
          id: this.nextId++, x: slotPos.x, y: slotPos.y,
          vx: Math.cos(angle) * BULLET_SPEED, vy: Math.sin(angle) * BULLET_SPEED,
          damage: def.damage * (1 + atkPct),
          pierceLeft: def.pierce + (this.bonuses.pierce || 0),
          hitIds: [],
          kind: 'circle', source: 'slot', dmgFormula: 'percent',
          travel: 0, maxRange: def.range * (1 + (this.bonuses.rangePct || 0)) + 0.05,
          falloff: 0, explodeRadius: 0, targetId: null, exploded: false,
        });
      }
    }
  }

  nearestTarget(x, y, range) {
    let best = null;
    let bestDist = range;
    for (const t of (this.boss ? [this.boss, ...this.monsters] : this.monsters)) {
      const d = this.distance({ x, y }, t);
      if (d <= bestDist) { best = t; bestDist = d; }
    }
    return best;
  }

  // ---------- 击杀与漏怪 ----------
  onMonsterKilled(m, hit = {}) {
    this.killCount++;
    this.gold += m.goldDrop;
    this.totalGoldEarned += m.goldDrop;
    // 05-05 waves[] 聚合数据源：每波击杀数与金币
    this.emit('kill', { monster_id: m.monsterId, gold_drop: m.goldDrop, wave_index: this.waveIndex });
    // crit_kill 只在本次命中的确是暴击时发出，且带上真实伤害
    if (hit.isCrit) this.emit('crit_kill', { damage: hit.damage ?? 0, target_type: m.special });
  }

  onMonsterLeaked(m) {
    this.core.hp = Math.max(0, this.core.hp - m.leakDamage);
    this.emit('leak', { monster_id: m.monsterId, leak_damage: m.leakDamage, core_hp_left: this.core.hp });
  }

  onBossReachedCore() {
    const dmg = 15 * this.boss.damageMultiplier;
    this.core.hp = Math.max(0, this.core.hp - dmg);
    this.boss = null;
    this.waveState = 'clearing';
    this.waveTimer = 0;
  }

  // ---------- 玩家 ----------
  movePlayer(x, y) {
    const z = this.playerZone;
    this.player.x = Math.max(z.x_min, Math.min(z.x_max, x));
    this.player.y = Math.max(z.y_min, Math.min(z.y_max, y));
  }

  // ---------- 升级 ----------
  openUpgrade(line) {
    const options = getAvailableUpgrades(this.upgradeState, line, this.upgradeTables, this.gold);
    if (options.length === 0) return false;
    this.pendingUpgrade = { line, options };
    return true;
  }

  pickUpgrade(upgradeId) {
    if (!this.pendingUpgrade) return;
    const { line } = this.pendingUpgrade;
    const r = applyUpgrade(this.upgradeState, line, upgradeId, this.upgradeTables, this.gold);
    if (!r.ok) return;
    this.gold -= r.cost;
    this.upgradeState = r.state;
    this.bonuses = sumBonuses(this.upgradeState, this.upgradeTables);
    this.emit('upgrade_pick', {
      upgrade_id: upgradeId, line, level: getLevel(r.state, line, upgradeId), cost: r.cost,
    });
    this.pendingUpgrade = null;
  }

  refreshUpgradeOptions(method) {
    if (!this.pendingUpgrade) return;
    if (method === 'coin') {
      if (this.gold < 50) return;
      this.gold -= 50;
    }
    const { line } = this.pendingUpgrade;
    this.pendingUpgrade.options = getAvailableUpgrades(this.upgradeState, line, this.upgradeTables, this.gold);
    this.emit('upgrade_refresh', { method, line });
  }

  // ---------- 软成长 ----------
  effectiveAtkPct() {
    return (this.bonuses.atkPct || 0) + (this.softGrowth.dmgPct || 0);
  }

  effectiveAspdPct() {
    return (this.bonuses.aspdPct || 0) + (this.softGrowth.aspdPct || 0);
  }

  // 当前携带武器满级后，金币超过保留线即自动转入软成长池
  applyOverflowSoftGrowth() {
    if (this.runOver) return;
    const state = this.charWeaponState(this.currentCharWeapon);
    if (!isSoftGrowthUnlocked(state, CHAR_MAX_LEVEL)) return;
    const result = convertOverflowGold(this.softGrowth, this.gold, this.cfg);
    if (result.converted <= 0) return;
    this.softGrowth = result.state;
    this.gold = result.gold;
    const bucket = Math.floor(this.softGrowth.gold / 1000);
    if (bucket > this.softEventBucket) {
      this.softEventBucket = bucket;
      this.emit('soft_growth', {
        gold_consumed: Math.round(result.converted),
        total_gold: Math.round(this.softGrowth.gold),
        dmg_pct: Math.round(this.softGrowth.dmgPct * 10000) / 100,
        aspd_pct: Math.round(this.softGrowth.aspdPct * 10000) / 100,
      });
    }
  }

  // ---------- 结算 ----------
  checkRunEnd() {
    if (this.core.hp > 0 || this.runOver) return;
    this.emit('run_end', {
      survival_time: this.survivalSec,
      cycle_index: this.cycleIndex,
      kill_count: this.killCount,
      wave_index: this.waveIndex,
    });
    this.runOver = true;
  }

  getRunSummary() {
    return {
      survival_time: this.survivalSec,
      cycle_index: this.cycleIndex,
      kill_count: this.killCount,
      boss_kill_count: this.bossKillCount,
      wave_index: this.waveIndex,
      core_hp_left: this.core.hp,
      gold_earned: this.totalGoldEarned,
      rng_seed: this.rngSeed,
      result: this.runOver ? 'defeat' : 'playing',
    };
  }

  // ---------- 工具 ----------
  coreHpPercent() { return this.core.hp / this.core.maxHp; }

  weightedPick(pool) {
    const total = pool.reduce((s, m) => s + (m.spawn_weight || 0), 0);
    if (total <= 0) return pool[0];
    let r = Math.random() * total;
    for (const m of pool) { r -= m.spawn_weight || 0; if (r <= 0) return m; }
    return pool[pool.length - 1];
  }

  advanceAlongPath(m, dt) {
    if (m.pathIndex >= this.path.length - 1) return;
    const next = this.path[m.pathIndex + 1];
    const dx = next.x - m.x;
    const dy = next.y - m.y;
    const dist = Math.hypot(dx, dy);
    const step = m.speed * dt * 0.001;   // speed 单位 px/s，归一化 0.001 折算
    if (dist <= step) {
      m.x = next.x; m.y = next.y; m.pathIndex++;
    } else {
      m.x += (dx / dist) * step;
      m.y += (dy / dist) * step;
    }
  }

  reachedCore(m) { return m.pathIndex >= this.path.length - 1; }

  distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  // ---------- 角色武器（文档 01-18） ----------
  charWeaponRow(weaponId, level) {
    return this.charWeaponTable.find(r => r.weapon_id === weaponId && r.level === level) || null;
  }

  charWeaponState(weaponId) {
    return this.charWeapons[weaponId] || null;
  }

  // 打开角色武器面板（暂停式弹层，与升级三选一一致）；默认选中当前携带武器
  openCharWeaponPanel() {
    if (this.runOver || this.pendingUpgrade || this.pendingWeaponSlot) return false;
    this.pendingCharWeaponPanel = true;
    this.charWeaponSelected = this.currentCharWeapon;
    return true;
  }

  closeCharWeaponPanel() {
    this.pendingCharWeaponPanel = false;
  }

  // 面板选择栏：点击图标选中；已解锁未携带的武器同时切换携带
  selectCharWeapon(weaponId) {
    if (!this.charWeapons[weaponId]) return false;
    this.charWeaponSelected = weaponId;
    if (this.charWeapons[weaponId].owned) this.switchCharWeapon(weaponId);
    return true;
  }

  // 购买武器：一次性消耗金币解锁（Lv1），金币不足失败
  buyCharWeapon(weaponId) {
    if (this.runOver) return false;
    const state = this.charWeaponState(weaponId);
    const row = this.charWeaponRow(weaponId, 1);
    if (!state || state.owned || !row) return false;
    if (this.gold < row.unlock_cost_gold) return false;
    this.gold -= row.unlock_cost_gold;
    state.owned = true;
    this.emit('char_weapon_buy', { weapon_id: weaponId, cost_gold: row.unlock_cost_gold });
    return true;
  }

  // 升级武器：单武器独立升级，消耗随等级递增；Lv4 满级拒升
  upgradeCharWeapon(weaponId) {
    if (this.runOver) return false;
    const state = this.charWeaponState(weaponId);
    if (!state?.owned) return false;
    if (state.level >= CHAR_MAX_LEVEL) return false;
    const row = this.charWeaponRow(weaponId, state.level);
    if (!row) return false;
    if (this.gold < row.upgrade_cost_gold) return false;
    this.gold -= row.upgrade_cost_gold;
    state.level += 1;
    this.emit('char_weapon_upgrade', {
      weapon_id: weaponId, level: state.level, cost_gold: row.upgrade_cost_gold,
    });
    return true;
  }

  // 切换携带：加载该武器已养成等级与属性，不重置射击冷却
  switchCharWeapon(weaponId) {
    const state = this.charWeaponState(weaponId);
    if (!state?.owned || weaponId === this.currentCharWeapon) return false;
    this.currentCharWeapon = weaponId;
    this.emit('char_weapon_switch', { weapon_id: weaponId, level: state.level });
    return true;
  }

  // 自动开火：角色朝上射击，冷却结束自动发射，弹数 = 武器当前等级（硬上限 7）
  autoFire() {
    const state = this.charWeaponState(this.currentCharWeapon);
    if (!state?.owned) return;
    const row = this.charWeaponRow(this.currentCharWeapon, state.level);
    if (!row) return;
    const interval = row.fire_interval / (1 + this.effectiveAspdPct()) / (this.isUltActive() ? ULT_BARRAGE_ASPD : 1);
    if (this.survivalSec - this.lastFireAt < interval) return;
    this.lastFireAt = this.survivalSec;
    this.fireCharWeapon(row);
  }

  // 按武器当前等级行发射：circle 直线 / spread 扇形 / laser 穿透 / missile 追踪
  fireCharWeapon(row) {
    const speed = row.bullet_speed * 0.001;   // px/s → 归一化单位
    const range = row.range * (1 + (this.bonuses.rangePct || 0));
    const damage = row.damage * (1 + this.effectiveAtkPct());
    const pellets = Math.min(CHAR_PELLETS_CAP, Math.max(1, row.pellets));
    const spread = row.bullet_type === 'spread' ? row.spread_angle : 0;
    const missileTarget = row.bullet_type === 'missile'
      ? this.nearestTarget(this.player.x, this.player.y, range)
      : null;
    for (let i = 0; i < pellets; i++) {
      const t = pellets === 1 ? 0.5 : i / (pellets - 1);
      const rad = (90 + (t - 0.5) * spread) * Math.PI / 180;   // 90° = 朝上，spread 为扇形总角度
      const bullet = {
        id: this.nextId++, x: this.player.x, y: this.player.y,
        vx: Math.cos(rad) * speed, vy: Math.sin(rad) * speed,
        damage, pierceLeft: this.isUltActive() ? ULT_BARRAGE_PIERCE : row.pierce + (this.bonuses.pierce || 0),
        hitIds: [],
        kind: row.bullet_type, source: 'char', dmgFormula: 'flat',
        travel: 0, maxRange: Math.max(0.05, range),
        falloff: row.bullet_type === 'spread' ? SPREAD_FALLOFF_MIN : 0,
        explodeRadius: row.explosion_radius * METER,
        targetId: missileTarget ? missileTarget.id : null,
        exploded: false,
      };
      this.bullets.push(bullet);
    }
  }

  emit(type, params) {
    this.events.push({ t: this.survivalSec, type, params });
  }
}
