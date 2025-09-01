require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import configuration and validation
const { validateEnvironment } = require('./config/env');
const { sql } = require('./config/database');
const Migrator = require('./db/migrator');

// Import security middleware
const { securityHeaders, corsOptions } = require('./middleware/security');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Validate environment variables at startup
validateEnvironment();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const brandsRoutes = require('./routes/brands');
const suppliersRoutes = require('./routes/suppliers');
const clientsRoutes = require('./routes/clients');
const documentsRoutes = require('./routes/documents');
const documentFilesRoutes = require('./routes/documentFiles');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses (needed for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/document-files', documentFilesRoutes);

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
    
    console.log(`🚀 ContIQ Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log('📁 Project structure:');
    console.log('   ├── config/     - Database connection and configuration');
    console.log('   ├── db/         - Migrations and database management');
    console.log('   ├── models/     - Data models with business logic');
    console.log('   ├── controllers/ - Request handlers and business logic');
    console.log('   ├── routes/     - API endpoint definitions');
    console.log('   └── middleware/ - Authentication and validation');
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