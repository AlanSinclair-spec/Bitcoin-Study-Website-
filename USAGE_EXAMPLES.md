# 🎯 Usage Examples - Supabase Sync

This guide shows how to use the Supabase sync functionality in your components.

---

## Example 1: Manual Sync in Journal Page

Add manual sync button to trigger push/pull:

```tsx
'use client';

import { useSync } from '@/lib/supabase/useSync';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function JournalPage() {
  const { sync, isAuthenticated } = useSync();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await sync();
    setIsSyncing(false);
  };

  return (
    <div>
      {/* Your journal content */}

      {isAuthenticated && (
        <Button
          onClick={handleManualSync}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      )}
    </div>
  );
}
```

---

## Example 2: Auto-Sync on Save

Automatically sync when saving a journal entry:

```tsx
'use client';

import { useSync } from '@/lib/supabase/useSync';
import { journalStorage } from '@/lib/journal/storage';

export default function NewJournalEntry() {
  const { pushToCloud, isAuthenticated } = useSync();

  const handleSave = async (entry: JournalEntry) => {
    // Save to localStorage first (instant)
    await journalStorage.saveEntry(entry);

    // Then sync to cloud (if authenticated)
    if (isAuthenticated) {
      await pushToCloud();
    }

    // Redirect or show success
    router.push('/journal');
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Example 3: Sync Status Indicator

Show sync status in the UI:

```tsx
'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Cloud, CloudOff } from 'lucide-react';

export function SyncStatusBadge() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {user ? (
        <>
          <Cloud className="h-3 w-3 text-green-500" />
          <span>Synced to cloud</span>
        </>
      ) : (
        <>
          <CloudOff className="h-3 w-3 text-gray-400" />
          <span>Local only</span>
        </>
      )}
    </div>
  );
}
```

---

## Example 4: Force Pull from Cloud

Pull fresh data from Supabase (useful after login on new device):

```tsx
'use client';

import { useSync } from '@/lib/supabase/useSync';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { pullFromCloud, isAuthenticated } = useSync();

  useEffect(() => {
    // Pull fresh data on mount
    if (isAuthenticated) {
      pullFromCloud();
    }
  }, [isAuthenticated, pullFromCloud]);

  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
}
```

---

## Example 5: Custom Sync Interval

Change auto-sync interval (default is 5 minutes):

```tsx
'use client';

import { useSync } from '@/lib/supabase/useSync';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { startAutoSync, stopAutoSync } = useSync();

  const handleIntervalChange = (minutes: number) => {
    stopAutoSync();
    startAutoSync(minutes * 60 * 1000);
  };

  return (
    <div>
      <label>Auto-sync interval (minutes):</label>
      <select onChange={(e) => handleIntervalChange(Number(e.target.value))}>
        <option value="1">1 minute</option>
        <option value="5" selected>5 minutes</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
      </select>
    </div>
  );
}
```

---

## Example 6: Offline Detection

Handle offline scenarios gracefully:

```tsx
'use client';

import { useSync } from '@/lib/supabase/useSync';
import { useState, useEffect } from 'react';

export default function OfflineAwareComponent() {
  const { sync, isAuthenticated } = useSync();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync when coming back online
      if (isAuthenticated) {
        sync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, sync]);

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-sm text-yellow-800">
            You&apos;re offline. Changes will be saved locally and synced when you reconnect.
          </p>
        </div>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

---

## Example 7: Direct Supabase Queries

Sometimes you need to query Supabase directly (for server-side operations):

```tsx
import { supabase } from '@/lib/supabase/client';

export async function getPublicLessons() {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Query error:', error);
    return [];
  }

  return data;
}
```

---

## Example 8: Real-time Subscriptions (Advanced)

Listen for changes in real-time:

```tsx
'use client';

import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';

export function RealtimeJournal() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new journal entries
    const subscription = supabase
      .channel('journal_entries')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New entry created:', payload.new);
          // Update UI with new entry
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return <div>{/* Journal UI */}</div>;
}
```

---

## Best Practices

### ✅ DO:

1. **Use localStorage first** - Save to localStorage immediately for instant UI updates
2. **Sync in background** - Push to Supabase after localStorage save
3. **Handle offline** - App should work offline, sync when back online
4. **Show sync status** - Let users know if their data is synced
5. **Use auto-sync** - The `useSync()` hook automatically syncs every 5 minutes

### ❌ DON'T:

1. **Don't wait for Supabase** - Always save to localStorage first for speed
2. **Don't sync on every keystroke** - Sync on save, not during typing
3. **Don't block UI** - Sync operations should be async and non-blocking
4. **Don't ignore errors** - Log sync errors for debugging
5. **Don't disable RLS** - Row Level Security keeps data isolated

---

## Debugging

### Check Sync Status

```tsx
import { useSync } from '@/lib/supabase/useSync';

const { isAuthenticated } = useSync();
console.log('Authenticated:', isAuthenticated);
```

### Test Sync Manually

```tsx
const { sync } = useSync();
await sync(); // Check console for logs
```

### Check Supabase Logs

1. Go to: https://dmenzvniqndjkvyvpzut.supabase.co/project/dmenzvniqndjkvyvpzut/logs
2. Filter by "API" to see query logs
3. Look for errors or slow queries

### Browser Console

```javascript
// Check auth status
import { supabase } from '@/lib/supabase/client';
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Test query
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .limit(5);
console.log('Data:', data, 'Error:', error);
```

---

## Common Patterns

### Pattern: Optimistic Updates

```tsx
const handleSave = async (entry: JournalEntry) => {
  // 1. Update UI immediately
  setEntries([...entries, entry]);

  try {
    // 2. Save to localStorage
    await journalStorage.saveEntry(entry);

    // 3. Sync to cloud (non-blocking)
    if (isAuthenticated) {
      pushToCloud().catch(console.error);
    }
  } catch (error) {
    // Rollback UI on error
    setEntries(entries);
    console.error('Save failed:', error);
  }
};
```

### Pattern: Lazy Load from Cloud

```tsx
const [entries, setEntries] = useState([]);
const { pullFromCloud, isAuthenticated } = useSync();

useEffect(() => {
  // Load from localStorage first (instant)
  journalStorage.getEntries().then(setEntries);

  // Then pull from cloud (background)
  if (isAuthenticated) {
    pullFromCloud().then(() => {
      // Refresh from localStorage
      journalStorage.getEntries().then(setEntries);
    });
  }
}, [isAuthenticated, pullFromCloud]);
```

---

**Need more help?** Check `SUPABASE_SETUP.md` for detailed setup instructions.
