const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

// Respect explicit PGSSLMODE and only default to SSL in production.
const pgSslMode = (process.env.PGSSLMODE || '').toLowerCase();
const sslDisabledModes = new Set(['disable', 'false', '0', 'no']);
const sslEnabledModes = new Set(['require', 'verify-ca', 'verify-full', 'true', '1', 'yes']);

let sslModeFromUrl = null;
if (connectionString) {
  try {
    const parsed = new URL(connectionString);
    sslModeFromUrl = parsed.searchParams.get('sslmode')?.toLowerCase() || null;
  } catch {
    // Ignore URL parse failures and fall back to env-based detection.
  }
}

const sslExplicitlyDisabled = sslDisabledModes.has(pgSslMode) || sslModeFromUrl === 'disable';
const sslExplicitlyEnabled = sslEnabledModes.has(pgSslMode) ||
  (sslModeFromUrl !== null && sslModeFromUrl !== 'disable');
const useSsl = sslExplicitlyEnabled || (!sslExplicitlyDisabled && process.env.NODE_ENV === 'production');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

// Initialize database schema
async function initializeDB() {
  try {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER DEFAULT 100,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "teacherId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("teacherId") REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        "skillId" TEXT NOT NULL,
        "teacherId" TEXT NOT NULL,
        "learnerId" TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        "requestedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TIMESTAMP,
        FOREIGN KEY ("skillId") REFERENCES skills(id),
        FOREIGN KEY ("teacherId") REFERENCES users(id),
        FOREIGN KEY ("learnerId") REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        "sessionId" TEXT NOT NULL,
        "targetUserId" TEXT NOT NULL,
        "reviewerId" TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        text TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("sessionId", "reviewerId"),
        FOREIGN KEY ("sessionId") REFERENCES sessions(id),
        FOREIGN KEY ("targetUserId") REFERENCES users(id),
        FOREIGN KEY ("reviewerId") REFERENCES users(id)
      )
    `);

    // Initialize demo data if users table is empty
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      await insertDemoData();
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function insertDemoData() {
  const now = new Date().toISOString();

  try {
    await pool.query(
      `INSERT INTO users (id, email, password, name, credits, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['1', 'alice@skillswap.com', 'alice123', 'Alice', 100, now]
    );

    await pool.query(
      `INSERT INTO users (id, email, password, name, credits, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['2', 'bob@skillswap.com', 'bob123', 'Bob', 100, now]
    );

    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId", "createdAt")
       VALUES ($1, $2, $3, $4, $5)`,
      ['skill_1', 'Guitar', 'Beginner guitar lessons', '1', now]
    );

    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId", "createdAt")
       VALUES ($1, $2, $3, $4, $5)`,
      ['skill_2', 'Cooking', 'Home cooking basics', '2', now]
    );

    console.log('Demo data inserted');
  } catch (error) {
    console.error('Demo data insertion error:', error);
  }
}

// Helper functions
async function getUser(id) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function createUser(id, email, password, name) {
  try {
    await pool.query(
      `INSERT INTO users (id, email, password, name, credits) VALUES ($1, $2, $3, $4, 100)`,
      [id, email, password, name]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function getSkill(id) {
  try {
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function getAllSkills() {
  try {
    const result = await pool.query(`
      SELECT s.*, u.name as "teacherName", u.email as "teacherEmail"
      FROM skills s
      JOIN users u ON s."teacherId" = u.id
      ORDER BY s."createdAt" DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function getUserSkills(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM skills WHERE "teacherId" = $1 ORDER BY "createdAt" DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function addSkill(id, name, description, teacherId) {
  try {
    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId") VALUES ($1, $2, $3, $4)`,
      [id, name, description, teacherId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function deleteSkill(id) {
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    return { changes: 1 };
  } catch (error) {
    console.error('Delete error:', error);
    return { changes: 0 };
  }
}

async function getSession(id) {
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function getUserSessions(userId) {
  try {
    const result = await pool.query(`
      SELECT s.*, sk.name as "skillName", sk.description as "skillDesc",
             l.name as "learnerName", t.name as "teacherName"
      FROM sessions s
      JOIN skills sk ON s."skillId" = sk.id
      JOIN users l ON s."learnerId" = l.id
      JOIN users t ON s."teacherId" = t.id
      WHERE s."learnerId" = $1 OR s."teacherId" = $2
      ORDER BY s."requestedAt" DESC
    `, [userId, userId]);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function createSession(id, skillId, teacherId, learnerId) {
  try {
    await pool.query(
      `INSERT INTO sessions (id, "skillId", "teacherId", "learnerId", status) VALUES ($1, $2, $3, $4, 'pending')`,
      [id, skillId, teacherId, learnerId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function updateSessionStatus(id, status) {
  try {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    await pool.query(
      `UPDATE sessions SET status = $1, "completedAt" = $2 WHERE id = $3`,
      [status, completedAt, id]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Update error:', error);
    return { changes: 0 };
  }
}

async function updateUserCredits(userId, amount) {
  try {
    await pool.query(
      `UPDATE users SET credits = credits + $1 WHERE id = $2`,
      [amount, userId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Update error:', error);
    return { changes: 0 };
  }
}

async function getUserCredits(userId) {
  try {
    const result = await pool.query('SELECT credits FROM users WHERE id = $1', [userId]);
    return result.rows[0] ? result.rows[0].credits : 0;
  } catch (error) {
    console.error('Query error:', error);
    return 0;
  }
}

async function getReviews(targetUserId) {
  try {
    const result = await pool.query(
      `SELECT id, rating, text, "createdAt" FROM reviews WHERE "targetUserId" = $1 ORDER BY "createdAt" DESC`,
      [targetUserId]
    );
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function addReview(id, sessionId, targetUserId, reviewerId, rating, text) {
  try {
    await pool.query(
      `INSERT INTO reviews (id, "sessionId", "targetUserId", "reviewerId", rating, text) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, sessionId, targetUserId, reviewerId, rating, text]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function checkReviewExists(sessionId, reviewerId) {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM reviews WHERE "sessionId" = $1 AND "reviewerId" = $2`,
      [sessionId, reviewerId]
    );
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Query error:', error);
    return false;
  }
}

async function resetDemo() {
  try {
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM sessions');
    await pool.query('DELETE FROM skills');
    await pool.query('DELETE FROM users');
    await insertDemoData();
  } catch (error) {
    console.error('Reset error:', error);
  }
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
