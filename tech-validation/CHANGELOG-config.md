# 配置变更记录

## 2026-11-19 · 技术验证后首次配置冻结

### 变更背景

技术验证链路（CSV 加载 + 伤害结算 + 词条插值 + Boss 时序）已跑通，33 项单测全绿。根据验证阶段暴露的占位假设，策划拍板以下调整，作为原型开发阶段的配置基线。

### 变更内容

| 序号 | 文件 | 变更类型 | 内容 |
|---|---|---|---|
| 1 | `monsters.csv` | 新增列 | 增加 `leak_damage` 列，按怪物类型区分漏怪核心伤害：M01=2、M02=4、M03=3、M04=0、M05=8、Boss=0 |
| 2 | `cannons.csv` | 新增文件 | 炮台基础数值表，首发 C01 基础炮台（攻击 60 / 间隔 0.8s / 范围 600），预留 C02 速射、C03 重炮 |
| 3 | `level_multiplier.csv` | 新增文件 | 跨关成长倍率表，`hp_multiplier` 1.00–2.46、`gold_multiplier` 1.00–2.00，覆盖 1–15 关 |
| 4 | `map_paths.csv` | 新增列 | 增加 `allowed_cannon` 列，MVP 阶段可建造节点全部填 `C01` |

### 规则调整

- **小怪血量公式**：由 `hp_base × hp_growth^(wave_index-1)` 改为 `hp_base × hp_growth^(wave_index-1) × hp_multiplier(level_id)`，关内成长与跨关成长解耦。
- **Boss 血量**：只吃 `boss_growth.csv` 关卡倍率，不再叠加 `level_multiplier`，避免双重膨胀。
- **金币产出**：`gold_drop` 同步乘以 `gold_multiplier(level_id)`。
- **波次结束 +10 金币**：保留。
- **≥90 金币自动升级炮台 +15%**：移除，金币完全由玩家手动消费，保留 `economy_loop.csv` 的决策意图。

### 未变更但需确认

- Boss 召唤 `flying` 映射 M03：确认正确，MVP 阶段沿用。
- 漏怪伤害不进护甲减伤，直接扣核心血量。
- 自爆怪漏到核心不额外扣血，视为该波防线失败。

### 影响范围

- `tech-validation/src/loader.js`：需在 `monsters` schema 中增加 `leak_damage` 必填数值字段；新增 `cannons`、`level_multiplier` 两张表的加载。
- `tech-validation/src/schema.js`：新增两张表的字段类型与引用校验（`cannons.cannon_id` 被 `map_paths.allowed_cannon` 引用）。
- `tech-validation/src/battle.js`：血量计算改为乘 `level_multiplier`；漏怪扣血改读 `leak_damage`；移除自动升级炮台逻辑。
- 单测：新增 `leak_damage` 边界测试（Boss 漏怪不扣血）、`level_multiplier` 乘算测试、`cannons` 引用完整性测试。

### 下一步

1. 按本记录更新 `tech-validation/` 下配置表与 loader/schema/battle。
2. 跑 `node --test` 确认全绿。
3. 进入原型开发：最小可玩场景（level 1 + 碎骨者）。
