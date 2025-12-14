// Add missing supabase_uid column
const { Client } = require('pg');
require('dotenv').config();

async function addMissingColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    console.log('🔧 Adding supabase_uid column to users table...');
    
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS supabase_uid varchar,
      ADD COLUMN IF NOT EXISTS display_name varchar,
      ADD COLUMN IF NOT EXISTS photo_url varchar
    `);
    
    console.log('✅ Columns added successfully!\n');
    
    console.log('🔧 Adding unique constraint on supabase_uid...');
    
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE users 
        ADD CONSTRAINT users_supabase_uid_unique UNIQUE (supabase_uid);
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);
    
    console.log('✅ Constraint added successfully!\n');
    
    // Verify
    const check = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('supabase_uid', 'display_name', 'photo_url')
      ORDER BY column_name
    `);
    
    console.log('📊 Verification - Added columns:');
    check.rows.forEach(row => {
      console.log(`   ✅ ${row.column_name}`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMissingColumn();
