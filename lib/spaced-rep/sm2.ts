/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm for optimal flashcard review scheduling
 */

export interface CardReview {
  cardId: string;
  easeFactor: number; // 1.3 - 2.5
  interval: number; // days
  repetitions: number;
  nextReview: Date;
}

export enum ReviewQuality {
  AGAIN = 0, // Complete blackout
  HARD = 1, // Incorrect, correct answer remembered
  GOOD = 2, // Correct with hesitation
  EASY = 3, // Perfect recall
}

/**
 * Calculate next review date based on SM-2 algorithm
 */
export function calculateNextReview(
  currentReview: CardReview | null,
  quality: ReviewQuality
): CardReview {
  // Initial values for new card
  let easeFactor = currentReview?.easeFactor ?? 2.5;
  let interval = currentReview?.interval ?? 1;
  let repetitions = currentReview?.repetitions ?? 0;

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
  );

  // Calculate new interval
  if (quality < ReviewQuality.GOOD) {
    // Reset if answer was poor
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    cardId: currentReview?.cardId ?? '',
    easeFactor,
    interval,
    repetitions,
    nextReview,
  };
}

/**
 * Get cards due for review
 */
export function getDueCards(reviews: CardReview[]): CardReview[] {
  const now = new Date();
  return reviews.filter((review) => new Date(review.nextReview) <= now);
}

/**
 * Save review to localStorage
 */
export function saveReview(review: CardReview, userId: string = 'anonymous'): void {
  if (typeof window === 'undefined') return;

  const key = `flashcard-reviews-${userId}`;
  const existing = localStorage.getItem(key);
  const reviews: Record<string, CardReview> = existing ? JSON.parse(existing) : {};

  reviews[review.cardId] = review;
  localStorage.setItem(key, JSON.stringify(reviews));
}

/**
 * Load all reviews from localStorage
 */
export function loadReviews(userId: string = 'anonymous'): Record<string, CardReview> {
  if (typeof window === 'undefined') return {};

  const key = `flashcard-reviews-${userId}`;
  const existing = localStorage.getItem(key);
  return existing ? JSON.parse(existing) : {};
}

/**
 * Get review stats
 */
export function getReviewStats(reviews: CardReview[]) {
  const now = new Date();
  const dueToday = reviews.filter((r) => new Date(r.nextReview) <= now).length;
  const totalCards = reviews.length;
  const averageEaseFactor =
    reviews.reduce((sum, r) => sum + r.easeFactor, 0) / (totalCards || 1);

  return {
    dueToday,
    totalCards,
    averageEaseFactor: averageEaseFactor.toFixed(2),
  };
}
