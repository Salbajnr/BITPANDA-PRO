// Add missing provider column and verify all columns
const { Client } = require('pg');
require('dotenv').config();

async function addMissingColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    console.log('🔧 Adding missing provider column to users table...');
    
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS provider varchar
    `);
    
    console.log('✅ Provider column added successfully!\n');
    
    console.log('🔧 Adding constraint for provider column...');
    
    try {
      await client.query(`
        ALTER TABLE users 
        ADD CONSTRAINT users_provider_check 
        CHECK (provider IN ('local', 'google', 'facebook', 'apple'))
      `);
      console.log('   ✅ Added constraint: users_provider_check');
    } catch (error) {
      if (error.code === '42710') {
        console.log('   ⏭️  Constraint already exists: users_provider_check');
      } else {
        throw error;
      }
    }
    
    console.log('\n📊 Verifying all columns in users table...');
    
    const check = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND column_name IN ('provider', 'google_id', 'facebook_id', 'apple_id', 'supabase_uid', 'display_name', 'photo_url')
      ORDER BY column_name
    `);
    
    console.log('\n✅ Current columns in users table:');
    check.rows.forEach(row => {
      console.log(`   ✅ ${row.column_name.padEnd(15)} ${row.data_type.padEnd(15)} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check if any are missing
    const expectedColumns = ['provider', 'google_id', 'facebook_id', 'apple_id', 'supabase_uid', 'display_name', 'photo_url'];
    const existingColumns = check.rows.map(row => row.column_name);
    const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\n⚠️  Missing columns:', missingColumns.join(', '));
    } else {
      console.log('\n🎉 All expected columns are present!');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMissingColumns();
