'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SupabaseSync } from './sync';

/**
 * Hook to trigger manual or automatic sync with Supabase
 */
export function useSync() {
  const { user } = useAuth();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Push local data to Supabase
   */
  const pushToCloud = useCallback(async () => {
    if (!user) {
      console.log('Not authenticated - skipping push');
      return;
    }

    try {
      await SupabaseSync.pushToSupabase(user.id);
      console.log('✅ Pushed to cloud');
    } catch (error) {
      console.error('❌ Push failed:', error);
    }
  }, [user]);

  /**
   * Pull data from Supabase to local
   */
  const pullFromCloud = useCallback(async () => {
    if (!user) {
      console.log('Not authenticated - skipping pull');
      return;
    }

    try {
      await SupabaseSync.pullFromSupabase(user.id);
      console.log('✅ Pulled from cloud');
    } catch (error) {
      console.error('❌ Pull failed:', error);
    }
  }, [user]);

  /**
   * Bidirectional sync
   */
  const sync = useCallback(async () => {
    if (!user) {
      console.log('Not authenticated - skipping sync');
      return;
    }

    try {
      await SupabaseSync.bidirectionalSync(user.id);
      console.log('✅ Sync complete');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }, [user]);

  /**
   * Start auto-sync (every 5 minutes)
   */
  const startAutoSync = useCallback((intervalMs: number = 5 * 60 * 1000) => {
    if (!user) {
      console.log('Not authenticated - cannot start auto-sync');
      return;
    }

    // Clear existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Start new interval
    syncIntervalRef.current = SupabaseSync.startAutoSync(user.id, intervalMs);
    console.log(`✅ Auto-sync started (every ${intervalMs / 1000}s)`);
  }, [user]);

  /**
   * Stop auto-sync
   */
  const stopAutoSync = useCallback(() => {
    if (syncIntervalRef.current) {
      SupabaseSync.stopAutoSync(syncIntervalRef.current);
      syncIntervalRef.current = null;
      console.log('✅ Auto-sync stopped');
    }
  }, []);

  /**
   * Auto-sync on mount if authenticated
   */
  useEffect(() => {
    if (user) {
      // Initial sync on mount
      sync();

      // Start auto-sync (every 5 minutes)
      startAutoSync();
    }

    // Cleanup on unmount
    return () => {
      stopAutoSync();
    };
  }, [user, sync, startAutoSync, stopAutoSync]);

  return {
    pushToCloud,
    pullFromCloud,
    sync,
    startAutoSync,
    stopAutoSync,
    isAuthenticated: !!user,
  };
}
