import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// Import routes
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/email.js';
import imapRoutes from './routes/imap.js';
import smtpRoutes from './routes/smtp.js';
import { verifyAndMigrate } from './database/init.js';
import quotesRoutes from './routes/quotes.js';
import ordersRoutes from './routes/orders.js';
import { autoSyncAllUsers } from './services/imapService.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

const app = express();
const server = createServer(app);
const PORT = process.env.SERVER_PORT || 5000;

// WebSocket server for real-time notifications
const wss = new WebSocketServer({ server });

// Store connected clients: userId -> Set<ws> (one user may have multiple tabs)
const clients = new Map();

function addClient(userId, ws) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(ws);
}

function removeClient(userId, ws) {
  const set = clients.get(userId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) clients.delete(userId);
}

// Send an event only to the target user's connections (no cross-account leakage)
function sendToUser(userId, data) {
  const set = clients.get(String(userId));
  if (!set || set.size === 0) return;
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  for (const ws of set) {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(payload);
      } catch (err) {
        console.error(`WebSocket send error for user ${userId}:`, err.message);
      }
    }
  }
}

wss.on('connection', (ws, req) => {
  let userId = null;
  try {
    const url = new URL(req.url, 'http://localhost');
    userId = url.searchParams.get('userId');
  } catch (_) {
    userId = null;
  }

  if (!userId) {
    ws.close(1008, 'userId required');
    return;
  }

  ws.isAlive = true;
  ws.userId = userId;
  addClient(userId, ws);
  console.log(`WebSocket connected for user: ${userId} (total connections: ${clients.get(userId).size})`);

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (raw) => {
    // Lightweight client->server ack / keepalive; ignore unknown payloads
    try {
      const msg = JSON.parse(raw.toString());
      if (msg && msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
      }
    } catch (_) { /* ignore malformed frames */ }
  });

  ws.on('close', () => {
    removeClient(userId, ws);
    console.log(`WebSocket disconnected for user: ${userId}`);
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error for user ${userId}:`, err.message);
    removeClient(userId, ws);
  });
});

// Heartbeat: terminate dead connections so they don't accumulate
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    try {
      ws.ping();
    } catch (_) { /* ignore */ }
  });
}, 30000);

wss.on('close', () => clearInterval(heartbeatInterval));

// Make helpers available globally for notifications
global.wss = wss;
global.clients = clients;
global.notifyUser = sendToUser;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'no-referrer' },
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false
}));

// CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(url => url.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global rate limiting (per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Stricter rate limiting for authentication endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', authenticateToken, emailRoutes);
app.use('/api/imap', authenticateToken, imapRoutes);
app.use('/api/smtp', authenticateToken, smtpRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/orders', ordersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Verify database and start server
try {
  await verifyAndMigrate();
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email system ready`);
    console.log(`🔗 WebSocket server ready`);
    
    // Start background email synchronization
    const syncIntervalMs = parseInt(process.env.SYNC_INTERVAL || '30000', 10);
    console.log(`⏰ Starting background email auto-sync (interval: ${syncIntervalMs}ms)`);
    
    // Run initial sync shortly after startup
    setTimeout(() => {
      console.log('[Scheduler] Running initial auto-sync for all users...');
      autoSyncAllUsers().catch((err) => {
        console.error('[Scheduler] initial auto-sync error:', err);
      });
    }, 5000);

    setInterval(() => {
      console.log('[Scheduler] Triggering auto-sync for all users...');
      autoSyncAllUsers().catch((err) => {
        console.error('[Scheduler] auto-sync cycle error:', err);
      });
    }, syncIntervalMs);
  });
} catch (error) {
  console.error('❌ Failed to initialize database. Server cannot start:', error.message);
  process.exit(1);
}

export default app;
