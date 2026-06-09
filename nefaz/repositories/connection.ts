import * as SQLite from 'expo-sqlite';

export const initDB = async () => {
  
    const db = await SQLite.openDatabaseAsync('estoque_nfe.db');


    await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    
    -- Tabela mestre do produto (O catálogo)
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      quantidade_total REAL DEFAULT 0,
      custo_medio REAL DEFAULT 0
    );

    -- Tabela para registrar cada item lido da NFe
    CREATE TABLE IF NOT EXISTS entradas_estoque (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      quantidade REAL NOT NULL,
      valor_unitario REAL NOT NULL,
      valor_total REAL NOT NULL,
      data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
      chave_nfe TEXT,
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
  `);

    return db;
};