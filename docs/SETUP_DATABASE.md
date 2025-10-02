# Database Setup Instructions

## Required: PostgreSQL Database Setup

Your crypto platform requires a PostgreSQL database to run. Here's how to set it up:

### Step 1: Access Database Tool
1. Look for the **Database** tool in your left sidebar (Tools panel)
2. If you can't see it, use the search bar and type "Replit Database"
3. Click on the Database tool

### Step 2: Create PostgreSQL Database
1. In the Database tool, click **"Create a database"**
2. Select **PostgreSQL** as the database type
3. Replit will automatically provision the database and set up environment variables

### Step 3: Verify Environment Variables
After creation, you should see these environment variables automatically added:
- `DATABASE_URL`
- `PGHOST`
- `PGUSER` 
- `PGPASSWORD`
- `PGDATABASE`
- `PGPORT`

### Step 4: Restart the Application
Once the database is created:
1. The application will automatically restart
2. Database tables will be created automatically using Drizzle migrations
3. Your crypto platform will be fully functional

## What This Database Stores
- User accounts and authentication
- Trading portfolios and holdings
- Transaction history
- Admin balance adjustments
- News articles and notifications
- Session data for security

## Next Steps
After setting up the database, I'll complete the migration by:
1. Running database migrations to create all tables
2. Verifying the application starts successfully
3. Testing core functionality
4. Marking the migration as complete

**Need help?** Let me know if you encounter any issues during the database setup process.