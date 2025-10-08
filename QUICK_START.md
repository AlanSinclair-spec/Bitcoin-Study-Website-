# 🚀 Supabase Integration Quick Start

Supabase has been fully integrated into your app! Here's what you need to do to get it running:

## ✅ What's Already Done

1. ✅ **Supabase client configured** - Connected to your project
2. ✅ **Environment variables set** - `.env.local` created with your credentials
3. ✅ **Database schema ready** - Complete schema in `supabase/schema.sql`
4. ✅ **Sync layer implemented** - Bidirectional sync between localStorage and Supabase
5. ✅ **Authentication UI built** - Sign up/Sign in/Sign out buttons in header
6. ✅ **Auth flow complete** - Auto-sync on login, data persistence

## 📋 Next Steps (Required)

### Step 1: Create Database Tables

You need to run the database schema in Supabase SQL Editor:

1. **Open Supabase SQL Editor:**
   - Go to: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/sql/new
   - Or: Dashboard → SQL Editor → New query

2. **Copy & Paste Schema:**
   - Open `supabase/schema.sql` in your project
   - Copy the **entire file** (all 306 lines)
   - Paste into Supabase SQL Editor

3. **Run the Query:**
   - Click "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for success message: "Success. No rows returned"

4. **Verify Tables Created:**
   - Go to: Dashboard → Table Editor
   - You should see 8 tables:
     - ✅ profiles
     - ✅ journal_entries
     - ✅ journal_links
     - ✅ goals
     - ✅ habits
     - ✅ habit_completions
     - ✅ lesson_progress
     - ✅ weak_areas

### Step 2: Test Authentication

1. **Start dev server** (already running on http://localhost:3000)
   ```bash
   npm run dev
   ```

2. **Click "Sign In" button** in the header

3. **Create an account:**
   - Click "Sign Up" tab
   - Enter email and password
   - Click "Create Account"

4. **Verify sync:**
   - Go to Supabase → Table Editor → journal_entries
   - Create a journal entry in your app
   - Refresh Supabase table - entry should appear!

### Step 3: Deploy to Vercel

1. **Add environment variables to Vercel:**
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add these two variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://dmenzvniqndjkvyvpzut.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZW56dm5pcW5kamt2eXZwenV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4ODU2NTYsImV4cCI6MjA3NTQ2MTY1Nn0.34-UOFQv5hJ_Y40P5zXDwMROP_wjf6cSZCHvr-cMJAM
     ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Supabase authentication and sync"
   git push
   ```

3. **Test on production:**
   - Visit your Vercel URL
   - Sign in with your account
   - Data should sync across devices!

---

## 🎯 How It Works

### Anonymous Mode (No Login)
- ✅ All features work with localStorage
- ✅ No internet required
- ❌ No multi-device sync
- ❌ Data stays on this device only

### Authenticated Mode (Logged In)
- ✅ All features work with localStorage
- ✅ Auto-sync to Supabase every 5 minutes
- ✅ Multi-device sync
- ✅ Data backed up in cloud
- ✅ Access from any device

### Sync Flow
```
┌──────────────┐          ┌──────────────┐
│ localStorage │ ◄──────► │   Supabase   │
│  (Client)    │  Sync    │  (Cloud DB)  │
└──────────────┘          └──────────────┘
       │                         │
       ▼                         ▼
  Instant UI           Multi-device sync
  updates              & backup
```

**When sync happens:**
- 🔵 On sign up: Push local data to cloud
- 🔵 On sign in: Pull cloud data to local
- 🔵 On save: Push to cloud (if authenticated)
- 🔵 Auto: Every 5 minutes (optional)

---

## 📁 Files Created

### Core Integration
- `lib/supabase/client.ts` - Supabase client configuration
- `lib/supabase/auth.ts` - Authentication service (sign up, sign in, sign out)
- `lib/supabase/sync.ts` - Bidirectional sync between localStorage and Supabase

### UI Components
- `components/auth/AuthProvider.tsx` - Auth context provider
- `components/auth/AuthButton.tsx` - Sign in/Sign up/Sign out button
- `components/ui/dialog.tsx` - Dialog component for auth modal
- `components/ui/label.tsx` - Label component for forms
- `components/ui/tabs.tsx` - Tabs component for sign in/sign up

### Configuration
- `.env.local` - Environment variables (gitignored)
- `supabase/schema.sql` - Database schema with RLS policies

### Documentation
- `SUPABASE_SETUP.md` - Comprehensive setup guide
- `QUICK_START.md` - This file!

---

## 🔒 Security

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ Users can only see their own data
- ✅ ANON key is public-safe (read-only access with RLS)
- ✅ SECRET key is NOT in `.env.local` (only use server-side)
- ✅ `.env.local` is gitignored
- ✅ All queries filtered by `auth.uid()`

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists in root directory
- Restart dev server: `npm run dev`

### "Row Level Security violation"
- Make sure you ran `supabase/schema.sql` in Supabase
- Verify you're logged in
- Check RLS policies exist in Supabase → Database → Policies

### "Cannot read from table"
- Run `supabase/schema.sql` in SQL Editor
- Check tables exist in Table Editor
- Verify RLS is enabled

### "Data not syncing"
- Check browser console for errors
- Verify user is authenticated (check AuthProvider state)
- Check Supabase logs: Dashboard → Logs

---

## 📚 Learn More

- **Supabase Dashboard**: https://dmenzvniqndjkvyvpzut.supabase.co
- **Table Editor**: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/editor
- **SQL Editor**: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/sql
- **Supabase Docs**: https://supabase.com/docs

---

## ✨ What You Can Do Now

1. **Test the app locally** (http://localhost:3000)
   - Create journal entries
   - Set goals and habits
   - Complete lessons
   - Sign up and watch data sync!

2. **Deploy to production**
   - Add env vars to Vercel
   - Push to git
   - Test multi-device sync

3. **Invite users**
   - Share your Vercel URL
   - Each user gets their own isolated data
   - Perfect for learning communities!

---

**Ready to go! 🚀 Start with Step 1 above to create your database tables.**
