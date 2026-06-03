const express = require('express');
const path = require('path');
const cors = require('cors');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const chatAdminRoutes = require('./routes/chatAdmin');

const app = express();
const PORT = process.env.PORT || 3001;
const distPath = path.join(__dirname, '..', 'client', 'dist');
const fs = require('fs');
const hasFrontend = fs.existsSync(distPath);

// Force UTF-8 for all responses
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function (body) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return oldJson.call(this, body);
  };
  next();
});

// CORS
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Initialize database
initDB();

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin/chat', chatAdminRoutes);

app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve static frontend (if built)
if (hasFrontend) {
  app.use(express.static(distPath));
  // SPA fallback - must be after API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} ${hasFrontend ? '(+ frontend)' : '(API only)'}`);
});
