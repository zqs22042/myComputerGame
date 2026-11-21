System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  // @ts-nocheck
  // 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
  // core/endless.js — 无尽波次与血量计算（纯函数，无引擎依赖）

  /**
   * 血量档位：每 hp_step_waves 波提升一档，档位从 0 开始。
   * Boss 波在普通档位基础上额外跳 boss_wave_step_extra 档。
   */

  /** 档位倍率：HP × (1 + hp_step_growth)^tier */

  /**
   * 普通怪血量（分段台阶，不再随时间连续增长）
   * hp = hp_base × (1 + hp_step_growth)^floor((waveIndex - 1) / hp_step_waves)
   */

  /**
   * Boss 血量：在普通档位基础上额外跳档
   * hp = hp_base × (1 + hp_step_growth)^(普通档位 + boss_wave_step_extra)
   */

  /**
   * Boss 伤害
   * dmg = baseDamage × (1 + boss_damage_cycle_bonus × (cycleIndex - 1))
   */

  /**
   * 波次类型
   * 每循环 10 波，第 5 波精英，第 10 波 Boss，其余普通。
   * waveIndex 从 1 开始，连续递增（不按循环重置）。
   */

  /**
   * 当前循环编号
   * cycleIndex = floor((waveIndex - 1) / boss_every_waves) + 1
   */

  /**
   * 当前波次数量
   * count = round(base_spawn_count × spawn_count_growth^(waveIndex - 1))
   */
  function getHpStepTier(waveIndex, cfg, isBoss) {
    if (isBoss === void 0) {
      isBoss = false;
    }

    var width = Math.max(1, Math.floor(cfg.hp_step_waves));
    var baseTier = Math.floor((Math.max(1, waveIndex) - 1) / width);
    var bossSkip = isBoss ? Math.max(0, Math.floor(cfg.boss_wave_step_extra)) : 0;
    return baseTier + bossSkip;
  }

  function hpStepMultiplier(tier, cfg) {
    return Math.pow(1 + Math.max(0, cfg.hp_step_growth), Math.max(0, tier));
  }

  function calcMonsterHp(hpBase, waveIndex, cfg) {
    return Math.round(hpBase * hpStepMultiplier(getHpStepTier(waveIndex, cfg), cfg));
  }

  function calcBossHp(hpBase, waveIndex, cfg) {
    return Math.round(hpBase * hpStepMultiplier(getHpStepTier(waveIndex, cfg, true), cfg));
  }

  function calcBossDamage(baseDamage, cycleIndex, cfg) {
    var {
      boss_damage_cycle_bonus
    } = cfg;
    var cycleFactor = 1 + boss_damage_cycle_bonus * (cycleIndex - 1);
    return Math.round(baseDamage * cycleFactor * 100) / 100;
  }

  function getWaveType(waveIndex, cfg) {
    var {
      elite_every_waves,
      boss_every_waves
    } = cfg;
    var withinCycle = (waveIndex - 1) % boss_every_waves + 1;
    if (withinCycle === boss_every_waves) return 'boss';
    if (withinCycle === elite_every_waves) return 'elite';
    return 'normal';
  }

  function getCycleIndex(waveIndex, cfg) {
    return Math.floor((waveIndex - 1) / cfg.boss_every_waves) + 1;
  }

  function calcSpawnCount(waveIndex, cfg) {
    var {
      base_spawn_count,
      spawn_count_growth
    } = cfg;
    return Math.max(1, Math.round(base_spawn_count * Math.pow(spawn_count_growth, waveIndex - 1)));
  }

  _export({
    getHpStepTier: getHpStepTier,
    hpStepMultiplier: hpStepMultiplier,
    calcMonsterHp: calcMonsterHp,
    calcBossHp: calcBossHp,
    calcBossDamage: calcBossDamage,
    getWaveType: getWaveType,
    getCycleIndex: getCycleIndex,
    calcSpawnCount: calcSpawnCount
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7c1bfsJ8UBLQZll5ehMAjLx", "endless", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9870954af9195546c24448b184edb175d1629cfa.js.map