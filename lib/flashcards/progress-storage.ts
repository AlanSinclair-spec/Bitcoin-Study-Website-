import type { CardProgress, StudySession } from './types';

const PROGRESS_KEY = 'flashcard-progress';
const SESSIONS_KEY = 'study-sessions';
const STARRED_KEY = 'starred-cards';

export function getCardProgress(cardId: string): CardProgress | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(PROGRESS_KEY);
  if (!data) return null;

  const progress: Record<string, CardProgress> = JSON.parse(data);
  return progress[cardId] || null;
}

export function getAllCardProgress(): Record<string, CardProgress> {
  if (typeof window === 'undefined') return {};

  const data = localStorage.getItem(PROGRESS_KEY);
  if (!data) return {};

  return JSON.parse(data);
}

export function saveCardProgress(cardId: string, isCorrect: boolean): void {
  if (typeof window === 'undefined') return;

  const allProgress = getAllCardProgress();
  const existing = allProgress[cardId];

  const updated: CardProgress = {
    cardId,
    timesCorrect: (existing?.timesCorrect || 0) + (isCorrect ? 1 : 0),
    timesIncorrect: (existing?.timesIncorrect || 0) + (isCorrect ? 0 : 1),
    lastStudied: new Date().toISOString(),
    confidence: calculateConfidence(
      (existing?.timesCorrect || 0) + (isCorrect ? 1 : 0),
      (existing?.timesIncorrect || 0) + (isCorrect ? 0 : 1)
    ),
    isStarred: existing?.isStarred || false,
  };

  allProgress[cardId] = updated;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
}

export function toggleStar(cardId: string): boolean {
  if (typeof window === 'undefined') return false;

  const allProgress = getAllCardProgress();
  const existing = allProgress[cardId];

  const updated: CardProgress = existing || {
    cardId,
    timesCorrect: 0,
    timesIncorrect: 0,
    lastStudied: new Date().toISOString(),
    confidence: 0,
    isStarred: false,
  };

  updated.isStarred = !updated.isStarred;

  allProgress[cardId] = updated;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));

  return updated.isStarred;
}

export function getStarredCards(): string[] {
  if (typeof window === 'undefined') return [];

  const allProgress = getAllCardProgress();
  return Object.values(allProgress)
    .filter(p => p.isStarred)
    .map(p => p.cardId);
}

export function calculateConfidence(correct: number, incorrect: number): number {
  const total = correct + incorrect;
  if (total === 0) return 0;

  const ratio = correct / total;

  // Weight recent performance more heavily
  // Minimum of 3 attempts before showing confidence
  if (total < 3) return Math.round(ratio * 50);

  return Math.round(ratio * 100);
}

export function saveStudySession(session: StudySession): void {
  if (typeof window === 'undefined') return;

  const data = localStorage.getItem(SESSIONS_KEY);
  const sessions: StudySession[] = data ? JSON.parse(data) : [];

  sessions.push(session);

  // Keep only last 100 sessions
  if (sessions.length > 100) {
    sessions.splice(0, sessions.length - 100);
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getStudySessions(): StudySession[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getStudyStats() {
  const sessions = getStudySessions();
  const allProgress = Object.values(getAllCardProgress());

  const totalSessions = sessions.length;
  const totalCardsStudied = allProgress.reduce((sum, p) => sum + p.timesCorrect + p.timesIncorrect, 0);
  const averageAccuracy = allProgress.length > 0
    ? Math.round(
        (allProgress.reduce((sum, p) => {
          const total = p.timesCorrect + p.timesIncorrect;
          return total > 0 ? sum + (p.timesCorrect / total) : sum;
        }, 0) / allProgress.length) * 100
      )
    : 0;

  const totalTimeStudied = sessions.reduce((sum, s) => sum + s.timeSpent, 0);

  return {
    totalSessions,
    totalCardsStudied,
    averageAccuracy,
    totalTimeStudied,
    cardsWithHighConfidence: allProgress.filter(p => p.confidence >= 80).length,
    cardsNeedingReview: allProgress.filter(p => p.confidence < 60).length,
  };
}

export function getWeakCards(threshold: number = 60): CardProgress[] {
  const allProgress = Object.values(getAllCardProgress());
  return allProgress
    .filter(p => p.confidence < threshold)
    .sort((a, b) => a.confidence - b.confidence);
}

export function getStrongCards(threshold: number = 80): CardProgress[] {
  const allProgress = Object.values(getAllCardProgress());
  return allProgress
    .filter(p => p.confidence >= threshold)
    .sort((a, b) => b.confidence - a.confidence);
}
