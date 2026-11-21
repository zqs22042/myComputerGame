// 从文档 CSV 生成运行时 JSON，保证 Cocos 与 tech-validation 共用同一份配置源。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAllTables } from '../../tech-validation/src/loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../assets/resources');
const outFile = path.join(outDir, 'config.json');

const { tables, counts, errors } = loadAllTables();
if (errors.length > 0) {
  console.error('配置校验失败，未生成 config.json：');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  counts,
  tables,
};
fs.writeFileSync(outFile, JSON.stringify(payload, (key, value) => (value === Infinity ? 9999 : value), 2), 'utf8');
console.log(`已生成 ${outFile}`);
console.log(`表数量 ${Object.keys(counts).length}，总行数 ${Object.values(counts).reduce((a, b) => a + b, 0)}`);
