System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, RARITIES, WEIGHT_FIELD;

  function pickWeights(row) {
    var out = {};

    for (var rarity of RARITIES) out[rarity] = row[WEIGHT_FIELD[rarity]];

    return out;
  }

  function sortAnchors(anchors) {
    return [...anchors].sort((a, b) => a.wave - b.wave);
  }

  function interpolateWeights(anchors, wave) {
    if (!anchors || anchors.length === 0) throw new Error('card_draw_curve 锚点为空');
    var sorted = sortAnchors(anchors);
    var first = sorted[0];
    var last = sorted[sorted.length - 1];
    if (wave <= first.wave) return pickWeights(first);
    if (wave >= last.wave) return pickWeights(last);
    var lo = first;
    var hi = last;

    for (var i = 0; i < sorted.length - 1; i += 1) {
      if (wave >= sorted[i].wave && wave <= sorted[i + 1].wave) {
        lo = sorted[i];
        hi = sorted[i + 1];
        break;
      }
    }

    var span = hi.wave - lo.wave;
    var t = span === 0 ? 0 : (wave - lo.wave) / span;
    var out = {};

    for (var rarity of RARITIES) {
      var from = lo[WEIGHT_FIELD[rarity]];
      var to = hi[WEIGHT_FIELD[rarity]];
      out[rarity] = from + (to - from) * t;
    }

    return out;
  }

  function normalizeWeights(weights) {
    var sum = RARITIES.reduce((acc, rarity) => acc + weights[rarity], 0);
    if (sum <= 0) throw new Error('权重之和必须大于 0');
    var out = {};

    for (var rarity of RARITIES) out[rarity] = weights[rarity] / sum;

    return out;
  }

  function segmentRow(anchors, wave) {
    var sorted = sortAnchors(anchors);
    var current = sorted[0];

    for (var row of sorted) {
      if (row.wave <= wave) current = row;else break;
    }

    return current;
  }

  function drawRarity(weights, rng) {
    if (rng === void 0) {
      rng = Math.random;
    }

    var r = rng();
    var acc = 0;

    for (var rarity of RARITIES) {
      acc += weights[rarity];
      if (r < acc) return rarity;
    }

    return RARITIES[RARITIES.length - 1];
  }

  _export({
    interpolateWeights: interpolateWeights,
    normalizeWeights: normalizeWeights,
    segmentRow: segmentRow,
    drawRarity: drawRarity
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fac34Ju2uVBArMDulo8HoqT", "CardDraw", undefined);

      // 词条权重插值与抽取：与 tech-validation/src/cardDraw.js 保持同一实现。
      _export("RARITIES", RARITIES = ['common', 'rare', 'epic', 'legendary']);

      _export("WEIGHT_FIELD", WEIGHT_FIELD = {
        common: 'common_weight',
        rare: 'rare_weight',
        epic: 'epic_weight',
        legendary: 'legendary_weight'
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=233035c5f341c4aa28737098e9f659cd8055859f.js.map