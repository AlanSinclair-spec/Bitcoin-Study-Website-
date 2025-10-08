# Supabase Integration Setup Guide

## Overview
This guide will help you set up Supabase for multi-device sync and user authentication.

---

## Step 1: Run Database Schema

1. **Go to Supabase SQL Editor**
   - Visit: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/sql/new
   - Or navigate to: Dashboard → SQL Editor → New query

2. **Copy and Paste Schema**
   - Open `supabase/schema.sql`
   - Copy the entire file contents
   - Paste into Supabase SQL Editor

3. **Run the Query**
   - Click "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for success message
   - You should see: "Success. No rows returned"

4. **Verify Tables Created**
   - Go to: Dashboard → Table Editor
   - You should see tables:
     - profiles
     - journal_entries
     - journal_links
     - goals
     - habits
     - habit_completions
     - lesson_progress
     - weak_areas

---

## Step 2: Configure Authentication (Optional but Recommended)

### Enable Email Authentication

1. **Go to Authentication Settings**
   - Visit: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/auth/providers
   - Or: Dashboard → Authentication → Providers

2. **Configure Email Provider**
   - Enable "Email" provider
   - Configure email templates (optional)
   - Set "Confirm email" to ON for security

### Enable OAuth Providers (Optional)

For easier signup, you can enable:
- **Google OAuth**
  1. Go to Authentication → Providers
  2. Enable Google
  3. Add Client ID and Secret from Google Cloud Console

- **GitHub OAuth**
  1. Enable GitHub
  2. Add Client ID and Secret from GitHub OAuth Apps

---

## Step 3: Test Database Connection

Run this in Supabase SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Expected: You should see all 8 tables with `rowsecurity = true`

---

## Step 4: Environment Variables

### Local Development (.env.local)

Already created! File contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://dmenzvniqndjkvyvpzut.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

⚠️ **Never commit .env.local to git!** (Already in .gitignore)

### Vercel Deployment

When deploying to Vercel, add these environment variables:

1. Go to: https://vercel.com/your-project/settings/environment-variables

2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dmenzvniqndjkvyvpzut.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key...
   ```

3. Redeploy for changes to take effect

---

## Step 5: How Sync Works

### Automatic Sync Flow

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

### When Sync Happens

- **On Login**: Pull data from Supabase → localStorage
- **On Save**: Push localStorage → Supabase
- **On Logout**: Clear localStorage
- **Periodic**: Auto-sync every 5 minutes (optional)

### Conflict Resolution

If data exists in both localStorage and Supabase:
1. Compare timestamps
2. Keep most recent version
3. Merge non-conflicting changes

---

## Step 6: Testing Locally

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Without Auth (Anonymous Mode)
- App works with localStorage only
- No sync, data stays local
- Fastest performance

### 3. Test With Auth
- Click "Sign Up" button
- Create account
- Data syncs to Supabase
- Test on different device/browser

### 4. Test Multi-Device Sync
1. Login on Device A
2. Create journal entry
3. Login on Device B with same account
4. Verify journal entry appears

---

## Step 7: Monitoring & Debugging

### Check Supabase Logs

1. Go to: Dashboard → Logs
2. Filter by:
   - API errors
   - Slow queries
   - Auth events

### Check Browser Console

```javascript
// In browser console, test connection:
import { supabase } from '@/lib/supabase/client'

// Test auth status
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// Test database query
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .limit(5)
console.log('Entries:', data, 'Error:', error)
```

---

## Security Best Practices

### ✅ DO:
- Use Row Level Security (RLS) policies (already configured)
- Only expose ANON key to client
- Keep SECRET key server-side only
- Validate user input before saving
- Use HTTPS (Vercel provides this)

### ❌ DON'T:
- Commit .env.local to git
- Share SECRET key publicly
- Disable RLS policies
- Trust client-side data without validation

---

## Row Level Security (RLS) Explained

RLS ensures users can ONLY see their own data:

```sql
-- Example: Users can only see their own journal entries
CREATE POLICY "Users can view own entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);
```

This means:
- User A can't see User B's journals
- Even with direct API access
- Enforced at database level

---

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**:
- Check `.env.local` exists
- Restart dev server: `npm run dev`

### Issue: "Row Level Security violation"
**Solution**:
- Make sure user is logged in
- Check RLS policies were created
- Verify `user_id` is set correctly

### Issue: "Cannot read from table"
**Solution**:
- Run `supabase/schema.sql` in SQL Editor
- Check table exists in Table Editor
- Verify RLS policies exist

### Issue: "Data not syncing"
**Solution**:
- Check browser console for errors
- Verify user is authenticated
- Check Supabase logs for API errors
- Test internet connection

---

## Migration Guide: localStorage → Supabase

### For Existing Users

When they first login, we'll migrate their local data:

```typescript
// On first login
async function migrateLocalDataToSupabase(userId: string) {
  // 1. Get all localStorage data
  const localEntries = await journalStorage.getEntries()
  const localGoals = await journalStorage.getGoals()
  const localHabits = await journalStorage.getHabits()

  // 2. Upload to Supabase
  await supabase.from('journal_entries').insert(
    localEntries.map(e => ({ ...e, user_id: userId }))
  )

  // 3. Clear localStorage (optional)
  // localStorage.clear()
}
```

---

## Performance Optimization

### Caching Strategy

```typescript
// Use Supabase's built-in caching
const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50)  // Only fetch recent entries
```

### Batch Operations

```typescript
// Instead of 10 individual inserts:
for (const entry of entries) {
  await supabase.from('journal_entries').insert(entry)  // ❌ Slow
}

// Do 1 batch insert:
await supabase.from('journal_entries').insert(entries)  // ✅ Fast
```

---

## Cost Estimation (Free Tier)

Supabase Free Tier Includes:
- ✅ 500MB database storage
- ✅ 1GB file storage
- ✅ 2GB bandwidth per month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

**Your app should easily stay within free tier** unless you get massive traffic.

---

## Next Steps

1. ✅ Run `supabase/schema.sql` in Supabase SQL Editor
2. ✅ Test authentication (sign up, login, logout)
3. ✅ Test data sync (create entry, check in Supabase Table Editor)
4. ✅ Deploy to Vercel with environment variables
5. ✅ Test multi-device sync

---

## Support & Resources

- **Supabase Dashboard**: https://dmenzvniqndjkvyvpzut.supabase.co
- **Supabase Docs**: https://supabase.com/docs
- **Your Project URL**: https://dmenzvniqndjkvyvpzut.supabase.co
- **Table Editor**: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/editor
- **SQL Editor**: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/sql

---

**Ready to go! 🚀 Follow the steps above to get Supabase working.**
