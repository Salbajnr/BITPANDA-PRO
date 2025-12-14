// Simple script to run Drizzle migration SQL file
const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
  console.log('📚 Reading migration file...');
  
  // Read the SQL migration file
  const sqlFile = fs.readFileSync('./drizzle/0000_elite_reaper.sql', 'utf8');
  
  // Split by statement breakpoint
  const statements = sqlFile
    .split('--> statement-breakpoint')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log(`📊 Found ${statements.length} SQL statements to execute`);
  
  // Create PostgreSQL client
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('🚀 Running migrations...');
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await client.query(statement);
        successCount++;
        
        // Show progress every 10 statements
        if ((i + 1) % 10 === 0) {
          console.log(`   Progress: ${i + 1}/${statements.length} statements executed`);
        }
      } catch (error) {
        // Skip if already exists
        if (error.code === '42P07' || error.code === '42710') {
          skipCount++;
          console.log(`   ⏭️  Skipped (already exists): Statement ${i + 1}`);
        } else {
          console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    console.log(`   ✅ Success: ${successCount} statements`);
    console.log(`   ⏭️  Skipped: ${skipCount} statements (already existed)`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

runMigration();
