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

const app = express();
const server = createServer(app);
const PORT = process.env.SERVER_PORT || 5000;

// WebSocket server for real-time notifications
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('?userId=')[1];
  if (userId) {
    clients.set(userId, ws);
    console.log(`WebSocket connected for user: ${userId}`);
    
    ws.on('close', () => {
      clients.delete(userId);
      console.log(`WebSocket disconnected for user: ${userId}`);
    });
  }
});

// Make wss available globally for notifications
global.wss = wss;
global.clients = clients;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

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
      autoSyncAllUsers();
    }, 5000);

    setInterval(() => {
      console.log('[Scheduler] Triggering auto-sync for all users...');
      autoSyncAllUsers();
    }, syncIntervalMs);
  });
} catch (error) {
  console.error('❌ Failed to initialize database. Server cannot start:', error.message);
  process.exit(1);
}

export default app;
