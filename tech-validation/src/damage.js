// 伤害结算纯函数：严格按 01-12 的乘区与判定顺序实现，不依赖任何引擎。
export const ARMOR_CONSTANT = 100;
export const BASE_CRIT_MULTIPLIER = 1.5;
export const BURN_DURATION = 3;

// 穿透：第 1/2/3/4 个目标的伤害折减，超出第 4 个目标不再结算。
export const PIERCE_FALLOFF = [1, 0.85, 0.7, 0.55];

export function armorReduction(armor) {
  if (!Number.isFinite(armor) || armor <= 0) return 0;
  return armor / (armor + ARMOR_CONSTANT);
}

// 弹道折减：穿透按命中序号查表；弹射/分裂/爆炸按词条配置的伤害系数。
export function trajectoryScale(bullet = {}) {
  const { trajectory = 'direct', pierceIndex = 0, damageScale = 1 } = bullet;
  switch (trajectory) {
    case 'pierce':
      return PIERCE_FALLOFF[pierceIndex] ?? 0;
    case 'ricochet':
    case 'split':
    case 'explode':
      return damageScale;
    case 'direct':
    default:
      return 1;
  }
}

/**
 * @param {{attack?: number, skillCoeff?: number, attackPercentBonus?: number,
 *          critRate?: number, critDamageBonus?: number}} attacker
 * @param {{armor?: number}} target
 * @param {{trajectory?: string, pierceIndex?: number, damageScale?: number,
 *          critRoll?: number, forceCrit?: boolean}} bullet
 */
export function calcDamage(attacker = {}, target = {}, bullet = {}) {
  const attack = attacker.attack ?? 0;
  const skillCoeff = attacker.skillCoeff ?? 1;
  const attackPercentBonus = attacker.attackPercentBonus ?? 0;
  const critRate = attacker.critRate ?? 0;
  const critDamageBonus = attacker.critDamageBonus ?? 0;

  const critRoll = bullet.critRoll ?? Math.random();
  const isCrit = bullet.forceCrit ?? critRoll < critRate;
  const critMultiplier = isCrit ? BASE_CRIT_MULTIPLIER * (1 + critDamageBonus) : 1;

  const reduction = armorReduction(target.armor ?? 0);
  const scale = trajectoryScale(bullet);

  // 乘区：攻击力 → 系数 → 加算百分比 → 暴击 → 护甲 → 弹道折减
  const preMitigation = attack * skillCoeff * (1 + attackPercentBonus) * critMultiplier;
  const final = preMitigation * (1 - reduction) * scale;

  return {
    final,
    isCrit,
    critMultiplier,
    armorReduction: reduction,
    trajectoryScale: scale,
    preMitigation,
  };
}

// 灼烧：同一目标只保留一层，重复命中刷新持续时间、取更高每秒伤害。
export function applyBurn(current, next, now) {
  const duration = next.duration ?? BURN_DURATION;
  const dps = Math.max(current?.dps ?? 0, next.dps ?? 0);
  const expiresAt = Math.max(current?.expiresAt ?? 0, now + duration);
  return {
    stacks: 1,
    dps,
    expiresAt,
    sourceId: next.sourceId ?? current?.sourceId ?? null,
  };
}

export function burnTick(burn, now) {
  if (!burn) return 0;
  return now < burn.expiresAt ? burn.dps : 0;
}
