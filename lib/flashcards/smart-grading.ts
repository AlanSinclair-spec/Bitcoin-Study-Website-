/**
 * Smart Grading - Similar to Quizlet Plus
 * Uses fuzzy matching to accept paraphrases and close matches
 */

export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeAnswer(str1);
  const s2 = normalizeAnswer(str2);

  // Exact match after normalization
  if (s1 === s2) return 1.0;

  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);

  if (maxLen === 0) return 1.0;

  return 1 - (distance / maxLen);
}

export function isAnswerCorrect(
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 0.85
): boolean {
  const similarity = calculateSimilarity(userAnswer, correctAnswer);
  return similarity >= threshold;
}

export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    // Remove common articles
    .replace(/^(the|a|an)\s+/i, '')
    // Remove punctuation
    .replace(/[.,!?;:'"]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove common fillers
    .replace(/\s+(is|are|was|were|be|been|being)\s+/g, ' ');
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export function getGradeFeedback(similarity: number): string {
  if (similarity >= 0.95) return 'Perfect!';
  if (similarity >= 0.85) return 'Correct! (accepted close match)';
  if (similarity >= 0.70) return 'Almost! Check your answer.';
  return 'Incorrect. Try again.';
}
