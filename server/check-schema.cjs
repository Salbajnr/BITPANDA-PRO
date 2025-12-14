// Check database schema
const { Client } = require('pg');
require('dotenv').config();

async function checkSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      return;
    }
    
    console.log('✅ Users table exists\n');
    
    // Get all columns in users table
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Users table columns:');
    console.log('----------------------------------------');
    columns.rows.forEach(col => {
      const check = col.column_name === 'supabase_uid' ? '✅' : '  ';
      console.log(`${check} ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    const hasSupabaseUid = columns.rows.some(col => col.column_name === 'supabase_uid');
    
    console.log('\n----------------------------------------');
    if (hasSupabaseUid) {
      console.log('✅ supabase_uid column EXISTS');
    } else {
      console.log('❌ supabase_uid column MISSING - Need to add it!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();
