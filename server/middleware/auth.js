const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dental-veneer-studio-secret-key-2024';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: '登录已过期，请重新登录' });
  }
}

module.exports = { authenticateToken, JWT_SECRET };
