# Byte Brigade Dashboard

A Cyberpunk/Neo-Tokyo themed dashboard for team Byte Brigade for the 75-day Tech Sprint Journey 2026.

## Features

- **Neon Cyberpunk UI**: Built with Tailwind CSS, Lucide React, and Framer Motion.
- **Supabase SSR**: Integrated authentication, server actions, and Postgres database types.
- **Activity Logging**: Operatives can submit tasks and upload proof files.
- **Verification Portal**: Team leads can verify or penalize submissions (with a strict 90% plagiarism deduction).
- **Dual Scoreboards**: Tracks Team Network Power and individual MVP statuses.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database / Auth**: Supabase (`@supabase/ssr`)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui base components
- **Animations**: Framer Motion

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```
2. **Configure environment variables:**
   The `.env.local` file should contain your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
3. **Run the development server:**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
