require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import configuration and validation
const { validateEnvironment } = require('./config/env');
const { sql } = require('./config/database');
const Migrator = require('./db/migrator');

// Import error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Validate environment variables at startup
validateEnvironment();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// CORS FIRST - Working configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ContIQ Backend Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    const migrator = new Migrator();
    await migrator.runMigrations();
    
    console.log(`🚀 ContIQ Backend Server (SIMPLIFIED) running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`✅ CORS enabled for frontend development`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await sql.end();
  process.exit(0);
});