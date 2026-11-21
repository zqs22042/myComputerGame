System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, ARMOR_CONSTANT, BASE_CRIT_MULTIPLIER, BURN_DURATION, PIERCE_FALLOFF;

  function armorReduction(armor) {
    if (!Number.isFinite(armor) || armor <= 0) return 0;
    return armor / (armor + ARMOR_CONSTANT);
  }

  function trajectoryScale(bullet) {
    var _PIERCE_FALLOFF$pierc;

    if (bullet === void 0) {
      bullet = {};
    }

    var {
      trajectory = 'direct',
      pierceIndex = 0,
      damageScale = 1
    } = bullet;

    switch (trajectory) {
      case 'pierce':
        return (_PIERCE_FALLOFF$pierc = PIERCE_FALLOFF[pierceIndex]) != null ? _PIERCE_FALLOFF$pierc : 0;

      case 'ricochet':
      case 'split':
      case 'explode':
        return damageScale;

      default:
        return 1;
    }
  }

  function calcDamage(attacker, target, bullet) {
    var _attacker$attack, _attacker$skillCoeff, _attacker$attackPerce, _attacker$critRate, _attacker$critDamageB, _bullet$critRoll, _bullet$forceCrit, _target$armor;

    if (attacker === void 0) {
      attacker = {};
    }

    if (target === void 0) {
      target = {};
    }

    if (bullet === void 0) {
      bullet = {};
    }

    var attack = (_attacker$attack = attacker.attack) != null ? _attacker$attack : 0;
    var skillCoeff = (_attacker$skillCoeff = attacker.skillCoeff) != null ? _attacker$skillCoeff : 1;
    var attackPercentBonus = (_attacker$attackPerce = attacker.attackPercentBonus) != null ? _attacker$attackPerce : 0;
    var critRate = (_attacker$critRate = attacker.critRate) != null ? _attacker$critRate : 0;
    var critDamageBonus = (_attacker$critDamageB = attacker.critDamageBonus) != null ? _attacker$critDamageB : 0;
    var critRoll = (_bullet$critRoll = bullet.critRoll) != null ? _bullet$critRoll : Math.random();
    var isCrit = (_bullet$forceCrit = bullet.forceCrit) != null ? _bullet$forceCrit : critRoll < critRate;
    var critMultiplier = isCrit ? BASE_CRIT_MULTIPLIER * (1 + critDamageBonus) : 1;
    var reduction = armorReduction((_target$armor = target.armor) != null ? _target$armor : 0);
    var scale = trajectoryScale(bullet);
    var preMitigation = attack * skillCoeff * (1 + attackPercentBonus) * critMultiplier;
    var final = preMitigation * (1 - reduction) * scale;
    return {
      final,
      isCrit,
      critMultiplier,
      armorReduction: reduction,
      trajectoryScale: scale,
      preMitigation
    };
  }

  function applyBurn(current, next, now) {
    var _next$duration, _current$dps, _next$dps, _current$expiresAt, _ref, _next$sourceId;

    var duration = (_next$duration = next.duration) != null ? _next$duration : BURN_DURATION;
    var dps = Math.max((_current$dps = current == null ? void 0 : current.dps) != null ? _current$dps : 0, (_next$dps = next.dps) != null ? _next$dps : 0);
    var expiresAt = Math.max((_current$expiresAt = current == null ? void 0 : current.expiresAt) != null ? _current$expiresAt : 0, now + duration);
    return {
      stacks: 1,
      dps,
      expiresAt,
      sourceId: (_ref = (_next$sourceId = next.sourceId) != null ? _next$sourceId : current == null ? void 0 : current.sourceId) != null ? _ref : null
    };
  }

  function burnTick(burn, now) {
    if (!burn) return 0;
    return now < burn.expiresAt ? burn.dps : 0;
  }

  _export({
    armorReduction: armorReduction,
    trajectoryScale: trajectoryScale,
    calcDamage: calcDamage,
    applyBurn: applyBurn,
    burnTick: burnTick
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2bc93tAzGVCy4diCC9ZOW/J", "Damage", undefined);

      // 伤害结算纯函数：与 tech-validation/src/damage.js 保持同一实现。
      _export("ARMOR_CONSTANT", ARMOR_CONSTANT = 100);

      _export("BASE_CRIT_MULTIPLIER", BASE_CRIT_MULTIPLIER = 1.5);

      _export("BURN_DURATION", BURN_DURATION = 3);

      _export("PIERCE_FALLOFF", PIERCE_FALLOFF = [1, 0.85, 0.7, 0.55]);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=17e2818e820815c53bb05a8bf4846e29d27a1442.js.map