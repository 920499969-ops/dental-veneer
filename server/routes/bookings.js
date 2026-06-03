const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// POST /api/bookings — submit booking (no verification code)
router.post('/', (req, res) => {
  const { name, phone, wechat, service_type, preferred_date, preferred_time, message } = req.body;

  if (!name || !phone || !preferred_date || !preferred_time) {
    return res.status(400).json({ error: '请填写必要的预约信息（姓名、电话、日期、时间）' });
  }

  const db = getDB();

  // Prevent duplicate bookings
  const existing = db.prepare(
    'SELECT id FROM bookings WHERE phone = ? AND preferred_date = ? AND preferred_time = ? AND status != ?'
  ).get(phone, preferred_date, preferred_time, 'cancelled');

  if (existing) {
    return res.status(409).json({ error: '您已在该时间段预约过，请勿重复预约' });
  }

  const result = db.prepare(`
    INSERT INTO bookings (name, phone, email, service_type, preferred_date, preferred_time, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, phone, wechat || '', service_type || 'consultation', preferred_date, preferred_time, message || '');

  res.status(201).json({
    id: result.lastInsertRowid,
    message: '预约成功！我们会尽快与您联系确认。',
  });
});

module.exports = router;
