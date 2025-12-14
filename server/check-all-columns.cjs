// Comprehensive check of users table columns
const { Client } = require('pg');
require('dotenv').config();

async function checkAllColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    console.log('📊 Checking all columns in users table...\n');
    
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Users table schema:');
    console.log('=====================');
    console.log('Column Name'.padEnd(25) + 'Data Type'.padEnd(20) + 'Nullable'.padEnd(12) + 'Default');
    console.log('-'.repeat(70));
    
    result.rows.forEach(row => {
      console.log(
        row.column_name.padEnd(25) + 
        row.data_type.padEnd(20) + 
        (row.is_nullable === 'YES' ? 'NULL'.padEnd(12) : 'NOT NULL'.padEnd(12)) +
        (row.column_default || '')
      );
    });
    
    console.log('\n🔍 Checking for critical missing columns...\n');
    
    // Critical columns that should exist
    const criticalColumns = [
      'id', 'username', 'email', 'password', 'first_name', 'last_name',
      'supabase_uid', 'display_name', 'photo_url', 'provider',
      'google_id', 'facebook_id', 'apple_id', 'role', 'is_active',
      'wallet_balance', 'created_at', 'updated_at'
    ];
    
    const existingColumns = result.rows.map(row => row.column_name);
    const missingColumns = criticalColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('⚠️  Missing critical columns:');
      missingColumns.forEach(col => console.log(`   - ${col}`));
    } else {
      console.log('✅ All critical columns are present!');
    }
    
    console.log('\n🎉 Database schema verification completed!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkAllColumns();
