const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { 
  initializeDB, getUser, getUserByEmail, createUser, 
  getSkill, getAllSkills, getUserSkills, addSkill, deleteSkill,
  getSession, getUserSessions, createSession, updateSessionStatus, updateUserCredits, getUserCredits,
  getReviews, addReview, checkReviewExists, resetDemo
} = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const TEACH_EARN = 5;
const LEARN_COST = 5;

/**
 * Middleware: Verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Auth Routes
 */
app.post('/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  // Check if email exists
  const existing = getUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = 'user_' + Date.now();
  createUser(id, email, password, name);
  
  const user = getUser(id);
  const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ id, email, name, credits: user.credits, token });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, token });
});

app.get('/auth/verify', verifyToken, (req, res) => {
  const user = getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const skills = getUserSkills(req.userId);
  res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, skills });
});

/**
 * Skill Management Routes
 */
app.post('/api/user/:id/skills', verifyToken, (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });
  
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name required' });

  const user = getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Check if skill already exists
  const userSkills = getUserSkills(req.userId);
  if (userSkills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'You already listed this skill' });
  }

  const skillId = 'skill_' + Date.now();
  addSkill(skillId, name, description || '', req.userId);
  
  const skill = getSkill(skillId);
  res.status(201).json(skill);
});

app.get('/api/user/:id/skills', (req, res) => {
  const user = getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const skills = getUserSkills(req.params.id);
  res.json(skills || []);
});

app.delete('/api/user/:id/skills/:skillId', verifyToken, (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });

  const user = getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skill = getSkill(req.params.skillId);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  deleteSkill(req.params.skillId);
  res.json({ success: true, skill });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/skills', (req, res) => {
  const allSkills = getAllSkills();
  res.json(allSkills);
});

app.get('/api/info', (req, res) => {
  res.json({ 
    name: 'SkillSwap', 
    version: '0.1.0', 
    creditRules: { teachEarn: TEACH_EARN, learnCost: LEARN_COST } 
  });
});

app.get('/api/user/:id', (req, res) => {
  const u = getUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

/**
 * Session Management Routes
 */
app.post('/api/sessions', verifyToken, (req, res) => {
  const { skillId, teacherId } = req.body;
  if (!skillId || !teacherId) return res.status(400).json({ error: 'skillId and teacherId required' });
  if (req.userId === teacherId) return res.status(400).json({ error: 'Cannot request your own skill' });

  const teacher = getUser(teacherId);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  const sessionId = 'session_' + Date.now();
  createSession(sessionId, skillId, teacherId, req.userId);
  
  const session = getSession(sessionId);
  res.status(201).json(session);
});

app.get('/api/sessions', verifyToken, (req, res) => {
  const userSessions = getUserSessions(req.userId);
  res.json(userSessions);
});

app.put('/api/sessions/:id', verifyToken, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });

  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Only teacher can accept/reject, or either can mark complete
  if (status !== 'completed' && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (status === 'completed') {
    // Check permissions and credits
    if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const learnerCredits = getUserCredits(session.learnerId);
    if (learnerCredits < LEARN_COST) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Transfer credits
    updateUserCredits(session.learnerId, -LEARN_COST);
    updateUserCredits(session.teacherId, TEACH_EARN);
  }

  updateSessionStatus(req.params.id, status);
  const updatedSession = getSession(req.params.id);
  res.json(updatedSession);
});

app.post('/api/reset-demo', (req, res) => {
  resetDemo();
  res.json({ success: true });
});

/**
 * Review System Routes (Anonymous)
 */
app.post('/api/reviews', verifyToken, (req, res) => {
  const { rating, text, sessionId } = req.body;
  if (!rating || !sessionId) return res.status(400).json({ error: 'Rating and sessionId required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  // Verify session exists and user is part of it
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status !== 'completed') {
    return res.status(400).json({ error: 'Can only review completed sessions' });
  }
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Not part of this session' });
  }

  // Prevent multiple reviews from same user for same session
  if (checkReviewExists(sessionId, req.userId)) {
    return res.status(409).json({ error: 'You already reviewed this session' });
  }

  // Determine who is being reviewed (the OTHER person in session)
  const targetUserId = req.userId === session.learnerId ? session.teacherId : session.learnerId;

  const reviewId = 'review_' + Date.now();
  addReview(reviewId, sessionId, targetUserId, req.userId, rating, text || '');
  
  // Return anonymous version (no reviewer identity)
  res.status(201).json({
    id: reviewId,
    rating,
    text: text || '',
    createdAt: new Date().toISOString(),
    verified: 'from completed session'
  });
});

app.get('/api/reviews/:userId', (req, res) => {
  // Get anonymous reviews for a user
  const userReviews = getReviews(req.params.userId);
  
  // Return anonymous version
  const anonymousReviews = userReviews.map(r => ({
    id: r.id,
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt,
    verified: 'from completed session'
  }));

  // Calculate average rating
  const avgRating = userReviews.length > 0
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
    : null;

  res.json({
    reviews: anonymousReviews,
    totalReviews: userReviews.length,
    averageRating: avgRating
  });
});

// Async initialization and startup
(async () => {
  try {
    await initializeDB();
    app.listen(PORT, () => {
      console.log(`SkillSwap backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
