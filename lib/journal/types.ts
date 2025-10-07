export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  contentMD: string;
  tags: string[];
  links: JournalLink[];
  goalsChecked: string[];
  habits: Record<string, boolean>;
  rating?: number;
  weekOf: string;
}

export interface JournalLink {
  type: 'lesson' | 'quiz' | 'figure' | 'glossary';
  ref: string;
  label: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  status: 'active' | 'paused' | 'done';
  createdAt: string;
}

export interface Habit {
  id: string;
  label: string;
  cadence: 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
}

export interface WeakArea {
  type: 'chapter' | 'term' | 'concept';
  ref: string;
  label: string;
  score: number;
}

export interface JournalStats {
  entriesThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  avgConfidence: number;
  totalEntries: number;
  goalsCompleted: number;
  habitCompletionRate: number;
}
