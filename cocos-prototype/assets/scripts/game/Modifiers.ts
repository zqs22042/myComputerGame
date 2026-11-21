// 词条池、加成汇总与三选一抽取（复用 core/CardDraw 的插值与归一化）。
import { drawRarity, interpolateWeights, normalizeWeights, segmentRow } from '../core/CardDraw';
import type { CardOption, Modifiers } from './Types';

export interface CardRow {
  cardId: string;
  name: string;
  rarity: string;
  level: number;
  effectValue: number;
  effectDesc: string;
  synergyTag: string;
  category: string;
}

export function baseModifiers(): Modifiers {
  return {
    pierce: 0,
    ricochet: 0,
    split: 0,
    critRate: 0.05,
    critDamage: 0,
    heroIntervalMult: 1,
    burn: 0,
    explode: 0,
    towerIntervalMult: 1,
    towerRangeBonus: 0,
    slowAura: 0,
    frostSlow: 0,
    tesla: 0,
    towerSynergy: 0,
    coreMaxBonus: 0,
    healPerWave: 0,
    dodge: 0,
    thorns: 0,
    emergency: 0,
    goldBonus: 0,
    expBonus: 0,
    freeRefresh: 0,
    interest: 0,
    greed: 0,
  };
}

export function buildCardPool(tables: any): CardRow[] {
  const out: CardRow[] = [];
  const push = (rows: any[], category: string) => {
    for (const row of rows ?? []) {
      out.push({
        cardId: row.card_id,
        name: row.name,
        rarity: row.rarity,
        level: row.level,
        effectValue: row.effect_value,
        effectDesc: row.effect_desc,
        synergyTag: row.synergy_tag ?? '无',
        category,
      });
    }
  };
  push(tables.cards_weapon, 'weapon');
  push(tables.cards_tower, 'tower');
  push(tables.cards_survival, 'survival');
  push(tables.cards_economy, 'economy');
  return out;
}

// 由“已拥有词条等级”重新汇总全部加成，避免增量叠加导致重复计算。
export function deriveModifiers(pool: CardRow[], owned: Map<string, number>): Modifiers {
  const m = baseModifiers();
  for (const row of pool) {
    if (owned.get(row.cardId) !== row.level) continue;
    const v = row.effectValue;
    switch (row.cardId) {
      case 'W01': m.pierce = Math.max(m.pierce, v); break;
      case 'W02': m.ricochet = v; break;
      case 'W03': m.split = v; break;
      case 'W04': m.critRate += v; break;
      case 'W05': m.critDamage += v; break;
      case 'W06': m.heroIntervalMult *= 1 - v; break;
      case 'W07': m.burn = v; break;
      case 'W08': m.explode = v; break;
      case 'T01': m.towerIntervalMult *= 1 - v; break;
      case 'T02': m.towerRangeBonus += v; break;
      case 'T03': m.slowAura = v; break;
      case 'T04': m.frostSlow = v; break;
      case 'T05': m.tesla = v; break;
      case 'T06': m.towerSynergy = v; break;
      case 'S01': m.coreMaxBonus += v; break;
      case 'S02': m.healPerWave = v; break;
      case 'S03': m.dodge += v; break;
      case 'S04': m.thorns = v; break;
      case 'S05': m.emergency = v; break;
      case 'E01': m.goldBonus += v; break;
      case 'E02': m.expBonus += v; break;
      case 'E03': m.freeRefresh += v; break;
      case 'E04': m.interest = v; break;
      case 'E05': m.greed += v; break;
      default: break;
    }
  }
  return m;
}

function pickOne(list: CardRow[], rng: () => number): CardRow | null {
  if (list.length === 0) return null;
  return list[Math.floor(rng() * list.length)];
}

// 抽取三选一：插值权重 → 稀有度 → 词条 → 同系保底替换（与 card_weight_interpolation.md 一致）。
export function drawCardOptions(params: {
  pool: CardRow[];
  owned: Map<string, number>;
  curve: any[];
  wave: number;
  rng: () => number;
  refreshCount: number;
}): CardOption[] {
  const { pool, owned, curve, wave, rng, refreshCount } = params;
  const weights = interpolateWeights(curve, wave);
  const seg = segmentRow(curve, wave);
  const bonus = (seg.refresh_rarity_bonus ?? 0) * refreshCount;
  const boosted: any = { ...weights };
  if (bonus > 0) {
    boosted.rare += bonus;
    boosted.epic += bonus;
  }
  const normalized = normalizeWeights(boosted);

  const eligible = pool.filter((row) => (owned.get(row.cardId) ?? 0) + 1 === row.level);
  const picked: CardRow[] = [];
  for (let i = 0; i < 3; i += 1) {
    const rarity = drawRarity(normalized, rng);
    let candidates = eligible.filter(
      (row) => row.rarity === rarity && !picked.some((p) => p.cardId === row.cardId),
    );
    if (candidates.length === 0) {
      candidates = eligible.filter((row) => !picked.some((p) => p.cardId === row.cardId));
    }
    const choice = pickOne(candidates, rng);
    if (!choice) break;
    picked.push(choice);
  }

  // 保底：若已有同系词条且本组无同系，则把最后一张替换为同系词条。
  const ownedTags = [...owned.keys()]
    .map((cardId) => pool.find((row) => row.cardId === cardId)?.synergyTag)
    .filter((tag): tag is string => Boolean(tag) && tag !== '无');
  if ((seg.same_category_guarantee ?? 0) > 0 && ownedTags.length > 0) {
    const hasMatch = picked.some((card) => ownedTags.includes(card.synergyTag));
    if (!hasMatch) {
      const pool2 = eligible.filter(
        (row) => ownedTags.includes(row.synergyTag) && !picked.some((p) => p.cardId === row.cardId),
      );
      const replacement = pickOne(pool2, rng);
      if (replacement) picked[picked.length - 1] = replacement;
    }
  }

  return picked.map((row) => ({
    cardId: row.cardId,
    name: row.name,
    rarity: row.rarity,
    level: row.level,
    effectValue: row.effectValue,
    effectDesc: row.effectDesc,
    synergyTag: row.synergyTag,
    category: row.category,
  }));
}
