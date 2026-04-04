# EPMOC Website

Official website for the Event Planning and Management Organizing Council of IIIT Una.

**Stack:** Next.js 14 · Tailwind CSS · Supabase · Vercel

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql` — this creates all tables, policies, storage buckets, and seeds the initial team + events data
3. Go to **Project Settings → API** and copy your Project URL and anon key

### 3. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Add the logo

Place `Copy_of_EPMOC.png` (renamed) at `public/epmoc-logo.png`

### 5. Run

```bash
npm run dev
```

---

## Admin Setup

The admin panel is at `/admin/login` — not linked publicly anywhere.

To create an admin account:
1. Go to Supabase dashboard → **Authentication → Users**
2. Click **Add User → Create New User**
3. Set an email + strong password
4. Use those credentials at `/admin/login`

---

## Deploy on Vercel

**Via GitHub (recommended):**
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

**Via CLI:**
```bash
npx vercel
```

---

## Project Structure

```
app/
  (public)/         Public pages (Home, About, Events, Team, Gallery, Contact)
  admin/            Admin dashboard (auth-protected via middleware)
components/         Navbar, Footer
lib/                Supabase clients
middleware.ts       Protects /admin/* routes
supabase/schema.sql Full DB schema + seed data
types/database.ts   TypeScript types
```

---

## Admin Dashboard

| Section   | What you can do                                      |
|-----------|------------------------------------------------------|
| Events    | Add / edit / delete events with images and categories |
| Team      | Add / edit / remove members with photos               |
| Gallery   | Upload photos, link to events                         |
| Messages  | Read contact form submissions, mark read, reply       |

---

## Design

- **Colors:** Orange `#FF6B2B` (primary) · Lime `#A8FF3E` (secondary) · Dark `#08080e` (bg)
- **Fonts:** Syne (headings) · DM Sans (body)
- **Theme:** Dark, modern, friendly — not corporate

---

## Notes

- Public pages fall back to hardcoded seed data if Supabase isn't connected yet
- Images stored in Supabase Storage (buckets: `events`, `team`, `gallery`)
- RLS ensures only admins can write; public can only read
- `/admin/login` is intentionally not linked from the public site
