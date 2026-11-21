// 词条权重插值与抽取：与 tech-validation/src/cardDraw.js 保持同一实现。
export const RARITIES = ['common', 'rare', 'epic', 'legendary'];

export const WEIGHT_FIELD: Record<string, string> = {
  common: 'common_weight',
  rare: 'rare_weight',
  epic: 'epic_weight',
  legendary: 'legendary_weight',
};

function pickWeights(row: any): any {
  const out: any = {};
  for (const rarity of RARITIES) out[rarity] = row[WEIGHT_FIELD[rarity]];
  return out;
}

function sortAnchors(anchors: any[]): any[] {
  return [...anchors].sort((a, b) => a.wave - b.wave);
}

export function interpolateWeights(anchors: any[], wave: number): any {
  if (!anchors || anchors.length === 0) throw new Error('card_draw_curve 锚点为空');
  const sorted = sortAnchors(anchors);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (wave <= first.wave) return pickWeights(first);
  if (wave >= last.wave) return pickWeights(last);

  let lo = first;
  let hi = last;
  for (let i = 0; i < sorted.length - 1; i += 1) {
    if (wave >= sorted[i].wave && wave <= sorted[i + 1].wave) {
      lo = sorted[i];
      hi = sorted[i + 1];
      break;
    }
  }

  const span = hi.wave - lo.wave;
  const t = span === 0 ? 0 : (wave - lo.wave) / span;
  const out: any = {};
  for (const rarity of RARITIES) {
    const from = lo[WEIGHT_FIELD[rarity]];
    const to = hi[WEIGHT_FIELD[rarity]];
    out[rarity] = from + (to - from) * t;
  }
  return out;
}

export function normalizeWeights(weights: any): any {
  const sum = RARITIES.reduce((acc, rarity) => acc + weights[rarity], 0);
  if (sum <= 0) throw new Error('权重之和必须大于 0');
  const out: any = {};
  for (const rarity of RARITIES) out[rarity] = weights[rarity] / sum;
  return out;
}

export function segmentRow(anchors: any[], wave: number): any {
  const sorted = sortAnchors(anchors);
  let current = sorted[0];
  for (const row of sorted) {
    if (row.wave <= wave) current = row;
    else break;
  }
  return current;
}

export function drawRarity(weights: any, rng: () => number = Math.random): string {
  const r = rng();
  let acc = 0;
  for (const rarity of RARITIES) {
    acc += weights[rarity];
    if (r < acc) return rarity;
  }
  return RARITIES[RARITIES.length - 1];
}
