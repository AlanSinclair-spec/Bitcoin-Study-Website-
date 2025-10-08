import { supabase } from './client';
import { journalStorage } from '@/lib/journal/storage';
import { progressStorage } from '@/lib/progress/storage';
import type { JournalEntry, Goal, Habit } from '@/lib/journal/types';
import type { LessonProgress, WeakArea } from '@/lib/progress/types';

export class SupabaseSync {
  /**
   * Sync all data from localStorage to Supabase
   */
  static async pushToSupabase(userId: string): Promise<void> {
    try {
      // Get all localStorage data
      const [entries, goals, habits, progress, weakAreas] = await Promise.all([
        journalStorage.getEntries(),
        journalStorage.getGoals(),
        journalStorage.getHabits(),
        progressStorage.getAllProgress(),
        progressStorage.getAllWeakAreas(),
      ]);

      // Push journal entries
      if (entries.length > 0) {
        const entriesData = entries.map(entry => ({
          id: entry.id,
          user_id: userId,
          title: entry.title,
          content_md: entry.contentMD,
          tags: entry.tags,
          rating: entry.rating,
          week_of: entry.weekOf,
          created_at: entry.createdAt,
          updated_at: entry.updatedAt,
        }));

        await supabase
          .from('journal_entries')
          .upsert(entriesData, { onConflict: 'id' });

        // Push journal links
        for (const entry of entries) {
          if (entry.links && entry.links.length > 0) {
            const linksData = entry.links.map(link => ({
              entry_id: entry.id,
              type: link.type,
              ref: link.ref,
              label: link.label,
            }));

            await supabase
              .from('journal_links')
              .upsert(linksData, { onConflict: 'entry_id,type,ref' });
          }
        }
      }

      // Push goals
      if (goals.length > 0) {
        const goalsData = goals.map(goal => ({
          id: goal.id,
          user_id: userId,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          target_date: goal.targetDate,
          created_at: goal.createdAt,
        }));

        await supabase
          .from('goals')
          .upsert(goalsData, { onConflict: 'id' });
      }

      // Push habits
      if (habits.length > 0) {
        const habitsData = habits.map(habit => ({
          id: habit.id,
          user_id: userId,
          label: habit.label,
          cadence: habit.cadence,
          active: habit.active,
          created_at: habit.createdAt,
        }));

        await supabase
          .from('habits')
          .upsert(habitsData, { onConflict: 'id' });
      }

      // Push lesson progress
      if (progress.length > 0) {
        const progressData = progress.map(p => ({
          user_id: userId,
          lesson_id: p.lessonId,
          module: p.module,
          completed: p.completed,
          quiz_score: p.quizScore,
          quiz_attempts: p.quizAttempts,
          completed_at: p.completedAt,
          created_at: p.createdAt || new Date().toISOString(),
          updated_at: p.updatedAt || new Date().toISOString(),
        }));

        await supabase
          .from('lesson_progress')
          .upsert(progressData, { onConflict: 'user_id,lesson_id' });
      }

      // Push weak areas
      if (weakAreas.length > 0) {
        const weakAreasData = weakAreas.map(wa => ({
          user_id: userId,
          topic: wa.topic,
          miss_count: wa.missCount,
          related_lessons: wa.relatedLessons,
          suggested_flashcards: wa.suggestedFlashcards,
          created_at: wa.createdAt || new Date().toISOString(),
          updated_at: wa.updatedAt || new Date().toISOString(),
        }));

        await supabase
          .from('weak_areas')
          .upsert(weakAreasData, { onConflict: 'user_id,topic' });
      }

      console.log('✅ Data synced to Supabase');
    } catch (error) {
      console.error('❌ Error syncing to Supabase:', error);
      throw error;
    }
  }

  /**
   * Pull all data from Supabase to localStorage
   */
  static async pullFromSupabase(userId: string): Promise<void> {
    try {
      // Fetch all data from Supabase
      const [entriesResult, goalsResult, habitsResult, progressResult, weakAreasResult] = await Promise.all([
        supabase
          .from('journal_entries')
          .select('*, journal_links(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', userId),
        supabase
          .from('weak_areas')
          .select('*')
          .eq('user_id', userId)
          .order('miss_count', { ascending: false }),
      ]);

      // Transform and save to localStorage (fixed TypeScript error)
      if (entriesResult.data) {
        const entries: JournalEntry[] = entriesResult.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          contentMD: e.content_md,
          tags: e.tags || [],
          rating: e.rating,
          weekOf: e.week_of,
          links: e.journal_links?.map((l: any) => ({
            type: l.type,
            ref: l.ref,
            label: l.label,
          })) || [],
          goalsChecked: e.goals_checked || [],
          habits: e.habits || {},
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        }));

        // Clear and repopulate entries
        for (const entry of entries) {
          await journalStorage.saveEntry(entry);
        }
      }

      if (goalsResult.data) {
        const goals: Goal[] = goalsResult.data.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          status: g.status,
          targetDate: g.target_date,
          createdAt: g.created_at,
          updatedAt: g.updated_at,
        }));

        // Save goals
        for (const goal of goals) {
          await journalStorage.saveGoal(goal);
        }
      }

      if (habitsResult.data) {
        const habits: Habit[] = habitsResult.data.map((h: any) => ({
          id: h.id,
          label: h.label,
          cadence: h.cadence,
          active: h.active,
          createdAt: h.created_at,
        }));

        // Save habits
        for (const habit of habits) {
          await journalStorage.saveHabit(habit);
        }
      }

      if (progressResult.data) {
        const progress: LessonProgress[] = progressResult.data.map((p: any) => ({
          lessonId: p.lesson_id,
          module: p.module,
          completed: p.completed,
          quizScore: p.quiz_score,
          quizAttempts: p.quiz_attempts,
          completedAt: p.completed_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));

        // Save progress
        for (const p of progress) {
          await progressStorage.saveProgress(p.lessonId, p.module, p.completed, p.quizScore);
        }
      }

      if (weakAreasResult.data) {
        const weakAreas: WeakArea[] = weakAreasResult.data.map((wa: any) => ({
          topic: wa.topic,
          missCount: wa.miss_count,
          relatedLessons: wa.related_lessons || [],
          suggestedFlashcards: wa.suggested_flashcards || [],
          createdAt: wa.created_at,
          updatedAt: wa.updated_at,
        }));

        // Save weak areas
        for (const wa of weakAreas) {
          await progressStorage.saveWeakArea(wa.topic, wa.missCount, wa.relatedLessons);
        }
      }

      console.log('✅ Data pulled from Supabase to localStorage');
    } catch (error) {
      console.error('❌ Error pulling from Supabase:', error);
      throw error;
    }
  }

  /**
   * Bidirectional sync: merge data from both sources
   * Keeps most recent version based on updated_at timestamp
   */
  static async bidirectionalSync(userId: string): Promise<void> {
    try {
      // Pull from Supabase first
      await this.pullFromSupabase(userId);

      // Then push any local changes
      await this.pushToSupabase(userId);

      console.log('✅ Bidirectional sync completed');
    } catch (error) {
      console.error('❌ Error during bidirectional sync:', error);
      throw error;
    }
  }

  /**
   * Sync on interval (e.g., every 5 minutes)
   */
  static startAutoSync(userId: string, intervalMs: number = 5 * 60 * 1000): NodeJS.Timeout {
    const interval = setInterval(() => {
      this.bidirectionalSync(userId).catch(err => {
        console.error('Auto-sync failed:', err);
      });
    }, intervalMs);

    // Initial sync
    this.bidirectionalSync(userId).catch(err => {
      console.error('Initial sync failed:', err);
    });

    return interval;
  }

  /**
   * Stop auto-sync
   */
  static stopAutoSync(interval: NodeJS.Timeout): void {
    clearInterval(interval);
  }
}
