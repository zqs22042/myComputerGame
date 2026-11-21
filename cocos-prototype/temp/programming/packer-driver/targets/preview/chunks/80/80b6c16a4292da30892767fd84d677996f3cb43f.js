System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  // 可复现随机数（与 tech-validation 保持一致）
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function next() {
      a = a + 0x6d2b79f5 >>> 0;
      var t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  _export("mulberry32", mulberry32);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8638auXx89Kb696IIQNGoUG", "Rng", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=80b6c16a4292da30892767fd84d677996f3cb43f.js.map