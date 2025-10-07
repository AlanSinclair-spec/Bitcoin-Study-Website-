import type { JournalEntry, Goal, Habit } from './types';

const STORAGE_KEYS = {
  ENTRIES: 'journal-entries',
  GOALS: 'journal-goals',
  HABITS: 'journal-habits',
  SYNC_ENABLED: 'journal-sync-enabled',
};

// Local storage layer (default)
export class LocalJournalStorage {
  // Entries
  async getEntries(): Promise<JournalEntry[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return data ? JSON.parse(data) : [];
  }

  async getEntry(id: string): Promise<JournalEntry | null> {
    const entries = await this.getEntries();
    return entries.find(e => e.id === id) || null;
  }

  async saveEntry(entry: JournalEntry): Promise<void> {
    const entries = await this.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  }

  async saveGoal(goal: Goal): Promise<void> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  async deleteGoal(id: string): Promise<void> {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  }

  async saveHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    const index = habits.findIndex(h => h.id === habit.id);
    if (index >= 0) {
      habits[index] = habit;
    } else {
      habits.push(habit);
    }
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  async deleteHabit(id: string): Promise<void> {
    const habits = await this.getHabits();
    const filtered = habits.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(filtered));
  }

  // Sync setting
  isSyncEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.SYNC_ENABLED) === 'true';
  }

  setSyncEnabled(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_ENABLED, enabled.toString());
  }

  // Export
  async exportAll(): Promise<{entries: JournalEntry[]; goals: Goal[]; habits: Habit[]}> {
    return {
      entries: await this.getEntries(),
      goals: await this.getGoals(),
      habits: await this.getHabits(),
    };
  }

  // Import
  async importAll(data: {entries?: JournalEntry[]; goals?: Goal[]; habits?: Habit[]}): Promise<void> {
    if (data.entries) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(data.entries));
    }
    if (data.goals) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
    }
    if (data.habits) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
    }
  }
}

// Singleton instance
export const journalStorage = new LocalJournalStorage();
