# Killer Listings - Deployment Guide

## Quick Start

### 1. Get a Mapbox Token (Free)
1. Sign up at [mapbox.com](https://www.mapbox.com)
2. Go to [Account → Access Tokens](https://account.mapbox.com/access-tokens/)
3. Copy your default public token
4. Add to `.env`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   ```

### 2. Test Locally
```bash
npm install
npm run dev
```
Visit [http://localhost:3000/map](http://localhost:3000/map) to see the map!

---

## Production Deployment

### Option A: Deploy to Vercel (Easiest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Set up PostgreSQL Database**

   Choose one:

   **Neon** (Recommended - Free tier):
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

   **Supabase**:
   - Sign up at [supabase.com](https://supabase.com)
   - Create project
   - Get connection string from Settings → Database

   **Railway**:
   - Sign up at [railway.app](https://railway.app)
   - Create PostgreSQL service
   - Copy connection URL

3. **Update Database Schema**

   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Deploy**
   ```bash
   vercel login
   vercel
   ```

5. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add:
     ```
     DATABASE_URL=postgresql://...
     NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey...
     OPENAI_API_KEY=sk-...  (optional)
     ```

6. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Deploy to Railway

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repo
   - Add PostgreSQL service
   - Set environment variables (same as Vercel above)

---

## Environment Variables

### Required
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Map (get from mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.ey..."
```

### Optional
```env
# AI extraction (get from platform.openai.com)
OPENAI_API_KEY="sk-..."
```

---

## Features Available

✅ **Working Now:**
- Map view with incident markers
- Automatic geocoding (uses Mapbox + free fallback)
- Bulk import from HouseCreep
- AI-powered article extraction
- Search by address
- Property detail pages

✅ **Auto-Geocoding:**
- Automatically gets coordinates for addresses
- Uses Mapbox Geocoding API (if token provided)
- Falls back to free OpenStreetMap Nominatim
- Manual entry option if geocoding fails

---

## Post-Deployment

### Seed Database
After deploying, you can add sample data:
```bash
npx tsx prisma/seed.ts
```

### Import Real Data
1. Go to `/admin`
2. Use "Bulk Import from HouseCreep":
   - Open HouseCreep Vancouver page
   - Scroll to load all listings
   - Select all (Ctrl+A)
   - Copy and paste into textarea
   - Click "Parse Listings"
   - Approve each one (auto-geocodes!)

---

## Troubleshooting

### Map not showing
- Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Must start with `pk.`
- Visit `/map` to test

### Geocoding fails
- Mapbox: 100k requests/month free
- Fallback: OpenStreetMap (rate limited)
- Manual entry always available

### Database connection fails
- Check `DATABASE_URL` format
- PostgreSQL: `postgresql://user:pass@host:5432/db`
- Run migrations: `npx prisma migrate deploy`

---

## Costs

All **FREE** for small projects:
- **Mapbox**: 50k map loads + 100k geocodes/month
- **Neon/Supabase**: 500MB database free
- **Vercel**: Hobby tier (personal projects)
- **OpenAI** (optional): Pay per use (~$0.002 per extraction)

---

## Next Steps

1. Get Mapbox token → Add to `.env`
2. Test map locally
3. Deploy to Vercel
4. Import HouseCreep data
5. Launch! 🚀
