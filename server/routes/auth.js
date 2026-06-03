const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

function makeToken(admin) {
  return jwt.sign(
    { id: admin.id, phone: admin.phone, display_name: admin.display_name, role: admin.role },
    JWT_SECRET, { expiresIn: '24h' }
  );
}

// POST /api/admin/register — register with phone + password + name
router.post('/register', (req, res) => {
  const { phone, password, name } = req.body;
  if (!phone || !password || password.length < 6) {
    return res.status(400).json({ error: '手机号和密码不能为空，密码至少6位' });
  }

  const db = getDB();
  const existing = db.prepare('SELECT id FROM admins WHERE phone = ?').get(phone);
  if (existing) return res.status(400).json({ error: '该手机号已注册，请直接登录' });

  const displayName = name || '员工';
  let role = 'staff';
  let status = 'pending';

  if (phone === '13976387730') { role = 'manager'; status = 'approved'; }

  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (phone, username, password_hash, display_name, role, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(phone, phone, hash, displayName, role, status);

  if (status === 'approved') {
    const admin = db.prepare('SELECT * FROM admins WHERE phone = ?').get(phone);
    return res.json({ token: makeToken(admin), admin: { id: admin.id, phone: admin.phone, display_name: admin.display_name, role: admin.role }, message: '注册成功' });
  }

  res.json({ pending: true, message: '注册申请已提交，等待店长审批' });
});

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone) return res.status(400).json({ error: '请输入手机号' });

  const db = getDB();
  const admin = db.prepare('SELECT * FROM admins WHERE phone = ?').get(phone);
  if (!admin) return res.status(401).json({ error: '账号不存在' });
  if (admin.status === 'pending') return res.status(403).json({ error: '账号正在等待店长审批' });

  // Manager can login without password
  if (admin.role !== 'manager') {
    if (!password) return res.status(400).json({ error: '请输入密码' });
    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: '密码错误' });
  }

  const token = makeToken(admin);
  res.json({ token, admin: { id: admin.id, phone: admin.phone, display_name: admin.display_name, role: admin.role } });
});

// Approval routes
router.get('/pending', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  const db = getDB();
  const pending = db.prepare("SELECT id, phone, display_name, created_at FROM admins WHERE status = 'pending' AND password_hash != '' ORDER BY created_at DESC").all();
  res.json({ pending });
});

router.post('/approve/:id', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  getDB().prepare("UPDATE admins SET status = 'approved' WHERE id = ? AND status = 'pending'").run(req.params.id);
  res.json({ success: true });
});

router.post('/reject/:id', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  getDB().prepare('DELETE FROM admins WHERE id = ? AND status = ?').run(req.params.id, 'pending');
  res.json({ success: true });
});

// Password reset (manager only)
router.post('/reset-password/:id', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ error: '密码至少6位' });
  const hash = bcrypt.hashSync(password, 10);
  getDB().prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hash, req.params.id);
  res.json({ success: true });
});

// Staff management
router.get('/staff', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  const db = getDB();
  const staff = db.prepare("SELECT id, phone, display_name, role, status, created_at FROM admins WHERE id != ? AND password_hash != '' ORDER BY created_at DESC").all(req.admin.id);
  res.json({ staff });
});

router.patch('/staff/:id', authenticateToken, (req, res) => {
  if (req.admin.role !== 'manager') return res.status(403).json({ error: '仅店长可操作' });
  const { display_name } = req.body;
  if (!display_name?.trim()) return res.status(400).json({ error: '姓名不能为空' });
  getDB().prepare('UPDATE admins SET display_name = ? WHERE id = ?').run(display_name.trim(), req.params.id);
  res.json({ success: true });
});

router.get('/me', authenticateToken, (req, res) => {
  const admin = getDB().prepare('SELECT id, phone, display_name, role, status FROM admins WHERE id = ?').get(req.admin.id);
  res.json({ admin: admin || req.admin });
});

module.exports = router;
