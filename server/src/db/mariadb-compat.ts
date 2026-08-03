import deasync from 'deasync';
import mysql, { type Pool, type QueryResult } from 'mysql2';

type SqlParams = unknown[] | Record<string, unknown>;

function waitFor<T>(start: (done: (error: Error | null, value?: T) => void) => void): T {
  let finished = false;
  let error: Error | null = null;
  let value: T | undefined;
  start((err, result) => {
    error = err;
    value = result;
    finished = true;
  });
  deasync.loopWhile(() => !finished);
  if (error) throw error;
  return value as T;
}

function mariaSql(sql: string, params: SqlParams): { sql: string; values: unknown[] } {
  let text = sql
    .replace(/\bINSERT\s+OR\s+IGNORE\b/gi, 'INSERT IGNORE')
    .replace(/\bINSERT\s+OR\s+REPLACE\b/gi, 'REPLACE')
    .replace(/\bON\s+CONFLICT\s*\([^)]*\)\s*DO\s+UPDATE\s+SET\b/gi, 'ON DUPLICATE KEY UPDATE')
    .replace(/\bexcluded\.([A-Za-z_][A-Za-z0-9_]*)\b/gi, 'VALUES($1)')
    .replace(/\bdatetime\s*\(\s*'now'\s*\)/gi, 'CURRENT_TIMESTAMP')
    .replace(/\bdate\s*\(\s*'now'\s*\)/gi, 'CURRENT_DATE');

  // `key` is a reserved MariaDB word but is an existing column in several
  // inherited tables (app_settings, settings, idempotency_keys).
  text = text.replace(/\bkey\b/g, '`key`');

  if (Array.isArray(params)) return { sql: text, values: params };

  const values: unknown[] = [];
  text = text.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_whole, name: string) => {
    if (!(name in params)) throw new Error(`Missing named SQL parameter: ${name}`);
    values.push(params[name]);
    return '?';
  });
  return { sql: text, values };
}

function normalizeParams(args: unknown[]): SqlParams {
  if (args.length === 1 && Array.isArray(args[0])) return args[0] as unknown[];
  if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Buffer.isBuffer(args[0])) {
    return args[0] as Record<string, unknown>;
  }
  return args;
}

/**
 * Small synchronous compatibility layer for the existing better-sqlite3 call
 * sites. It keeps the legacy server operational while its query API is moved
 * to mysql2 over time. All main-application queries execute against MariaDB.
 */
export class MariaDbDatabase {
  private readonly connection: Pool;
  open = true;

  constructor() {
    this.connection = mysql.createPool({
      host: process.env.MARIADB_HOST || '127.0.0.1',
      port: Number(process.env.MARIADB_PORT || 3306),
      user: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || undefined,
      database: process.env.MARIADB_DATABASE || 'moons_migrated',
      charset: 'utf8mb4',
      // SQLite returned DATETIME values as strings. Retain that contract for
      // legacy services that append/parse UTC suffixes themselves.
      dateStrings: true,
      multipleStatements: true,
      connectionLimit: Number(process.env.MARIADB_POOL_SIZE || 12),
      queueLimit: 0,
    });
    this.connection.on('connection', (connection) => {
      connection.query("SET SESSION sql_mode = CONCAT(@@sql_mode, ',PIPES_AS_CONCAT')");
    });
    // Open one connection now so an invalid local database fails at startup,
    // not on the first browser request.
    waitFor<void>((done) => this.connection.getConnection((err, connection) => {
      if (connection) connection.release();
      done(err || null);
    }));
  }

  private query(sql: string, params: SqlParams): QueryResult {
    const bound = mariaSql(sql, params);
    return waitFor<QueryResult>((done) => {
      this.connection.query(bound.sql, bound.values, (err, result) => done(err || null, result as QueryResult));
    });
  }

  prepare(sql: string) {
    return {
      get: (...args: unknown[]) => {
        const rows = this.query(sql, normalizeParams(args)) as unknown[];
        return Array.isArray(rows) ? rows[0] : undefined;
      },
      all: (...args: unknown[]) => {
        const rows = this.query(sql, normalizeParams(args));
        return Array.isArray(rows) ? rows : [];
      },
      run: (...args: unknown[]) => {
        const result = this.query(sql, normalizeParams(args)) as unknown as { affectedRows?: number; insertId?: number };
        return { changes: result.affectedRows || 0, lastInsertRowid: result.insertId || 0 };
      },
      iterate: (...args: unknown[]) => {
        const rows = this.query(sql, normalizeParams(args));
        return (Array.isArray(rows) ? rows : [])[Symbol.iterator]();
      },
    };
  }

  exec(sql: string): void {
    // SQLite maintenance pragmas are intentionally no-ops on MariaDB.
    if (/^\s*PRAGMA\b/i.test(sql) || /^\s*VACUUM\b/i.test(sql)) return;
    this.query(sql, []);
  }

  transaction<T>(fn: () => T) {
    return () => {
      this.exec('START TRANSACTION');
      try {
        const result = fn();
        this.exec('COMMIT');
        return result;
      } catch (error) {
        try { this.exec('ROLLBACK'); } catch { /* preserve original failure */ }
        throw error;
      }
    };
  }

  close(): void {
    if (!this.open) return;
    waitFor<void>((done) => this.connection.end((err) => done(err || null)));
    this.open = false;
  }
}
