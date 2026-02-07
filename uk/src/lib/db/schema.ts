import pool from "../db";

export interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  column_key: string;
}

export interface ForeignKey {
  constraint_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

export interface TableSchema {
  table_name: string;
  columns: TableColumn[];
  foreign_keys: ForeignKey[];
}

export interface IndexInfo {
  indexname: string;
  columns: string[];
}

// Get all table names
export async function getTableNames(): Promise<string[]> {
  const result = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  return result.rows.map((row) => row.table_name);
}

// Get columns for a specific table
export async function getTableColumns(tableName: string): Promise<TableColumn[]> {
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

// Get foreign keys for a specific table
export async function getTableForeignKeys(tableName: string): Promise<ForeignKey[]> {
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

// Get indexes for a specific table
export async function getTableIndexes(tableName: string): Promise<IndexInfo[]> {
  const result = await pool.query(`
    SELECT
      i.relname AS indexname,
      array_agg(a.attname ORDER BY a.attnum) AS columns
    FROM pg_index ix
    JOIN pg_class t ON t.oid = ix.indrelid
    JOIN pg_class i ON i.oid = ix.indexrelid
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
    WHERE t.relname = $1
    GROUP BY i.relname
  `, [tableName]);
  return result.rows.map((row) => ({
    indexname: row.indexname,
    columns: row.columns,
  }));
}

// Get complete schema for all tables
export async function getFullSchema(): Promise<TableSchema[]> {
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

// Get schema as SQL CREATE statements (for documentation)
export async function getSchemaAsSQL(): Promise<string> {
  const tables = await getTableNames();
  let sql = '-- Database Schema Export\n';
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;

  for (const table of tables) {
    const columns = await getTableColumns(table);
    const foreignKeys = await getTableForeignKeys(table);

    sql += `CREATE TABLE ${table} (\n`;
    const colDefs = columns.map((col) => {
      let def = `  ${col.column_name} ${col.data_type}`;
      if (col.column_default) {
        def += ` DEFAULT ${col.column_default}`;
      }
      if (col.is_nullable === 'NO') {
        def += ' NOT NULL';
      }
      if (col.column_key === 'PRI') {
        def += ' PRIMARY KEY';
      }
      return def;
    });

    // Add foreign key constraints
    for (const fk of foreignKeys) {
      colDefs.push(
        `  FOREIGN KEY (${fk.column_name}) REFERENCES ${fk.foreign_table_name}(${fk.foreign_column_name})`
      );
    }

    sql += colDefs.join(',\n');
    sql += `\n);\n\n`;
  }

  return sql;
}
