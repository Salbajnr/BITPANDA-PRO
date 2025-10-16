
# BitPanda-Pro

A modern web application that merges the features of a cryptocurrency trading platform and a precious metals investment platform, providing users with a unified dashboard for managing both digital and physical asset investments.

## 🚀 Overview

BitPanda-Pro combines the best of both worlds - cryptocurrency trading and precious metals investment - in a single, intuitive platform. Users can manage their crypto portfolios alongside precious metals investments, all while enjoying real-time market data, advanced analytics, and secure deposit workflows.

## ✨ Key Features

### 🔐 Dual Authentication System
- **User Authentication**: Standard user registration and login with portfolio management
- **Admin Authentication**: Separate admin panel with full platform control
- **Role-based Access Control**: Strict separation between user and admin functionalities

### 💰 Asset Management
- **Cryptocurrency Trading**: Real-time crypto market data via CoinGecko API
- **Precious Metals Investment**: Live metals pricing through Metals API
- **Unified Dashboard**: Single interface for managing both asset types
- **Portfolio Analytics**: Comprehensive tracking and performance metrics

### 📊 Real-Time Market Data
- **Live Price Ticker**: Real-time crypto and metals prices at the top of the app
- **Market Analytics**: Advanced charting and technical indicators
- **Price Alerts**: Customizable notifications for price movements
- **News Integration**: Latest cryptocurrency and financial news feeds

### 💳 Deposit & Payment System
- **Multi-Platform Deposits**: Support for Binance, Bybit, Crypto.com, and other exchanges
- **Proof-of-Payment Workflow**: Users upload payment confirmations for verification
- **Admin Verification**: Manual review and approval of deposit requests
- **Balance Management**: Real-time balance updates after admin approval

### 🛠️ Admin Features
- **Balance Simulation**: Admin can simulate balances for demo/testing purposes
- **Deposit Management**: Review and approve/reject deposit requests
- **Content Management**: Control over news, featured rates, and pricing adjustments
- **User Management**: Full oversight of user accounts and activities

## 🏗️ Technical Architecture

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based auth with role management
- **APIs**: RESTful endpoints with WebSocket support for real-time data

### Frontend Stack
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Custom components with Tailwind CSS
- **State Management**: React Query for server state management

### Database Schema
```sql
-- Users and Authentication
users: id, username, email, password, firstName, lastName, role, isActive
sessions: session management and security

-- Financial Data
portfolios: user portfolio information and balances
deposits: deposit requests and verification status
transactions: transaction history and records
balances: real-time balance tracking

-- Market Data
crypto_rates: cryptocurrency pricing data
metals_rates: precious metals pricing information
price_alerts: user-defined price notifications

-- Content Management
news: cryptocurrency and financial news articles
proof_uploads: deposit confirmation files
```

### External APIs
- **CoinGecko API**: Real-time cryptocurrency market data and pricing
- **Metals API**: Live precious metals pricing and market information
- **News APIs**: Financial and cryptocurrency news content feeds

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database
- API keys for CoinGecko and Metals API services (optional)

### Development Setup
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd bitpandapro
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. Initialize database
   ```bash
   npm run db:push
   ```

5. Start development server
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

### Production Deployment

For detailed deployment instructions to any platform (Render, Railway, DigitalOcean, AWS, etc.), see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

#### Quick Deploy Commands

```bash
# Complete deployment (install → build → start)
npm run deploy

# Or step by step:
npm run deploy:install  # Install dependencies
npm run deploy:build    # Build application
npm run deploy:start    # Start production server
```

#### Environment Variables
See `.env.example` for all required environment variables. Key variables include:
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Set to 'production' for deployment
- `PORT`: Server port (default: 5000)
- `COOKIE_SECRET`: Session encryption key (generate random string)
- `COINGECKO_API_KEY`: CoinGecko API key (optional)
- `NEWS_API_KEY`: News API key (optional)
- `METALS_API_KEY`: Metals API key (optional)
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── admin/         # Admin-specific components and pages
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── contexts/      # React contexts
│   │   ├── translations/  # i18n translation files
│   │   └── lib/          # Utility functions
├── server/                # Backend Node.js application
│   ├── *-routes.ts       # API route handlers
│   ├── *-service.ts      # Business logic services
│   ├── db.ts             # Database configuration
│   ├── storage.ts        # Data access layer
│   └── websocket-*.ts    # WebSocket servers
├── shared/               # Shared types and schemas
├── tests/                # Test files
├── docs/                 # Documentation files
├── scripts/              # Utility scripts
├── assets/               # Static assets and reference files
└── uploads/             # File upload storage
```

## 🔄 Workflows

### User Deposit Flow
1. User selects deposit amount and payment method
2. System redirects to external platform (Binance, Bybit, etc.)
3. User completes payment and uploads proof of payment
4. Admin reviews and verifies the deposit
5. Upon approval, user balance is updated automatically

### Admin Verification Process
1. Admin receives notification of new deposit request
2. Reviews uploaded proof of payment documents
3. Verifies transaction details against external platform
4. Approves or rejects the deposit with optional notes
5. System automatically updates user balance if approved

## 🛡️ Security Features

- **Session Management**: Secure HTTP-only cookies with configurable TTL
- **Role-based Access**: Middleware-enforced route protection
- **Input Validation**: Comprehensive request validation using Zod
- **File Upload Security**: Safe file handling for proof uploads
- **Admin Separation**: Complete isolation of admin and user functionalities

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Core authentication system
- ✅ Basic portfolio management
- ✅ Real-time price data integration
- ✅ Deposit workflow implementation

### Phase 2 (Upcoming)
- 🔄 Savings plans and recurring investments
- 🔄 Advanced trading features
- 🔄 Enhanced analytics and reporting
- 🔄 Mobile-responsive improvements

### Phase 3 (Future)
- 📋 Escrow payment system
- 📋 Advanced portfolio rebalancing
- 📋 Institutional trading features
- 📋 API access for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@bitpanda-pro.com
- 💬 Discord: [Join our community](https://discord.gg/bitpanda-pro)
- 📚 Documentation: [docs.bitpanda-pro.com](https://docs.bitpanda-pro.com)

---

**BitPanda-Pro** - Bridging Traditional and Digital Assets 🌉
