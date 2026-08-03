import Database from 'better-sqlite3';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');
const sourceFile = process.env.SQLITE_FILE || path.join(rootDir, 'server', 'data', 'travel.db');
const targetDb = process.env.MARIADB_DATABASE || 'moons_migrated';
const mysqlExe = process.env.MARIADB_CLIENT || 'C:\\xampp\\mysql\\bin\\mysql.exe';
const mysqlArgs = ['--protocol=TCP', '-h', process.env.MARIADB_HOST || '127.0.0.1', '-P', process.env.MARIADB_PORT || '3306', '-u', process.env.MARIADB_USER || 'root', '--skip-password'];

function runMaria(sql, database) {
  const result = spawnSync(mysqlExe, database ? [...mysqlArgs, database] : mysqlArgs, {
    input: sql,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'MariaDB command failed');
}

function ident(name) {
  return `\`${String(name).replaceAll('`', '``')}\``;
}

function columnType(sqliteType = '', indexed = false) {
  const type = sqliteType.toUpperCase();
  if (type.includes('INT')) return 'BIGINT';
  if (type.includes('REAL') || type.includes('FLOA') || type.includes('DOUB')) return 'DOUBLE';
  if (type.includes('BLOB')) return 'LONGBLOB';
  if (type.includes('BOOL')) return 'TINYINT(1)';
  if (type.includes('DATE') || type.includes('TIME')) return 'DATETIME';
  // MariaDB does not permit LONGTEXT in a primary key without a prefix.
  // SQLite commonly uses TEXT UUIDs as ids, so preserve them as indexable strings.
  if (type.includes('CHAR') || type.includes('TEXT') || type.includes('CLOB')) return indexed ? 'VARCHAR(255)' : 'LONGTEXT';
  return 'LONGTEXT';
}

function valueSql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (Buffer.isBuffer(value)) return `X'${value.toString('hex')}'`;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'bigint') return value.toString();
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "''").replaceAll('\0', '\\0')}'`;
}

const sqlite = new Database(sourceFile, { readonly: true });
const tables = sqlite
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map(({ name }) => name);

runMaria(`CREATE DATABASE IF NOT EXISTS ${ident(targetDb)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, undefined);
runMaria('SET FOREIGN_KEY_CHECKS = 0;', targetDb);

let rowCount = 0;
for (const table of tables) {
  const columns = sqlite.prepare(`PRAGMA table_info(${ident(table)})`).all();
  const primary = columns.filter((column) => column.pk).sort((a, b) => a.pk - b.pk);
  const definitions = columns.map((column) => {
    const notNull = column.notnull ? ' NOT NULL' : ' NULL';
    const isAutoIncrementId = primary.length === 1 && column.pk === 1 && column.name === 'id' && /INT/i.test(column.type || '');
    return `${ident(column.name)} ${columnType(column.type, column.pk > 0)}${notNull}${isAutoIncrementId ? ' AUTO_INCREMENT' : ''}`;
  });
  if (primary.length) definitions.push(`PRIMARY KEY (${primary.map((column) => ident(column.name)).join(', ')})`);

  runMaria(`DROP TABLE IF EXISTS ${ident(table)}; CREATE TABLE ${ident(table)} (${definitions.join(', ')}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`, targetDb);

  const rows = sqlite.prepare(`SELECT * FROM ${ident(table)}`).all();
  const names = columns.map((column) => column.name);
  for (let start = 0; start < rows.length; start += 250) {
    const batch = rows.slice(start, start + 250);
    const values = batch.map((row) => `(${names.map((name) => valueSql(row[name])).join(', ')})`).join(',\n');
    runMaria(`INSERT INTO ${ident(table)} (${names.map(ident).join(', ')}) VALUES\n${values};`, targetDb);
  }
  rowCount += rows.length;
  console.log(`${table}: ${rows.length} rows`);
}

runMaria('SET FOREIGN_KEY_CHECKS = 1;', targetDb);
sqlite.close();
console.log(`Migrated ${tables.length} tables and ${rowCount} rows to MariaDB database '${targetDb}'.`);
