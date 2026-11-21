import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcDamage,
  armorReduction,
  trajectoryScale,
  applyBurn,
  burnTick,
} from '../src/damage.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('伤害：基础攻击 × 系数', () => {
  const result = calcDamage({ attack: 100, skillCoeff: 1.8 }, { armor: 0 }, { critRoll: 1 });
  close(result.final, 180);
  assert.equal(result.isCrit, false);
});

test('伤害：百分比加成为同一乘区内加算', () => {
  const result = calcDamage(
    { attack: 100, attackPercentBonus: 0.3 + 0.2 },
    { armor: 0 },
    { critRoll: 1 },
  );
  close(result.final, 150);
});

test('伤害：暴击倍率 1.5 × (1 + 暴伤加成)', () => {
  const baseCrit = calcDamage({ attack: 100, critRate: 0 }, { armor: 0 }, { forceCrit: true });
  close(baseCrit.final, 150);
  const boostedCrit = calcDamage(
    { attack: 100, critRate: 0, critDamageBonus: 0.5 },
    { armor: 0 },
    { forceCrit: true },
  );
  close(boostedCrit.final, 225);
});

test('伤害：护甲减伤 = 护甲 / (护甲 + 100)', () => {
  close(armorReduction(0), 0);
  close(armorReduction(100), 0.5);
  const result = calcDamage({ attack: 100 }, { armor: 100 }, { critRoll: 1 });
  close(result.final, 50);
});

test('伤害：穿透第 2/3/4 目标 ×0.85/0.7/0.55，超出不再结算', () => {
  const scales = [0, 1, 2, 3].map((pierceIndex) => trajectoryScale({ trajectory: 'pierce', pierceIndex }));
  assert.deepEqual(scales, [1, 0.85, 0.7, 0.55]);
  assert.equal(trajectoryScale({ trajectory: 'pierce', pierceIndex: 4 }), 0);
});

test('伤害：弹射/分裂/爆炸使用配置系数', () => {
  close(trajectoryScale({ trajectory: 'ricochet', damageScale: 0.4 }), 0.4);
  close(trajectoryScale({ trajectory: 'split', damageScale: 0.25 }), 0.25);
  close(trajectoryScale({ trajectory: 'explode', damageScale: 1.3 }), 1.3);
});

test('伤害：穿透与护甲乘区叠乘', () => {
  const result = calcDamage(
    { attack: 200 },
    { armor: 100 },
    { trajectory: 'pierce', pierceIndex: 1, critRoll: 1 },
  );
  close(result.final, 200 * 0.85 * 0.5);
});

test('灼烧：刷新持续时间，不叠层', () => {
  const first = applyBurn(null, { dps: 10 }, 0);
  assert.equal(first.stacks, 1);
  assert.equal(first.expiresAt, 3);

  const refreshed = applyBurn(first, { dps: 8 }, 2);
  assert.equal(refreshed.stacks, 1);
  assert.equal(refreshed.dps, 10);
  assert.equal(refreshed.expiresAt, 5);
  assert.equal(burnTick(refreshed, 4), 10);
  assert.equal(burnTick(refreshed, 5), 0);
});
