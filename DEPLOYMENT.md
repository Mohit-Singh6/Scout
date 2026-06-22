# Scout - Deployment Guide

This guide covers deploying Scout to production environments.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon, Render, or similar)
- GitHub OAuth credentials
- Groq API key
- A deployment platform (Vercel, Render, Railway, etc.)

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in environment variables:**
   Edit `.env.local` and add your actual values:
   - `DATABASE_URL` - PostgreSQL connection string
   - `AUTH_SECRET` - Generate with: `openssl rand -hex 32`
   - `GITHUB_ID` & `GITHUB_SECRET` - From GitHub OAuth app
   - `GROQ_API_KEY` - From Groq console
   - `CRON_SECRET_KEY` - Any random secure string

## Database Setup

### Local Development
```bash
# Install dependencies
npm install

# Setup Prisma
npx prisma generate
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Production Database

1. Create a PostgreSQL database (Neon recommended)
2. Set `DATABASE_URL` in production environment
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to your production domain:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://yourdomain.com/api/auth/callback/github`
4. Copy `Client ID` and `Client Secret` to `.env.local`

## Groq API Key

1. Sign up at [Groq Console](https://console.groq.com)
2. Create an API key
3. Add to `GROQ_API_KEY` in environment

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.example`
5. Deploy

**Vercel-specific setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Render

1. Create account at [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables
5. Set build command: `npm run build`
6. Set start command: `npm start`

### Railway

1. Go to [Railway](https://railway.app)
2. Create new project
3. Import GitHub repo
4. Add PostgreSQL service
5. Set environment variables
6. Deploy

## Build & Start

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Health Checks

After deployment, verify:

1. **Homepage loads:** Visit your domain
2. **Authentication works:** Try GitHub login
3. **Database connected:** Check /api/auth/signin
4. **Cron jobs:** Monitor `/api/cron/ping` endpoint

## Monitoring

- Check application logs in your deployment platform
- Monitor database performance
- Set up error tracking (optional: Sentry)

## Database Migrations

For production database schema changes:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Review the generated SQL
# Commit changes
# Deploy will auto-run migrations
```

## Environment Variables Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | PostgreSQL connection | ✅ |
| AUTH_SECRET | NextAuth secret | ✅ |
| GITHUB_ID | OAuth client ID | ✅ |
| GITHUB_SECRET | OAuth client secret | ✅ |
| GROQ_API_KEY | AI summary generation | ✅ |
| CRON_SECRET_KEY | Cron endpoint security | ✅ |

## Troubleshooting

**Database connection fails:**
- Verify `DATABASE_URL` format
- Check database is running
- Ensure firewall allows connections

**OAuth redirects to wrong URL:**
- Confirm callback URL in GitHub OAuth settings
- Check your domain in `.env`

**Cron jobs not running:**
- Verify `CRON_SECRET_KEY` is set
- Check cron logs in deployment platform
- Ensure HTTP endpoints are accessible

## Security Checklist

- [ ] `.env*` files are in `.gitignore`
- [ ] `AUTH_SECRET` is a secure random string
- [ ] All secrets use strong values
- [ ] HTTPS is enabled on production domain
- [ ] Database backups are configured
- [ ] Firewall rules restrict database access

## Support

For issues, check:
- Application logs in deployment platform
- Database connection status
- GitHub OAuth callback URL
- Environment variable spelling and values
