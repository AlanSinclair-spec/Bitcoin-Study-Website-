/**
 * Progress Tracking Storage
 * Persists lesson completion and quiz scores to localStorage
 */

export interface LessonProgress {
  lessonId: string;
  module: 'fundamentals' | 'softwar';
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  quizAttempts?: number;
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
}

class ProgressStorage {
  private STORAGE_KEY = 'learning-progress';
  private WEAK_AREAS_KEY = 'weak-areas';

  /**
   * Get all lesson progress
   */
  async getProgress(): Promise<LessonProgress[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get progress for a specific lesson
   */
  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const allProgress = await this.getProgress();
    return allProgress.find(p => p.lessonId === lessonId) || null;
  }

  /**
   * Mark a lesson as completed
   */
  async markCompleted(lessonId: string, module: 'fundamentals' | 'softwar'): Promise<void> {
    const allProgress = await this.getProgress();
    const existing = allProgress.findIndex(p => p.lessonId === lessonId);

    const updated: LessonProgress = {
      lessonId,
      module,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    if (existing >= 0) {
      allProgress[existing] = { ...allProgress[existing], ...updated };
    } else {
      allProgress.push(updated);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
  }

  /**
   * Record quiz score
   */
  async recordQuizScore(lessonId: string, module: 'fundamentals' | 'softwar', score: number): Promise<void> {
    const allProgress = await this.getProgress();
    const existing = allProgress.findIndex(p => p.lessonId === lessonId);

    if (existing >= 0) {
      const prev = allProgress[existing];
      allProgress[existing] = {
        ...prev,
        quizScore: score,
        quizAttempts: (prev.quizAttempts || 0) + 1,
      };
    } else {
      allProgress.push({
        lessonId,
        module,
        completed: false,
        quizScore: score,
        quizAttempts: 1,
      });
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
  }

  /**
   * Get module progress summary
   */
  async getModuleProgress(module: 'fundamentals' | 'softwar'): Promise<ModuleProgress> {
    const allProgress = await this.getProgress();
    const moduleProgress = allProgress.filter(p => p.module === module);

    const totalLessons = module === 'fundamentals' ? 6 : 7; // 6 fundamentals, 7 softwar (exec + ch1-6)
    const completedLessons = moduleProgress.filter(p => p.completed).length;
    const percentComplete = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    const quizScores = moduleProgress.filter(p => p.quizScore !== undefined).map(p => p.quizScore!);
    const averageQuizScore = quizScores.length > 0
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
      : 0;

    return {
      module,
      totalLessons,
      completedLessons,
      percentComplete,
      averageQuizScore,
    };
  }

  /**
   * Record topic miss (for weak area detection)
   */
  async recordTopicMiss(topic: string, lessonId: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const data = localStorage.getItem(this.WEAK_AREAS_KEY);
    const weakAreas: Record<string, WeakArea> = data ? JSON.parse(data) : {};

    if (!weakAreas[topic]) {
      weakAreas[topic] = {
        topic,
        missCount: 0,
        relatedLessons: [],
        suggestedFlashcards: [],
      };
    }

    weakAreas[topic].missCount += 1;
    if (!weakAreas[topic].relatedLessons.includes(lessonId)) {
      weakAreas[topic].relatedLessons.push(lessonId);
    }

    localStorage.setItem(this.WEAK_AREAS_KEY, JSON.stringify(weakAreas));
  }

  /**
   * Get top weak areas
   */
  async getWeakAreas(limit: number = 3): Promise<WeakArea[]> {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(this.WEAK_AREAS_KEY);
    if (!data) return [];

    const weakAreas: Record<string, WeakArea> = JSON.parse(data);
    const sorted = Object.values(weakAreas)
      .sort((a, b) => b.missCount - a.missCount)
      .slice(0, limit);

    return sorted;
  }

  /**
   * Clear all progress (for testing)
   */
  async clearAll(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.WEAK_AREAS_KEY);
  }
}

export const progressStorage = new ProgressStorage();
