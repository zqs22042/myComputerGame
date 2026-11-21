System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BattleModelCore, BattleModel, _crd;

  function _reportPossibleCrUseOfBattleModelCore(extras) {
    _reporterNs.report("BattleModelCore", "../logic/battleModelCore", _context.meta, extras);
  }

  _export("BattleModel", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      BattleModelCore = _unresolved_2.BattleModelCore;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c8eb1JJCKxMWoK9pv6Abqrk", "BattleModel", undefined); // BattleModel.ts — Cocos 侧薄包装，逻辑全部委托 BattleModelCore
      // 纯逻辑由 tools/sync-logic.mjs 从 tech-validation 同步到 assets/scripts/logic。


      // 配置结构与 tech-validation 的 CSV 表集合一致。
      _export("BattleModel", BattleModel = class BattleModel {
        constructor(config) {
          this.core = void 0;
          this.core = new (_crd && BattleModelCore === void 0 ? (_reportPossibleCrUseOfBattleModelCore({
            error: Error()
          }), BattleModelCore) : BattleModelCore)(config);
        } // ---------- 渲染层只读状态 ----------


        get coreHp() {
          return this.core.core.hp;
        }

        get coreMaxHp() {
          return this.core.core.maxHp;
        }

        get player() {
          return this.core.player;
        }

        get playerZone() {
          return this.core.playerZone;
        }

        get path() {
          return this.core.path;
        }

        get monsters() {
          return this.core.monsters;
        }

        get boss() {
          return this.core.boss;
        }

        get bullets() {
          return this.core.bullets;
        }

        get gold() {
          return this.core.gold;
        }

        get survivalSec() {
          return this.core.survivalSec;
        }

        get waveIndex() {
          return this.core.waveIndex;
        }

        get cycleIndex() {
          return this.core.cycleIndex;
        }

        get killCount() {
          return this.core.killCount;
        }

        get waveState() {
          return this.core.waveState;
        }

        get hpTier() {
          return this.core.hpTier;
        }

        get softGrowth() {
          return this.core.softGrowth;
        }

        get effectiveAtkPct() {
          return this.core.effectiveAtkPct();
        }

        get effectiveAspdPct() {
          return this.core.effectiveAspdPct();
        }

        get pendingUpgrade() {
          return this.core.pendingUpgrade;
        }

        get pendingUpgradeOptions() {
          var _this$core$pendingUpg, _this$core$pendingUpg2;

          return (_this$core$pendingUpg = (_this$core$pendingUpg2 = this.core.pendingUpgrade) == null ? void 0 : _this$core$pendingUpg2.options) != null ? _this$core$pendingUpg : [];
        }

        get pendingUpgradeLine() {
          var _this$core$pendingUpg3, _this$core$pendingUpg4;

          return (_this$core$pendingUpg3 = (_this$core$pendingUpg4 = this.core.pendingUpgrade) == null ? void 0 : _this$core$pendingUpg4.line) != null ? _this$core$pendingUpg3 : null;
        }

        get upgradeState() {
          return this.core.upgradeState;
        }

        get bonuses() {
          return this.core.bonuses;
        }
        /** 该线当前最低可升级价格；全满级为 null */


        cheapestUpgradeCost(line) {
          return this.core.cheapestUpgradeCost(line);
        }
        /** 技能/大招冷却剩余秒数与释放特效 */


        get skillDef() {
          return this.core.activeSkill;
        }

        get ultimateDef() {
          return this.core.ultimateSkill;
        }

        get skillCdLeft() {
          return this.core.skillCdLeft;
        }

        get ultCdLeft() {
          return this.core.ultCdLeft;
        }

        get ultActive() {
          return this.core.isUltActive();
        }

        get fx() {
          return this.core.fx;
        }

        get runOver() {
          return this.core.runOver;
        }

        get events() {
          return this.core.events;
        }

        get weapons() {
          return this.core.weapons;
        }

        get weaponTable() {
          return this.core.weaponTable;
        }

        get pendingWeaponSlot() {
          return this.core.pendingWeaponSlot;
        } // ---------- 角色武器 ----------


        get charWeaponTable() {
          return this.core.charWeaponTable;
        }

        get charWeapons() {
          return this.core.charWeapons;
        }

        get currentCharWeapon() {
          return this.core.currentCharWeapon;
        }

        get charWeaponSelected() {
          return this.core.charWeaponSelected;
        }

        get pendingCharWeaponPanel() {
          return this.core.pendingCharWeaponPanel;
        }
        /** 角色武器 ID 列表（按表内出现顺序） */


        get charWeaponIds() {
          var ids = this.core.charWeaponTable.map(r => String(r.weapon_id)); // 不用 [...new Set()]：Cocos 降级转译会得到 [].concat(Set)，返回 Set 对象而不是 ID 数组

          return Array.from(new Set(ids));
        }
        /** 取某武器当前等級的属性行 */


        charWeaponRow(weaponId, level) {
          var _this$charWeapons$wea, _this$core$charWeapon;

          var lv = level != null ? level : (_this$charWeapons$wea = this.charWeapons[weaponId]) == null ? void 0 : _this$charWeapons$wea.level;
          return (_this$core$charWeapon = this.core.charWeaponTable.find(r => r.weapon_id === weaponId && r.level === lv)) != null ? _this$core$charWeapon : null;
        } // ---------- 生命周期 ----------


        start() {
          this.core.start();
        }

        reset() {
          this.core.reset();
        }

        update(dt) {
          this.core.update(dt);
        } // ---------- 操作 ----------


        movePlayer(x, y) {
          this.core.movePlayer(x, y);
        }

        openUpgrade(line) {
          return this.core.openUpgrade(line);
        }

        pickUpgrade(id) {
          this.core.pickUpgrade(id);
        }

        refreshUpgradeOptions(method) {
          this.core.refreshUpgradeOptions(method);
        } // ---------- 武器槽 ----------


        openWeaponPanel(slot) {
          return this.core.openWeaponPanel(slot);
        }

        closeWeaponPanel() {
          this.core.closeWeaponPanel();
        }

        buyWeapon(slot, weaponId) {
          return this.core.buyWeapon(slot, weaponId);
        }

        sellWeapon(slot) {
          return this.core.sellWeapon(slot);
        }

        weaponCost(slot) {
          return this.core.weaponCost(slot);
        } // ---------- 角色武器 ----------


        openCharWeaponPanel() {
          return this.core.openCharWeaponPanel();
        }

        closeCharWeaponPanel() {
          this.core.closeCharWeaponPanel();
        }

        selectCharWeapon(weaponId) {
          return this.core.selectCharWeapon(weaponId);
        }

        buyCharWeapon(weaponId) {
          return this.core.buyCharWeapon(weaponId);
        }

        upgradeCharWeapon(weaponId) {
          return this.core.upgradeCharWeapon(weaponId);
        }

        switchCharWeapon(weaponId) {
          return this.core.switchCharWeapon(weaponId);
        } // ---------- 结算 ----------


        getRunSummary() {
          return this.core.getRunSummary();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2de300834c2456c92f92306bdbd6f4fc41ace1ea.js.map