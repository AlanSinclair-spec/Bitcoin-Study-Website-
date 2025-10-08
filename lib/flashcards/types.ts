export interface FlashCard {
  id: string;
  chapterId: string;
  front: string;
  back: string;
  tags: string[];
}

export type StudyMode = 'flashcards' | 'learn' | 'write' | 'test';

export type QuestionType = 'multipleChoice' | 'trueFalse' | 'written';

export interface Question {
  id: string;
  cardId: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options?: string[]; // For MCQ
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface StudySession {
  mode: StudyMode;
  startedAt: string;
  completedAt?: string;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number; // in seconds
}

export interface CardProgress {
  cardId: string;
  timesCorrect: number;
  timesIncorrect: number;
  lastStudied: string;
  confidence: number; // 0-100
  isStarred: boolean;
}
