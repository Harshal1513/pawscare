# 🐾 Paws Care and Heal Pet Clinic — Complete Website

**Clinic:** Paws Care and Heal Pet Clinic  
**Location:** Ganapati Temple, double road, near Hindalga, Belagavi 590019  
**Phone:** 094838 52691  
**Rating:** 4.9★ (223 reviews)

---

## 🗃️ Supabase Database Tables

| Table | Purpose |
|-------|---------|
| `pets` | Pet + owner records (name, mobile, type, age) |
| `visits` | Visit history (one pet → many visits) with diagnosis, treatment, medicines, reminder |
| `appointments` | Online booking form submissions |
| `stories` | Success stories with tags and photos |
| `services` | Service list with editable prices |

**Key relationships:**
- One pet → many visits (pet_id FK in visits)
- Each visit has its own reminder date + custom WhatsApp message

---

## 📂 Project Structure

```
pawscare/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Home page (full design)
│   │   ├── layout.tsx                  ← Root layout
│   │   ├── globals.css                 ← Design system
│   │   ├── services/page.tsx           ← Services & Prices
│   │   ├── offers/page.tsx             ← Special Offers
│   │   ├── success-stories/page.tsx    ← Success Stories
│   │   ├── book/page.tsx               ← Book Appointment
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── appointments/page.tsx
│   │   │   ├── records/page.tsx        ← Pet Records + Visits
│   │   │   └── reminders/page.tsx      ← WhatsApp Reminders
│   │   └── api/
│   │       ├── appointments/route.ts
│   │       ├── pets/route.ts
│   │       ├── visits/route.ts
│   │       ├── stories/route.ts
│   │       ├── services/route.ts
│   │       └── reminders/cron/route.ts ← Daily cron
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── chatbot/ChatBot.tsx
│   └── lib/
│       ├── supabase.ts
│       └── whatsapp.ts
├── supabase-schema.sql
├── vercel.json                          ← Daily cron config
└── package.json
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create account → New project
2. Choose a region close to India (Singapore recommended)
3. Go to **SQL Editor** → Paste entire `supabase-schema.sql` → **Run**
4. Go to **Settings → API** → Copy:
   - `Project URL` (looks like `https://xxxx.supabase.co`)
   - `anon / public` key

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Paws Care and Heal"
git remote add origin https://github.com/YOURNAME/pawscare-clinic.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   CRON_SECRET=any-random-secure-string-you-choose
   ADMIN_PASSWORD=clinic2026
   ```
5. Click **Deploy** → Live in ~2 minutes!

### Step 4: Verify Cron Job

The `vercel.json` configures a daily cron at 8 AM IST (2:30 AM UTC):
```json
{
  "crons": [{ "path": "/api/reminders/cron", "schedule": "30 2 * * *" }]
}
```

Test it manually: `GET https://yoursite.vercel.app/api/reminders/cron?secret=YOUR_CRON_SECRET`

---

## 📱 WhatsApp Integration

Currently using **wa.me links** (100% free, no API needed):
- Doctor clicks "Send WhatsApp" → opens WhatsApp with pre-filled message
- Works on any device with WhatsApp installed

### To upgrade to WhatsApp Cloud API (automatic sending):

1. Get credentials from Meta Business Suite
2. Add to `.env.local`:
   ```
   WA_PHONE_NUMBER_ID=your_id
   WA_ACCESS_TOKEN=your_token
   ```
3. Uncomment the API call in `src/app/api/reminders/cron/route.ts`

---

## 🔐 Admin Login

- URL: `https://yoursite.vercel.app/admin/login`
- Default: `admin` / `clinic2026`
- **Change password** in Vercel environment variables!

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Font | Nunito (800/900 weight) |
| Primary accent | `#F59E0B` (amber/yellow) |
| Service cards | `#5BC8D4` (teal) |
| Appointment form | `#F59E0B` (amber) |
| Signs tiles | `#F59E0B` (amber) |
| Do-not cards | `#5BC8D4` (teal) |
| Border radius | 20px cards, 28px panels, 50px buttons |

All matching the Dribbble "Happy Paw" reference design.

---

*© 2026 Paws Care and Heal Pet Clinic, Belagavi, Karnataka*
