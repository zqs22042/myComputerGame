System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, Graphics, Label, Layers, Node, UITransform, BATTLE, BUY_PANEL, CARD_RECTS, CHAR_BUY_RECT, CHAR_CLOSE_RECT, CHAR_OPTION_RECTS, CHAR_PANEL, CHAR_UPGRADE_RECT, CHAR_WEAPON_ICON, CLOSE_RECT, CORE_POS, DEFENSE_LINE_Y, DESIGN_H, DESIGN_W, EXPORT_RECT, HALF_H, HALF_W, HUD, PLATFORM, REFRESH_RECT, RESTART_RECT, SELL_RECT, SLOT_POS, UPGRADE_ICONS, UPGRADE_LINE_LABEL, WEAPON_OPTION_RECTS, WIDEN_ZONE, mapX, mapY, Renderer, _crd, MONSTER_COLOR;

  function col(hex, alpha) {
    if (alpha === void 0) {
      alpha = 255;
    }

    var s = hex.replace('#', '');
    return new Color(parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16), alpha);
  }

  function _reportPossibleCrUseOfBATTLE(extras) {
    _reporterNs.report("BATTLE", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBUY_PANEL(extras) {
    _reporterNs.report("BUY_PANEL", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCARD_RECTS(extras) {
    _reporterNs.report("CARD_RECTS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_BUY_RECT(extras) {
    _reporterNs.report("CHAR_BUY_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_CLOSE_RECT(extras) {
    _reporterNs.report("CHAR_CLOSE_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_OPTION_RECTS(extras) {
    _reporterNs.report("CHAR_OPTION_RECTS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_PANEL(extras) {
    _reporterNs.report("CHAR_PANEL", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_UPGRADE_RECT(extras) {
    _reporterNs.report("CHAR_UPGRADE_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCHAR_WEAPON_ICON(extras) {
    _reporterNs.report("CHAR_WEAPON_ICON", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCLOSE_RECT(extras) {
    _reporterNs.report("CLOSE_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCORE_POS(extras) {
    _reporterNs.report("CORE_POS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDEFENSE_LINE_Y(extras) {
    _reporterNs.report("DEFENSE_LINE_Y", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESIGN_H(extras) {
    _reporterNs.report("DESIGN_H", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESIGN_W(extras) {
    _reporterNs.report("DESIGN_W", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEXPORT_RECT(extras) {
    _reporterNs.report("EXPORT_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHALF_H(extras) {
    _reporterNs.report("HALF_H", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHALF_W(extras) {
    _reporterNs.report("HALF_W", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHUD(extras) {
    _reporterNs.report("HUD", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPLATFORM(extras) {
    _reporterNs.report("PLATFORM", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfREFRESH_RECT(extras) {
    _reporterNs.report("REFRESH_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRESTART_RECT(extras) {
    _reporterNs.report("RESTART_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSELL_RECT(extras) {
    _reporterNs.report("SELL_RECT", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSLOT_POS(extras) {
    _reporterNs.report("SLOT_POS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUPGRADE_ICONS(extras) {
    _reporterNs.report("UPGRADE_ICONS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUPGRADE_LINE_LABEL(extras) {
    _reporterNs.report("UPGRADE_LINE_LABEL", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWEAPON_OPTION_RECTS(extras) {
    _reporterNs.report("WEAPON_OPTION_RECTS", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWIDEN_ZONE(extras) {
    _reporterNs.report("WIDEN_ZONE", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmapX(extras) {
    _reporterNs.report("mapX", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmapY(extras) {
    _reporterNs.report("mapY", "./Coords", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleModel(extras) {
    _reporterNs.report("BattleModel", "./BattleModel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUpgradeOption(extras) {
    _reporterNs.report("UpgradeOption", "./BattleModel", _context.meta, extras);
  }

  _export("Renderer", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      Graphics = _cc.Graphics;
      Label = _cc.Label;
      Layers = _cc.Layers;
      Node = _cc.Node;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      BATTLE = _unresolved_2.BATTLE;
      BUY_PANEL = _unresolved_2.BUY_PANEL;
      CARD_RECTS = _unresolved_2.CARD_RECTS;
      CHAR_BUY_RECT = _unresolved_2.CHAR_BUY_RECT;
      CHAR_CLOSE_RECT = _unresolved_2.CHAR_CLOSE_RECT;
      CHAR_OPTION_RECTS = _unresolved_2.CHAR_OPTION_RECTS;
      CHAR_PANEL = _unresolved_2.CHAR_PANEL;
      CHAR_UPGRADE_RECT = _unresolved_2.CHAR_UPGRADE_RECT;
      CHAR_WEAPON_ICON = _unresolved_2.CHAR_WEAPON_ICON;
      CLOSE_RECT = _unresolved_2.CLOSE_RECT;
      CORE_POS = _unresolved_2.CORE_POS;
      DEFENSE_LINE_Y = _unresolved_2.DEFENSE_LINE_Y;
      DESIGN_H = _unresolved_2.DESIGN_H;
      DESIGN_W = _unresolved_2.DESIGN_W;
      EXPORT_RECT = _unresolved_2.EXPORT_RECT;
      HALF_H = _unresolved_2.HALF_H;
      HALF_W = _unresolved_2.HALF_W;
      HUD = _unresolved_2.HUD;
      PLATFORM = _unresolved_2.PLATFORM;
      REFRESH_RECT = _unresolved_2.REFRESH_RECT;
      RESTART_RECT = _unresolved_2.RESTART_RECT;
      SELL_RECT = _unresolved_2.SELL_RECT;
      SLOT_POS = _unresolved_2.SLOT_POS;
      UPGRADE_ICONS = _unresolved_2.UPGRADE_ICONS;
      UPGRADE_LINE_LABEL = _unresolved_2.UPGRADE_LINE_LABEL;
      WEAPON_OPTION_RECTS = _unresolved_2.WEAPON_OPTION_RECTS;
      WIDEN_ZONE = _unresolved_2.WIDEN_ZONE;
      mapX = _unresolved_2.mapX;
      mapY = _unresolved_2.mapY;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dc86e+/d3RNeJAw5m+rwiMk", "Renderer", undefined); // 渲染层：色块地图、HUD、升级图标、三选一弹层与结算页（全部运行时创建，无需预制体）。
      // 模型坐标均为归一化 (0-1)，渲染时用 mapX/mapY 转为屏幕坐标。


      __checkObsolete__(['Color', 'Graphics', 'Label', 'Layers', 'Node', 'UITransform']);

      MONSTER_COLOR = {
        M01: '#e05b5b',
        M02: '#c79a4a',
        M03: '#6fb3e0',
        M04: '#e08a3a',
        M05: '#a060c0',
        M06: '#ff4d6d'
      };

      _export("Renderer", Renderer = class Renderer {
        constructor(root) {
          this.bg = void 0;
          this.world = void 0;
          this.hud = void 0;
          this.overlay = void 0;
          this.waveLabel = void 0;
          this.goldLabel = void 0;
          this.coreLabel = void 0;
          this.cycleLabel = void 0;
          this.timerLabel = void 0;
          this.hintLabel = void 0;
          this.cardLabels = [];
          this.refreshLabel = void 0;
          this.iconLabels = [];
          this.charIconLabel = void 0;
          // 角色武器面板
          this.charTitleLabel = void 0;
          this.charOptionLabels = [];
          this.charBuyLabel = void 0;
          this.charUpgradeLabel = void 0;
          this.charCloseLabel = void 0;
          // 武器槽与购买面板
          this.defenseLabel = void 0;
          this.slotLabels = [];
          this.buyTitleLabel = void 0;
          this.weaponLabels = [];
          this.sellLabel = void 0;
          this.closeLabel = void 0;
          this.titleLabel = void 0;
          this.bodyLabel = void 0;
          this.restartLabel = void 0;
          this.exportLabel = void 0;
          // 导出按钮状态：idle 常态，exported 已导出（2 秒），failed 导出失败（2 秒）。
          this.exportState = 'idle';
          this.root = root;
          this.bg = this.graphics('bg');
          this.world = this.graphics('world');
          this.hud = this.graphics('hud');
          this.waveLabel = this.label('wave', 24, 330, 40, Label.HorizontalAlign.LEFT);
          this.goldLabel = this.label('gold', 26, 180, 40, Label.HorizontalAlign.RIGHT);
          this.coreLabel = this.label('core', 22, 440, 34);
          this.cycleLabel = this.label('cycle', 22, 440, 30);
          this.timerLabel = this.label('timer', 20, 760, 34);
          this.hintLabel = this.label('hint', 20, 700, 30);
          this.waveLabel.node.setPosition((_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).waveX, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).waveY);
          this.goldLabel.node.setPosition((_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).goldX, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).goldY);
          this.coreLabel.node.setPosition(0, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).coreY);
          this.cycleLabel.node.setPosition(0, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).cycleY);
          this.timerLabel.node.setPosition(0, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).timerY);
          this.hintLabel.node.setPosition(0, -660); // 底部三个升级图标标签

          var lines = ['equipment', 'skill', 'ultimate'];

          for (var line of lines) {
            var rect = (_crd && UPGRADE_ICONS === void 0 ? (_reportPossibleCrUseOfUPGRADE_ICONS({
              error: Error()
            }), UPGRADE_ICONS) : UPGRADE_ICONS)[line];
            var label = this.label("icon-" + line, 20, rect.w, rect.h);
            label.node.setPosition(rect.x, rect.y);
            this.iconLabels.push(label);
          } // 第 4 个图标：角色武器入口


          this.charIconLabel = this.label('icon-char-weapon', 20, (_crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
            error: Error()
          }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON).w, (_crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
            error: Error()
          }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON).h);
          this.charIconLabel.node.setPosition((_crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
            error: Error()
          }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON).x, (_crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
            error: Error()
          }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON).y); // 角色武器面板

          this.charTitleLabel = this.label('char-title', 26, 520, 50);
          this.charTitleLabel.node.setPosition(0, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
            error: Error()
          }), CHAR_PANEL) : CHAR_PANEL).y + (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
            error: Error()
          }), CHAR_PANEL) : CHAR_PANEL).h / 2 - 55);

          for (var i = 0; i < (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
            error: Error()
          }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS).length; i += 1) {
            var _label = this.label("char-opt-" + i, 17, 270, 160);

            _label.node.setPosition((_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
              error: Error()
            }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS)[i].x, (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
              error: Error()
            }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS)[i].y);

            this.charOptionLabels.push(_label);
          }

          this.charBuyLabel = this.label('char-buy', 20, 230, 70);
          this.charBuyLabel.node.setPosition((_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
            error: Error()
          }), CHAR_BUY_RECT) : CHAR_BUY_RECT).x, (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
            error: Error()
          }), CHAR_BUY_RECT) : CHAR_BUY_RECT).y);
          this.charUpgradeLabel = this.label('char-upgrade', 20, 230, 70);
          this.charUpgradeLabel.node.setPosition((_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
            error: Error()
          }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).x, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
            error: Error()
          }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).y);
          this.charCloseLabel = this.label('char-close', 22, 460, 60);
          this.charCloseLabel.node.setPosition((_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
            error: Error()
          }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).x, (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
            error: Error()
          }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).y);
          this.charCloseLabel.string = '关闭';
          this.charCloseLabel.color = col('#cfe3ff'); // 三选一弹层

          this.overlay = this.graphics('overlay'); // 防线标注与左右武器槽文本

          this.defenseLabel = this.label('defense', 20, 140, 30);
          this.defenseLabel.node.setPosition((_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)(0.18), (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)(_crd && DEFENSE_LINE_Y === void 0 ? (_reportPossibleCrUseOfDEFENSE_LINE_Y({
            error: Error()
          }), DEFENSE_LINE_Y) : DEFENSE_LINE_Y) + 22);
          this.defenseLabel.string = '防 线';
          this.defenseLabel.color = col('#ff8fa3');
          var slots = ['left', 'right'];

          for (var slot of slots) {
            var _label2 = this.label("slot-" + slot, 18, 150, 54);

            _label2.node.setPosition((_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)((_crd && SLOT_POS === void 0 ? (_reportPossibleCrUseOfSLOT_POS({
              error: Error()
            }), SLOT_POS) : SLOT_POS)[slot].x), (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)((_crd && SLOT_POS === void 0 ? (_reportPossibleCrUseOfSLOT_POS({
              error: Error()
            }), SLOT_POS) : SLOT_POS)[slot].y) - 72);

            this.slotLabels.push(_label2);
          } // 武器购买面板


          this.buyTitleLabel = this.label('buy-title', 26, 520, 50);
          this.buyTitleLabel.node.setPosition(0, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
            error: Error()
          }), BUY_PANEL) : BUY_PANEL).y + (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
            error: Error()
          }), BUY_PANEL) : BUY_PANEL).h / 2 - 60);

          for (var _i = 0; _i < (_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
            error: Error()
          }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS).length; _i += 1) {
            var _label3 = this.label("weapon-" + _i, 18, 470, 110);

            _label3.node.setPosition((_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
              error: Error()
            }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS)[_i].x, (_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
              error: Error()
            }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS)[_i].y);

            this.weaponLabels.push(_label3);
          }

          this.sellLabel = this.label('sell', 22, 210, 70);
          this.sellLabel.node.setPosition((_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
            error: Error()
          }), SELL_RECT) : SELL_RECT).x, (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
            error: Error()
          }), SELL_RECT) : SELL_RECT).y);
          this.closeLabel = this.label('close', 22, 210, 70);
          this.closeLabel.node.setPosition((_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
            error: Error()
          }), CLOSE_RECT) : CLOSE_RECT).x, (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
            error: Error()
          }), CLOSE_RECT) : CLOSE_RECT).y);

          for (var _i2 = 0; _i2 < 3; _i2 += 1) {
            var _label4 = this.label("card-" + _i2, 20, 178, 380);

            _label4.node.setPosition((_crd && CARD_RECTS === void 0 ? (_reportPossibleCrUseOfCARD_RECTS({
              error: Error()
            }), CARD_RECTS) : CARD_RECTS)[_i2].x, (_crd && CARD_RECTS === void 0 ? (_reportPossibleCrUseOfCARD_RECTS({
              error: Error()
            }), CARD_RECTS) : CARD_RECTS)[_i2].y);

            this.cardLabels.push(_label4);
          }

          this.refreshLabel = this.label('refresh', 24, 260, 50);
          this.refreshLabel.node.setPosition(0, (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
            error: Error()
          }), REFRESH_RECT) : REFRESH_RECT).y); // 结算页

          this.titleLabel = this.label('title', 34, 620, 60);
          this.titleLabel.node.setPosition(0, 330);
          this.bodyLabel = this.label('body', 22, 560, 380);
          this.bodyLabel.node.setPosition(0, 30);
          this.restartLabel = this.label('restart', 22, 230, 84);
          this.restartLabel.node.setPosition((_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
            error: Error()
          }), RESTART_RECT) : RESTART_RECT).x, (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
            error: Error()
          }), RESTART_RECT) : RESTART_RECT).y);
          this.exportLabel = this.label('export', 22, 230, 84);
          this.exportLabel.node.setPosition((_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
            error: Error()
          }), EXPORT_RECT) : EXPORT_RECT).x, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
            error: Error()
          }), EXPORT_RECT) : EXPORT_RECT).y);
          this.drawBackground();
        }

        makeNode(name) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform);
          this.root.addChild(node);
          return node;
        }

        graphics(name) {
          return this.makeNode(name).addComponent(Graphics);
        }

        label(name, size, width, height, align) {
          if (align === void 0) {
            align = Label.HorizontalAlign.CENTER;
          }

          var node = this.makeNode(name);
          node.getComponent(UITransform).setContentSize(width, height);
          var label = node.addComponent(Label);
          label.fontSize = size;
          label.lineHeight = Math.round(size * 1.3);
          label.horizontalAlign = align;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          label.color = col('#e6ecf5');
          return label;
        }

        drawBackground() {
          var g = this.bg;
          g.fillColor = col('#0d1018');
          g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
            error: Error()
          }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
            error: Error()
          }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
            error: Error()
          }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
            error: Error()
          }), DESIGN_H) : DESIGN_H);
          g.fill();
          g.fillColor = col('#161d2a');
          g.roundRect((_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).left - 12, (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).bottom - 12, (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).right - (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).left + 24, (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).top - (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).bottom + 24, 18);
          g.fill();
          g.fillColor = col('#1b2331');
          g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
            error: Error()
          }), HALF_W) : HALF_W), (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).top + 14, _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
            error: Error()
          }), DESIGN_W) : DESIGN_W, (_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
            error: Error()
          }), HALF_H) : HALF_H) - (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).top - 14);
          g.fill();
          g.fillColor = col('#0f1420');
          g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
            error: Error()
          }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
            error: Error()
          }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
            error: Error()
          }), DESIGN_W) : DESIGN_W, (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).bottom + (_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
            error: Error()
          }), HALF_H) : HALF_H) - 12);
          g.fill();
        }

        showError(message) {
          this.hintLabel.string = "\u52A0\u8F7D\u5931\u8D25\uFF1A" + message;
          this.hintLabel.color = col('#ff7b7b');
        }

        draw(model) {
          this.updateLabels(model);
          this.drawWorld(model);
          this.drawOverlay(model);
        } // ---------- HUD 文本 ----------


        updateLabels(model) {
          this.waveLabel.string = "\u6CE2\u6B21 " + model.waveIndex + " \xB7 \u5FAA\u73AF " + model.cycleIndex + " \xB7 \u6863\u4F4D " + (model.hpTier + 1);
          this.goldLabel.string = "\u91D1\u5E01 " + model.gold;
          this.coreLabel.string = "\u6838\u5FC3 " + Math.max(0, Math.ceil(model.coreHp)) + " / " + model.coreMaxHp;
          this.cycleLabel.string = "\u5FAA\u73AF " + model.cycleIndex;
          var soft = model.softGrowth;
          var softText = soft.gold > 0 ? " \xB7 \u8F6F\u6210\u957F \u4F24\u5BB3+" + (soft.dmgPct * 100).toFixed(0) + "% \u5C04\u901F+" + (soft.aspdPct * 100).toFixed(0) + "%" : '';
          this.timerLabel.string = "\u5B58\u6D3B " + model.survivalSec.toFixed(1) + "s \xB7 \u51FB\u6740 " + model.killCount + softText; // 技能/大招状态放进现有提示行，不新增布局

          var skillTxt = model.skillDef ? "\u6280\u80FD " + (model.skillCdLeft <= 0 ? '就绪' : Math.ceil(model.skillCdLeft) + "s") : '';
          var ultTxt = model.ultimateDef ? "\u5927\u62DB " + (model.ultActive ? '爆发中' : model.ultCdLeft <= 0 ? '就绪' : Math.ceil(model.ultCdLeft) + "s") : '';
          var cdText = [skillTxt, ultTxt].filter(Boolean).join(' · ');
          this.hintLabel.string = (cdText ? cdText + " \xB7 " : '') + "\u62D6\u52A8\u89D2\u8272\u79FB\u52A8 \xB7 \u6EE1\u7EA7\u540E\u591A\u4F59\u91D1\u5E01\u8F6C\u8F6F\u6210\u957F";
          var cardsOpen = model.pendingUpgrade !== null;
          var charOpen = model.pendingCharWeaponPanel;
          var buyingSlot = model.pendingWeaponSlot !== null;
          var showResult = model.runOver; // 升级图标

          var lines = ['equipment', 'skill', 'ultimate'];
          lines.forEach((line, i) => {
            var _model$upgradeState$l;

            var state = (_model$upgradeState$l = model.upgradeState[line]) != null ? _model$upgradeState$l : {};
            var totalLevels = Object.values(state).reduce((s, v) => s + (v || 0), 0);
            var minCost = model.cheapestUpgradeCost(line);
            var affordable = minCost !== null && model.gold >= minCost;
            var stateText = minCost === null ? 'MAX' : affordable ? '可升' : minCost + "\u91D1";
            this.iconLabels[i].string = (_crd && UPGRADE_LINE_LABEL === void 0 ? (_reportPossibleCrUseOfUPGRADE_LINE_LABEL({
              error: Error()
            }), UPGRADE_LINE_LABEL) : UPGRADE_LINE_LABEL)[line] + "\nLv " + totalLevels + " \xB7 " + stateText;
            this.iconLabels[i].color = col(affordable ? '#ffd479' : minCost === null ? '#5a6577' : '#8a93a3');
            this.iconLabels[i].node.active = !showResult && !charOpen && !buyingSlot;
          }); // 角色武器入口图标：显示当前携带武器与等级

          {
            var _st$level;

            var cur = model.charWeaponRow(model.currentCharWeapon);
            var st = model.charWeapons[model.currentCharWeapon];
            this.charIconLabel.string = cur ? "\u6B66\u5668\n" + cur.name + "\nLv " + ((_st$level = st == null ? void 0 : st.level) != null ? _st$level : 1) : '武器';
            this.charIconLabel.color = col('#ffd479');
            this.charIconLabel.node.active = !showResult && !charOpen && !buyingSlot;
          } // 武器槽文本：空槽显示最低价，已放置显示武器名

          var cheapest = model.weaponTable.reduce((a, b) => !a || b.cost_gold < a.cost_gold ? b : a, null);
          ['left', 'right'].forEach((slot, i) => {
            var state = model.weapons.find(w => w.slot === slot);
            var def = state != null && state.weaponId ? model.weaponTable.find(w => w.weapon_id === state.weaponId) : null;
            this.slotLabels[i].string = def ? def.name : "\u7A7A\u69FD\n" + (cheapest ? cheapest.cost_gold : 0) + " \u91D1\u8D77";
            this.slotLabels[i].color = col(def ? '#ffd479' : '#7f8ea3');
            this.slotLabels[i].node.active = !showResult && !cardsOpen && !charOpen && model.pendingWeaponSlot === null;
          }); // 武器购买面板

          var buying = model.pendingWeaponSlot !== null && !showResult;
          this.buyTitleLabel.node.active = buying;
          this.sellLabel.node.active = buying;
          this.closeLabel.node.active = buying; // 关闭面板时必须整组隐藏，否则武器列表文字会残留在屏幕上

          for (var label of this.weaponLabels) label.node.active = buying;

          if (buying) {
            var slot = model.pendingWeaponSlot;
            var state = model.weapons.find(w => w.slot === slot);
            var current = state != null && state.weaponId ? model.weaponTable.find(w => w.weapon_id === state.weaponId) : null;
            this.buyTitleLabel.string = "\u6B66\u5668\u90E8\u7F72\u533A \xB7 " + (slot === 'left' ? '左' : '右');
            this.buyTitleLabel.color = col('#cfe3ff');
            model.weaponTable.forEach((w, i) => {
              if (i >= this.weaponLabels.length) return;
              var cost = w.cost_gold - model.weaponCost(slot);
              var equipped = current && current.weapon_id === w.weapon_id;
              this.weaponLabels[i].string = "" + w.name + (equipped ? '（已装备）' : '') + "\n" + ("\u4F24\u5BB3 " + w.damage + " \xD7 " + w.pellets + " \u5F39 \xB7 \u95F4\u9694 " + w.fire_interval + "s \xB7 \u5C04\u7A0B " + w.range + "\n") + ("\u4EF7\u683C " + cost + " \u91D1");
              this.weaponLabels[i].color = col(model.gold >= cost && !equipped ? '#ffffff' : '#8a93a3');
              this.weaponLabels[i].node.active = true;
            });

            for (var i = model.weaponTable.length; i < this.weaponLabels.length; i += 1) {
              this.weaponLabels[i].node.active = false;
            }

            this.sellLabel.string = current ? "\u62C6\u9664 +" + Math.floor(current.cost_gold * 0.5) + " \u91D1" : '空槽不可拆除';
            this.sellLabel.color = col(current ? '#ffd479' : '#5a6577');
            this.closeLabel.string = '关闭';
            this.closeLabel.color = col('#cfe3ff');
          } // 三选一弹层


          for (var _label5 of this.cardLabels) _label5.node.active = cardsOpen && !showResult;

          this.refreshLabel.node.active = cardsOpen && !showResult;

          if (cardsOpen && !showResult) {
            var options = model.pendingUpgradeOptions;
            options.forEach((opt, i) => {
              this.cardLabels[i].string = opt.name + "\n\n" + opt.effect_desc + "\n\n\u2192 Lv." + opt.nextLevel + "\n" + opt.cost_gold + " \u91D1\u5E01";
              this.cardLabels[i].color = col(model.gold >= opt.cost_gold ? '#ffffff' : '#9aa4b2');
              this.cardLabels[i].node.active = true;
            });

            for (var _i3 = options.length; _i3 < 3; _i3 += 1) this.cardLabels[_i3].node.active = false;

            var canRefresh = model.gold >= 50;
            this.refreshLabel.string = "\u5237\u65B0 (50 \u91D1\u5E01)";
            this.refreshLabel.color = col(canRefresh ? '#9fd0ff' : '#5a6577');
          } // 角色武器面板


          this.charTitleLabel.node.active = charOpen && !showResult;

          for (var _label6 of this.charOptionLabels) _label6.node.active = charOpen && !showResult;

          this.charBuyLabel.node.active = charOpen && !showResult;
          this.charUpgradeLabel.node.active = charOpen && !showResult;
          this.charCloseLabel.node.active = charOpen && !showResult;

          if (charOpen && !showResult) {
            var _model$charWeaponRow$, _model$charWeaponRow, _model$charWeaponRow$2, _model$charWeaponRow2, _selState$level, _selRow$upgrade_cost_, _selState$level2, _selRow$upgrade_cost_2, _selState$level3;

            this.charTitleLabel.string = '角色武器';
            this.charTitleLabel.color = col('#cfe3ff');
            var weaponIds = model.charWeaponIds;
            var sel = model.charWeaponSelected;
            weaponIds.forEach((id, i) => {
              var _st$level2, _st$level3;

              if (i >= this.charOptionLabels.length) return;
              var st = model.charWeapons[id];
              var lv1 = model.charWeaponRow(id, 1);
              var row = model.charWeaponRow(id, (_st$level2 = st == null ? void 0 : st.level) != null ? _st$level2 : 1);
              if (!lv1 || !row) return;
              var carrying = model.currentCharWeapon === id;
              var maxed = ((_st$level3 = st == null ? void 0 : st.level) != null ? _st$level3 : 1) >= 4;
              var stateText = st != null && st.owned ? "Lv " + st.level + (maxed ? ' · MAX' : '') + (carrying ? ' · 携带中' : '') : "\u672A\u89E3\u9501 \xB7 " + lv1.unlock_cost_gold + " \u91D1";
              this.charOptionLabels[i].string = "" + lv1.name + (st != null && st.owned ? '' : ' 🔒') + "\n" + ("\u4F24\u5BB3 " + row.damage + " \xB7 " + row.pellets + " \u53D1 \xB7 \u95F4\u9694 " + row.fire_interval + "s\n") + stateText; // 当前携带武器高亮（绿色）；未解锁置灰；已解锁白色

              this.charOptionLabels[i].color = col(carrying ? '#7be39a' : st != null && st.owned ? '#e6ecf5' : '#6b7688');
            }); // 购买按钮：选中未解锁武器时可用

            var selState = model.charWeapons[sel];
            var canBuy = selState && !selState.owned && model.gold >= ((_model$charWeaponRow$ = (_model$charWeaponRow = model.charWeaponRow(sel, 1)) == null ? void 0 : _model$charWeaponRow.unlock_cost_gold) != null ? _model$charWeaponRow$ : 0);
            this.charBuyLabel.string = selState && !selState.owned ? "\u8D2D\u4E70 " + ((_model$charWeaponRow$2 = (_model$charWeaponRow2 = model.charWeaponRow(sel, 1)) == null ? void 0 : _model$charWeaponRow2.unlock_cost_gold) != null ? _model$charWeaponRow$2 : 0) + " \u91D1" : '已解锁';
            this.charBuyLabel.color = col(canBuy ? '#ffd479' : '#5a6577'); // 升级按钮：选中已解锁武器且未满级、金币足够时可用；满级显示 MAX

            var selRow = model.charWeaponRow(sel);
            var canUpgrade = (selState == null ? void 0 : selState.owned) && ((_selState$level = selState.level) != null ? _selState$level : 1) < 4 && model.gold >= ((_selRow$upgrade_cost_ = selRow == null ? void 0 : selRow.upgrade_cost_gold) != null ? _selRow$upgrade_cost_ : 0);
            this.charUpgradeLabel.string = !(selState != null && selState.owned) ? '未解锁' : ((_selState$level2 = selState.level) != null ? _selState$level2 : 1) >= 4 ? 'MAX' : "\u5347\u7EA7 " + ((_selRow$upgrade_cost_2 = selRow == null ? void 0 : selRow.upgrade_cost_gold) != null ? _selRow$upgrade_cost_2 : 0) + " \u91D1";
            this.charUpgradeLabel.color = col(canUpgrade ? '#7be39a' : selState != null && selState.owned && ((_selState$level3 = selState.level) != null ? _selState$level3 : 1) >= 4 ? '#ffd479' : '#5a6577');
          } // 结算页


          this.titleLabel.node.active = showResult;
          this.bodyLabel.node.active = showResult;
          this.restartLabel.node.active = showResult;
          this.exportLabel.node.active = showResult;

          if (showResult) {
            var s = model.getRunSummary();
            this.titleLabel.string = '核心失守';
            this.titleLabel.color = col('#ff7b7b');
            this.bodyLabel.string = "\u5B58\u6D3B " + s.survival_time.toFixed(1) + "s\n\u5FAA\u73AF " + s.cycle_index + "\n\u6CE2\u6B21 " + s.wave_index + "\n" + ("\u51FB\u6740 " + s.kill_count + "\n\u6838\u5FC3\u5269\u4F59 " + s.core_hp_left);
            this.restartLabel.string = '再来一局';
            this.restartLabel.color = col('#c8f0d8');
            this.exportLabel.string = this.exportState === 'exported' ? '已导出' : this.exportState === 'failed' ? '导出失败' : '导出本局日志';
            this.exportLabel.color = col(this.exportState === 'idle' ? '#cfe3ff' : '#6b7484');
          }
        } // ---------- 世界渲染 ----------


        drawWorld(model) {
          var _beamColor$model$curr, _model$charWeapons$mo, _model$charWeapons$mo2;

          var g = this.world;
          g.clear(); // 站位区石台

          var platX = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)((_crd && PLATFORM === void 0 ? (_reportPossibleCrUseOfPLATFORM({
            error: Error()
          }), PLATFORM) : PLATFORM).xMin);
          var platW = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)((_crd && PLATFORM === void 0 ? (_reportPossibleCrUseOfPLATFORM({
            error: Error()
          }), PLATFORM) : PLATFORM).xMax) - platX;
          var platY = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)((_crd && PLATFORM === void 0 ? (_reportPossibleCrUseOfPLATFORM({
            error: Error()
          }), PLATFORM) : PLATFORM).yMin);
          var platH = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)((_crd && PLATFORM === void 0 ? (_reportPossibleCrUseOfPLATFORM({
            error: Error()
          }), PLATFORM) : PLATFORM).yMax) - platY;
          g.fillColor = col('#2a2f39');
          g.roundRect(platX, platY, platW, platH, 16);
          g.fill();
          g.lineWidth = 3;
          g.strokeColor = col('#55606f');
          g.roundRect(platX, platY, platW, platH, 16);
          g.stroke(); // 纵向路径：窄通道 + 临近防线的加宽段

          var half = 0.08 * ((_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).right - (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).left); // 屏宽约 16%

          var yTop = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)(1.0);
          var yWideTop = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)((_crd && WIDEN_ZONE === void 0 ? (_reportPossibleCrUseOfWIDEN_ZONE({
            error: Error()
          }), WIDEN_ZONE) : WIDEN_ZONE).yMax);
          var yWideBot = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)((_crd && WIDEN_ZONE === void 0 ? (_reportPossibleCrUseOfWIDEN_ZONE({
            error: Error()
          }), WIDEN_ZONE) : WIDEN_ZONE).yMin);
          var wideL = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)((_crd && WIDEN_ZONE === void 0 ? (_reportPossibleCrUseOfWIDEN_ZONE({
            error: Error()
          }), WIDEN_ZONE) : WIDEN_ZONE).xMin);
          var wideR = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)((_crd && WIDEN_ZONE === void 0 ? (_reportPossibleCrUseOfWIDEN_ZONE({
            error: Error()
          }), WIDEN_ZONE) : WIDEN_ZONE).xMax);

          var tracePath = () => {
            g.moveTo(-half, yTop);
            g.lineTo(half, yTop);
            g.lineTo(half, yWideTop);
            g.lineTo(wideR, yWideBot);
            g.lineTo(wideL, yWideBot);
            g.lineTo(-half, yWideTop);
            g.close();
          };

          g.fillColor = col('#463a2a');
          tracePath();
          g.fill();
          g.lineWidth = 3;
          g.strokeColor = col('#7a6647');
          tracePath();
          g.stroke(); // 防线：横跨战场的红线

          var lineY = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)(_crd && DEFENSE_LINE_Y === void 0 ? (_reportPossibleCrUseOfDEFENSE_LINE_Y({
            error: Error()
          }), DEFENSE_LINE_Y) : DEFENSE_LINE_Y);
          var lineL = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)(0.12);
          var lineR = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)(0.88);
          g.lineWidth = 14;
          g.strokeColor = col('#ff4d6d', 45);
          g.moveTo(lineL, lineY);
          g.lineTo(lineR, lineY);
          g.stroke();
          g.lineWidth = 5;
          g.strokeColor = col('#ff4d6d', 235);
          g.moveTo(lineL, lineY);
          g.lineTo(lineR, lineY);
          g.stroke(); // 人物活动区：缩小后的蓝色矩形，角色只能在此移动

          var z = model.playerZone;

          if (z) {
            var zx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(z.x_min);
            var zw = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(z.x_max) - zx;
            var zy = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(z.y_min);
            var zh = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(z.y_max) - zy;
            g.fillColor = col('#1f3a5f', 110);
            g.roundRect(zx, zy, zw, zh, 14);
            g.fill();
            g.lineWidth = 2;
            g.strokeColor = col('#3f7fc4', 190);
            g.roundRect(zx, zy, zw, zh, 14);
            g.stroke();
          } // 我方核心（站位区中央）


          var cx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)((_crd && CORE_POS === void 0 ? (_reportPossibleCrUseOfCORE_POS({
            error: Error()
          }), CORE_POS) : CORE_POS).x);
          var cy = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)((_crd && CORE_POS === void 0 ? (_reportPossibleCrUseOfCORE_POS({
            error: Error()
          }), CORE_POS) : CORE_POS).y);
          var ratio = model.coreHp / model.coreMaxHp;
          var coreColor = ratio > 0.6 ? '#59d998' : ratio > 0.3 ? '#e0c05a' : '#e05b5b';
          g.fillColor = col('#5ac8ff', 40);
          g.circle(cx, cy, 52);
          g.fill();
          g.fillColor = col('#5ac8ff', 80);
          g.circle(cx, cy, 42);
          g.fill();
          g.fillColor = col(coreColor);
          g.circle(cx, cy, 30);
          g.fill();
          g.lineWidth = 3;
          g.strokeColor = col('#d9f7ff');
          g.circle(cx, cy, 36);
          g.stroke(); // 左右武器槽

          var WEAPON_COLOR = {
            W01: '#8fd0ff',
            W02: '#ffb020',
            W03: '#a0e07a'
          };

          for (var state of model.weapons) {
            var pos = (_crd && SLOT_POS === void 0 ? (_reportPossibleCrUseOfSLOT_POS({
              error: Error()
            }), SLOT_POS) : SLOT_POS)[state.slot];
            var sx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(pos.x);
            var sy = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(pos.y);

            if (state.weaponId) {
              var _WEAPON_COLOR$state$w, _WEAPON_COLOR$state$w2;

              g.fillColor = col((_WEAPON_COLOR$state$w = WEAPON_COLOR[state.weaponId]) != null ? _WEAPON_COLOR$state$w : '#8fd0ff', 70);
              g.circle(sx, sy, 40);
              g.fill();
              g.fillColor = col((_WEAPON_COLOR$state$w2 = WEAPON_COLOR[state.weaponId]) != null ? _WEAPON_COLOR$state$w2 : '#8fd0ff');
              g.circle(sx, sy, 26);
              g.fill();
              g.lineWidth = 3;
              g.strokeColor = col('#ffe9b0');
              g.circle(sx, sy, 33);
              g.stroke();
            } else {
              this.dashedRoundRect(g, sx - 44, sy - 44, 88, 88, 12, '#7f8ea3');
            }
          } // 怪物


          for (var m of model.monsters) {
            var _MONSTER_COLOR$m$mons;

            var mx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(m.x);
            var my = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(m.y);
            var radius = m.special === 'elite_armor' ? 24 : 17;
            g.fillColor = col((_MONSTER_COLOR$m$mons = MONSTER_COLOR[m.monsterId]) != null ? _MONSTER_COLOR$m$mons : '#e05b5b');
            g.circle(mx, my, radius);
            g.fill(); // 越线怪物加红色描边：提示已来不及拦截

            if (m.y < (_crd && DEFENSE_LINE_Y === void 0 ? (_reportPossibleCrUseOfDEFENSE_LINE_Y({
              error: Error()
            }), DEFENSE_LINE_Y) : DEFENSE_LINE_Y)) {
              g.lineWidth = 4;
              g.strokeColor = col('#ff2d55');
              g.circle(mx, my, radius + 5);
              g.stroke();
            }

            if (m.hp < m.maxHp) {
              var w = radius * 2.4;
              g.fillColor = col('#20263a');
              g.rect(mx - w / 2, my + radius + 8, w, 5);
              g.fill();
              g.fillColor = col('#7be0a3');
              g.rect(mx - w / 2, my + radius + 8, w * Math.max(0, m.hp / m.maxHp), 5);
              g.fill();
            }
          } // Boss


          var boss = model.boss;

          if (boss) {
            var bx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(boss.x);
            var by = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(boss.y);
            var _radius = 40;
            g.fillColor = col('#ff4d6d');
            g.circle(bx, by, _radius);
            g.fill();
            g.lineWidth = 4;
            g.strokeColor = col('#ffb020');
            g.circle(bx, by, _radius + 6);
            g.stroke();
            g.strokeColor = col('#ffb020', 160);
            g.circle(bx, by, _radius + 12 + boss.phase * 4);
            g.stroke();

            if (boss.hp < boss.maxHp) {
              var _w = _radius * 2.6;

              g.fillColor = col('#2a1d26');
              g.rect(bx - _w / 2, by + _radius + 10, _w, 7);
              g.fill();
              g.fillColor = col('#ff6b8a');
              g.rect(bx - _w / 2, by + _radius + 10, _w * Math.max(0, boss.hp / boss.maxHp), 7);
              g.fill();
            }
          } // 玩家：朝上射击的光束（枪身微光随武器升级变亮，颜色随武器类型变化）


          var p = model.player;
          var px = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
            error: Error()
          }), mapX) : mapX)(p.x);
          var py = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
            error: Error()
          }), mapY) : mapY)(p.y);
          var beamColor = {
            RW01: '#6fe0c0',
            RW02: '#ffb020',
            RW03: '#5ac8ff',
            RW04: '#ff6b4a'
          };
          var glow = (_beamColor$model$curr = beamColor[model.currentCharWeapon]) != null ? _beamColor$model$curr : '#6fe0c0';
          var weaponLevel = (_model$charWeapons$mo = (_model$charWeapons$mo2 = model.charWeapons[model.currentCharWeapon]) == null ? void 0 : _model$charWeapons$mo2.level) != null ? _model$charWeapons$mo : 1;
          g.lineWidth = 10 + weaponLevel * 2;
          g.strokeColor = col(glow, 60 + weaponLevel * 15);
          g.moveTo(px, py + 14);
          g.lineTo(px, py + 88);
          g.stroke();
          g.lineWidth = 4;
          g.strokeColor = col(glow, 190);
          g.moveTo(px, py + 14);
          g.lineTo(px, py + 88);
          g.stroke();
          g.fillColor = col(glow);
          g.circle(px, py, 24);
          g.fill();
          g.lineWidth = 4;
          g.strokeColor = col('#c8fff0');
          g.circle(px, py, 32);
          g.stroke(); // 子弹：按武器类型区分形态（文档 01-18）
          // circle 白色圆弹 / spread 橙色弹丸 / laser 蓝色光束 / missile 红色导弹+尾焰；武器槽保持黄色弹

          for (var b of model.bullets) {
            var _bx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(b.x);

            var _by = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(b.y);

            if (b.source === 'char') {
              if (b.kind === 'laser') {
                var sp = Math.hypot(b.vx, b.vy) || 1;
                var dx = b.vx / sp * 30;
                var dy = b.vy / sp * 30;
                g.lineWidth = 7;
                g.strokeColor = col('#5ac8ff', 230);
                g.moveTo(_bx - dx, _by - dy);
                g.lineTo(_bx + dx, _by + dy);
                g.stroke();
                g.lineWidth = 2;
                g.strokeColor = col('#c8ecff');
                g.moveTo(_bx - dx, _by - dy);
                g.lineTo(_bx + dx, _by + dy);
                g.stroke();
              } else if (b.kind === 'missile') {
                var _sp = Math.hypot(b.vx, b.vy) || 1;

                var tx = b.vx / _sp * 14;
                var ty = b.vy / _sp * 14; // 尾部粒子火焰

                g.fillColor = col('#ffb020', 150);
                g.circle(_bx - tx, _by - ty, 6);
                g.fill();
                g.fillColor = col('#ff6b4a');
                g.circle(_bx, _by, 7);
                g.fill();
              } else if (b.kind === 'spread') {
                g.fillColor = col('#ffb020');
                g.circle(_bx, _by, 5.5);
                g.fill();
              } else {
                // 基础步枪：白色小圆弹
                g.fillColor = col('#ffffff', 240);
                g.circle(_bx, _by, 5);
                g.fill();
              }
            } else if (b.vx === 0) {
              g.fillColor = col('#ffe08a', 230);
              g.rect(_bx - 2.5, _by - 8, 5, 16);
              g.fill();
            } else {
              g.fillColor = col('#ffe08a');
              g.circle(_bx, _by, 6);
              g.fill();
            }
          } // 技能/大招释放特效：0.35 秒的扩散圆环，让加成变化在战场上可见


          var mapW = (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).right - (_crd && BATTLE === void 0 ? (_reportPossibleCrUseOfBATTLE({
            error: Error()
          }), BATTLE) : BATTLE).left;

          for (var f of model.fx) {
            var fx = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(f.x);
            var fy = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(f.y);
            g.lineWidth = 5;
            g.strokeColor = col(f.color, 190);
            g.circle(fx, fy, f.radius * mapW);
            g.stroke();
          } // 大招弹幕期间：角色外圈金色脉冲


          if (model.ultActive) {
            var pl = model.player;
            var px2 = (_crd && mapX === void 0 ? (_reportPossibleCrUseOfmapX({
              error: Error()
            }), mapX) : mapX)(pl.x);
            var py2 = (_crd && mapY === void 0 ? (_reportPossibleCrUseOfmapY({
              error: Error()
            }), mapY) : mapY)(pl.y);
            g.lineWidth = 4;
            g.strokeColor = col('#ffd479', 160);
            g.circle(px2, py2, 40);
            g.stroke();
          }

          this.drawHudBars(model);
        } // 虚线圆角矩形：空武器槽的底座


        dashedRoundRect(g, x, y, w, h, r, color) {
          g.lineWidth = 3;
          g.strokeColor = col(color, 170);
          var dash = 10;
          var gap = 7;
          var horizontal = Math.ceil(w / (dash + gap));
          var vertical = Math.ceil(h / (dash + gap));

          for (var i = 0; i < horizontal; i += 1) {
            var sx = x + i * (dash + gap);
            if (sx >= x + w) break;
            var len = Math.min(dash, x + w - sx);
            g.moveTo(sx, y);
            g.lineTo(sx + len, y);
            g.moveTo(sx, y + h);
            g.lineTo(sx + len, y + h);
          }

          for (var _i4 = 0; _i4 < vertical; _i4 += 1) {
            var sy = y + _i4 * (dash + gap);
            if (sy >= y + h) break;

            var _len = Math.min(dash, y + h - sy);

            g.moveTo(x, sy);
            g.lineTo(x, sy + _len);
            g.moveTo(x + w, sy);
            g.lineTo(x + w, sy + _len);
          }

          g.stroke();
        }

        drawHudBars(model) {
          var g = this.hud;
          g.clear();
          var ratio = Math.max(0, model.coreHp / model.coreMaxHp);
          var barW = 440;
          var barX = -barW / 2;
          var barY = (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
            error: Error()
          }), HUD) : HUD).barY;
          g.fillColor = col('#242c3d');
          g.roundRect(barX, barY, barW, 20, 10);
          g.fill();
          g.fillColor = col(ratio > 0.6 ? '#59d998' : ratio > 0.3 ? '#e0c05a' : '#e05b5b');
          g.roundRect(barX, barY, Math.max(4, barW * ratio), 20, 10);
          g.fill(); // Boss 血条

          if (model.boss) {
            var boss = model.boss;
            var br = Math.max(0, boss.hp / boss.maxHp);
            g.fillColor = col('#2a1d26');
            g.roundRect(-260, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
              error: Error()
            }), HUD) : HUD).bossBarY, 520, 14, 7);
            g.fill();
            g.fillColor = col('#ff4d6d');
            g.roundRect(-260, (_crd && HUD === void 0 ? (_reportPossibleCrUseOfHUD({
              error: Error()
            }), HUD) : HUD).bossBarY, Math.max(3, 520 * br), 14, 7);
            g.fill();
          }
        } // ---------- 弹层与按钮 ----------


        drawOverlay(model) {
          var g = this.overlay;
          g.clear(); // 底部三个升级图标 + 角色武器入口（非结算、非弹层时显示）

          if (!model.runOver && !model.pendingUpgrade && !model.pendingCharWeaponPanel && model.pendingWeaponSlot === null) {
            var lines = ['equipment', 'skill', 'ultimate'];
            lines.forEach(line => {
              var rect = (_crd && UPGRADE_ICONS === void 0 ? (_reportPossibleCrUseOfUPGRADE_ICONS({
                error: Error()
              }), UPGRADE_ICONS) : UPGRADE_ICONS)[line];
              var minCost = model.cheapestUpgradeCost(line);
              var canAfford = minCost !== null && model.gold >= minCost;
              g.fillColor = col(canAfford ? '#2a3550' : '#1c2130');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.fill();
              g.lineWidth = canAfford ? 3 : 2;
              g.strokeColor = col(canAfford ? '#ffd479' : '#3a4150');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.stroke();
            }); // 角色武器入口：金色描边突出

            {
              var rect = _crd && CHAR_WEAPON_ICON === void 0 ? (_reportPossibleCrUseOfCHAR_WEAPON_ICON({
                error: Error()
              }), CHAR_WEAPON_ICON) : CHAR_WEAPON_ICON;
              g.fillColor = col('#2a3040');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.fill();
              g.lineWidth = 2;
              g.strokeColor = col('#ffd479');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.stroke();
            }
          } // 角色武器面板（暂停式弹层）


          if (model.pendingCharWeaponPanel && !model.runOver) {
            var _model$charWeaponRow$3, _model$charWeaponRow3, _selState$level4, _selRow$upgrade_cost_3, _selState$level5;

            g.fillColor = col('#05080f', 214);
            g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
              error: Error()
            }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
              error: Error()
            }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
              error: Error()
            }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
              error: Error()
            }), DESIGN_H) : DESIGN_H);
            g.fill();
            g.fillColor = col('#1b2434');
            g.roundRect((_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).x - (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).w / 2, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).y - (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).h / 2, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).w, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).h, 22);
            g.fill();
            g.lineWidth = 3;
            g.strokeColor = col('#ffd479', 170);
            g.roundRect((_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).x - (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).w / 2, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).y - (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).h / 2, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).w, (_crd && CHAR_PANEL === void 0 ? (_reportPossibleCrUseOfCHAR_PANEL({
              error: Error()
            }), CHAR_PANEL) : CHAR_PANEL).h, 22);
            g.stroke();
            var weaponIds = model.charWeaponIds;
            var sel = model.charWeaponSelected;
            weaponIds.forEach((id, i) => {
              var rect = (_crd && CHAR_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfCHAR_OPTION_RECTS({
                error: Error()
              }), CHAR_OPTION_RECTS) : CHAR_OPTION_RECTS)[i];
              if (!rect) return;
              var st = model.charWeapons[id];
              var carrying = model.currentCharWeapon === id;
              var selected = sel === id;
              g.fillColor = col(carrying ? '#233d2e' : st != null && st.owned ? '#232c3e' : '#1a1f2b');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.fill();
              g.lineWidth = selected ? 4 : 2;
              g.strokeColor = col(carrying ? '#7be39a' : selected ? '#ffd479' : st != null && st.owned ? '#4aa3ff' : '#3a4150');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.stroke();
            });
            var selState = model.charWeapons[sel];
            var canBuy = selState && !selState.owned && model.gold >= ((_model$charWeaponRow$3 = (_model$charWeaponRow3 = model.charWeaponRow(sel, 1)) == null ? void 0 : _model$charWeaponRow3.unlock_cost_gold) != null ? _model$charWeaponRow$3 : 0);
            g.fillColor = col(canBuy ? '#3a4a30' : '#20242e');
            g.roundRect((_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).x - (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).w / 2, (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).y - (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).h / 2, (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).w, (_crd && CHAR_BUY_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_BUY_RECT({
              error: Error()
            }), CHAR_BUY_RECT) : CHAR_BUY_RECT).h, 12);
            g.fill();
            var selRow = model.charWeaponRow(sel);
            var canUpgrade = (selState == null ? void 0 : selState.owned) && ((_selState$level4 = selState.level) != null ? _selState$level4 : 1) < 4 && model.gold >= ((_selRow$upgrade_cost_3 = selRow == null ? void 0 : selRow.upgrade_cost_gold) != null ? _selRow$upgrade_cost_3 : 0);
            var maxed = (selState == null ? void 0 : selState.owned) && ((_selState$level5 = selState.level) != null ? _selState$level5 : 1) >= 4;
            g.fillColor = col(canUpgrade ? '#2e4a36' : maxed ? '#4a3f22' : '#20242e');
            g.roundRect((_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).x - (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).w / 2, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).y - (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).h / 2, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).w, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).h, 12);
            g.fill();
            g.lineWidth = 2;
            g.strokeColor = col(maxed ? '#ffd479' : '#3a4150');
            g.roundRect((_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).x - (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).w / 2, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).y - (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).h / 2, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).w, (_crd && CHAR_UPGRADE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_UPGRADE_RECT({
              error: Error()
            }), CHAR_UPGRADE_RECT) : CHAR_UPGRADE_RECT).h, 12);
            g.stroke();
            g.fillColor = col('#2a3550');
            g.roundRect((_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).x - (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).w / 2, (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).y - (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).h / 2, (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).w, (_crd && CHAR_CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCHAR_CLOSE_RECT({
              error: Error()
            }), CHAR_CLOSE_RECT) : CHAR_CLOSE_RECT).h, 12);
            g.fill();
          } // 三选一弹层


          if (model.pendingUpgrade && !model.runOver) {
            g.fillColor = col('#05080f', 214);
            g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
              error: Error()
            }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
              error: Error()
            }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
              error: Error()
            }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
              error: Error()
            }), DESIGN_H) : DESIGN_H);
            g.fill();
            model.pendingUpgradeOptions.forEach((_, i) => {
              var rect = (_crd && CARD_RECTS === void 0 ? (_reportPossibleCrUseOfCARD_RECTS({
                error: Error()
              }), CARD_RECTS) : CARD_RECTS)[i];
              g.fillColor = col('#1c2536');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 16);
              g.fill();
              g.lineWidth = 3;
              g.strokeColor = col('#4aa3ff');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 16);
              g.stroke();
            });
            g.fillColor = col('#2a3550');
            g.roundRect((_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).x - (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).w / 2, (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).y - (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).h / 2, (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).w, (_crd && REFRESH_RECT === void 0 ? (_reportPossibleCrUseOfREFRESH_RECT({
              error: Error()
            }), REFRESH_RECT) : REFRESH_RECT).h, 12);
            g.fill();
          } // 武器购买面板


          if (model.pendingWeaponSlot && !model.runOver) {
            g.fillColor = col('#05080f', 214);
            g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
              error: Error()
            }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
              error: Error()
            }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
              error: Error()
            }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
              error: Error()
            }), DESIGN_H) : DESIGN_H);
            g.fill();
            g.fillColor = col('#1b2434');
            g.roundRect((_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).x - (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).w / 2, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).y - (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).h / 2, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).w, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).h, 22);
            g.fill();
            g.lineWidth = 3;
            g.strokeColor = col('#ffb020', 170);
            g.roundRect((_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).x - (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).w / 2, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).y - (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).h / 2, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).w, (_crd && BUY_PANEL === void 0 ? (_reportPossibleCrUseOfBUY_PANEL({
              error: Error()
            }), BUY_PANEL) : BUY_PANEL).h, 22);
            g.stroke();
            var slot = model.pendingWeaponSlot;
            var state = model.weapons.find(w => w.slot === slot);
            model.weaponTable.forEach((w, i) => {
              var rect = (_crd && WEAPON_OPTION_RECTS === void 0 ? (_reportPossibleCrUseOfWEAPON_OPTION_RECTS({
                error: Error()
              }), WEAPON_OPTION_RECTS) : WEAPON_OPTION_RECTS)[i];
              if (!rect) return;
              var cost = w.cost_gold - model.weaponCost(slot);
              var equipped = (state == null ? void 0 : state.weaponId) === w.weapon_id;
              var afford = model.gold >= cost && !equipped;
              g.fillColor = col(equipped ? '#2f4a3c' : afford ? '#232c3e' : '#1a1f2b');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.fill();
              g.lineWidth = 2;
              g.strokeColor = col(equipped ? '#59d998' : afford ? '#4aa3ff' : '#3a4150');
              g.roundRect(rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h, 14);
              g.stroke();
            });
            g.fillColor = col('#2a3550');
            g.roundRect((_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).x - (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).w / 2, (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).y - (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).h / 2, (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).w, (_crd && SELL_RECT === void 0 ? (_reportPossibleCrUseOfSELL_RECT({
              error: Error()
            }), SELL_RECT) : SELL_RECT).h, 12);
            g.fill();
            g.roundRect((_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).x - (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).w / 2, (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).y - (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).h / 2, (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).w, (_crd && CLOSE_RECT === void 0 ? (_reportPossibleCrUseOfCLOSE_RECT({
              error: Error()
            }), CLOSE_RECT) : CLOSE_RECT).h, 12);
            g.fill();
          } // 结算页


          if (model.runOver) {
            g.fillColor = col('#05080f', 220);
            g.rect(-(_crd && HALF_W === void 0 ? (_reportPossibleCrUseOfHALF_W({
              error: Error()
            }), HALF_W) : HALF_W), -(_crd && HALF_H === void 0 ? (_reportPossibleCrUseOfHALF_H({
              error: Error()
            }), HALF_H) : HALF_H), _crd && DESIGN_W === void 0 ? (_reportPossibleCrUseOfDESIGN_W({
              error: Error()
            }), DESIGN_W) : DESIGN_W, _crd && DESIGN_H === void 0 ? (_reportPossibleCrUseOfDESIGN_H({
              error: Error()
            }), DESIGN_H) : DESIGN_H);
            g.fill();
            g.fillColor = col('#1b2434');
            g.roundRect(-300, -400, 600, 820, 22);
            g.fill();
            g.lineWidth = 3;
            g.strokeColor = col('#e05b5b');
            g.roundRect(-300, -400, 600, 820, 22);
            g.stroke();
            g.fillColor = col('#2f4a3c');
            g.roundRect((_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).x - (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).w / 2, (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).y - (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).h / 2, (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).w, (_crd && RESTART_RECT === void 0 ? (_reportPossibleCrUseOfRESTART_RECT({
              error: Error()
            }), RESTART_RECT) : RESTART_RECT).h, 14);
            g.fill();
            var exportIdle = this.exportState === 'idle';
            g.fillColor = col(exportIdle ? '#2a3550' : '#262b34');
            g.roundRect((_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).x - (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).w / 2, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).y - (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).h / 2, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).w, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).h, 14);
            g.fill();
            g.lineWidth = 2;
            g.strokeColor = col(exportIdle ? '#4a6a90' : '#3a4150');
            g.roundRect((_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).x - (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).w / 2, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).y - (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).h / 2, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).w, (_crd && EXPORT_RECT === void 0 ? (_reportPossibleCrUseOfEXPORT_RECT({
              error: Error()
            }), EXPORT_RECT) : EXPORT_RECT).h, 14);
            g.stroke();
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=16965b90d6b0e7f9ba38e05bd9252c8e0e2e59d4.js.map