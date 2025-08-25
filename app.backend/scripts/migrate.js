#!/usr/bin/env node
require('dotenv').config();
const Migrator = require('../db/migrator');

const migrator = new Migrator();

const command = process.argv[2];
const arg = process.argv[3];

async function main() {
  try {
    switch (command) {
      case 'up':
      case 'run':
        await migrator.runMigrations();
        break;
        
      case 'down':
      case 'rollback':
        const steps = parseInt(arg) || 1;
        await migrator.rollback(steps);
        break;
        
      case 'status':
        await migrator.status();
        break;
        
      default:
        console.log('Usage:');
        console.log('  node scripts/migrate.js run     - Run pending migrations');
        console.log('  node scripts/migrate.js up      - Run pending migrations');
        console.log('  node scripts/migrate.js down [n] - Rollback n migrations (default: 1)');
        console.log('  node scripts/migrate.js rollback [n] - Rollback n migrations');
        console.log('  node scripts/migrate.js status  - Show migration status');
        process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();