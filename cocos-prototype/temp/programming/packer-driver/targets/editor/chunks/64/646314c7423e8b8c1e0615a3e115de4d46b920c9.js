System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, drawRarity, interpolateWeights, normalizeWeights, segmentRow, _crd;

  function baseModifiers() {
    return {
      pierce: 0,
      ricochet: 0,
      split: 0,
      critRate: 0.05,
      critDamage: 0,
      heroIntervalMult: 1,
      burn: 0,
      explode: 0,
      towerIntervalMult: 1,
      towerRangeBonus: 0,
      slowAura: 0,
      frostSlow: 0,
      tesla: 0,
      towerSynergy: 0,
      coreMaxBonus: 0,
      healPerWave: 0,
      dodge: 0,
      thorns: 0,
      emergency: 0,
      goldBonus: 0,
      expBonus: 0,
      freeRefresh: 0,
      interest: 0,
      greed: 0
    };
  }

  function buildCardPool(tables) {
    const out = [];

    const push = (rows, category) => {
      for (const row of rows != null ? rows : []) {
        var _row$synergy_tag;

        out.push({
          cardId: row.card_id,
          name: row.name,
          rarity: row.rarity,
          level: row.level,
          effectValue: row.effect_value,
          effectDesc: row.effect_desc,
          synergyTag: (_row$synergy_tag = row.synergy_tag) != null ? _row$synergy_tag : '无',
          category
        });
      }
    };

    push(tables.cards_weapon, 'weapon');
    push(tables.cards_tower, 'tower');
    push(tables.cards_survival, 'survival');
    push(tables.cards_economy, 'economy');
    return out;
  } // 由“已拥有词条等级”重新汇总全部加成，避免增量叠加导致重复计算。


  function deriveModifiers(pool, owned) {
    const m = baseModifiers();

    for (const row of pool) {
      if (owned.get(row.cardId) !== row.level) continue;
      const v = row.effectValue;

      switch (row.cardId) {
        case 'W01':
          m.pierce = Math.max(m.pierce, v);
          break;

        case 'W02':
          m.ricochet = v;
          break;

        case 'W03':
          m.split = v;
          break;

        case 'W04':
          m.critRate += v;
          break;

        case 'W05':
          m.critDamage += v;
          break;

        case 'W06':
          m.heroIntervalMult *= 1 - v;
          break;

        case 'W07':
          m.burn = v;
          break;

        case 'W08':
          m.explode = v;
          break;

        case 'T01':
          m.towerIntervalMult *= 1 - v;
          break;

        case 'T02':
          m.towerRangeBonus += v;
          break;

        case 'T03':
          m.slowAura = v;
          break;

        case 'T04':
          m.frostSlow = v;
          break;

        case 'T05':
          m.tesla = v;
          break;

        case 'T06':
          m.towerSynergy = v;
          break;

        case 'S01':
          m.coreMaxBonus += v;
          break;

        case 'S02':
          m.healPerWave = v;
          break;

        case 'S03':
          m.dodge += v;
          break;

        case 'S04':
          m.thorns = v;
          break;

        case 'S05':
          m.emergency = v;
          break;

        case 'E01':
          m.goldBonus += v;
          break;

        case 'E02':
          m.expBonus += v;
          break;

        case 'E03':
          m.freeRefresh += v;
          break;

        case 'E04':
          m.interest = v;
          break;

        case 'E05':
          m.greed += v;
          break;

        default:
          break;
      }
    }

    return m;
  }

  function pickOne(list, rng) {
    if (list.length === 0) return null;
    return list[Math.floor(rng() * list.length)];
  } // 抽取三选一：插值权重 → 稀有度 → 词条 → 同系保底替换（与 card_weight_interpolation.md 一致）。


  function drawCardOptions(params) {
    var _seg$refresh_rarity_b, _seg$same_category_gu;

    const {
      pool,
      owned,
      curve,
      wave,
      rng,
      refreshCount
    } = params;
    const weights = (_crd && interpolateWeights === void 0 ? (_reportPossibleCrUseOfinterpolateWeights({
      error: Error()
    }), interpolateWeights) : interpolateWeights)(curve, wave);
    const seg = (_crd && segmentRow === void 0 ? (_reportPossibleCrUseOfsegmentRow({
      error: Error()
    }), segmentRow) : segmentRow)(curve, wave);
    const bonus = ((_seg$refresh_rarity_b = seg.refresh_rarity_bonus) != null ? _seg$refresh_rarity_b : 0) * refreshCount;
    const boosted = { ...weights
    };

    if (bonus > 0) {
      boosted.rare += bonus;
      boosted.epic += bonus;
    }

    const normalized = (_crd && normalizeWeights === void 0 ? (_reportPossibleCrUseOfnormalizeWeights({
      error: Error()
    }), normalizeWeights) : normalizeWeights)(boosted);
    const eligible = pool.filter(row => {
      var _owned$get;

      return ((_owned$get = owned.get(row.cardId)) != null ? _owned$get : 0) + 1 === row.level;
    });
    const picked = [];

    for (let i = 0; i < 3; i += 1) {
      const rarity = (_crd && drawRarity === void 0 ? (_reportPossibleCrUseOfdrawRarity({
        error: Error()
      }), drawRarity) : drawRarity)(normalized, rng);
      let candidates = eligible.filter(row => row.rarity === rarity && !picked.some(p => p.cardId === row.cardId));

      if (candidates.length === 0) {
        candidates = eligible.filter(row => !picked.some(p => p.cardId === row.cardId));
      }

      const choice = pickOne(candidates, rng);
      if (!choice) break;
      picked.push(choice);
    } // 保底：若已有同系词条且本组无同系，则把最后一张替换为同系词条。


    const ownedTags = [...owned.keys()].map(cardId => {
      var _pool$find;

      return (_pool$find = pool.find(row => row.cardId === cardId)) == null ? void 0 : _pool$find.synergyTag;
    }).filter(tag => Boolean(tag) && tag !== '无');

    if (((_seg$same_category_gu = seg.same_category_guarantee) != null ? _seg$same_category_gu : 0) > 0 && ownedTags.length > 0) {
      const hasMatch = picked.some(card => ownedTags.includes(card.synergyTag));

      if (!hasMatch) {
        const pool2 = eligible.filter(row => ownedTags.includes(row.synergyTag) && !picked.some(p => p.cardId === row.cardId));
        const replacement = pickOne(pool2, rng);
        if (replacement) picked[picked.length - 1] = replacement;
      }
    }

    return picked.map(row => ({
      cardId: row.cardId,
      name: row.name,
      rarity: row.rarity,
      level: row.level,
      effectValue: row.effectValue,
      effectDesc: row.effectDesc,
      synergyTag: row.synergyTag,
      category: row.category
    }));
  }

  function _reportPossibleCrUseOfdrawRarity(extras) {
    _reporterNs.report("drawRarity", "../core/CardDraw", _context.meta, extras);
  }

  function _reportPossibleCrUseOfinterpolateWeights(extras) {
    _reporterNs.report("interpolateWeights", "../core/CardDraw", _context.meta, extras);
  }

  function _reportPossibleCrUseOfnormalizeWeights(extras) {
    _reporterNs.report("normalizeWeights", "../core/CardDraw", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsegmentRow(extras) {
    _reporterNs.report("segmentRow", "../core/CardDraw", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCardOption(extras) {
    _reporterNs.report("CardOption", "./Types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfModifiers(extras) {
    _reporterNs.report("Modifiers", "./Types", _context.meta, extras);
  }

  _export({
    baseModifiers: baseModifiers,
    buildCardPool: buildCardPool,
    deriveModifiers: deriveModifiers,
    drawCardOptions: drawCardOptions
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      drawRarity = _unresolved_2.drawRarity;
      interpolateWeights = _unresolved_2.interpolateWeights;
      normalizeWeights = _unresolved_2.normalizeWeights;
      segmentRow = _unresolved_2.segmentRow;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7b27aNqE9RNTLQ/DXpPUoKl", "Modifiers", undefined); // 词条池、加成汇总与三选一抽取（复用 core/CardDraw 的插值与归一化）。


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=646314c7423e8b8c1e0615a3e115de4d46b920c9.js.map