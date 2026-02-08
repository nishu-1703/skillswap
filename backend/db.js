const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'skillswap.db');
let db = null;

// Initialize database schema and load from disk
async function initializeDB() {
  const SQL = await initSqlJs();
  
  // Try to load existing database
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      credits INTEGER DEFAULT 100,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      teacherId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacherId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      skillId TEXT NOT NULL,
      teacherId TEXT NOT NULL,
      learnerId TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME,
      FOREIGN KEY (skillId) REFERENCES skills(id),
      FOREIGN KEY (teacherId) REFERENCES users(id),
      FOREIGN KEY (learnerId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      targetUserId TEXT NOT NULL,
      reviewerId TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      text TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(sessionId, reviewerId),
      FOREIGN KEY (sessionId) REFERENCES sessions(id),
      FOREIGN KEY (targetUserId) REFERENCES users(id),
      FOREIGN KEY (reviewerId) REFERENCES users(id)
    )
  `);

  // Initialize demo data if users table is empty
  const userCount = db.exec('SELECT COUNT(*) as count FROM users');
  if (userCount.length === 0 || userCount[0].values.length === 0 || userCount[0].values[0][0] === 0) {
    insertDemoData();
  }

  saveDatabase();
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function insertDemoData() {
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO users (id, email, password, name, credits, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['1', 'alice@skillswap.com', 'alice123', 'Alice', 100, now]
  );

  db.run(
    `INSERT INTO users (id, email, password, name, credits, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['2', 'bob@skillswap.com', 'bob123', 'Bob', 100, now]
  );

  db.run(
    `INSERT INTO skills (id, name, description, teacherId, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    ['skill_1', 'Guitar', 'Beginner guitar lessons', '1', now]
  );

  db.run(
    `INSERT INTO skills (id, name, description, teacherId, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    ['skill_2', 'Cooking', 'Home cooking basics', '2', now]
  );
}

function rowsToObjects(columns, rows) {
  if (!rows || rows.length === 0) return [];
  return rows.map(row => {
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

function execQuery(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const result = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return result;
  } catch (error) {
    console.error('Query error:', sql, params, error);
    return null;
  }
}

function execAll(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Query error:', sql, params, error);
    return [];
  }
}

function execRun(sql, params = []) {
  try {
    db.run(sql, params);
    saveDatabase();
    return { changes: db.getRowsModified() };
  } catch (error) {
    console.error('Run error:', sql, params, error);
    return { changes: 0 };
  }
}

// Helper functions
function getUser(id) {
  return execQuery('SELECT * FROM users WHERE id = ?', [id]);
}

function getUserByEmail(email) {
  return execQuery('SELECT * FROM users WHERE email = ?', [email]);
}

function createUser(id, email, password, name) {
  return execRun(
    `INSERT INTO users (id, email, password, name, credits) VALUES (?, ?, ?, ?, 100)`,
    [id, email, password, name]
  );
}

function getSkill(id) {
  return execQuery('SELECT * FROM skills WHERE id = ?', [id]);
}

function getAllSkills() {
  return execAll(`
    SELECT s.*, u.name as teacherName, u.email as teacherEmail
    FROM skills s
    JOIN users u ON s.teacherId = u.id
    ORDER BY s.createdAt DESC
  `);
}

function getUserSkills(userId) {
  return execAll(
    'SELECT * FROM skills WHERE teacherId = ? ORDER BY createdAt DESC',
    [userId]
  );
}

function addSkill(id, name, description, teacherId) {
  return execRun(
    `INSERT INTO skills (id, name, description, teacherId) VALUES (?, ?, ?, ?)`,
    [id, name, description, teacherId]
  );
}

function deleteSkill(id) {
  return execRun('DELETE FROM skills WHERE id = ?', [id]);
}

function getSession(id) {
  return execQuery('SELECT * FROM sessions WHERE id = ?', [id]);
}

function getUserSessions(userId) {
  return execAll(`
    SELECT s.*, sk.name as skillName, sk.description as skillDesc,
           l.name as learnerName, t.name as teacherName
    FROM sessions s
    JOIN skills sk ON s.skillId = sk.id
    JOIN users l ON s.learnerId = l.id
    JOIN users t ON s.teacherId = t.id
    WHERE s.learnerId = ? OR s.teacherId = ?
    ORDER BY s.requestedAt DESC
  `, [userId, userId]);
}

function createSession(id, skillId, teacherId, learnerId) {
  return execRun(
    `INSERT INTO sessions (id, skillId, teacherId, learnerId, status) VALUES (?, ?, ?, ?, 'pending')`,
    [id, skillId, teacherId, learnerId]
  );
}

function updateSessionStatus(id, status) {
  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  return execRun(
    `UPDATE sessions SET status = ?, completedAt = ? WHERE id = ?`,
    [status, completedAt, id]
  );
}

function updateUserCredits(userId, amount) {
  return execRun(
    `UPDATE users SET credits = credits + ? WHERE id = ?`,
    [amount, userId]
  );
}

function getUserCredits(userId) {
  const result = execQuery('SELECT credits FROM users WHERE id = ?', [userId]);
  return result ? result.credits : 0;
}

function getReviews(targetUserId) {
  return execAll(
    `SELECT id, rating, text, createdAt FROM reviews WHERE targetUserId = ? ORDER BY createdAt DESC`,
    [targetUserId]
  );
}

function addReview(id, sessionId, targetUserId, reviewerId, rating, text) {
  return execRun(
    `INSERT INTO reviews (id, sessionId, targetUserId, reviewerId, rating, text) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, sessionId, targetUserId, reviewerId, rating, text]
  );
}

function checkReviewExists(sessionId, reviewerId) {
  const result = execQuery(
    `SELECT COUNT(*) as count FROM reviews WHERE sessionId = ? AND reviewerId = ?`,
    [sessionId, reviewerId]
  );
  return result && result.count > 0;
}

function resetDemo() {
  execRun('DELETE FROM reviews');
  execRun('DELETE FROM sessions');
  execRun('DELETE FROM skills');
  execRun('DELETE FROM users');
  insertDemoData();
}

module.exports = {
  initializeDB,
  getUser,
  getUserByEmail,
  createUser,
  getSkill,
  getAllSkills,
  getUserSkills,
  addSkill,
  deleteSkill,
  getSession,
  getUserSessions,
  createSession,
  updateSessionStatus,
  updateUserCredits,
  getUserCredits,
  getReviews,
  addReview,
  checkReviewExists,
  resetDemo
};
