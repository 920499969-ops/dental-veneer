const express = require('express');
const { getDB } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', (req, res) => {
  const db = getDB();

  const total = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
  const pending = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get();
  const confirmed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get();
  const completed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'").get();
  const today = db.prepare(
    "SELECT COUNT(*) as count FROM bookings WHERE preferred_date = date('now', 'localtime')"
  ).get();
  const recentBookings = db.prepare(
    'SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5'
  ).all();

  res.json({
    total: total.count,
    pending: pending.count,
    confirmed: confirmed.count,
    completed: completed.count,
    today: today.count,
    recentBookings,
  });
});

// GET /api/admin/bookings - All bookings with optional filters
router.get('/bookings', (req, res) => {
  const db = getDB();
  const { status, search, date, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM bookings WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (name LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (date) {
    query += ' AND preferred_date = ?';
    params.push(date);
  }

  // Count total
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const bookings = db.prepare(query).all(...params);

  res.json({
    bookings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// GET /api/admin/bookings/:id
router.get('/bookings/:id', (req, res) => {
  const db = getDB();
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: '预约不存在' });
  }
  res.json({ booking });
});

// PATCH /api/admin/bookings/:id
router.patch('/bookings/:id', (req, res) => {
  const db = getDB();
  const { status, note } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: '预约不存在' });
  }

  if (status) {
    db.prepare(
      "UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(status, req.params.id);
  }

  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json({ booking: updated });
});

// DELETE /api/admin/bookings/:id
router.delete('/bookings/:id', (req, res) => {
  const db = getDB();
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: '预约不存在' });
  }
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.json({ message: '预约已删除' });
});

module.exports = router;
