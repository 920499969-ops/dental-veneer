const express = require('express');
const { getDB } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// GET /api/admin/chat/sessions — list active sessions
router.get('/sessions', (req, res) => {
  const db = getDB();
  const sessions = db.prepare(
    'SELECT * FROM chat_sessions WHERE deleted = 0 AND EXISTS (SELECT 1 FROM chat_messages WHERE session_id = chat_sessions.id) ORDER BY updated_at DESC'
  ).all();
  // Get last message preview for each session
  const enriched = sessions.map((s) => {
    const lastMsg = db.prepare(
      'SELECT text, role, created_at FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT 1'
    ).get(s.id);
    return { ...s, lastMessage: lastMsg || null };
  });
  res.json({ sessions: enriched });
});

// GET /api/admin/chat/sessions/:id/messages — get all messages
router.get('/sessions/:id/messages', (req, res) => {
  const db = getDB();
  const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Mark as read
  db.prepare('UPDATE chat_sessions SET unread = 0 WHERE id = ?').run(req.params.id);

  const messages = db.prepare(
    'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC'
  ).all(req.params.id);
  res.json({ session, messages });
});

// POST /api/admin/chat/sessions/:id/takeover — agent takes over
router.post('/sessions/:id/takeover', (req, res) => {
  const db = getDB();
  const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const agentName = req.admin.display_name || '客服';
  db.prepare("UPDATE chat_sessions SET status = 'agent', agent_name = ?, updated_at = datetime('now') WHERE id = ?")
    .run(agentName, req.params.id);

  // Send system notification to customer
  db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
    req.params.id,
    'system',
    `✨ 已为您转接人工客服，${agentName}将为您服务`
  );

  res.json({ success: true, agentName });
});

// POST /api/admin/chat/sessions/:id/release — release back to AI
router.post('/sessions/:id/release', (req, res) => {
  const db = getDB();
  db.prepare("UPDATE chat_sessions SET status = 'ai', agent_name = '', updated_at = datetime('now') WHERE id = ?")
    .run(req.params.id);

  db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
    req.params.id,
    'system',
    '🤖 AI客服小美已重新接管对话，继续为您服务'
  );

  res.json({ success: true });
});

// POST /api/admin/chat/sessions/:id/messages — agent sends message
router.post('/sessions/:id/messages', (req, res) => {
  const db = getDB();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
    req.params.id, 'agent', text
  );
  db.prepare("UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);

  res.json({ success: true });
});

// DELETE /api/admin/chat/sessions/:id — soft delete
router.delete('/sessions/:id', (req, res) => {
  const db = getDB();
  db.prepare('UPDATE chat_sessions SET deleted = 1, updated_at = datetime(\'now\') WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// POST /api/admin/chat/sessions/:id/restore — restore from trash
router.post('/sessions/:id/restore', (req, res) => {
  const db = getDB();
  db.prepare('UPDATE chat_sessions SET deleted = 0, updated_at = datetime(\'now\') WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/admin/chat/sessions/deleted — list deleted sessions
router.get('/sessions/deleted', (req, res) => {
  const db = getDB();
  const sessions = db.prepare(
    'SELECT * FROM chat_sessions WHERE deleted = 1 ORDER BY updated_at DESC'
  ).all();
  const enriched = sessions.map((s) => {
    const lastMsg = db.prepare('SELECT text, role FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT 1').get(s.id);
    return { ...s, lastMessage: lastMsg || null };
  });
  res.json({ sessions: enriched });
});

module.exports = router;
