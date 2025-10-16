# Deployment Guide - BitpandaPro

This guide explains how to deploy the BitpandaPro application outside of Replit.

## Prerequisites

- **Node.js**: Version 20.x or higher
- **PostgreSQL Database**: A running PostgreSQL instance
- **npm** or **yarn**: Package manager

## Quick Start (One Command Deployment)

```bash
npm run deploy
```

This command will:
1. Install all dependencies
2. Build the application (server + client)
3. Start the production server

## Step-by-Step Deployment

### 1. Install Dependencies

```bash
npm install
# or
npm run deploy:install
```

This installs all required packages including devDependencies needed for building.

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000

# Optional API Keys (for full functionality)
COINGECKO_API_KEY=your_coingecko_api_key
NEWS_API_KEY=your_news_api_key
METALS_API_KEY=your_metals_api_key
COOKIE_SECRET=your_cookie_secret_key

# Node Environment
NODE_ENV=production
```

### 3. Build the Application

```bash
npm run build
# or
npm run deploy:build
```

This command:
- Compiles TypeScript server code (`tsc`)
- Builds the React frontend (`vite build`)
- Outputs to `dist/` directory

**Build Breakdown:**
- Server build: `npm run build:server` (TypeScript compilation)
- Client build: `npm run build:client` (Vite production build)

### 4. Database Setup

Run database migrations:

```bash
npm run db:push
```

### 5. Start the Production Server

```bash
npm start
# or
npm run deploy:start
```

The server will start on `http://0.0.0.0:5000` (or the PORT specified in your .env file).

## Deployment Platforms

### Render.com

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

### Railway.app

1. Connect your GitHub repository
2. Railway auto-detects Node.js and runs `npm install` and `npm start`
3. Add environment variables in Railway dashboard
4. Deploy!

### DigitalOcean / AWS / GCP

1. Clone repository on server
2. Install Node.js 20+
3. Run: `npm install && npm run build`
4. Set up PM2 or systemd for process management:
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start npm --name "bitpandapro" -- start
   pm2 save
   pm2 startup
   ```
5. Configure reverse proxy (nginx/apache) to forward to port 5000

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t bitpandapro .
docker run -p 5000:5000 --env-file .env bitpandapro
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `DATABASE_URL` with production database
- [ ] Set secure `COOKIE_SECRET` (random string)
- [ ] Add API keys for external services
- [ ] Enable SSL/HTTPS on your server
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up CDN for static assets (optional)

## Automatic Deployment Scripts

The package.json includes these deployment-specific scripts:

| Script | Description |
|--------|-------------|
| `npm run deploy` | Complete deployment (install → build → start) |
| `npm run deploy:install` | Install all dependencies including devDependencies |
| `npm run deploy:build` | Build server and client |
| `npm run deploy:start` | Start production server |
| `npm run build:server` | Build server only (TypeScript) |
| `npm run build:client` | Build client only (Vite) |
| `npm run db:migrate` | Run database migrations |

## Post-Install Hooks

The package.json includes automatic build hooks:

- **postinstall**: Automatically builds the client after `npm install`
- **prepare**: Automatically builds the server before publishing

These ensure the app is ready to run after installation.

## Troubleshooting

### Build Errors

If build fails:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running and accessible
- Check firewall rules allow connection
- Test connection: `npm run db:push`

### Port Already in Use

Change port in `.env` file:
```
PORT=3000
```

## Support

For issues or questions:
- Check logs: `pm2 logs` (if using PM2)
- Review environment variables
- Ensure all dependencies are installed
- Verify Node.js version: `node --version` (should be 20+)
