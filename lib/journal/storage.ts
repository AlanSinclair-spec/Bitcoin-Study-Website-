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
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to parse journal entries, resetting:', error);
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      return [];
    }
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
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to parse goals, resetting:', error);
      localStorage.removeItem(STORAGE_KEYS.GOALS);
      return [];
    }
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
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to parse habits, resetting:', error);
      localStorage.removeItem(STORAGE_KEYS.HABITS);
      return [];
    }
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

  // Initialize sample entry
  async initializeSampleEntry(): Promise<void> {
    if (typeof window === 'undefined') return;

    const entries = await this.getEntries();
    const hasSampleEntry = entries.some(e => e.id === 'sample-entry-1');

    if (!hasSampleEntry && entries.length === 0) {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());

      const sampleEntry: JournalEntry = {
        id: 'sample-entry-1',
        createdAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(now.getTime() - 86400000).toISOString(),
        title: 'Example: Understanding Proof-of-Work',
        contentMD: `**Related Lesson**: [How Bitcoin Works](/fundamentals/2-how-bitcoin-works)

**My Key Takeaways**:

- Proof-of-Work is like a digital lock that requires real electricity to open
- Miners compete to solve complex math problems to validate transactions
- This makes attacking the network extremely expensive (high BCR_A cost)
- The system is self-regulating through difficulty adjustment

**Questions I Still Have**:

- How exactly does mining difficulty adjust every 2016 blocks?
- What happens when all 21 million Bitcoin are mined?
- Could quantum computers break proof-of-work in the future?

**How I Can Apply This**:

When explaining Bitcoin to friends, I can use the analogy of "digital walls" - just like Constantinople's physical walls made attacks too costly, Bitcoin's proof-of-work makes digital attacks prohibitively expensive.

I want to run a Bitcoin node to better understand how network validation works in practice.`,
        tags: ['bitcoin', 'proof-of-work', 'fundamentals'],
        links: [{
          type: 'lesson',
          ref: '/fundamentals/2-how-bitcoin-works',
          label: 'How Bitcoin Works'
        }],
        goalsChecked: [],
        habits: {},
        rating: 4,
        weekOf: weekStart.toISOString(),
      };

      await this.saveEntry(sampleEntry);
    }
  }
}

// Singleton instance
export const journalStorage = new LocalJournalStorage();
