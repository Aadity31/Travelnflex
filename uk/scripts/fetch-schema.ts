/**
 * Script to fetch database schema from Neon and save to file
 * 
 * Usage:
 *   npx tsx scripts/fetch-schema.ts
 *   npm run db:schema
 * 
 * Output saved to: docs/db-schema-live.md
 */

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  column_key: string;
}

interface ForeignKey {
  constraint_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

interface TableSchema {
  table_name: string;
  columns: Column[];
  foreign_keys: ForeignKey[];
}

async function getTableNames(): Promise<string[]> {
  const result = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  return result.rows.map((row: { table_name: string }) => row.table_name);
}

async function getTableColumns(tableName: string): Promise<Column[]> {
  const result = await pool.query(`
    SELECT 
      c.column_name,
      c.data_type,
      c.is_nullable,
      c.column_default,
      CASE 
        WHEN kcu.column_name IS NOT NULL THEN 'PRI'
        ELSE ''
      END as column_key
    FROM information_schema.columns c
    LEFT JOIN information_schema.table_constraints tc
      ON tc.table_name = c.table_name 
      AND tc.constraint_type = 'PRIMARY KEY'
    LEFT JOIN information_schema.key_column_usage kcu
      ON kcu.constraint_name = tc.constraint_name
      AND kcu.column_name = c.column_name
    WHERE c.table_schema = 'public'
      AND c.table_name = $1
    ORDER BY c.ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getTableForeignKeys(tableName: string): Promise<ForeignKey[]> {
  const result = await pool.query(`
    SELECT
      tc.constraint_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = $1
  `, [tableName]);
  return result.rows;
}

async function getFullSchema(): Promise<TableSchema[]> {
  const tables = await getTableNames();
  const schema: TableSchema[] = [];

  for (const table of tables) {
    const [columns, foreignKeys] = await Promise.all([
      getTableColumns(table),
      getTableForeignKeys(table),
    ]);
    schema.push({
      table_name: table,
      columns,
      foreign_keys: foreignKeys,
    });
  }

  return schema;
}

function generateSQL(schema: TableSchema[]): string {
  let sql = `-- ============================================================\n`;
  sql += `-- Devbhoomi Darshan - Database Schema Export\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Database: Neon PostgreSQL\n`;
  sql += `-- ============================================================\n\n`;

  for (const table of schema) {
    sql += `-- ${table.table_name.toUpperCase()} TABLE\n`;
    sql += `-- ============================================================\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${table.table_name} (\n`;

    const colDefs: string[] = [];
    for (const col of table.columns) {
      let colDef = `    ${col.column_name} ${col.data_type}`;

      if (col.column_default) {
        colDef += ` DEFAULT ${col.column_default}`;
      }
      if (col.is_nullable === 'NO') {
        colDef += ' NOT NULL';
      }
      if (col.column_key === 'PRI') {
        colDef += ' PRIMARY KEY';
      }
      colDefs.push(colDef);
    }

    sql += colDefs.join(',\n');
    sql += '\n);\n\n';

    if (table.foreign_keys.length > 0) {
      for (const fk of table.foreign_keys) {
        sql += `-- Foreign Key: ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})\n`;
      }
      sql += '\n';
    }
  }

  return sql;
}

async function main() {
  console.log("🔍 Fetching schema from Neon database...\n");

  try {
    const schema = await getFullSchema();
    console.log(`✅ Found ${schema.length} tables\n`);

    for (const table of schema) {
      console.log(`  📋 ${table.table_name} (${table.columns.length} columns)`);
    }

    const sql = generateSQL(schema);
    const outputPath = path.join(process.cwd(), "db.sql");

    fs.writeFileSync(outputPath, sql);
    console.log(`\n💾 Schema saved to: ${outputPath}`);

    await pool.end();
    console.log("\n✨ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    await pool.end();
    process.exit(1);
  }
}

main();
