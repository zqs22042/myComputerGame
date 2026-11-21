System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Pool, _crd;

  _export("Pool", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1c0b12Y+nBBJr/VRcrvnv0K", "Pool", undefined);

      // 对象池与实体 ID 规则（与 tech-validation/src/pool.js 一致）
      _export("Pool", Pool = class Pool {
        constructor(factory, initial) {
          if (initial === void 0) {
            initial = 0;
          }

          this.factory = void 0;
          this.free = [];
          this.created = 0;
          this.active = 0;
          this.factory = factory;

          for (var i = 0; i < initial; i += 1) this.free.push(this.create());
        }

        create() {
          this.created += 1;
          return this.factory();
        }

        acquire() {
          var _this$free$pop;

          var obj = (_this$free$pop = this.free.pop()) != null ? _this$free$pop : this.create();
          this.active += 1;
          return obj;
        }

        release(obj) {
          this.active -= 1;
          this.free.push(obj);
          return obj;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2a4c771219bb1efa55b5b5bd63daa177f2ca02c0.js.map