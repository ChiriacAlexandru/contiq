const fs = require('fs');
const path = require('path');
const { sql } = require('../config/database');

class Migrator {
  constructor() {
    this.migrationsDir = path.join(__dirname, 'migrations');
  }

  async createMigrationsTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  async getExecutedMigrations() {
    const migrations = await sql`
      SELECT filename FROM migrations ORDER BY id
    `;
    return migrations.map(m => m.filename);
  }

  getMigrationFiles() {
    if (!fs.existsSync(this.migrationsDir)) {
      console.log('Migrations directory not found');
      return [];
    }
    
    return fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  async executeMigration(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Executing migration: ${filename}`);
    
    try {
      // Execute the migration SQL
      await sql.unsafe(migrationSQL);
      
      // Record that this migration has been executed
      await sql`
        INSERT INTO migrations (filename) 
        VALUES (${filename})
        ON CONFLICT (filename) DO NOTHING
      `;
      
      console.log(`✅ Migration ${filename} executed successfully`);
    } catch (error) {
      console.error(`❌ Error executing migration ${filename}:`, error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      console.log('🔄 Starting database migrations...');
      
      // Create migrations tracking table
      await this.createMigrationsTable();
      
      // Get list of migrations that have been executed
      const executedMigrations = await this.getExecutedMigrations();
      
      // Get all migration files
      const migrationFiles = this.getMigrationFiles();
      
      if (migrationFiles.length === 0) {
        console.log('📝 No migration files found');
        return;
      }
      
      // Find migrations that haven't been executed yet
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✨ All migrations are up to date');
        return;
      }
      
      console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);
      
      // Execute pending migrations in order
      for (const filename of pendingMigrations) {
        await this.executeMigration(filename);
      }
      
      console.log('🎉 All migrations completed successfully!');
      
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  async rollback(steps = 1) {
    console.log(`🔄 Rolling back ${steps} migration(s)...`);
    
    const executedMigrations = await sql`
      SELECT filename FROM migrations 
      ORDER BY id DESC 
      LIMIT ${steps}
    `;
    
    for (const migration of executedMigrations) {
      console.log(`Rolling back: ${migration.filename}`);
      
      // Remove from migrations table
      await sql`
        DELETE FROM migrations 
        WHERE filename = ${migration.filename}
      `;
      
      console.log(`✅ Rolled back: ${migration.filename}`);
    }
    
    console.log('🎉 Rollback completed!');
  }

  async status() {
    await this.createMigrationsTable();
    
    const executedMigrations = await this.getExecutedMigrations();
    const migrationFiles = this.getMigrationFiles();
    
    console.log('\n📊 Migration Status:');
    console.log('==================');
    
    migrationFiles.forEach(file => {
      const status = executedMigrations.includes(file) ? '✅ EXECUTED' : '⏳ PENDING';
      console.log(`${status} - ${file}`);
    });
    
    console.log(`\nTotal: ${migrationFiles.length} migrations`);
    console.log(`Executed: ${executedMigrations.length}`);
    console.log(`Pending: ${migrationFiles.length - executedMigrations.length}`);
  }
}

module.exports = Migrator;