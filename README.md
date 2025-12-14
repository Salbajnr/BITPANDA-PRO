# BitpandaPro - Cryptocurrency Trading Platform

A full-stack cryptocurrency trading platform built with React, Node.js, and PostgreSQL. Features real-time price updates, portfolio management, trading capabilities, and an admin dashboard.

## 📚 Documentation

All documentation has been moved to the [`docs/`](./docs/) directory for better organization:

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 5 minutes
- **[Deployment Guide](./docs/DEPLOYMENT_STATUS.md)** - Deploy to Render
- **[Authentication Guide](./docs/COMPLETE_AUTH_GUIDE.md)** - OAuth & OTP setup
- **[Environment Setup](./docs/ENVIRONMENT_SETUP.md)** - All environment variables
- **[API Integration Status](./docs/API_INTEGRATION_STATUS.md)** - API documentation
- **[Gmail SMTP Setup](./docs/GMAIL_SMTP_SETUP.md)** - Configure Gmail for OTP email delivery

See the [`docs/`](./docs/) directory for complete documentation.

## 🚀 Features

### User Features
- **Real-time Crypto Prices** - Live price updates for 100+ cryptocurrencies
- **Trading Interface** - Buy/sell cryptocurrencies with advanced order types
- **Portfolio Management** - Track investments and performance
- **Multi-language Support** - English, German, Spanish, French, Chinese
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Authentication System** - Secure user registration and login
- **KYC Verification** - Identity verification for compliance
- **Investment Plans** - Automated savings and investment strategies
- **Price Alerts** - Get notified when prices hit your targets
- **News Integration** - Latest crypto news and market analysis

### Admin Features
- **User Management** - Manage user accounts and permissions
- **Transaction Monitoring** - Real-time transaction tracking
- **System Analytics** - Platform usage and performance metrics
- **Content Management** - Manage news articles and announcements
- **Support System** - Chat system for customer support
- **Audit Logs** - Complete audit trail of all activities

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Wouter** - Lightweight routing
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database queries
- **WebSocket** - Real-time communication
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### External APIs
- **CoinGecko** - Cryptocurrency price data
- **NewsAPI** - News aggregation
- **Metals API** - Precious metals pricing

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14+ (optional - can run in demo mode)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bitpandapro.git
cd bitpandapro
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
# Database (optional - runs in demo mode without this)
DATABASE_URL=postgresql://username:password@localhost:5432/bitpandapro

# Server Configuration
NODE_ENV=development
PORT=5000

# API Keys (optional - for full functionality)
COINGECKO_API_KEY=your_coingecko_api_key
NEWS_API_KEY=your_news_api_key
METALS_API_KEY=your_metals_api_key

# Security
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-long
```

### 4. Start Development Servers

**Option A: Start Both Frontend and Backend**
```bash
npm run dev
```

**Option B: Start Separately**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin.html

## 🗄️ Database Setup

### Option 1: Demo Mode (No Database Required)
The application runs in demo mode without a database. Perfect for development and testing.

### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb bitpandapro`
3. Add `DATABASE_URL` to your `.env` file
4. Run migrations: `npm run db:push`

### Option 3: Cloud Database (Recommended)
Use a cloud PostgreSQL service for both development and production:

**Free Options:**
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL with additional features
- [Render](https://render.com) - Managed PostgreSQL

**Setup:**
1. Create a PostgreSQL database
2. Copy the connection string
3. Add to `.env`: `DATABASE_URL=your-connection-string`
4. Run migrations: `npm run db:push`

## 📁 Project Structure

```
bitpandapro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility functions
│   │   └── translations/   # i18n language files
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   ├── types/              # TypeScript type definitions
│   └── drizzle/            # Database migrations
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema
└── dist/                   # Build output
```

## 🔧 Available Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both frontend and backend
npm run build:client     # Build only frontend
npm run build:server     # Build only backend
npm run start            # Start production server
npm run install:all      # Install all dependencies
```

### Client Scripts
```bash
cd client
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Server Scripts
```bash
cd server
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm run start            # Start production server
npm run db:push          # Push database schema
npm run db:migrate       # Run database migrations
```

## 🌐 Deployment

### Render.com (Recommended)
Follow the detailed guide in `RENDER_DEPLOYMENT_GUIDE.md`:

1. **Deploy Backend**: Create a Web Service
2. **Deploy Frontend**: Create a Static Site
3. **Database**: Use Render PostgreSQL or external service

### Other Platforms
- **Vercel** - Frontend deployment
- **Railway** - Full-stack deployment
- **Heroku** - Backend deployment
- **Netlify** - Frontend deployment

## 🔐 Environment Variables

### Required for Production
```env
DATABASE_URL=postgresql://...
NODE_ENV=production
COOKIE_SECRET=your-secret-key
```

### Optional (for full functionality)
```env
COINGECKO_API_KEY=your-api-key
NEWS_API_KEY=your-api-key
METALS_API_KEY=your-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for cryptocurrency data
- [NewsAPI](https://newsapi.org) for news aggregation
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling

---

**Built with ❤️ for the crypto community**
