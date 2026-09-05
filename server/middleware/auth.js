import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('[AUTH] WARNING: JWT_SECRET is not set. Falling back to an insecure default in production!');
}

const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^(Bearer|Token)$/i.test(parts[0])) {
      return parts[1];
    }
  }
  return null;
};

// Periodic cleanup of expired sessions to avoid unbounded table growth
if (process.env.NODE_ENV !== 'test') {
  setInterval(async () => {
    try {
      await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
    } catch (_) { /* best-effort */ }
  }, 60 * 60 * 1000);
}

const authenticateToken = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify session in database
    const sessionRes = await pool.query(
      'SELECT id FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (sessionRes.rows.length === 0) {
      return res.status(401).json({ error: 'Session expired or logged out' });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export { authenticateToken, JWT_SECRET };
