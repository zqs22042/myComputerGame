// 通用 CSV 解析：支持 UTF-8 BOM、双引号包裹、字段内逗号、"" 转义、CRLF、空字段。
export function parseCsv(text) {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (inQuotes) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch === '\r') {
      // 忽略 CR，等待 LF
    } else {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const dataRows = rows.filter((cells) => !(cells.length === 1 && cells[0].trim() === ''));
  if (dataRows.length === 0) return { header: [], rows: [] };

  const header = dataRows.shift().map((h) => h.trim());
  const records = dataRows.map((cells) => {
    const record = {};
    header.forEach((name, index) => {
      record[name] = cells[index] === undefined ? '' : cells[index];
    });
    return record;
  });

  return { header, rows: records };
}
