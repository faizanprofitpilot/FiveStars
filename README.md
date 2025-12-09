# FiveStars

AI-powered Review Request Automation + Review Reply Assistant

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

See `.env.example` for all required environment variables.

## Tech Stack

- **Next.js 14+** (App Router)
- **Supabase** (Auth & Database)
- **OpenAI** (AI generation)
- **Twilio** (SMS)
- **Resend** (Email)
- **Tailwind CSS + shadcn/ui** (UI)
- **Playwright** (Web scraping)

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components
- `lib/` - Utilities and configurations
- `types/` - TypeScript type definitions

