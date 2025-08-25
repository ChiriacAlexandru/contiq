const postgres = require('postgres');
const { getConfig } = require('./env');

const config = getConfig();

const sql = postgres({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  ssl: config.app.environment === 'production' ? { rejectUnauthorized: false } : false,
  connection: {
    application_name: 'contiq-backend',
  },
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
});

module.exports = { sql };