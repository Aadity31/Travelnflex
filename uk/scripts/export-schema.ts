/**
 * Comprehensive Database Schema Export Script
 * 
 * Exports complete Neon PostgreSQL database schema including:
 * - Tables with full column definitions
 * - Constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
 * - Indexes
 * - Views
 * - Sequences
 * - Functions/Procedures
 * - Triggers
 * 
 * Output: SQL file with DROP and CREATE statements
 * 
 * Usage:
 *   npx tsx scripts/export-schema.ts
 *   npm run db:export
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

// Types for database objects
interface TableInfo {
  table_name: string;
  table_type: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
}

interface PrimaryKeyInfo {
  constraint_name: string;
  column_name: string;
}

interface ForeignKeyInfo {
  constraint_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  on_delete: string;
  on_update: string;
}

interface UniqueConstraintInfo {
  constraint_name: string;
  column_name: string;
}

interface CheckConstraintInfo {
  constraint_name: string;
  check_clause: string;
}

interface IndexInfo {
  index_name: string;
  column_name: string;
  is_unique: boolean;
  is_primary: boolean;
  index_definition: string;
}

interface ViewInfo {
  view_name: string;
  definition: string;
}

interface SequenceInfo {
  sequence_name: string;
  data_type: string;
  start_value: number;
  min_value: number;
  max_value: number;
  increment_by: number;
  is_cycled: boolean;
  last_value: number | null;
}

interface FunctionInfo {
  function_name: string;
  arguments: string;
  return_type: string;
  definition: string;
  language: string;
}

// Helper to format timestamp for filename
function getTimestamp(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}`;
}

// ==================== FETCH FUNCTIONS ====================

async function getTables(): Promise<TableInfo[]> {
  const result = await pool.query(`
    SELECT table_name, table_type
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type IN ('BASE TABLE', 'VIEW')
    ORDER BY table_name
  `);
  return result.rows;
}

async function getColumns(tableName: string): Promise<ColumnInfo[]> {
  const result = await pool.query(`
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = $1
    ORDER BY ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getPrimaryKeys(tableName: string): Promise<PrimaryKeyInfo[]> {
  const result = await pool.query(`
    SELECT 
      tc.constraint_name,
      kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'public'
    AND tc.table_name = $1
    AND tc.constraint_type = 'PRIMARY KEY'
    ORDER BY kcu.ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]> {
  const result = await pool.query(`
    SELECT 
      tc.constraint_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      rc.update_rule AS on_update,
      rc.delete_rule AS on_delete
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    LEFT JOIN information_schema.referential_constraints rc
      ON rc.constraint_name = tc.constraint_name
      AND rc.constraint_schema = tc.table_schema
    WHERE tc.table_schema = 'public'
    AND tc.table_name = $1
    AND tc.constraint_type = 'FOREIGN KEY'
    ORDER BY kcu.ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getUniqueConstraints(tableName: string): Promise<UniqueConstraintInfo[]> {
  const result = await pool.query(`
    SELECT 
      tc.constraint_name,
      kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'public'
    AND tc.table_name = $1
    AND tc.constraint_type = 'UNIQUE'
    ORDER BY tc.constraint_name, kcu.ordinal_position
  `, [tableName]);
  return result.rows;
}

async function getCheckConstraints(tableName: string): Promise<CheckConstraintInfo[]> {
  const result = await pool.query(`
    SELECT 
      conname AS constraint_name,
      pg_get_constraintdef(c.oid) AS check_clause
    FROM pg_constraint c
    JOIN pg_class cl ON cl.oid = c.conrelid
    JOIN pg_namespace ns ON ns.oid = cl.relnamespace
    WHERE ns.nspname = 'public'
    AND cl.relname = $1
    AND c.contype = 'c'
  `, [tableName]);
  return result.rows;
}

async function getIndexes(tableName: string): Promise<IndexInfo[]> {
  const result = await pool.query(`
    SELECT 
      i.relname AS index_name,
      a.attname AS column_name,
      ix.indisunique AS is_unique,
      ix.indisprimary AS is_primary,
      pg_get_indexdef(ix.indexrelid) AS index_definition
    FROM pg_index ix
    JOIN pg_class i ON i.oid = ix.indexrelid
    JOIN pg_class t ON t.oid = ix.indrelid
    JOIN pg_namespace ns ON ns.oid = t.relnamespace
    LEFT JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
    WHERE ns.nspname = 'public'
    AND t.relname = $1
    AND NOT i.relname LIKE '%_pkey'  -- Exclude primary key indexes (auto-created)
    ORDER BY i.relname, a.attnum
  `, [tableName]);
  return result.rows;
}

async function getViews(): Promise<ViewInfo[]> {
  const result = await pool.query(`
    SELECT 
      viewname AS view_name,
      definition
    FROM pg_views
    WHERE schemaname = 'public'
    ORDER BY viewname
  `);
  return result.rows;
}

async function getSequences(): Promise<SequenceInfo[]> {
  const result = await pool.query(`
    SELECT 
      sequencename AS sequence_name,
      data_type,
      start_value,
      min_value,
      max_value,
      increment_by,
      false AS is_cycled,
      last_value
    FROM pg_sequences
    WHERE schemaname = 'public'
    ORDER BY sequencename
  `);
  return result.rows;
}

async function getFunctions(): Promise<FunctionInfo[]> {
  const result = await pool.query(`
    SELECT 
      p.proname AS function_name,
      pg_get_function_arguments(p.oid) AS arguments,
      pg_get_function_result(p.oid) AS return_type,
      pg_get_functiondef(p.oid) AS definition,
      l.lanname AS language
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    LEFT JOIN pg_language l ON l.oid = p.prolang
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'  -- Only functions, not procedures
    ORDER BY p.proname
  `);
  return result.rows;
}

async function getTriggers(): Promise<any[]> {
  const result = await pool.query(`
    SELECT 
      t.tgname AS trigger_name,
      c.relname AS table_name,
      pg_get_triggerdef(t.oid) AS trigger_definition
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND NOT t.tgisinternal  -- Exclude internal triggers
    ORDER BY c.relname, t.tgname
  `);
  return result.rows;
}

// ==================== SQL GENERATION ====================

function escapeSQL(text: string | null): string {
  if (!text) return '';
  return text.replace(/'/g, "''");
}

function formatDataType(dataType: string, columnDefault: string | null): string {
  // For SERIAL/BIGSERIAL, use GENERATED BY DEFAULT
  if (dataType === 'integer' && columnDefault?.includes('nextval')) {
    return 'INTEGER GENERATED BY DEFAULT AS IDENTITY';
  }
  if (dataType === 'bigint' && columnDefault?.includes('nextval')) {
    return 'BIGINT GENERATED BY DEFAULT AS IDENTITY';
  }
  if (dataType === 'smallint' && columnDefault?.includes('nextval')) {
    return 'SMALLINT GENERATED BY DEFAULT AS IDENTITY';
  }
  return dataType.toUpperCase();
}

function generateDropStatements(
  tables: TableInfo[],
  views: ViewInfo[],
  sequences: SequenceInfo[],
  functions: FunctionInfo[]
): string {
  let sql = `-- ============================================================
-- DROP STATEMENTS (Run these first for clean recreation)
-- ============================================================

-- Disable triggers temporarily for cleaner drops
SET session_replication_role = replica;

`;

  // Drop triggers first
  sql += `-- Drop Triggers\n`;
  
  // Drop functions (in reverse dependency order)
  if (functions.length > 0) {
    sql += `\n-- Drop Functions\n`;
    for (const func of functions) {
      sql += `DROP FUNCTION IF EXISTS ${func.function_name}(${func.arguments}) CASCADE;\n`;
    }
  }

  // Drop views
  if (views.length > 0) {
    sql += `\n-- Drop Views\n`;
    for (const view of views) {
      sql += `DROP VIEW IF EXISTS ${view.view_name} CASCADE;\n`;
    }
  }

  // Drop tables (in reverse order due to foreign keys)
  if (tables.length > 0) {
    sql += `\n-- Drop Tables\n`;
    for (const table of tables.filter(t => t.table_type === 'BASE TABLE').reverse()) {
      sql += `DROP TABLE IF EXISTS ${table.table_name} CASCADE;\n`;
    }
  }

  // Drop sequences
  if (sequences.length > 0) {
    sql += `\n-- Drop Sequences\n`;
    for (const seq of sequences) {
      sql += `DROP SEQUENCE IF EXISTS ${seq.sequence_name} CASCADE;\n`;
    }
  }

  sql += `\nSET session_replication_role = origin;\n`;

  return sql;
}

function generateCreateSequences(sequences: SequenceInfo[]): string {
  if (sequences.length === 0) return '';

  let sql = `-- ============================================================
-- SEQUENCES
-- ============================================================

`;
  for (const seq of sequences) {
    sql += `-- Sequence: ${seq.sequence_name}
CREATE SEQUENCE ${seq.sequence_name}
    AS ${seq.data_type.toUpperCase()}
    START WITH ${seq.start_value}
    MINVALUE ${seq.min_value}
    MAXVALUE ${seq.max_value}
    INCREMENT BY ${seq.increment_by}
    ${seq.is_cycled ? 'CYCLE' : 'NO CYCLE'}
    OWNED BY NONE;

`;
    if (seq.last_value !== null) {
      sql += `SELECT setval('${seq.sequence_name}', ${seq.last_value}, true);

`;
    }
  }

  return sql;
}

function generateCreateTables(
  tables: TableInfo[],
  tableColumns: Map<string, ColumnInfo[]>,
  primaryKeys: Map<string, PrimaryKeyInfo[]>,
  foreignKeys: Map<string, ForeignKeyInfo[]>,
  uniqueConstraints: Map<string, UniqueConstraintInfo[]>,
  checkConstraints: Map<string, CheckConstraintInfo[]>,
  indexes: Map<string, IndexInfo[]>
): string {
  const tableOnly = tables.filter(t => t.table_type === 'BASE TABLE');
  if (tableOnly.length === 0) return '';

  let sql = `-- ============================================================
-- TABLES
-- ============================================================

`;

  for (const table of tableOnly) {
    const columns = tableColumns.get(table.table_name) || [];
    const pks = primaryKeys.get(table.table_name) || [];
    const fks = foreignKeys.get(table.table_name) || [];
    const uniqs = uniqueConstraints.get(table.table_name) || [];
    const checks = checkConstraints.get(table.table_name) || [];
    const idxs = indexes.get(table.table_name) || [];

    sql += `-- --------------------------------------------------------------
-- Table: ${table.table_name}
-- --------------------------------------------------------------
CREATE TABLE ${table.table_name} (
`;

    // Column definitions
    const columnDefs: string[] = [];
    for (const col of columns) {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default 
        ? ` DEFAULT ${col.column_default}` 
        : '';
      const type = formatDataType(col.data_type, col.column_default);
      
      let def = `    ${col.column_name} ${type} ${nullable}${defaultVal}`;
      columnDefs.push(def);
    }

    // Primary key constraint
    if (pks.length > 0) {
      const pkCols = pks.map(pk => pk.column_name).join(', ');
      columnDefs.push(`    CONSTRAINT ${pks[0].constraint_name} PRIMARY KEY (${pkCols})`);
    }

    sql += columnDefs.join(',\n');
    sql += `\n);

`;

    // Add table comments
    sql += `-- Table ${table.table_name} has ${columns.length} columns\n`;

    // Foreign key constraints (as ALTER TABLE)
    for (const fk of fks) {
      sql += `ALTER TABLE ${table.table_name} 
    ADD CONSTRAINT ${fk.constraint_name} 
    FOREIGN KEY (${fk.column_name}) 
    REFERENCES ${fk.foreign_table_name}(${fk.foreign_column_name})
    ON DELETE ${fk.on_delete.toUpperCase()}
    ON UPDATE ${fk.on_update.toUpperCase()};

`;
    }

    // Unique constraints (as ALTER TABLE)
    const uniqueByConstraint = new Map<string, string[]>();
    for (const uniq of uniqs) {
      const existing = uniqueByConstraint.get(uniq.constraint_name) || [];
      existing.push(uniq.column_name);
      uniqueByConstraint.set(uniq.constraint_name, existing);
    }
    for (const [name, cols] of uniqueByConstraint) {
      sql += `ALTER TABLE ${table.table_name} 
    ADD CONSTRAINT ${name} UNIQUE (${cols.join(', ')});

`;
    }

    // Check constraints (as ALTER TABLE)
    for (const check of checks) {
      // Extract just the CHECK clause from pg_get_constraintdef
      const checkMatch = check.check_clause.match(/CHECK\s*\((.+)\)/i);
      if (checkMatch) {
        sql += `ALTER TABLE ${table.table_name} 
    ADD CONSTRAINT ${check.constraint_name} CHECK (${checkMatch[1]});

`;
      }
    }

    sql += `\n`;
  }

  // Indexes (excluding primary key indexes)
  sql += `-- ============================================================
-- INDEXES (Additional indexes beyond constraints)
-- ============================================================

`;
  const seenIndexes = new Set<string>();
  for (const [tableName, idxs] of indexes) {
    for (const idx of idxs) {
      const idxKey = `${idx.index_name}`;
      if (!seenIndexes.has(idxKey) && !idx.is_primary) {
        seenIndexes.add(idxKey);
        sql += `-- Index: ${idx.index_name} on ${tableName}.${idx.column_name}
CREATE ${idx.is_unique ? 'UNIQUE ' : ''}INDEX ${idx.index_name} 
    ON ${tableName} (${idx.column_name});

`;
      }
    }
  }

  return sql;
}

function generateCreateViews(views: ViewInfo[]): string {
  if (views.length === 0) return '';

  let sql = `-- ============================================================
-- VIEWS
-- ============================================================

`;
  for (const view of views) {
    sql += `-- View: ${view.view_name}
CREATE OR REPLACE VIEW ${view.view_name} AS
${view.definition};

`;
  }

  return sql;
}

function generateCreateFunctions(functions: FunctionInfo[]): string {
  if (functions.length === 0) return '';

  let sql = `-- ============================================================
-- FUNCTIONS
-- ============================================================

`;
  for (const func of functions) {
    sql += `-- Function: ${func.function_name}
${func.definition};

`;
  }

  return sql;
}

function generateTriggers(triggers: any[]): string {
  if (triggers.length === 0) return '';

  let sql = `-- ============================================================
-- TRIGGERS
-- ============================================================

`;
  for (const trigger of triggers) {
    sql += `-- Trigger: ${trigger.trigger_name} on ${trigger.table_name}
${trigger.trigger_definition};

`;
  }

  return sql;
}

function generateSchemaMetadata(
  tables: TableInfo[],
  views: ViewInfo[],
  sequences: SequenceInfo[],
  functions: FunctionInfo[],
  triggers: any[],
  totalIndexes: number,
  totalConstraints: number
): string {
  const tableCount = tables.filter(t => t.table_type === 'BASE TABLE').length;
  const viewCount = views.length;

  return `-- ============================================================
-- SCHEMA METADATA
-- ============================================================
-- 
-- Database: Neon PostgreSQL
-- Host: ${new URL(process.env.DATABASE_URL || '').hostname}
-- Database Name: neondb
-- SSL: Required
-- 
-- Export Generated: ${new Date().toISOString()}
-- 
-- OBJECT COUNTS:
--   - Tables: ${tableCount}
--   - Views: ${viewCount}
--   - Sequences: ${sequences.length}
--   - Functions: ${functions.length}
--   - Triggers: ${triggers.length}
--   - Indexes: ${totalIndexes}
--   - Constraints: ${totalConstraints}
-- 
-- TOTAL OBJECTS: ${tableCount + viewCount + sequences.length + functions.length + triggers.length}
-- 
-- ============================================================

`;
}

// ==================== MAIN ====================

async function main() {
  console.log('🔍 Exporting Neon PostgreSQL database schema...\n');

  try {
    // Fetch all database objects
    console.log('📋 Fetching database objects...');
    
    const [tables, views, sequences, functions, triggers] = await Promise.all([
      getTables(),
      getViews(),
      getSequences(),
      getFunctions(),
      getTriggers()
    ]);

    // Fetch table-specific metadata
    console.log('📊 Fetching table details...');
    const tableColumns = new Map<string, ColumnInfo[]>();
    const primaryKeys = new Map<string, PrimaryKeyInfo[]>();
    const foreignKeys = new Map<string, ForeignKeyInfo[]>();
    const uniqueConstraints = new Map<string, UniqueConstraintInfo[]>();
    const checkConstraints = new Map<string, CheckConstraintInfo[]>();
    const indexes = new Map<string, IndexInfo[]>();

    for (const table of tables.filter(t => t.table_type === 'BASE TABLE')) {
      const [cols, pks, fks, uniqs, checks, idxs] = await Promise.all([
        getColumns(table.table_name),
        getPrimaryKeys(table.table_name),
        getForeignKeys(table.table_name),
        getUniqueConstraints(table.table_name),
        getCheckConstraints(table.table_name),
        getIndexes(table.table_name)
      ]);
      
      tableColumns.set(table.table_name, cols);
      primaryKeys.set(table.table_name, pks);
      foreignKeys.set(table.table_name, fks);
      uniqueConstraints.set(table.table_name, uniqs);
      checkConstraints.set(table.table_name, checks);
      indexes.set(table.table_name, idxs);
    }

    // Calculate totals
    let totalIndexes = 0;
    let totalConstraints = 0;
    for (const [, idxs] of indexes) totalIndexes += idxs.length;
    for (const [, pks] of primaryKeys) totalConstraints += pks.length;
    for (const [, fks] of foreignKeys) totalConstraints += fks.length;

    // Generate SQL
    console.log('⚙️  Generating SQL schema...\n');

    const metadata = generateSchemaMetadata(
      tables, views, sequences, functions, triggers, totalIndexes, totalConstraints
    );
    
    const dropStatements = generateDropStatements(tables, views, sequences, functions);
    const createSequences = generateCreateSequences(sequences);
    const createTables = generateCreateTables(
      tables, tableColumns, primaryKeys, foreignKeys, 
      uniqueConstraints, checkConstraints, indexes
    );
    const createViews = generateCreateViews(views);
    const createFunctions = generateCreateFunctions(functions);
    const createTriggers = generateTriggers(triggers);

    const fullSQL = 
      metadata +
      dropStatements +
      createSequences +
      createTables +
      createViews +
      createFunctions +
      createTriggers;

    // Save to file with timestamp
    const timestamp = getTimestamp();
    const filename = `db-schema-export_${timestamp}.sql`;
    const outputPath = path.join(process.cwd(), filename);
    
    fs.writeFileSync(outputPath, fullSQL);
    
    // Summary
    const tableCount = tables.filter(t => t.table_type === 'BASE TABLE').length;
    console.log('✅ Schema export completed!\n');
    console.log('📊 Summary:');
    console.log(`   Tables: ${tableCount}`);
    console.log(`   Views: ${views.length}`);
    console.log(`   Sequences: ${sequences.length}`);
    console.log(`   Functions: ${functions.length}`);
    console.log(`   Triggers: ${triggers.length}`);
    console.log(`   Indexes: ${totalIndexes}`);
    console.log(`   Constraints: ${totalConstraints}\n`);
    console.log(`💾 Saved to: ${filename}`);
    console.log(`📁 Full path: ${outputPath}\n`);

    await pool.end();
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error exporting schema:', error);
    await pool.end();
    process.exit(1);
  }
}

main();
