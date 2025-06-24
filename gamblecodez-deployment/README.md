# 🎰 GambleCodez - Referral Link Management System

A comprehensive full-stack web application for managing gambling referral links and promotional campaigns with a dark neon theme, calendar functionality, and Telegram integration.

## ✨ Features

- **Dark Neon Theme**: Cyberpunk-inspired UI with glowing borders and text effects
- **Promo Calendar**: Manage time-sensitive casino promotions (48-hour events)
- **Automatic Link Detection**: Auto-populate affiliate URLs when adding casino promotions
- **Telegram Integration**: One-click HTML copy buttons optimized for Telegram posting
- **Admin Dashboard**: Three-tab interface (Overview, Calendar, Link Management)
- **Click Tracking**: Analytics dashboard with comprehensive statistics
- **Database Seeding**: Pre-populate with all GambleCodez referral links
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom neon styling
- **shadcn/ui** component library
- **TanStack React Query** for state management
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Replit Auth** with OpenID Connect
- **Session management** with PostgreSQL store

### Database
- **PostgreSQL** (Neon serverless compatible)
- **Drizzle ORM** with type-safe queries
- **Automatic migrations** via drizzle-kit

## 🚀 Quick Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Replit account (for authentication)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Replit Auth (required)
REPLIT_DOMAINS="your-domain.com"
REPL_ID="your-repl-id"
SESSION_SECRET="your-long-random-secret-key"
ISSUER_URL="https://replit.com/oidc"

# Server
NODE_ENV="production"
PORT=3000
```

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd gamblecodez
npm install
```

2. **Setup database:**
```bash
npm run db:push
```

3. **Build the application:**
```bash
npm run build
```

4. **Start the server:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Development

### Local Development
```bash
npm run dev
```

### Database Operations
```bash
# Push schema changes
npm run db:push

# Check TypeScript
npm run check
```

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Route components
├── server/                 # Express backend
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data layer
│   └── replitAuth.ts      # Authentication
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
└── scripts/               # Utility scripts
```

## 🎯 Usage

### Admin Features

1. **Login**: Use Replit authentication to access admin panel
2. **Dashboard Overview**: View statistics and quick actions
3. **Promo Calendar**: 
   - Add time-sensitive casino promotions
   - Set start/end dates (typically 48 hours)
   - Auto-detect GambleCodez affiliate links
   - Copy Telegram-formatted posts
4. **Link Management**:
   - Add/edit/delete referral links
   - Categorize (US, Non-US, Everywhere, Faucet, Socials)
   - Tag with KYC status and VPN requirements
   - Export all links for Telegram

### Seeding Database

After login, click "Seed Database with GambleCodez Links" to populate with:
- 24 US casino links
- 16 Non-US casino links  
- 9 Everywhere links
- 4 Faucet links
- 7 Social media links
- 3 Featured promotions (GetZoot, Bitsler.io, Winna)

## 🌐 Deployment Options

### Fly.io Deployment

1. **Install Fly CLI:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Deploy:**
```bash
fly launch
fly deploy
```

### VPS/Dedicated Server

1. **Setup Node.js environment**
2. **Install PostgreSQL**
3. **Configure reverse proxy (nginx recommended):**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. **Setup PM2 for process management:**
```bash
npm install -g pm2
pm2 start npm --name "gamblecodez" -- start
pm2 startup
pm2 save
```

### Docker Deployment

```bash
docker build -t gamblecodez .
docker run -p 3000:3000 --env-file .env gamblecodez
```

## 🔐 Authentication Setup

### Replit Auth Configuration

1. Go to [Replit Developer Console](https://replit.com/~)
2. Create a new app or use existing
3. Set redirect URL: `https://your-domain.com/api/callback`
4. Copy REPL_ID and add to environment variables
5. Set REPLIT_DOMAINS to your domain

### Session Security

- Uses PostgreSQL-backed sessions for reliability
- 7-day session expiry with automatic refresh
- CSRF protection enabled
- Secure cookies in production

## 📊 Database Schema

### Core Tables

- **users**: Replit auth user profiles
- **sessions**: Session storage for authentication  
- **links**: Referral links with categories and metadata
- **promo_events**: Time-sensitive promotional campaigns

### Link Categories
- `us`: US-accessible casinos
- `non-us`: International casinos (VPN required)
- `everywhere`: Global access casinos
- `faucet`: Free-play faucet sites
- `socials`: Social media links

### Tags System
- `kyc`: Requires identity verification
- `no-kyc`: No verification needed
- `vpn`: VPN/proxy friendly

## 🎨 Customization

### Theme Colors (CSS Variables)
```css
--neon-cyan: hsl(187, 100%, 50%)
--neon-magenta: hsl(300, 100%, 50%)
--neon-yellow: hsl(60, 100%, 50%)
--neon-green: hsl(120, 100%, 50%)
--neon-orange: hsl(30, 100%, 50%)
--neon-blue: hsl(240, 100%, 50%)
```

### Adding New Categories
1. Update `shared/schema.ts`
2. Add to category enum in components
3. Update API validation
4. Run `npm run db:push`

## 🔧 Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check DATABASE_URL format
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Conflicts**
```bash
# Check if port is in use
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

### Development Debugging

Enable debug logging:
```env
DEBUG=express:*
NODE_ENV=development
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- Total links count
- Active promotions
- Social media links
- Click tracking per link

### External Monitoring
Recommended tools:
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Logs**: Logtail, Papertrail

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] Multi-user support with role-based permissions
- [ ] Advanced analytics with charts and graphs
- [ ] Email notification system for promotions
- [ ] API rate limiting and caching
- [ ] Mobile app with React Native
- [ ] Integration with more casino APIs

## 📞 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Include environment details and error logs

---

**GambleCodez** - Professional referral link management for the digital age 🎰