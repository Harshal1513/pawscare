# Paws Care and Heal Pet Clinic - Complete Deployment Guide

## Overview
This guide will help you deploy your pet clinic website to production. The website includes:
- Public website (home, services, offers, success stories, booking)
- Admin dashboard (protected, only accessible to admin)
- Database (Supabase) for storing all data
- Cron job for automatic reminders
- Responsive design for all devices

---

## PART 1: SUPABASE SETUP (Database)

### Step 1: Create Supabase Account
1. Go to https://supabase.com and sign up (free tier is enough)
2. Click "New Project"
3. Fill in:
   - **Organization name**: Your clinic name
   - **Project name**: pawscare
   - **Database password**: Create a strong password and SAVE IT (you'll need it)
   - **Region**: India (bangalore or closest)
4. Click "Create new project"
5. Wait 1-2 minutes for it to set up

### Step 2: Create Database Tables
1. In your Supabase dashboard, click **SQL Editor** in the left menu
2. Click **New query**
3. Copy the entire content from `supabase-schema.sql` file in your project
4. Paste it into the SQL editor
5. Click **Run** button
6. You should see success messages

### Step 3: Get API Keys
1. In Supabase dashboard, click **Project Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## PART 2: VERCEL SETUP (Hosting)

### Step 1: Create Vercel Account
1. Go to https://vercel.com and sign up
2. You can sign up with GitHub (recommended) or email

### Step 2: Connect Your Project
1. Click **Add New** → **Project**
2. Click **Import Git Repository**
3. If your code is on GitHub, select your repository
4. If not, you can drag and drop your project folder

### Step 3: Configure Environment Variables
On the Vercel deployment screen:

1. Expand **Environment Variables** section
2. Add these variables (one by one):

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL (from Step 3 above) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `CRON_SECRET` | Any random string (e.g., `my-secret-123`) |

3. Click **Deploy**

---

## PART 3: VERIFY DEPLOYMENT

### Check Website Works
1. After deployment completes, Vercel will give you a URL (like `pawscare.vercel.app`)
2. Open that URL in your browser
3. Test:
   - Home page loads
   - Navigation works
   - Services page shows
   - Booking form works

### Check Admin Works
1. Go to: `https://your-site.vercel.app/admin/login`
2. Login with:
   - **Username**: `admin`
   - **Password**: `clinic2026`
3. You should see the admin dashboard

---

## PART 4: ACCESSING AND USING ADMIN

### Admin URL
```
https://your-website.com/admin/login
```

### Default Login Credentials
- **Username**: `admin`
- **Password**: `clinic2026`

### Admin Features
1. **Dashboard**: View today's appointments, total pets, due reminders
2. **Appt**: See today's appointments
3. **Records**: Search and add pet records, track visits
4. **Reminders**: See pets due for follow-up, send WhatsApp reminders
5. **Success Stories**: View customer reviews
6. **Services**: Manage services and prices

---

## PART 5: CHANGING ADMIN USERNAME/PASSWORD

### To change credentials:
1. Open your project in a code editor (VS Code)
2. Go to: `src/app/admin/login/page.tsx`
3. Find line 16:
   ```javascript
   if (creds.username === 'admin' && creds.password === 'clinic2026') {
   ```
4. Change `'admin'` to your new username
5. Change `'clinic2026'` to your new password
6. Save the file
7. Commit and push to GitHub
8. Vercel will auto-deploy with the new credentials

---

## PART 6: HOW THE SYSTEM WORKS

### Data Storage
1. When someone books an appointment on the website:
   - Data goes to Supabase `appointments` table
   - Admin sees it in dashboard

2. When admin adds pet records:
   - Data goes to Supabase `pets` table
   - Each visit is stored in `visits` table

3. Admin can set follow-up reminders (15 days, 30 days, 6 months, 1 year)
   - Reminders appear in admin panel
   - Admin can click to send WhatsApp message

### Cron Job (Automatic)
- The website has a cron job configured to run daily at 8:30 AM IST
- It checks for reminders due within 3 days
- Currently, it logs them (manual send)
- To auto-send WhatsApp, you need WhatsApp Cloud API (optional)

---

## PART 7: IMPORTANT NOTES

### For Cron Job to Work
1. The vercel.json already has the cron configured
2. It runs at 8:30 AM IST (2:30 AM UTC) daily
3. The CRON_SECRET environment variable must be set

### WhatsApp Integration (Optional)
To automatically send WhatsApp reminders:
1. Go to https://developers.facebook.com
2. Create a WhatsApp business app
3. Get your phone number ID and access token
4. Add these to Vercel environment variables:
   - `WA_PHONE_NUMBER_ID`
   - `WA_ACCESS_TOKEN`
5. Uncomment the WhatsApp code in `src/app/api/reminders/cron/route.ts`

### Domain (Optional)
You can connect a custom domain:
1. Go to Vercel dashboard → Your project → **Settings** → **Domains**
2. Add your domain (e.g., `pawscareclinic.com`)
3. Follow the instructions to update DNS

---

## TROUBLESHOOTING

### "Cannot read properties of undefined"
- Your Supabase environment variables might be wrong
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

### Admin login not working
- Make sure you're using the exact credentials
- Check browser console for errors

### Database tables not created
- Go to Supabase SQL Editor and run the schema again
- Make sure you see success messages

### Website shows "Something went wrong"
- Check the Vercel deployment logs
- Make sure all environment variables are set

---

## SUPPORT

If you need help:
1. Check Vercel docs: https://vercel.com/docs
2. Check Supabase docs: https://supabase.com/docs
3. Re-read this guide carefully

---

## QUICK START CHECKLIST

- [ ] Created Supabase account
- [ ] Created Supabase project
- [ ] Ran SQL schema
- [ ] Got API URL and key
- [ ] Created Vercel account
- [ ] Connected GitHub repo
- [ ] Set environment variables
- [ ] Deployed successfully
- [ ] Tested public website
- [ ] Tested admin login
- [ ] Changed admin password (optional but recommended)