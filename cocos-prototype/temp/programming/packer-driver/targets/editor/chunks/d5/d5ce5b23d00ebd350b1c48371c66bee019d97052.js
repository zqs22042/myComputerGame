System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  // @ts-nocheck
  // 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
  // core/softGrowth.js — 满级后溢出金币转局内软成长（纯函数，无引擎依赖）
  // 设计：溢出金币进入同一个累计池，伤害/射速各自用饱和曲线换算，边际递减并封顶。
  // bonus = cap × (1 - exp(-gold × perGold / cap))

  /** 饱和软成长：gold=0 时加成为 0，gold→∞ 时趋近 cap，初始斜率 = perGold */

  /** 当前携带武器达到满级后，才允许把溢出金币转为软成长 */

  /**
   * 把 gold 中超过 reserve 的部分全部转入软成长池。
   * 返回新状态、保留后的金币、本次转化量；不修改入参。
   */
  function initSoftGrowth() {
    return {
      gold: 0,
      dmgPct: 0,
      aspdPct: 0
    };
  }

  function softCapBonus(gold, perGold, cap) {
    if (!(gold > 0) || !(perGold > 0) || !(cap > 0)) return 0;
    return cap * (1 - Math.exp(-gold * perGold / cap));
  }

  function isSoftGrowthUnlocked(weaponState, maxLevel) {
    return !!(weaponState && weaponState.owned && weaponState.level >= maxLevel);
  }

  function convertOverflowGold(state, gold, cfg) {
    var _cfg$soft_growth_rese;

    const reserve = Math.max(0, (_cfg$soft_growth_rese = cfg.soft_growth_reserve) != null ? _cfg$soft_growth_rese : 0);
    const overflow = Math.max(0, gold - reserve);
    if (overflow <= 0) return {
      state,
      gold,
      converted: 0
    };
    const next = {
      gold: state.gold + overflow
    };
    next.dmgPct = softCapBonus(next.gold, cfg.soft_dmg_per_gold, cfg.soft_dmg_cap);
    next.aspdPct = softCapBonus(next.gold, cfg.soft_aspd_per_gold, cfg.soft_aspd_cap);
    return {
      state: next,
      gold: reserve,
      converted: overflow
    };
  }

  _export({
    initSoftGrowth: initSoftGrowth,
    softCapBonus: softCapBonus,
    isSoftGrowthUnlocked: isSoftGrowthUnlocked,
    convertOverflowGold: convertOverflowGold
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba6e9bkHGNFOa5q7FRRtunB", "softGrowth", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d5ce5b23d00ebd350b1c48371c66bee019d97052.js.map