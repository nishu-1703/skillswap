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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
        reason TEXT NOT NULL,
        "sessionId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
        FOREIGN KEY ("userId") REFERENCES users(id),
        FOREIGN KEY ("sessionId") REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS direct_messages (
        id TEXT PRIMARY KEY,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        text TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "isRead" BOOLEAN DEFAULT false,
        FOREIGN KEY ("senderId") REFERENCES users(id),
        FOREIGN KEY ("receiverId") REFERENCES users(id)
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

    await pool.query(
      `INSERT INTO sessions (id, "skillId", "teacherId", "learnerId", status, "requestedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['session_1', 'skill_1', '1', '2', 'pending', now]
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

async function getAllUsers(excludeUserId = null) {
  try {
    let query = 'SELECT id, name, email FROM users';
    let params = [];
    if (excludeUserId) {
      query += ' WHERE id != $1';
      params = [excludeUserId];
    }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
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
    await pool.query('DELETE FROM credit_transactions');
    await pool.query('DELETE FROM sessions');
    await pool.query('DELETE FROM skills');
    await pool.query('DELETE FROM users');
    await insertDemoData();
  } catch (error) {
    console.error('Reset error:', error);
  }
}

// Credit Transaction Functions
async function addCreditTransaction(userId, amount, type, reason, sessionId = null) {
  try {
    const id = 'txn_' + Date.now();
    // Credits earned from teaching expire after 6 months (180 days)
    const expiresAt = type === 'earn' ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) : null;
    
    const result = await pool.query(
      `INSERT INTO credit_transactions (id, "userId", amount, type, reason, "sessionId", "expiresAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, userId, amount, type, reason, sessionId, expiresAt]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Add credit transaction error:', error);
    return null;
  }
}

async function getTransactionHistory(userId, limit = 20) {
  try {
    const result = await pool.query(
      `SELECT * FROM credit_transactions 
       WHERE "userId" = $1 
       ORDER BY "createdAt" DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Get transaction history error:', error);
    return [];
  }
}

async function getActiveCredits(userId) {
  try {
    const result = await pool.query(
      `SELECT SUM(CASE WHEN type = 'earn' THEN amount ELSE -amount END) as "activeCredits"
       FROM credit_transactions
       WHERE "userId" = $1 AND status = 'active' AND (type = 'earn' OR type = 'spend')`,
      [userId]
    );
    return result.rows[0]?.activeCredits || 0;
  } catch (error) {
    console.error('Get active credits error:', error);
    return 0;
  }
}

async function getExpiringCredits(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM credit_transactions
       WHERE "userId" = $1 
       AND status = 'active'
       AND type = 'earn'
       AND "expiresAt" IS NOT NULL
       AND "expiresAt" > NOW()
       AND "expiresAt" < NOW() + INTERVAL '30 days'
       ORDER BY "expiresAt" ASC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get expiring credits error:', error);
    return [];
  }
}

async function expireOldCredits(userId) {
  try {
    const result = await pool.query(
      `UPDATE credit_transactions
       SET status = 'expired'
       WHERE "userId" = $1
       AND status = 'active'
       AND type = 'earn'
       AND "expiresAt" < NOW()
       RETURNING *`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Expire old credits error:', error);
    return [];
  }
}

async function awardTeachingCredits(teacherId, sessionId, creditAmount = 10) {
  try {
    // Award credits for teaching
    await addCreditTransaction(teacherId, creditAmount, 'earn', 'Teaching session completed', sessionId);
    // Update total user credits
    await pool.query(
      `UPDATE users SET credits = credits + $1 WHERE id = $2`,
      [creditAmount, teacherId]
    );
    return true;
  } catch (error) {
    console.error('Award teaching credits error:', error);
    return false;
  }
}

async function deductLearningCredits(learnerId, sessionId, creditAmount = 10) {
  try {
    // Check if user has enough credits
    const user = await getUser(learnerId);
    if (user.credits < creditAmount) {
      return { success: false, error: 'Insufficient credits' };
    }
    
    // Deduct credits for learning
    await addCreditTransaction(learnerId, creditAmount, 'spend', 'Learning session started', sessionId);
    // Update total user credits
    await pool.query(
      `UPDATE users SET credits = credits - $1 WHERE id = $2`,
      [creditAmount, learnerId]
    );
    return { success: true };
  } catch (error) {
    console.error('Deduct learning credits error:', error);
    return { success: false, error: error.message };
  }
}

async function saveDirectMessage(senderId, receiverId, text) {
  try {
    const id = 'msg_' + Date.now();
    await pool.query(
      `INSERT INTO direct_messages (id, "senderId", "receiverId", text) VALUES ($1, $2, $3, $4)`,
      [id, senderId, receiverId, text]
    );
    return { id, senderId, receiverId, text, createdAt: new Date().toISOString() };
  } catch (error) {
    console.error('Save message error:', error);
    return null;
  }
}

async function getDirectMessages(userId, otherUserId) {
  try {
    const result = await pool.query(
      `SELECT * FROM direct_messages 
       WHERE ("senderId" = $1 AND "receiverId" = $2) 
          OR ("senderId" = $2 AND "receiverId" = $1)
       ORDER BY "createdAt" ASC`,
      [userId, otherUserId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
}

async function getConversationUsers(userId) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT 
         CASE 
           WHEN "senderId" = $1 THEN "receiverId"
           ELSE "senderId"
         END as "otherUserId"
       FROM direct_messages
       WHERE "senderId" = $1 OR "receiverId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    return result.rows.map(r => r.otherUserId);
  } catch (error) {
    console.error('Get conversation users error:', error);
    return [];
  }
}

module.exports = {
  initializeDB,
  getUser,
  getUserByEmail,
  createUser,
  getAllUsers,
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
  resetDemo,
  addCreditTransaction,
  getTransactionHistory,
  getActiveCredits,
  getExpiringCredits,
  expireOldCredits,
  awardTeachingCredits,
  deductLearningCredits,
  saveDirectMessage,
  getDirectMessages,
  getConversationUsers
};
