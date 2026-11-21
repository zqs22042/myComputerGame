System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Canvas, Color, Component, JsonAsset, Layers, Node, ResolutionPolicy, resources, UITransform, Vec3, view, CARD_RECTS, CHAR_BUY_RECT, CHAR_CLOSE_RECT, CHAR_OPTION_RECTS, CHAR_UPGRADE_RECT, CHAR_WEAPON_ICON, CLOSE_RECT, DESIGN_H, DESIGN_W, EXPORT_RECT, REFRESH_RECT, RESTART_RECT, SELL_RECT, SLOT_RECTS, UPGRADE_ICONS, WEAPON_OPTION_RECTS, inRect, screenToNormX, screenToNormY, BattleModel, Renderer, _dec, _class, _crd, ccclass, GameRoot;

  function _reportPossibleCrUseOfCARD_RECTS(extras) {
    _reporterNs.report("CARD_RECTS", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_BUY_RECT(extras) {
    _reporterNs.report("CHAR_BUY_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_CLOSE_RECT(extras) {
    _reporterNs.report("CHAR_CLOSE_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_OPTION_RECTS(extras) {
    _reporterNs.report("CHAR_OPTION_RECTS", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_UPGRADE_RECT(extras) {
    _reporterNs.report("CHAR_UPGRADE_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_WEAPON_ICON(extras) {
    _reporterNs.report("CHAR_WEAPON_ICON", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCLOSE_RECT(extras) {
    _reporterNs.report("CLOSE_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESIGN_H(extras) {
    _reporterNs.report("DESIGN_H", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESIGN_W(extras) {
    _reporterNs.report("DESIGN_W", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEXPORT_RECT(extras) {
    _reporterNs.report("EXPORT_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfREFRESH_RECT(extras) {
    _reporterNs.report("REFRESH_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRESTART_RECT(extras) {
    _reporterNs.report("RESTART_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSELL_RECT(extras) {
    _reporterNs.report("SELL_RECT", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSLOT_RECTS(extras) {
    _reporterNs.report("SLOT_RECTS", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUPGRADE_ICONS(extras) {
    _reporterNs.report("UPGRADE_ICONS", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWEAPON_OPTION_RECTS(extras) {
    _reporterNs.report("WEAPON_OPTION_RECTS", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfinRect(extras) {
    _reporterNs.report("inRect", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfscreenToNormX(extras) {
    _reporterNs.report("screenToNormX", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfscreenToNormY(extras) {
    _reporterNs.report("screenToNormY", "./game/Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleModel(extras) {
    _reporterNs.report("BattleModel", "./game/BattleModel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRenderer(extras) {
    _reporterNs.report("Renderer", "./game/Renderer", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Canvas = _cc.Canvas;
      Color = _cc.Color;
      Component = _cc.Component;
      JsonAsset = _cc.JsonAsset;
      Layers = _cc.Layers;
      Node = _cc.Node;
      ResolutionPolicy = _cc.ResolutionPolicy;
      resources = _cc.resources;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
      view = _cc.view;
    }, function (_unresolved_2) {
      CARD_RECTS = _unresolved_2.CARD_RECTS;
      CHAR_BUY_RECT = _unresolved_2.CHAR_BUY_RECT;
      CHAR_CLOSE_RECT = _unresolved_2.CHAR_CLOSE_RECT;
      CHAR_OPTION_RECTS = _unresolved_2.CHAR_OPTION_RECTS;
      CHAR_UPGRADE_RECT = _unresolved_2.CHAR_UPGRADE_RECT;
      CHAR_WEAPON_ICON = _unresolved_2.CHAR_WEAPON_ICON;
      CLOSE_RECT = _unresolved_2.CLOSE_RECT;
      DESIGN_H = _unresolved_2.DESIGN_H;
      DESIGN_W = _unresolved_2.DESIGN_W;
      EXPORT_RECT = _unresolved_2.EXPORT_RECT;
      REFRESH_RECT = _unresolved_2.REFRESH_RECT;
      RESTART_RECT = _unresolved_2.RESTART_RECT;
      SELL_RECT = _unresolved_2.SELL_RECT;
      SLOT_RECTS = _unresolved_2.SLOT_RECTS;
      UPGRADE_ICONS = _unresolved_2.UPGRADE_ICONS;
      WEAPON_OPTION_RECTS = _unresolved_2.WEAPON_OPTION_RECTS;
      inRect = _unresolved_2.inRect;
      screenToNormX = _unresolved_2.screenToNormX;
      screenToNormY = _unresolved_2.screenToNormY;
    }, function (_unresolved_3) {
      BattleModel = _unresolved_3.BattleModel;
    }, function (_unresolved_4) {
      Renderer = _unresolved_4.Renderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5917cmpEhVKjbZisfkvrEIH", "GameRoot", undefined); // Cocos 原型入口：运行时搭建 Canvas/相机/渲染层，加载 config.json 后进入可玩战斗。
      // 使用方式：新建场景 → 新建空节点 → 挂载 GameRoot → 运行预览。


      __checkObsolete__(['_decorator', 'Camera', 'Canvas', 'Color', 'Component', 'EventTouch', 'JsonAsset', 'Layers', 'Node', 'ResolutionPolicy', 'resources', 'UITransform', 'Vec3', 'view']);

      ({
        ccclass
      } = _decorator);

      _export("GameRoot", GameRoot = (_dec = ccclass('GameRoot'), _dec(_class = class GameRoot extends Component {
        constructor(...args) {
          super(...args);
          this.model = null;
          this.renderer = null;
          this.dragging = false;
          this.exportTimer = null;
        }

        onLoad() {
          var _this$node$getCompone;

          // 调试/验收钩子：暴露 GameRoot 实例供控制台只读检查（不影响玩法逻辑）
          if (typeof window !== 'undefined') {
            window.__duskSentry = this;
          }

          view.setDesignResolutionSize(_crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
            error: Error()
          }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
            error: Error()
          }), DESIGN_H) : DESIGN_H, ResolutionPolicy.SHOW_ALL);
          const ui = (_this$node$getCompone = this.node.getComponent(UITransform)) != null ? _this$node$getCompone : this.node.addComponent(UITransform);
          ui.setContentSize(_crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
            error: Error()
          }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
            error: Error()
          }), DESIGN_H) : DESIGN_H);
          this.node.layer = Layers.Enum.UI_2D;
          this.ensureCanvas();
          this.renderer = new (_crd && Renderer === void 0 ? (_reportPossibleCrUseOfRenderer({
            error: Error()
          }), Renderer) : Renderer)(this.node);
          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          resources.load('config', JsonAsset, (err, asset) => {
            var _asset$json, _this$renderer3;

            if (err || !asset) {
              var _this$renderer;

              (_this$renderer = this.renderer) == null || _this$renderer.showError(err ? err.message : 'config.json 为空');
              return;
            }

            const tables = (_asset$json = asset.json) == null ? void 0 : _asset$json.tables;

            if (!tables) {
              var _this$renderer2;

              (_this$renderer2 = this.renderer) == null || _this$renderer2.showError('config.json 缺少 tables');
              return;
            }

            this.model = new (_crd && BattleModel === void 0 ? (_reportPossibleCrUseOfBattleModel({
              error: Error()
            }), BattleModel) : BattleModel)(tables);
            this.model.start();
            console.log('[dusk-sentry] 原型就绪：拖动角色，点击底部图标选择升级');
            (_this$renderer3 = this.renderer) == null || _this$renderer3.draw(this.model);
          });
        }

        update(dt) {
          if (!this.model || !this.renderer) return; // 三选一、武器面板、角色武器面板期间完全暂停；结算后停止推进。

          if (!this.model.pendingUpgrade && !this.model.pendingWeaponSlot && !this.model.pendingCharWeaponPanel && !this.model.runOver) {
            this.model.update(Math.min(dt, 0.05));
          }

          this.renderer.draw(this.model);
        }

        ensureCanvas() {
          var _this$node$getCompone2;

          let parent = this.node.parent;
          let existing = null;

          while (parent) {
            existing = parent.getComponent(Canvas);
            if (existing) break;
            parent = parent.parent;
          }

          if (existing) return;
          const cameraNode = new Node('UICamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          this.node.addChild(cameraNode);
          const camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = (_crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
            error: Error()
          }), DESIGN_H) : DESIGN_H) / 2;
          camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
          camera.clearColor = new Color(11, 13, 20, 255);
          camera.visibility = Layers.Enum.UI_2D;
          camera.near = 1;
          camera.far = 4000;
          const canvas = (_this$node$getCompone2 = this.node.getComponent(Canvas)) != null ? _this$node$getCompone2 : this.node.addComponent(Canvas);
          canvas.cameraComponent = camera;
          canvas.alignCanvasWithScreen = true;
        }

        toLocal(event) {
          const ui = this.node.getComponent(UITransform);
          const location = event.getUILocation();
          const point = ui.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
          return {
            x: point.x,
            y: point.y
          };
        }

        onTouchStart(event) {
          const model = this.model;
          const renderer = this.renderer;
          if (!model || !renderer) return;
          const point = this.toLocal(event); // 结算页：只响应双按钮

          if (model.runOver) {
            this.dragging = false;

            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT)) {
              this.exportLog();
              return;
            }

            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT)) {
              this.clearExportTimer();
              renderer.exportState = 'idle';
              model.start();
              renderer.draw(model);
            }

            return;
          } // 三选一弹层：响应卡片与刷新


          if (model.pendingUpgrade) {
            const options = model.pendingUpgradeOptions;

            for (let i = 0; i < (_crd && CARD_RECTS === void 0 ? (_reportPossibleCrUseOfCARD_RECTS({
              error: Error()
            }), CARD_RECTS) : CARD_RECTS).length; i += 1) {
              if (options[i] && (_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
                error: Error()
              }), inRect) : inRect)(point.x, point.y, (_crd && CARD_RECTS === void 0 ? (_reportPossibleCrUseOfCARD_RECTS({
                error: Error()
              }), CARD_RECTS) : CARD_RECTS)[i])) {
                model.pickUpgrade(options[i].upgrade_id);
                renderer.draw(model);
                return;
              }
            }

            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT)) {
              model.refreshUpgradeOptions('coin');
              renderer.draw(model);
            }

            return;
          } // 武器购买面板：选武器 / 拆除 / 关闭


          const buyingSlot = model.pendingWeaponSlot;

          if (buyingSlot) {
            model.weaponTable.forEach((w, i) => {
              if ((_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
                error: Error()
              }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS)[i] && (_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
                error: Error()
              }), inRect) : inRect)(point.x, point.y, (_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
                error: Error()
              }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS)[i])) {
                model.buyWeapon(buyingSlot, w.weapon_id);
              }
            });
            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT)) model.sellWeapon(buyingSlot);else if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT)) model.closeWeaponPanel();
            renderer.draw(model);
            return;
          } // 角色武器面板：选武器 / 购买 / 升级 / 关闭


          if (model.pendingCharWeaponPanel) {
            const weaponIds = model.charWeaponIds;

            for (let i = 0; i < (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
              error: Error()
            }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS).length; i += 1) {
              if (weaponIds[i] && (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
                error: Error()
              }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS)[i] && (_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
                error: Error()
              }), inRect) : inRect)(point.x, point.y, (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
                error: Error()
              }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS)[i])) {
                model.selectCharWeapon(weaponIds[i]); // 已解锁→切换携带；未解锁→仅选中

                renderer.draw(model);
                return;
              }
            }

            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT)) model.buyCharWeapon(model.charWeaponSelected);else if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT)) model.upgradeCharWeapon(model.charWeaponSelected);else if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, _crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT)) model.closeCharWeaponPanel();
            renderer.draw(model);
            return;
          } // 左右武器槽：点开购买面板


          for (const slot of ['left', 'right']) {
            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, (_crd && SLOT_RECTS === void 0 ? (_reportPossibleCrUseOfSLOT_RECTS({
              error: Error()
            }), SLOT_RECTS) : SLOT_RECTS)[slot])) {
              model.openWeaponPanel(slot);
              renderer.draw(model);
              return;
            }
          } // 角色武器入口图标


          if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
            error: Error()
          }), inRect) : inRect)(point.x, point.y, _crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
            error: Error()
          }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON)) {
            model.openCharWeaponPanel();
            renderer.draw(model);
            return;
          } // 底部升级图标


          const lines = ['equipment', 'skill', 'ultimate'];

          for (const line of lines) {
            if ((_crd && inRect === void 0 ? (_reportPossibleCrUseOfinRect({
              error: Error()
            }), inRect) : inRect)(point.x, point.y, (_crd && UPGRADE_ICONS === void 0 ? (_reportPossibleCrUseOfUPGRADE_ICONS({
              error: Error()
            }), UPGRADE_ICONS) : UPGRADE_ICONS)[line])) {
              model.openUpgrade(line);
              renderer.draw(model);
              return;
            }
          } // 否则进入拖拽


          this.dragging = true;
          this.movePlayerFromScreen(point.x, point.y);
        }

        onTouchMove(event) {
          if (!this.dragging || !this.model) return;
          if (this.model.runOver || this.model.pendingUpgrade || this.model.pendingCharWeaponPanel) return;
          const point = this.toLocal(event);
          this.movePlayerFromScreen(point.x, point.y);
        }

        onTouchEnd() {
          this.dragging = false;
        }

        movePlayerFromScreen(sx, sy) {
          const model = this.model;
          if (!model) return;
          const nx = (_crd && screenToNormX === void 0 ? (_reportPossibleCrUseOfscreenToNormX({
            error: Error()
          }), screenToNormX) : screenToNormX)(sx);
          const ny = (_crd && screenToNormY === void 0 ? (_reportPossibleCrUseOfscreenToNormY({
            error: Error()
          }), screenToNormY) : screenToNormY)(sy);
          model.movePlayer(nx, ny);
        } // 导出本局日志：Web 下载 JSON，小游戏兜底复制到剪贴板。


        exportLog() {
          const model = this.model;
          const renderer = this.renderer;
          if (!model || !renderer) return; // 05-05 第五节：导出按钮本身打 log_export 事件

          const summary = model.getRunSummary();
          model.events.push({
            t: model.survivalSec,
            type: 'log_export',
            params: {
              result: summary.result,
              duration_sec: Math.round(summary.survival_time)
            }
          });
          const json = this.buildExportJson(model);
          const ok = this.downloadLog(json);
          renderer.exportState = ok ? 'exported' : 'failed';
          if (!ok) console.error('导出失败，已输出到控制台', json);
          this.scheduleExportReset();
          renderer.draw(model);
        }

        buildExportJson(model) {
          const summary = model.getRunSummary();
          const upgradesPicked = [];
          const weaponsBought = [];
          const refreshCount = {
            coin: 0,
            ad: 0
          };
          let goldSpent = 0;

          for (const ev of model.events) {
            if (ev.type === 'upgrade_pick') {
              var _ev$params, _ev$params$cost, _ev$params2;

              if ((_ev$params = ev.params) != null && _ev$params.upgrade_id) upgradesPicked.push(ev.params.upgrade_id);
              goldSpent += (_ev$params$cost = (_ev$params2 = ev.params) == null ? void 0 : _ev$params2.cost) != null ? _ev$params$cost : 0;
            } else if (ev.type === 'upgrade_refresh') {
              var _ev$params3;

              const method = (_ev$params3 = ev.params) == null ? void 0 : _ev$params3.method;

              if (method === 'coin') {
                refreshCount.coin += 1;
                goldSpent += 50;
              } else if (method === 'ad') refreshCount.ad += 1;
            } else if (ev.type === 'weapon_buy') {
              var _ev$params$cost_gold, _ev$params4, _ev$params5;

              const cost = (_ev$params$cost_gold = (_ev$params4 = ev.params) == null ? void 0 : _ev$params4.cost_gold) != null ? _ev$params$cost_gold : 0;
              goldSpent += cost;
              if (cost > 0 && (_ev$params5 = ev.params) != null && _ev$params5.weapon_id) weaponsBought.push(ev.params.weapon_id);
            } else if (ev.type === 'char_weapon_buy') {
              var _ev$params$cost_gold2, _ev$params6;

              // 埋点 05-02：char_weapon_buy
              goldSpent += (_ev$params$cost_gold2 = (_ev$params6 = ev.params) == null ? void 0 : _ev$params6.cost_gold) != null ? _ev$params$cost_gold2 : 0;
            } else if (ev.type === 'char_weapon_upgrade') {
              var _ev$params$cost_gold3, _ev$params7;

              // 埋点 05-02：char_weapon_upgrade
              goldSpent += (_ev$params$cost_gold3 = (_ev$params7 = ev.params) == null ? void 0 : _ev$params7.cost_gold) != null ? _ev$params$cost_gold3 : 0;
            }
          } // 05-05：gold_earned 只统计本局赚取，不再用“钱包余额 + 已花费”反推（会混入初始 50 金币）


          const goldEarned = summary.gold_earned; // 05-05 waves[]：按 wave_start 切分，聚合每波漏怪/击杀/金币/时长

          const waves = [];
          const waveStarts = model.events.filter(e => e.type === 'wave_start');

          for (let i = 0; i < waveStarts.length; i++) {
            var _ws$params, _ws$params2, _ws$params3, _next$params;

            const ws = waveStarts[i];
            const next = waveStarts[i + 1];
            const endT = next ? next.t : summary.survival_time;
            const inWave = model.events.filter(e => e.t >= ws.t && e.t < (next ? next.t : Infinity));
            const kills = inWave.filter(e => e.type === 'kill');
            waves.push({
              wave_index: (_ws$params = ws.params) == null ? void 0 : _ws$params.wave_index,
              cycle_index: (_ws$params2 = ws.params) == null ? void 0 : _ws$params2.cycle_index,
              hp_percent_start: (_ws$params3 = ws.params) == null ? void 0 : _ws$params3.hp_percent,
              hp_percent_end: next ? (_next$params = next.params) == null ? void 0 : _next$params.hp_percent : model.coreHp / model.coreMaxHp,
              leak_count: inWave.filter(e => e.type === 'leak').length,
              kill_count: kills.length,
              gold_earned: kills.reduce((a, e) => {
                var _e$params$gold_drop, _e$params;

                return a + ((_e$params$gold_drop = (_e$params = e.params) == null ? void 0 : _e$params.gold_drop) != null ? _e$params$gold_drop : 0);
              }, 0),
              duration_sec: +(endT - ws.t).toFixed(1)
            });
          }

          return JSON.stringify({
            meta: {
              version: '1.0',
              exported_at: new Date().toISOString(),
              result: summary.result,
              survival_time_sec: Math.round(summary.survival_time),
              cycle_index: summary.boss_kill_count,
              rng_seed: summary.rng_seed,
              client: 'cocos-prototype'
            },
            battle_summary: {
              kill_count: summary.kill_count,
              wave_index: summary.wave_index,
              core_hp_left: summary.core_hp_left,
              gold_earned: goldEarned,
              gold_spent: goldSpent,
              upgrades_picked: upgradesPicked,
              weapons_bought: weaponsBought,
              refresh_count: refreshCount
            },
            waves,
            events: model.events
          }, null, 2);
        }

        downloadLog(json) {
          const fileName = `battle_${this.timeStamp(new Date())}.json`;

          if (typeof document !== 'undefined') {
            try {
              const blob = new Blob([json], {
                type: 'application/json'
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => URL.revokeObjectURL(url), 1000);
              return true;
            } catch (err) {
              return false;
            }
          }

          const wx = globalThis.wx;

          if (wx && typeof wx.setClipboardData === 'function') {
            try {
              wx.setClipboardData({
                data: json
              });
              return true;
            } catch (err) {
              return false;
            }
          }

          return false;
        }

        timeStamp(date) {
          const pad = v => `${v}`.padStart(2, '0');

          return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` + `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
        }

        scheduleExportReset() {
          this.clearExportTimer();
          this.exportTimer = setTimeout(() => {
            this.exportTimer = null;
            if (this.renderer) this.renderer.exportState = 'idle';
          }, 2000);
        }

        clearExportTimer() {
          if (this.exportTimer === null) return;
          clearTimeout(this.exportTimer);
          this.exportTimer = null;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=41f8dc9e8580aba848dce4d95bafa6c2f67c65be.js.map