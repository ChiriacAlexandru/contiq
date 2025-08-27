const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT', 
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

const optionalEnvVars = {
  PORT: 3000,
  NODE_ENV: 'development',
  ALLOWED_ORIGINS: 'http://localhost:3000,http://localhost:3001'
};

function validateEnvironment() {
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Set defaults for optional variables
  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = String(defaultValue);
    }
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for security');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}

function getConfig() {
  return {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
      port: parseInt(process.env.PORT) || optionalEnvVars.PORT,
      allowedOrigins: (process.env.ALLOWED_ORIGINS || optionalEnvVars.ALLOWED_ORIGINS).split(',')
    },
    app: {
      environment: process.env.NODE_ENV || optionalEnvVars.NODE_ENV
    }
  };
}

module.exports = { validateEnvironment, getConfig };