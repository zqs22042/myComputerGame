// 把 tech-validation 的纯逻辑同步进 Cocos 的 assets 目录。
// Cocos Creator 只编译 assets/ 下的脚本，跨目录 import 无法打包，故用同步副本。
// 副本以 .ts 形式落盘：Cocos 把 assets 下的 .js 当 CommonJS，ESM 的 export 会报错。
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, '..');
const srcRoot = join(projectRoot, '..', 'tech-validation', 'src');
const destRoot = join(projectRoot, 'assets', 'scripts', 'logic');

// 保持相对结构，battleModelCore.js 内部的 ./core/*、./damage.js 引用只需去掉扩展名。
const FILES = [
  'core/endless.js',
  'core/upgrade.js',
  'core/softGrowth.js',
  'damage.js',
  'battleModelCore.js',
];

for (const rel of FILES) {
  const source = readFileSync(join(srcRoot, rel), 'utf8');
  // 相对导入去掉 .js 后缀，交由 TS 解析到同名 .ts
  const code = source.replace(/(from\s+['"])(\.{1,2}\/[^'"]+)\.js(['"])/g, '$1$2$3');
  // 副本是纯 JS 的机械镜像，类型真相由 tech-validation 的 node --test 保证，这里跳过类型检查
  const header = '// @ts-nocheck\n// 由 tools/sync-logic.mjs 自动生成，请勿直接修改；改动请落在 tech-validation/src。\n';

  const dest = join(destRoot, rel.replace(/\.js$/, '.ts'));
  mkdirSync(dirname(dest), { recursive: true });
  // 类字段在构造函数里赋值，TS 不会推导成类型成员；用接口合并开放动态属性访问
  const classMatch = /export class (\w+)/.exec(code);
  const merge = classMatch
    ? `\n\n// 字段在构造函数中赋值，开放动态属性访问供包装层使用\nexport interface ${classMatch[1]} { [key: string]: any }\n`
    : '';
  writeFileSync(dest, header + code + merge);

  // 清掉早期同步产生的 .js 副本及其 meta，避免同一模块两份实现。
  const stale = join(destRoot, rel);
  if (existsSync(stale)) rmSync(stale);
  if (existsSync(`${stale}.meta`)) rmSync(`${stale}.meta`);

  console.log(`synced ${rel} -> ${rel.replace(/\.js$/, '.ts')}`);
}
