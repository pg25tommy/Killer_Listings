# Killer Listings

A BC-first property intelligence platform that surfaces violent or stigmatizing incident history tied to residential addresses.

## Getting Started

### Prerequisites

- Node.js 20.x+
- PostgreSQL database
- npm

### Setup

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create your environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your database connection string:
```
DATABASE_URL="postgresql://username:password@localhost:5432/killer_listings?schema=public"
```

5. Set up the database:
```bash
npm run db:push
npm run db:generate
```

6. (Optional) Seed with sample data:
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── legal/          # Legal disclaimer
│   ├── map/            # Map view
│   ├── property/[id]/  # Property detail page
│   └── search/         # Search results
├── components/
│   ├── layout/         # Layout components (Nav)
│   └── ui/             # UI components
├── lib/                # Utilities and config
├── services/           # Business logic
└── types/              # TypeScript types
```

## MVP Coverage

Currently supporting British Columbia:
- Vancouver
- Burnaby
- New Westminster
- Richmond
- Surrey
- Delta
- Coquitlam / Tri-Cities
- North Vancouver
- West Vancouver

## License

Private - All rights reserved
