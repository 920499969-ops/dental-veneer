const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'dental.db');
let db;

function initDB() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      username TEXT DEFAULT '',
      password_hash TEXT DEFAULT '',
      display_name TEXT NOT NULL,
      role TEXT DEFAULT 'staff' CHECK(role IN ('manager','staff')),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','active')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS verify_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      service_type TEXT NOT NULL DEFAULT 'consultation',
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','completed','cancelled')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_key TEXT UNIQUE NOT NULL,
      customer_name TEXT DEFAULT '访客',
      status TEXT DEFAULT 'ai' CHECK(status IN ('ai','agent')),
      agent_name TEXT DEFAULT '',
      unread INTEGER DEFAULT 0,
      deleted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user','bot','agent','system')),
      text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    );
  `);

  // Migration: add deleted column if missing
  try { db.exec('ALTER TABLE chat_sessions ADD COLUMN deleted INTEGER DEFAULT 0'); } catch (e) { /* already exists */ }

  // Seed store manager: 13976387730 / admin123
  const mgr = db.prepare('SELECT id FROM admins WHERE phone = ?').get('13976387730');
  if (!mgr) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admins (phone, username, password_hash, display_name, role, status) VALUES (?, ?, ?, ?, ?, ?)').run(
      '13976387730', '13976387730', hash, '吴店长', 'manager', 'approved'
    );
    console.log('Store manager: 13976387730 (免密登录)');
  }

  // Special staff seed removed for production

  return db;
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}

module.exports = { initDB, getDB };
