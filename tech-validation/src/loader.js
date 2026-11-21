// CSV 加载器：读取全部配置表 → 类型转换 → 字段/枚举/主键/引用完整性校验。
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from './csv.js';
import { TABLES, convertRows } from './schema.js';

export const DEFAULT_DOC_ROOT = path.resolve(import.meta.dirname, '..', '..', '孤军守卫-开发文档');

export function loadAllTables(docRoot = DEFAULT_DOC_ROOT) {
  const tables = {};
  const counts = {};
  const errors = [];

  for (const def of TABLES) {
    const filePath = path.join(docRoot, def.file);
    if (!fs.existsSync(filePath)) {
      errors.push(`缺少配置文件: ${def.file}`);
      tables[def.name] = [];
      counts[def.name] = 0;
      continue;
    }
    const { rows } = parseCsv(fs.readFileSync(filePath, 'utf8'));
    const converted = convertRows(def, rows, errors);
    tables[def.name] = converted;
    counts[def.name] = converted.length;
  }

  for (const def of TABLES) {
    if (!def.check) continue;
    errors.push(...def.check(tables[def.name] ?? [], tables));
  }

  return { tables, counts, errors, docRoot };
}
