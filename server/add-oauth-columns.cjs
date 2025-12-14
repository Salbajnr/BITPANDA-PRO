// Add OAuth columns to users table
const { Client } = require('pg');
require('dotenv').config();

async function addOAuthColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    console.log('🔧 Adding OAuth columns to users table...');
    
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id varchar,
      ADD COLUMN IF NOT EXISTS facebook_id varchar,
      ADD COLUMN IF NOT EXISTS apple_id varchar
    `);
    
    console.log('✅ OAuth columns added successfully!\n');
    
    console.log('🔧 Adding unique constraints...');
    
    // Add constraints separately to handle existing constraints
    const constraints = [
      { name: 'users_google_id_unique', column: 'google_id' },
      { name: 'users_facebook_id_unique', column: 'facebook_id' },
      { name: 'users_apple_id_unique', column: 'apple_id' }
    ];
    
    for (const constraint of constraints) {
      try {
        await client.query(`
          ALTER TABLE users 
          ADD CONSTRAINT ${constraint.name} UNIQUE (${constraint.column})
        `);
        console.log(`   ✅ Added constraint: ${constraint.name}`);
      } catch (error) {
        if (error.code === '42710') {
          console.log(`   ⏭️  Constraint already exists: ${constraint.name}`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n📊 Verifying added columns...');
    
    const check = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND column_name IN ('google_id', 'facebook_id', 'apple_id', 'supabase_uid', 'display_name', 'photo_url')
      ORDER BY column_name
    `);
    
    console.log('\n✅ All OAuth columns in users table:');
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

addOAuthColumns();
