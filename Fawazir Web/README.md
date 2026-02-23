# Fawazir Sultan 2026

A premium Ramadan challenge platform built with Next.js 14+, Tailwind CSS, and Prisma.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```
*Note: If you encounter issues with `jose` or `bcryptjs` not being found, try running `npm install jose bcryptjs` manually.*

### 2. Setup Database
The project uses SQLite by default for development.
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```
This will seed the database with:
- **Admin**: `admin@fawazir.com` (password: `admin123`)
- **Players**: `najm@fawazir.com`, `doctor@fawazir.com`, `bissa@fawazir.com`, `samit@fawazir.com` (password: `123123`)

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Features

- **Player Dashboard**: 30-day grid, countdown timer, leaderboard.
- **Admin Panel**: Manage days, tasks, progress, and notifications at `/admin`.
- **Themes**: Character-specific themes (Najm, Doctor, Bissa, Samit).

## Deployment

1. Push to GitHub.
2. Deploy to Vercel/Railway.
3. Update `DATABASE_URL` in environment variables if using Postgres (e.g. Neon/Supabase).
