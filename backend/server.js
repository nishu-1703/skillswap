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
// Enable CORS with proper headers for GitHub Pages
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));
app.use(express.json());

// Dynamic PORT binding
const PORT = process.env.PORT || 4000;

// Config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const TEACH_EARN = 5;
const LEARN_COST = 5;

// Simple in-memory chat store for prototype (persist only while server runs)
const chatStore = {};

// Online status tracker: { userId: { lastSeen: timestamp, isOnline: bool } }
const onlineStatus = {};

// Read status tracker: { conversationKey: { userId: lastReadTime } }
const readStatus = {};

const ONLINE_TIMEOUT = 30000; // 30 seconds - mark as offline if no ping

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
app.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  // Check if email exists
  const existing = await getUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = 'user_' + Date.now();
  await createUser(id, email, password, name);
  
  const user = await getUser(id);
  const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ id, email, name, credits: user.credits, token });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, token });
});

app.get('/auth/verify', verifyToken, async (req, res) => {
  const user = await getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const skills = await getUserSkills(req.userId);
  res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, skills });
});

/**
 * Skill Management Routes
 */
app.post('/api/user/:id/skills', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });
  
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name required' });

  const user = await getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Check if skill already exists
  const userSkills = await getUserSkills(req.userId);
  if (userSkills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'You already listed this skill' });
  }

  const skillId = 'skill_' + Date.now();
  await addSkill(skillId, name, description || '', req.userId);
  
  const skill = await getSkill(skillId);
  res.status(201).json(skill);
});

app.get('/api/user/:id/skills', async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const skills = await getUserSkills(req.params.id);
  res.json(skills || []);
});

app.delete('/api/user/:id/skills/:skillId', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });

  const user = await getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skill = await getSkill(req.params.skillId);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  await deleteSkill(req.params.skillId);
  res.json({ success: true, skill });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/skills', async (req, res) => {
  const allSkills = await getAllSkills();
  res.json(allSkills);
});

app.get('/api/info', (req, res) => {
  res.json({ 
    name: 'SkillSwap', 
    version: '0.1.0', 
    creditRules: { teachEarn: TEACH_EARN, learnCost: LEARN_COST } 
  });
});

app.get('/api/user/:id', async (req, res) => {
  const u = await getUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

/**
 * Session Management Routes
 */
app.post('/api/sessions', verifyToken, async (req, res) => {
  const { skillId, teacherId } = req.body;
  if (!skillId || !teacherId) return res.status(400).json({ error: 'skillId and teacherId required' });
  if (req.userId === teacherId) return res.status(400).json({ error: 'Cannot request your own skill' });

  const teacher = await getUser(teacherId);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  const sessionId = 'session_' + Date.now();
  await createSession(sessionId, skillId, teacherId, req.userId);
  
  const session = await getSession(sessionId);
  res.status(201).json(session);
});

app.get('/api/sessions', verifyToken, async (req, res) => {
  const userSessions = await getUserSessions(req.userId);
  res.json(userSessions);
});

// Chat endpoints (prototype) - messages are stored in-memory for each session
app.get('/api/chat/:sessionId', verifyToken, async (req, res) => {
  const session = await getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const msgs = chatStore[req.params.sessionId] || [];
  res.json(msgs);
});

app.post('/api/chat/:sessionId', verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required' });
  const session = await getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const message = { id: 'msg_' + Date.now(), sessionId: req.params.sessionId, senderId: req.userId, text, createdAt: new Date().toISOString() };
  chatStore[req.params.sessionId] = chatStore[req.params.sessionId] || [];
  chatStore[req.params.sessionId].push(message);
  res.status(201).json(message);
});

// Online status endpoints
app.post('/api/online/ping', verifyToken, async (req, res) => {
  const now = Date.now();
  onlineStatus[req.userId] = { lastSeen: now, isOnline: true };
  res.json({ status: 'pong' });
});

app.get('/api/online/users', verifyToken, async (req, res) => {
  const now = Date.now();
  const users = {};
  for (const userId in onlineStatus) {
    const status = onlineStatus[userId];
    users[userId] = {
      lastSeen: status.lastSeen,
      isOnline: (now - status.lastSeen) < ONLINE_TIMEOUT
    };
  }
  res.json(users);
});

app.get('/api/conversations', verifyToken, async (req, res) => {
  // Get all people current user has sessions with (for conversations)
  const userSessions = await getUserSessions(req.userId);
  const conversationMap = {};
  
  userSessions.forEach(s => {
    const otherUserId = s.learnerId === req.userId ? s.teacherId : s.learnerId;
    const otherUserName = s.learnerId === req.userId ? s.teacherName : s.learnerName;
    if (!conversationMap[otherUserId]) {
      conversationMap[otherUserId] = {
        userId: otherUserId,
        name: otherUserName,
        lastMessage: null,
        unreadCount: 0
      };
    }
  });
  
  // Get last message for each conversation
  for (const userId in conversationMap) {
    const sessionIds = userSessions
      .filter(s => (s.learnerId === req.userId && s.teacherId === userId) || (s.teacherId === req.userId && s.learnerId === userId))
      .map(s => s.id);
    
    let lastMsg = null;
    for (const sessionId of sessionIds) {
      const msgs = chatStore[sessionId] || [];
      if (msgs.length > 0) {
        const msg = msgs[msgs.length - 1];
        if (!lastMsg || new Date(msg.createdAt) > new Date(lastMsg.createdAt)) {
          lastMsg = msg;
        }
      }
    }
    conversationMap[userId].lastMessage = lastMsg;
  }
  
  const conversations = Object.values(conversationMap).sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
    return bTime - aTime;
  });
  
  res.json(conversations);
});

app.get('/api/direct-chat/:otherUserId', verifyToken, async (req, res) => {
  // Get direct messages with another user (across all sessions)
  const otherUserId = req.params.otherUserId;
  const userSessions = await getUserSessions(req.userId);
  const relevantSessions = userSessions.filter(
    s => (s.learnerId === req.userId && s.teacherId === otherUserId) || 
         (s.teacherId === req.userId && s.learnerId === otherUserId)
  );
  
  const allMessages = [];
  relevantSessions.forEach(s => {
    const msgs = chatStore[s.id] || [];
    allMessages.push(...msgs);
  });
  
  const sorted = allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  res.json(sorted);
});

app.post('/api/direct-chat/:otherUserId', verifyToken, async (req, res) => {
  // Send a direct message (store under a virtual conversation key)
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required' });
  
  const otherUserId = req.params.otherUserId;
  const conversationKey = [req.userId, otherUserId].sort().join('_');
  
  const message = {
    id: 'msg_' + Date.now(),
    conversationKey,
    senderId: req.userId,
    receiverId: otherUserId,
    text,
    createdAt: new Date().toISOString()
  };
  
  chatStore[conversationKey] = chatStore[conversationKey] || [];
  chatStore[conversationKey].push(message);
  res.status(201).json(message);
});

app.post('/api/conversations/:otherUserId/mark-read', verifyToken, async (req, res) => {
  const otherUserId = req.params.otherUserId;
  const conversationKey = [req.userId, otherUserId].sort().join('_');
  readStatus[conversationKey] = readStatus[conversationKey] || {};
  readStatus[conversationKey][req.userId] = Date.now();
  res.json({ status: 'marked' });
});

app.put('/api/sessions/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });

  const session = await getSession(req.params.id);
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
    
    const learnerCredits = await getUserCredits(session.learnerId);
    if (learnerCredits < LEARN_COST) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Transfer credits
    await updateUserCredits(session.learnerId, -LEARN_COST);
    await updateUserCredits(session.teacherId, TEACH_EARN);
  }

  await updateSessionStatus(req.params.id, status);
  const updatedSession = await getSession(req.params.id);
  res.json(updatedSession);
});

app.post('/api/reset-demo', async (req, res) => {
  await resetDemo();
  res.json({ success: true });
});

/**
 * Review System Routes (Anonymous)
 */
app.post('/api/reviews', verifyToken, async (req, res) => {
  const { rating, text, sessionId } = req.body;
  if (!rating || !sessionId) return res.status(400).json({ error: 'Rating and sessionId required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  // Verify session exists and user is part of it
  const session = await getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status !== 'completed') {
    return res.status(400).json({ error: 'Can only review completed sessions' });
  }
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Not part of this session' });
  }

  // Prevent multiple reviews from same user for same session
  if (await checkReviewExists(sessionId, req.userId)) {
    return res.status(409).json({ error: 'You already reviewed this session' });
  }

  // Determine who is being reviewed (the OTHER person in session)
  const targetUserId = req.userId === session.learnerId ? session.teacherId : session.learnerId;

  const reviewId = 'review_' + Date.now();
  await addReview(reviewId, sessionId, targetUserId, req.userId, rating, text || '');
  
  // Return anonymous version (no reviewer identity)
  res.status(201).json({
    id: reviewId,
    rating,
    text: text || '',
    createdAt: new Date().toISOString(),
    verified: 'from completed session'
  });
});

app.get('/api/reviews/:userId', async (req, res) => {
  // Get anonymous reviews for a user
  const userReviews = await getReviews(req.params.userId);
  
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

// Root route
app.get("/", (req, res) => {
  res.send("SkillSwap backend is live 🚀");
});

// Async initialization and startup
(async () => {
  try {
    await initializeDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`SkillSwap backend listening on port ${PORT} (accessible from network)`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
