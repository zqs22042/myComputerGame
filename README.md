# 《孤军守卫》特效 · Cocos Creator 接入规范

> 引擎版本：**Cocos Creator 3.8.x（2D 项目）**
> 目标平台：iOS / Android 竖屏 1080×1920（设计分辨率，适配 Fit Width + Fit Height）
> 本文档配套 3 个文件：`scripts/VFXConfig.ts`（配置表）、`scripts/VFXManager.ts`（播放管理器）、`materials/mat_vfx_add.mtl`（加法叠加材质）

---

## 一、为什么用代码驱动序列帧，而不用 Animation Clip

| 方案 | 结论 | 原因 |
| --- | --- | --- |
| Animation Clip + SpriteFrame 序列 | ❌ 不采用 | 每个特效都要一条 clip，改帧率要重做资源；clamp 播放后不能直接复用节点，池化成本高 |
| 代码驱动（本方案） | ✅ 采用 | 帧率、循环、并发上限全部在配置表里改，改数值不用动美术资源；节点可 100% 池化复用 |
| ParticleSystem2D 粒子 | ✅ 辅助使用 | 只用于碎片飞散、烟雾这类强随机性效果，见第六节 |

---

## 二、工程目录与资源规范

```
assets/
├─ resources/
│  ├─ vfx/                          ← 所有序列帧（必须放在 resources 下才能 loadDir 动态加载）
│  │  ├─ player_gunshot/
│  │  │  ├─ VFX_Player_GunShot_001.png
│  │  │  ├─ VFX_Player_GunShot_002.png   ...共 6 张
│  │  ├─ turret_mg_shoot/           ...共 5 张
│  │  ├─ turret_cannon_charge/      ...共 8 张
│  │  ├─ turret_cannon_fire/        ...共 7 张
│  │  ├─ hit_monster/               ...共 4 张
│  │  ├─ monster_death/             ...共 7 张（可拆 monster_death_red / _blue / _purple 三套）
│  │  ├─ core_shield/               ...共 12 张
│  │  ├─ core_shield_break/         ...共 9 张
│  │  ├─ monster_spawn/             ...共 6 张
│  │  └─ bullet_trail/              ...共 4 张
│  └─ materials/
│     └─ mat_vfx_add.mtl            ← 加法叠加材质
└─ scripts/vfx/
   ├─ VFXConfig.ts
   └─ VFXManager.ts
```

**资源导入设置（选中图片 → 属性检查器）**

| 项目 | 设置 | 说明 |
| --- | --- | --- |
| Type | `sprite-frame` | 序列帧必须切成 SpriteFrame |
| Premultiply Alpha | 关闭 | 加法模式下预乘会导致二次发光过曝 |
| Wrap Mode | `clamp` | 防止序列帧边缘采样到相邻帧 |
| Filter Mode | `bilinear` | 发光类特效不要用 point，会出硬边 |
| Packable | 打开 | 允许进自动图集，减少 DrawCall |
| 压缩 | Android 用 `ETC2 RGBA` / iOS 用 `ASTC 6×6 RGBA` | 透明通道必须保留；单帧 PNG 源文件 ≤150KB |

**图集策略**
- 同一个特效的序列帧**放在同一个文件夹**，程序按 `loadDir` 加载；
- 不同特效**不要打进同一张图集**，否则大图常驻且无法按需释放；
- 同类小特效（`hit_monster`、`player_gunshot`、`turret_mg_shoot`）可合到一个 Auto Atlas，控制在 **1024×1024 以内**，超出的拆第二张。

**文件命名（强约束）**
`VFX_<类别>_<名称>_<三位帧号>.png`，帧号从 001 连续补零，程序按文件名末尾数字排序播放，**不允许跳号、不允许改名**。

---

## 三、场景层级结构（必须按此搭）

```
Canvas
├─ WorldRoot                    ← 战斗世界（相机跟随/缩放只作用于此节点）
│  ├─ VFXLayer1  (地面层)        ← 刷新预警光圈、地面冲击
│  ├─ MapLayer                  ← 背景、道路瓦片、装饰
│  ├─ UnitLayer                 ← 核心、炮台、玩家、怪物
│  ├─ VFXLayer2  (角色怪物层)    ← 死亡消散、护盾光晕（跟在单位之后渲染）
│  ├─ BulletLayer               ← 子弹、弹道
│  └─ VFXLayer3  (命中层)        ← 命中闪光、枪口火花、爆炸
└─ UIRoot
   ├─ HUDLayer
   └─ VFXLayer4  (UI之上层)      ← 全屏震屏闪光、核心受击全屏红晕
```

- Cocos 3.x 的 2D 渲染顺序**由节点树顺序决定**，所以 4 个 VFXLayer 必须摆在上面指定的位置，不要同级乱放；
- `VFXManager.init([layer1, layer2, layer3, layer4])` 传入这 4 个节点，配置表里的 `layer` 字段自动决定特效落到哪一层；
- 节点 `zIndex` 对 2D Sprite 无效，不要用 zIndex 控层级。

> ⚠️ 如果战斗世界需要整体缩放（相机远近），把 4 个 VFXLayer 都挂在 `WorldRoot` 下，特效节点由管理器动态 `addChild` 到对应层，自动继承世界缩放。

---

## 四、叠加模式：加法（Additive）

发光类特效（枪口、火花、光束、刷新光圈、爆炸）必须用加法混合，否则在暗色道路上会糊成一块灰。

**推荐做法（编辑器内一步搞定）**
1. 在 `assets/resources/materials/` 右键 → 新建 → Material；
2. Effect 选择内置 `builtin-sprite`；
3. 展开 Pass 的 `Blend State`：`Blend = true`、`Src Blend = SRC_ALPHA`、`Dst Blend = ONE`（Alpha 通道同设为 `SRC_ALPHA` / `ONE`）；
4. 保存为 `mat_vfx_add.mtl`。

**也可以用随包提供的 `mat_vfx_add.mtl`**：直接拷进 `assets/resources/materials/`，引擎首次导入会自动生成 `.mtl.meta`，若编辑器提示 effect uuid 失效，按上面 3 步手动重建即可（不同小版本内置 effect uuid 可能不一致）。

- 配置表 `blend: 'add'` → 自动挂 `mat_vfx_add`；`blend: 'alpha'` → 用默认 Sprite 材质；
- 加法特效的**美术图必须自带亮边、边缘渐隐到纯黑透明**，不要保留灰底，否则加法后会整块发亮。

---

## 五、接入步骤 Checklist

1. 把 `VFXConfig.ts`、`VFXManager.ts` 放到 `assets/scripts/vfx/`；
2. 按第二节把 10 组序列帧放进 `resources/vfx/<dir>/`，文件夹名必须和配置表 `dir` 字段一致；
3. 按第三节把 4 个 VFXLayer 节点摆好；
4. 游戏启动（Loading 场景或 Entry 脚本）里调用一次：

```ts
import { VFXManager } from './vfx/VFXManager';

VFXManager.init([layer1.node, layer2.node, layer3.node, layer4.node]);
```

5. 业务代码直接播：

```ts
// 玩家开火：挂枪口
VFXManager.play('VFX_Player_GunShot', playerNode.worldPosition, {
    follow: muzzleNode, offset: new Vec3(0, 10, 0),
});

// 命中怪物：随机偏移避免完全重叠
const jitter = new Vec3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, 0);
VFXManager.play('VFX_Hit_Monster', monsterNode.worldPosition, { offset: jitter });

// 电磁炮充能（循环，需要手动停）
const charge = VFXManager.play('VFX_Turret_Cannon_Charge', cannonNode.worldPosition, {
    follow: cannonMuzzle,
});
// 充能结束
charge?.stop();
VFXManager.play('VFX_Turret_Cannon_Fire', cannonMuzzle.worldPosition);

// 核心护盾（常驻循环）
const shield = VFXManager.play('VFX_Core_Shield', coreNode.worldPosition, { follow: coreNode });
// 护盾破碎
shield?.stop();
VFXManager.play('VFX_Core_ShieldBreak', coreNode.worldPosition);

// 切关卡 / 战斗结束
VFXManager.clearAll();
```

6. 战斗场景销毁时调用 `VFXManager.clearAll()`，否则池里残留节点会带到下一局。

---

## 六、哪些用序列帧，哪些用 ParticleSystem2D

| 特效 | 实现方式 | 说明 |
| --- | --- | --- |
| 玩家枪口、机枪枪口、命中闪光、刷新光圈、护盾、充能、发射光束、子弹拖尾 | **序列帧**（本方案） | 形态固定、可控、省性能，美术改图即可调效果 |
| 怪物死亡碎片、爆炸飞散 | **序列帧为主 + 粒子补 2~4 个火星** | 序列帧保证形体，粒子补随机性，避免每次都一模一样 |
| 核心持续环境光、背景微光 | **序列帧循环** | 循环帧数控制在 12 帧内，不要用粒子做常驻，耗电量高 |

粒子上限：单个 `ParticleSystem2D` 的 `capacity` ≤ 30，`duration` ≤ 0.6s，`emissionRate` 不做无限循环发射。

---

## 七、性能预算（移动端）

| 指标 | 预算 | 超限处理 |
| --- | --- | --- |
| 全局同屏特效节点 | ≤ 60（低端机 40） | `VFXManager.globalMax` 调低，超限自动回收最旧 |
| 单特效并发 | 见配置表 `maxConcurrent` | 命中闪光 20、枪口 12，超出回收最旧 |
| 每帧 DrawCall 增量 | ≤ 6 | 同层同类特效合图，控制材质数量 |
| 序列帧总内存 | ≤ 60MB | 单帧 ≤150KB，大特效按需加载后释放 |
| 特效动画开销 | 无 Tween、无 Animation | 只用 `update` 里累加时间算帧，单帧 O(n) 遍历 |

**低端机降级开关（建议策划配置）**：一个 `lowEffectMode` 布尔量，开启时把 `VFX_Hit_Monster`（命中闪光）和 `VFX_Monster_Spawn`（刷新预警）跳过播放，仅保留核心与炮台特效。

---

## 八、验收清单（程序验收用）

- [ ] 10 组序列帧全部在 `resources/vfx/` 下，文件夹名与配置表 `dir` 一致
- [ ] 帧号 001 起连续，无跳号，数量与配置表 `frames` 一致
- [ ] 单个特效循环播放时首尾帧无跳变（第 12 帧与第 1 帧视觉连续）
- [ ] 加法特效在深色道路背景上看得到边缘，不是整块糊亮
- [ ] 单次特效不循环，播完节点已回到池中（Hierarchy 里不残留激活节点）
- [ ] 20 只怪物同屏死亡时无明显掉帧（iPhone 8 / 骁龙 660 实机验证）
- [ ] 切场景后无残留特效节点
- [ ] 4 个 VFXLayer 顺序正确，护盾在单位层之上、命中特效在子弹层之上

---

## 九、美术交付给程序的东西

1. 每组序列帧 PNG（透明底，帧号连续），按第二节目录结构打包；
2. 分层源文件（PSD/PSB 或 Procreate），每层独立，便于后续改配色；
3. 红/蓝/紫怪物死亡特效 3 套配色（可共用同一组序列帧模板改色）；
4. 一段 720p 录制视频，逐个特效展示完整播放（验收对帧率用）；
5. 每张图标注挂点位置（枪口/炮口/核心中心/刷新点），写在这份 README 对应特效行。

> （注：部分内容由豆包 AI 生成）