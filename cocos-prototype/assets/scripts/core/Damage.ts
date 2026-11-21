// 伤害结算纯函数：与 tech-validation/src/damage.js 保持同一实现。
export const ARMOR_CONSTANT = 100;
export const BASE_CRIT_MULTIPLIER = 1.5;
export const BURN_DURATION = 3;
export const PIERCE_FALLOFF = [1, 0.85, 0.7, 0.55];

export function armorReduction(armor: number): number {
  if (!Number.isFinite(armor) || armor <= 0) return 0;
  return armor / (armor + ARMOR_CONSTANT);
}

export function trajectoryScale(bullet: any = {}): number {
  const { trajectory = 'direct', pierceIndex = 0, damageScale = 1 } = bullet;
  switch (trajectory) {
    case 'pierce':
      return PIERCE_FALLOFF[pierceIndex] ?? 0;
    case 'ricochet':
    case 'split':
    case 'explode':
      return damageScale;
    default:
      return 1;
  }
}

export function calcDamage(attacker: any = {}, target: any = {}, bullet: any = {}): any {
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
  const preMitigation = attack * skillCoeff * (1 + attackPercentBonus) * critMultiplier;
  const final = preMitigation * (1 - reduction) * scale;

  return { final, isCrit, critMultiplier, armorReduction: reduction, trajectoryScale: scale, preMitigation };
}

export function applyBurn(current: any, next: any, now: number): any {
  const duration = next.duration ?? BURN_DURATION;
  const dps = Math.max(current?.dps ?? 0, next.dps ?? 0);
  const expiresAt = Math.max(current?.expiresAt ?? 0, now + duration);
  return { stacks: 1, dps, expiresAt, sourceId: next.sourceId ?? current?.sourceId ?? null };
}

export function burnTick(burn: any, now: number): number {
  if (!burn) return 0;
  return now < burn.expiresAt ? burn.dps : 0;
}
