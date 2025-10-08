import type { FlashCard, Question, QuestionType } from './types';

export function generateQuestions(
  cards: FlashCard[],
  count: number = 10,
  adaptToDifficulty: boolean = false
): Question[] {
  const questions: Question[] = [];
  const usedCards = new Set<string>();

  while (questions.length < count && questions.length < cards.length) {
    const card = cards[Math.floor(Math.random() * cards.length)];

    if (usedCards.has(card.id)) continue;
    usedCards.add(card.id);

    const questionType = getRandomQuestionType();
    const question = createQuestion(card, questionType, cards);

    questions.push(question);
  }

  return questions;
}

function getRandomQuestionType(): QuestionType {
  const types: QuestionType[] = ['multipleChoice', 'trueFalse', 'written'];
  const weights = [0.4, 0.3, 0.3]; // 40% MCQ, 30% T/F, 30% Written

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < types.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return types[i];
    }
  }

  return 'multipleChoice';
}

function createQuestion(
  card: FlashCard,
  type: QuestionType,
  allCards: FlashCard[]
): Question {
  const baseQuestion: Question = {
    id: `q-${card.id}-${Date.now()}`,
    cardId: card.id,
    type,
    question: card.front,
    correctAnswer: card.back,
  };

  switch (type) {
    case 'multipleChoice':
      return createMultipleChoiceQuestion(card, allCards);

    case 'trueFalse':
      return createTrueFalseQuestion(card);

    case 'written':
      return baseQuestion;

    default:
      return baseQuestion;
  }
}

function createMultipleChoiceQuestion(
  card: FlashCard,
  allCards: FlashCard[]
): Question {
  // Get 3 wrong answers from other cards
  const otherCards = allCards.filter(c => c.id !== card.id);
  const wrongAnswers: string[] = [];

  while (wrongAnswers.length < 3 && otherCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherCards.length);
    const wrongAnswer = otherCards[randomIndex].back;

    if (!wrongAnswers.includes(wrongAnswer) && wrongAnswer !== card.back) {
      wrongAnswers.push(wrongAnswer);
    }

    otherCards.splice(randomIndex, 1);
  }

  // Fill remaining slots if not enough cards
  while (wrongAnswers.length < 3) {
    wrongAnswers.push('Other');
  }

  // Shuffle options
  const options = [...wrongAnswers, card.back].sort(() => Math.random() - 0.5);

  return {
    id: `q-${card.id}-${Date.now()}`,
    cardId: card.id,
    type: 'multipleChoice',
    question: card.front,
    correctAnswer: card.back,
    options,
  };
}

function createTrueFalseQuestion(card: FlashCard): Question {
  // 50% chance to use correct answer, 50% chance to use false statement
  const useCorrect = Math.random() > 0.5;

  if (useCorrect) {
    return {
      id: `q-${card.id}-${Date.now()}`,
      cardId: card.id,
      type: 'trueFalse',
      question: `True or False: ${card.front} is ${card.back}`,
      correctAnswer: 'True',
      options: ['True', 'False'],
    };
  } else {
    // Create a false statement
    const falseStatement = createFalseStatement(card.back);

    return {
      id: `q-${card.id}-${Date.now()}`,
      cardId: card.id,
      type: 'trueFalse',
      question: `True or False: ${card.front} is ${falseStatement}`,
      correctAnswer: 'False',
      options: ['True', 'False'],
    };
  }
}

function createFalseStatement(correctAnswer: string): string {
  // Simple strategies to create false statements
  const strategies = [
    () => 'not ' + correctAnswer.toLowerCase(),
    () => correctAnswer.replace(/\d+/g, (num) => String(parseInt(num) + 1)),
    () => correctAnswer.split(' ').reverse().join(' '),
    () => 'the opposite of ' + correctAnswer.toLowerCase(),
  ];

  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  return strategy();
}

export function shuffleCards(cards: FlashCard[]): FlashCard[] {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function generateAdaptiveQuestion(
  cards: FlashCard[],
  weakCards: FlashCard[],
  strongCards: FlashCard[]
): Question | null {
  // 70% chance to focus on weak cards, 30% on all cards
  const focusOnWeak = Math.random() < 0.7 && weakCards.length > 0;

  const pool = focusOnWeak ? weakCards : cards;

  if (pool.length === 0) return null;

  const card = pool[Math.floor(Math.random() * pool.length)];
  const questionType = getRandomQuestionType();

  return createQuestion(card, questionType, cards);
}
