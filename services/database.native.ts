import * as SQLite from 'expo-sqlite';
import { BirthRecord, SyncStatus } from '@/types/birth';

const DB_NAME = 'naissancechain.db';
let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Table des dossiers
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY NOT NULL,
        childFirstName TEXT,
        childLastName TEXT,
        sex TEXT,
        birthDate TEXT,
        birthTime TEXT,
        birthPlace TEXT,
        fatherName TEXT,
        motherName TEXT,
        address TEXT,
        healthCenter TEXT,
        agentName TEXT,
        createdAt TEXT,
        syncedAt TEXT,
        status TEXT,
        proofHash TEXT
      );
    `);

    // Migration : Ajouter les colonnes manquantes si elles n'existent pas
    const tableInfo = await db.getAllAsync<any>("PRAGMA table_info(records)");
    const existingColumns = tableInfo.map(col => col.name);
    
    const missingColumns = [
      'fatherAge', 'fatherBirthPlace', 'fatherProfession', 'fatherNationality',
      'motherAge', 'motherBirthPlace', 'motherProfession', 'motherNationality',
      'declarantName', 'declarantRelation', 'declarantTel', 'declarantIdPiece',
      'witness1Name', 'witness1IdPiece', 'witness2Name', 'witness2IdPiece'
    ];

    for (const col of missingColumns) {
      if (!existingColumns.includes(col)) {
        await db.execAsync(`ALTER TABLE records ADD COLUMN ${col} TEXT;`);
        console.log(`Column ${col} added to records table.`);
      }
    }
    // Table des paramètres
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
    `);

    // Table des utilisateurs (pour la gestion sécurisée du PIN)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pin TEXT,
        sync_status INTEGER DEFAULT 0,
        last_updated TEXT
      );
    `);
  }
  return db;
}

export async function getSetting(key: string): Promise<string | null> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
  return result?.value || null;
}

export async function setSetting(key: string, value: string) {
  const database = await initDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export async function insertRecord(record: BirthRecord) {
  const database = await initDatabase();
  await database.runAsync(
    `INSERT INTO records (
      id, childFirstName, childLastName, sex, birthDate, birthTime, birthPlace, 
      fatherName, fatherAge, fatherBirthPlace, fatherProfession, fatherNationality,
      motherName, motherAge, motherBirthPlace, motherProfession, motherNationality,
      declarantName, declarantRelation, declarantTel, declarantIdPiece,
      witness1Name, witness1IdPiece, witness2Name, witness2IdPiece,
      address, healthCenter, agentName, createdAt, syncedAt, status, proofHash
    ) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id,
      record.childFirstName,
      record.childLastName,
      record.sex,
      record.birthDate,
      record.birthTime,
      record.birthPlace,
      record.fatherName,
      record.fatherAge || null,
      record.fatherBirthPlace || null,
      record.fatherProfession || null,
      record.fatherNationality || null,
      record.motherName,
      record.motherAge || null,
      record.motherBirthPlace || null,
      record.motherProfession || null,
      record.motherNationality || null,
      record.declarantName || null,
      record.declarantRelation || null,
      record.declarantTel || null,
      record.declarantIdPiece || null,
      record.witness1Name || null,
      record.witness1IdPiece || null,
      record.witness2Name || null,
      record.witness2IdPiece || null,
      record.address,
      record.healthCenter,
      record.agentName,
      record.createdAt,
      record.syncedAt || null,
      record.status,
      record.proofHash
    ]
  );
}

export async function getAllRecords(): Promise<BirthRecord[]> {
  const database = await initDatabase();
  const results = await database.getAllAsync<any>('SELECT * FROM records ORDER BY createdAt DESC');
  return results.map(row => ({
    ...row,
    syncedAt: row.syncedAt || undefined
  })) as BirthRecord[];
}

export async function updateRecordStatus(id: string, status: SyncStatus, syncedAt?: string) {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE records SET status = ?, syncedAt = ? WHERE id = ?',
    [status, syncedAt || null, id]
  );
}

export async function getUserPin(): Promise<string | null> {
  const database = await initDatabase();
  const row = await database.getFirstAsync<{ pin: string }>('SELECT pin FROM users LIMIT 1');
  return row?.pin || null;
}

export async function setUserPin(hashedPin: string) {
  const database = await initDatabase();
  const now = new Date().toISOString();
  
  // On vérifie s'il y a déjà un utilisateur
  const existing = await database.getFirstAsync('SELECT id FROM users LIMIT 1');
  
  if (existing) {
    await database.runAsync(
      'UPDATE users SET pin = ?, sync_status = 0, last_updated = ?',
      [hashedPin, now]
    );
  } else {
    await database.runAsync(
      'INSERT INTO users (pin, sync_status, last_updated) VALUES (?, 0, ?)',
      [hashedPin, now]
    );
  }
}

export async function deleteDatabase() {
  const database = await initDatabase();
  await database.execAsync('DELETE FROM records');
}
