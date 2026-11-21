System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, DESIGN_W, DESIGN_H, HALF_W, HALF_H, BATTLE, DEFENSE_LINE_Y, CORE_POS, SLOT_POS, PLATFORM, WIDEN_ZONE, SLOT_RECTS, BUY_PANEL, WEAPON_OPTION_RECTS, SELL_RECT, CLOSE_RECT, CARD_RECTS, REFRESH_RECT, UPGRADE_ICONS, CHAR_WEAPON_ICON, CHAR_PANEL, CHAR_OPTION_RECTS, CHAR_BUY_RECT, CHAR_UPGRADE_RECT, CHAR_CLOSE_RECT, UPGRADE_LINE_LABEL, RESTART_RECT, EXPORT_RECT, HUD;

  // ---------- 归一化 ↔ 屏幕坐标 ----------
  // mapX/mapY 用于路径节点；normToScreenX/Y 用于玩家活动区域，映射规则一致。
  function mapX(nx) {
    return BATTLE.left + nx * (BATTLE.right - BATTLE.left);
  }

  function mapY(ny) {
    return BATTLE.bottom + ny * (BATTLE.top - BATTLE.bottom);
  }

  function normToScreenX(nx) {
    return mapX(nx);
  }

  function normToScreenY(ny) {
    return mapY(ny);
  }

  function screenToNormX(sx) {
    return (sx - BATTLE.left) / (BATTLE.right - BATTLE.left);
  }

  function screenToNormY(sy) {
    return (sy - BATTLE.bottom) / (BATTLE.top - BATTLE.bottom);
  }

  function inRect(px, py, rect) {
    return Math.abs(px - rect.x) <= rect.w / 2 && Math.abs(py - rect.y) <= rect.h / 2;
  } // 兼容旧调用。


  function inside(px, py, rect) {
    return inRect(px, py, rect);
  } // ---------- 新布局：纵向路径 + 防线 + 站位区 ----------
  // 归一化坐标与文档 01-14 / battleModelCore.js 的空间常量保持一致。


  _export({
    mapX: mapX,
    mapY: mapY,
    normToScreenX: normToScreenX,
    normToScreenY: normToScreenY,
    screenToNormX: screenToNormX,
    screenToNormY: screenToNormY,
    inRect: inRect,
    inside: inside
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c470cdEvcdHI5JkDKuGboY+", "Coords", undefined);

      // 设计分辨率坐标与 UI 布局常量（UI 坐标系原点在屏幕中心）。
      // 玩法已切换为单路径拦截 + 金币成长，已移除炮台建造节点相关常量。
      _export("DESIGN_W", DESIGN_W = 750);

      _export("DESIGN_H", DESIGN_H = 1334);

      _export("HALF_W", HALF_W = DESIGN_W / 2);

      _export("HALF_H", HALF_H = DESIGN_H / 2); // 战斗区（地图归一化坐标映射到此矩形内）


      _export("BATTLE", BATTLE = {
        left: -350,
        right: 350,
        bottom: -450,
        top: 470
      });

      _export("DEFENSE_LINE_Y", DEFENSE_LINE_Y = 0.34);

      _export("CORE_POS", CORE_POS = {
        x: 0.50,
        y: 0.24
      });

      _export("SLOT_POS", SLOT_POS = {
        left: {
          x: 0.30,
          y: 0.22
        },
        right: {
          x: 0.70,
          y: 0.22
        }
      });

      _export("PLATFORM", PLATFORM = {
        xMin: 0.14,
        xMax: 0.86,
        yMin: 0.02,
        yMax: 0.30
      });

      _export("WIDEN_ZONE", WIDEN_ZONE = {
        xMin: 0.30,
        xMax: 0.70,
        yMin: 0.34,
        yMax: 0.40
      }); // 武器槽点击热区（屏幕坐标）


      _export("SLOT_RECTS", SLOT_RECTS = {
        left: {
          x: mapX(SLOT_POS.left.x),
          y: mapY(SLOT_POS.left.y),
          w: 130,
          h: 130
        },
        right: {
          x: mapX(SLOT_POS.right.x),
          y: mapY(SLOT_POS.right.y),
          w: 130,
          h: 130
        }
      }); // ---------- 武器购买面板 ----------


      _export("BUY_PANEL", BUY_PANEL = {
        x: 0,
        y: -110,
        w: 580,
        h: 640
      });

      _export("WEAPON_OPTION_RECTS", WEAPON_OPTION_RECTS = [{
        x: 0,
        y: 100,
        w: 500,
        h: 120
      }, {
        x: 0,
        y: -40,
        w: 500,
        h: 120
      }, {
        x: 0,
        y: -180,
        w: 500,
        h: 120
      }]);

      _export("SELL_RECT", SELL_RECT = {
        x: -150,
        y: -320,
        w: 220,
        h: 74
      });

      _export("CLOSE_RECT", CLOSE_RECT = {
        x: 150,
        y: -320,
        w: 220,
        h: 74
      }); // ---------- 升级三选一弹层 ----------


      _export("CARD_RECTS", CARD_RECTS = [{
        x: -245,
        y: 30,
        w: 200,
        h: 420
      }, {
        x: 0,
        y: 30,
        w: 200,
        h: 420
      }, {
        x: 245,
        y: 30,
        w: 200,
        h: 420
      }]);

      _export("REFRESH_RECT", REFRESH_RECT = {
        x: 0,
        y: -360,
        w: 260,
        h: 70
      }); // ---------- 底部四个图标（三升级线 + 角色武器入口，拇指热区） ----------


      _export("UPGRADE_ICONS", UPGRADE_ICONS = {
        equipment: {
          x: -270,
          y: -590,
          w: 130,
          h: 110
        },
        skill: {
          x: -90,
          y: -590,
          w: 130,
          h: 110
        },
        ultimate: {
          x: 90,
          y: -590,
          w: 130,
          h: 110
        }
      });

      _export("CHAR_WEAPON_ICON", CHAR_WEAPON_ICON = {
        x: 270,
        y: -590,
        w: 130,
        h: 110
      }); // ---------- 角色武器面板（暂停式弹层） ----------


      _export("CHAR_PANEL", CHAR_PANEL = {
        x: 0,
        y: -60,
        w: 640,
        h: 780
      });

      _export("CHAR_OPTION_RECTS", CHAR_OPTION_RECTS = [{
        x: -155,
        y: 150,
        w: 290,
        h: 180
      }, {
        x: 155,
        y: 150,
        w: 290,
        h: 180
      }, {
        x: -155,
        y: -50,
        w: 290,
        h: 180
      }, {
        x: 155,
        y: -50,
        w: 290,
        h: 180
      }]);

      _export("CHAR_BUY_RECT", CHAR_BUY_RECT = {
        x: -155,
        y: -215,
        w: 240,
        h: 80
      });

      _export("CHAR_UPGRADE_RECT", CHAR_UPGRADE_RECT = {
        x: 155,
        y: -215,
        w: 240,
        h: 80
      });

      _export("CHAR_CLOSE_RECT", CHAR_CLOSE_RECT = {
        x: 0,
        y: -320,
        w: 480,
        h: 74
      });

      _export("UPGRADE_LINE_LABEL", UPGRADE_LINE_LABEL = {
        equipment: '装备',
        skill: '技能',
        ultimate: '大招'
      }); // ---------- 结算页双按钮 ----------


      _export("RESTART_RECT", RESTART_RECT = {
        x: -130,
        y: -330,
        w: 240,
        h: 84
      });

      _export("EXPORT_RECT", EXPORT_RECT = {
        x: 130,
        y: -330,
        w: 240,
        h: 84
      }); // ---------- 顶部 HUD 文本位置 ----------
      // 纵向顺序：波次/金币 → 核心文本 → 核心血条 → Boss 血条 → 循环 → 存活时间


      _export("HUD", HUD = {
        waveX: -240,
        waveY: 638,
        goldX: 200,
        goldY: 638,
        coreY: 612,
        barY: 574,
        bossBarY: 540,
        cycleY: 500,
        timerY: 460
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c85a6b05f782c963a604b55c7ef88aeec243d6eb.js.map