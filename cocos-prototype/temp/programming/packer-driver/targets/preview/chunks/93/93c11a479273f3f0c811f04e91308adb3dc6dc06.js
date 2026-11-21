System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, LINES;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  /**
   * 初始化升级状态
   * state = { equipment: {EQ_ATK:0, ...}, skill: {...}, ultimate: {...} }
   */
  function initUpgradeState(tables) {
    var state = {};

    for (var line of LINES) {
      state[line] = {};
      var rows = tables[line] || [];

      for (var row of rows) {
        if (!(row.upgrade_id in state[line])) state[line][row.upgrade_id] = 0;
      }
    }

    return state;
  }
  /**
   * 获取某条线某升级项的当前等级
   */


  function getLevel(state, line, upgradeId) {
    var _state$line$upgradeId, _state$line;

    return (_state$line$upgradeId = (_state$line = state[line]) == null ? void 0 : _state$line[upgradeId]) != null ? _state$line$upgradeId : 0;
  }
  /**
   * 获取某条线可升级的项（未满级且金币足够）
   * 返回 [{ upgrade_id, name, nextLevel, cost_gold, effect_value, effect_desc }]
   */


  function getAvailableUpgrades(state, line, tables, gold) {
    var rows = tables[line] || [];
    var result = [];
    var seen = new Set();

    var _loop = function _loop(row) {
      if (seen.has(row.upgrade_id)) return 0; // continue

      var current = getLevel(state, line, row.upgrade_id);

      if (current >= 3) {
        seen.add(row.upgrade_id);
        return 0; // continue
      }

      var next = rows.find(r => r.upgrade_id === row.upgrade_id && r.level === current + 1);

      if (!next) {
        seen.add(row.upgrade_id);
        return 0; // continue
      }

      if (next.cost_gold <= gold) {
        result.push({
          upgrade_id: row.upgrade_id,
          name: next.name,
          nextLevel: next.level,
          cost_gold: next.cost_gold,
          effect_value: next.effect_value,
          effect_desc: next.effect_desc
        });
      }

      seen.add(row.upgrade_id);
    },
        _ret;

    for (var row of rows) {
      _ret = _loop(row);
      if (_ret === 0) continue;
    } // 三选一：单线候选最多 3 个；超出时随机取 3（刷新可重新抽），
    // 避免第 4 个候选项永远排在卡片区之外而无法被点到。


    if (result.length > 3) {
      for (var i = result.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }

      return result.slice(0, 3);
    }

    return result;
  }
  /**
   * 应用升级，返回 { state, cost, ok }
   * 满级、金币不足、非法 upgradeId 均返回 ok=false
   */


  function applyUpgrade(state, line, upgradeId, tables, gold) {
    var rows = tables[line] || [];
    var current = getLevel(state, line, upgradeId);
    if (current >= 3) return {
      state,
      cost: 0,
      ok: false,
      reason: 'max_level'
    };
    var next = rows.find(r => r.upgrade_id === upgradeId && r.level === current + 1);
    if (!next) return {
      state,
      cost: 0,
      ok: false,
      reason: 'not_found'
    };
    if (next.cost_gold > gold) return {
      state,
      cost: 0,
      ok: false,
      reason: 'insufficient_gold'
    };

    var newState = _extends({}, state, {
      [line]: _extends({}, state[line], {
        [upgradeId]: current + 1
      })
    });

    return {
      state: newState,
      cost: next.cost_gold,
      ok: true,
      reason: null
    };
  }
  /**
   * 汇总所有加成
   * 返回 { atkPct, aspdPct, rangePct, pierce, skillDmgPct, skillCdPct, skillRangePct,
   *        ultDmgPct, ultCdPct, ultRangePct }
   * 同类效果按等级累加（加算），不同类之间乘算由使用方处理。
   */


  function sumBonuses(state, tables) {
    var sum = {
      atkPct: 0,
      aspdPct: 0,
      rangePct: 0,
      pierce: 0,
      skillDmgPct: 0,
      skillCdPct: 0,
      skillRangePct: 0,
      ultDmgPct: 0,
      ultCdPct: 0,
      ultRangePct: 0
    };
    var map = {
      EQ_ATK: 'atkPct',
      EQ_ASPD: 'aspdPct',
      EQ_RANGE: 'rangePct',
      EQ_PIERCE: 'pierce',
      SK_DMG: 'skillDmgPct',
      SK_CD: 'skillCdPct',
      SK_RANGE: 'skillRangePct',
      UL_DMG: 'ultDmgPct',
      UL_CD: 'ultCdPct',
      UL_RANGE: 'ultRangePct'
    };

    for (var line of LINES) {
      var _loop2 = function _loop2(id, level) {
        if (level <= 0) return 0; // continue

        var key = map[id];
        if (!key) return 0; // continue

        var row = (tables[line] || []).find(r => r.upgrade_id === id && r.level === level);
        if (!row) return 0; // continue

        sum[key] += row.effect_value;
      },
          _ret2;

      for (var [id, level] of Object.entries(state[line] || {})) {
        _ret2 = _loop2(id, level);
        if (_ret2 === 0) continue;
      }
    }

    return sum;
  }

  _export({
    initUpgradeState: initUpgradeState,
    getLevel: getLevel,
    getAvailableUpgrades: getAvailableUpgrades,
    applyUpgrade: applyUpgrade,
    sumBonuses: sumBonuses
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "92c44duIr5PXJxu8KpzFRZF", "upgrade", undefined);

      // @ts-nocheck
      // 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。
      // core/upgrade.js — 三条升级线状态与加成汇总（纯函数）
      _export("LINES", LINES = ['equipment', 'skill', 'ultimate']);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=93c11a479273f3f0c811f04e91308adb3dc6dc06.js.map