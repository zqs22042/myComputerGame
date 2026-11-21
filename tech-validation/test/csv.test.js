import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../src/csv.js';

test('CSV：剥离 UTF-8 BOM 并解析表头', () => {
  const { header, rows } = parseCsv('\uFEFFid,name\n1,快速小怪\n');
  assert.deepEqual(header, ['id', 'name']);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, '1');
  assert.equal(rows[0].name, '快速小怪');
});

test('CSV：双引号包裹的逗号与转义引号', () => {
  const text = 'id,desc\n1,"每小时 * 20, 上限 ""400"""\n';
  const { rows } = parseCsv(text);
  assert.equal(rows[0].desc, '每小时 * 20, 上限 "400"');
});

test('CSV：空字段与 CRLF', () => {
  const text = 'a,b,c\r\n1,,3\r\n';
  const { rows } = parseCsv(text);
  assert.equal(rows[0].b, '');
  assert.equal(rows[0].c, '3');
});
