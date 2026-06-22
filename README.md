# Scout - Website Monitoring Dashboard

A modern, real-time website monitoring dashboard built with Next.js. Monitor uptime, performance, and health of your websites with beautiful analytics and AI-powered insights.

![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791)

## Features

✨ **Core Features**
- 📊 Real-time website monitoring dashboard
- 🚀 Track multiple routes per website
- 📈 Performance metrics with latency graphs
- 📉 Uptime statistics with custom time ranges
- 🤖 AI-powered uptime summaries using Groq
- 🔐 GitHub OAuth authentication
- 🎨 Beautiful dark theme UI

🛠️ **Capabilities**
- Monitor frontend pages and backend health endpoints
- Track hosting providers
- Status indicators (UP, DEGRADED, DOWN, TIMEOUT)
- Time range filtering (24h, 7d, 30d, custom)
- Full CRUD operations for websites and routes
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 16+, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with GitHub OAuth
- **AI**: Groq API for summaries
- **Monitoring**: Custom cron jobs
- **UI**: Recharts, Lucide Icons, shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- GitHub OAuth credentials
- Groq API key

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/scout.git
cd scout
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
# Edit .env.local and fill in your values
```

4. **Setup database**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## Configuration

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `AUTH_SECRET` | NextAuth secret | ✅ |
| `GITHUB_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_SECRET` | GitHub OAuth client secret | ✅ |
| `GROQ_API_KEY` | AI summary generation | ✅ |
| `CRON_SECRET_KEY` | Cron endpoint security | ✅ |

See [.env.example](.env.example) for details.

## Usage

1. **Login** with GitHub
2. **Add a website** with base URL and hosting provider
3. **Add routes** to monitor (frontend pages or backend endpoints)
4. **View analytics** with real-time status and performance metrics
5. **Get AI insights** on uptime summaries

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/scout)

### Other Platforms

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides:
- Vercel
- Render
- Railway
- Self-hosted

## Project Structure

```
scout/
├── app/                    # Next.js app directory
│   ├── api/               # API routes & cron jobs
│   ├── sites/             # Dashboard pages
│   ├── edit/              # Edit website/routes
│   └── signin/            # Auth pages
├── components/            # React components
├── lib/                   # Utilities & server actions
│   └── actions/          # Server-side operations
├── prisma/               # Database schema & migrations
├── public/               # Static assets
└── types/                # TypeScript types
```

## Available Scripts

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Database
npx prisma migrate dev      # Create migration
npx prisma migrate deploy   # Run migrations
npx prisma studio          # Visual database editor

# Linting
npm run lint
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [ ] Email notifications for downtime
- [ ] Slack integration
- [ ] Performance regression alerts
- [ ] Custom dashboards
- [ ] Team collaboration
- [ ] Advanced analytics

## Support

- 📖 [Documentation](DEPLOYMENT.md)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Groq](https://groq.com/) - AI API
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

Made with ❤️ by the Mohit
