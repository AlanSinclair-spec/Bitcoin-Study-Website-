/**
 * Progress Tracking Types
 */

export interface LessonProgress {
  lessonId: string;
  module: 'fundamentals' | 'softwar';
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  quizAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModuleProgress {
  module: 'fundamentals' | 'softwar';
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  averageQuizScore: number;
}

export interface WeakArea {
  topic: string;
  missCount: number;
  relatedLessons: string[];
  suggestedFlashcards: string[];
  createdAt?: string;
  updatedAt?: string;
}
