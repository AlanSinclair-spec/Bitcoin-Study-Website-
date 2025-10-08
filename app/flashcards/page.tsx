'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  RotateCcw,
  Star,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import { ModeSelector } from '@/components/flashcards/ModeSelector';
import type { FlashCard, StudyMode, Question } from '@/lib/flashcards/types';
import { generateQuestions, shuffleCards, generateAdaptiveQuestion } from '@/lib/flashcards/question-generator';
import { isAnswerCorrect, getGradeFeedback, calculateSimilarity } from '@/lib/flashcards/smart-grading';
import {
  saveCardProgress,
  toggleStar,
  getCardProgress,
  getWeakCards,
  getStrongCards,
  saveStudySession,
  getAllCardProgress,
} from '@/lib/flashcards/progress-storage';

export default function FlashcardsPage() {
  // Core state
  const [allCards, setAllCards] = useState<FlashCard[]>([]);
  const [currentMode, setCurrentMode] = useState<StudyMode | null>(null);
  const [filter, setFilter] = useState<'all' | 'fundamentals' | 'softwar' | 'starred'>('all');

  // Flashcards mode state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayCards, setDisplayCards] = useState<FlashCard[]>([]);

  // Learn/Write/Test mode state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);

  useEffect(() => {
    // Load flashcards
    fetch('/flashcards.json')
      .then((res) => res.json())
      .then((data: FlashCard[]) => {
        setAllCards(data);
        setDisplayCards(data);
      });
  }, []);

  useEffect(() => {
    // Filter cards when filter changes
    if (!allCards.length) return;

    let filtered = allCards;

    if (filter === 'fundamentals') {
      filtered = allCards.filter(
        (card) =>
          card.chapterId.includes('fund') ||
          card.tags.some((tag) => ['bitcoin', 'fundamentals', 'basics'].includes(tag.toLowerCase()))
      );
    } else if (filter === 'softwar') {
      filtered = allCards.filter(
        (card) =>
          card.chapterId.includes('ch') ||
          card.chapterId.includes('exec') ||
          card.tags.some((tag) => ['softwar', 'power-projection', 'strategy'].includes(tag.toLowerCase()))
      );
    } else if (filter === 'starred') {
      const allProgress = getAllCardProgress();
      const starredIds = Object.values(allProgress)
        .filter((p) => p.isStarred)
        .map((p) => p.cardId);
      filtered = allCards.filter((card) => starredIds.includes(card.id));
    }

    setDisplayCards(filtered);
    setCurrentCardIndex(0);
  }, [filter, allCards]);

  const startMode = (mode: StudyMode) => {
    setCurrentMode(mode);
    setSessionStartTime(Date.now());
    setCurrentCardIndex(0);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSessionComplete(false);
    setIsFlipped(false);
    setShowAnswer(false);
    setUserAnswer('');

    if (mode === 'learn' || mode === 'write' || mode === 'test') {
      const generatedQuestions = generateQuestions(displayCards, 20);
      setQuestions(generatedQuestions);
    }
  };

  const handleShuffle = () => {
    setDisplayCards(shuffleCards(displayCards));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleStar = (cardId: string) => {
    toggleStar(cardId);
    // Force re-render by updating state
    setDisplayCards([...displayCards]);
  };

  const handleNextCard = () => {
    if (currentCardIndex < displayCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSubmitAnswer = (question: Question, answer: string) => {
    const correct = isAnswerCorrect(answer, question.correctAnswer);

    // Update progress
    saveCardProgress(question.cardId, correct);

    if (correct) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

    // Update question with result
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...question,
      userAnswer: answer,
      isCorrect: correct,
    };
    setQuestions(updatedQuestions);

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setUserAnswer('');
    } else {
      // Session complete
      const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
      saveStudySession({
        mode: currentMode!,
        startedAt: new Date(sessionStartTime).toISOString(),
        completedAt: new Date().toISOString(),
        cardsStudied: questions.length,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        timeSpent,
      });
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentMode(null);
    setCurrentCardIndex(0);
    setCurrentQuestionIndex(0);
    setSessionComplete(false);
  };

  // Render mode selector
  if (!currentMode) {
    return <ModeSelector onSelectMode={startMode} cardCount={displayCards.length} />;
  }

  const currentCard = displayCards[currentCardIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentCard ? getCardProgress(currentCard.id) : null;

  // Render session complete screen
  if (sessionComplete) {
    const accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100);

    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>🎉 Session Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{accuracy}%</div>
                <p className="text-muted-foreground">Accuracy</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleRestart} className="w-full" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Mode Selection
                </Button>
                <Button onClick={() => startMode(currentMode!)} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start New Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // FLASHCARDS MODE
  if (currentMode === 'flashcards') {
    if (!currentCard) {
      return (
        <div className="container py-10">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No cards available in this category.</p>
                <Button onClick={handleRestart} className="w-full mt-4">
                  Back to Mode Selection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    const isStarred = progress?.isStarred || false;

    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleRestart} variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleShuffle} variant="outline" size="sm">
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
              All Cards
            </Button>
            <Button variant={filter === 'fundamentals' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('fundamentals')}>
              Bitcoin Basics
            </Button>
            <Button variant={filter === 'softwar' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('softwar')}>
              Softwar
            </Button>
            <Button variant={filter === 'starred' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('starred')}>
              <Star className="mr-2 h-4 w-4" />
              Starred
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Card {currentCardIndex + 1} of {displayCards.length}
              </span>
              {progress && (
                <span className="font-medium">
                  Confidence: {progress.confidence}%
                </span>
              )}
            </div>
            <Progress value={((currentCardIndex + 1) / displayCards.length) * 100} className="h-2" />
          </div>

          {/* Card */}
          <Card
            className="min-h-[400px] cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 min-h-[400px]">
              <div className="text-center space-y-6 w-full">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{currentCard.chapterId}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStar(currentCard.id);
                    }}
                  >
                    <Star className={`h-5 w-5 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                </div>

                <div className="text-2xl font-bold px-6">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>

                {!isFlipped && (
                  <p className="text-sm text-muted-foreground">
                    Click to flip
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button onClick={handlePrevCard} disabled={currentCardIndex === 0} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNextCard} disabled={currentCardIndex === displayCards.length - 1}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {currentCard.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // LEARN/WRITE/TEST MODES (Question-based)
  if (!currentQuestion) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading questions...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleRestart} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Badge variant="outline" className="text-sm">
            {currentMode === 'learn' && 'Learn Mode'}
            {currentMode === 'write' && 'Write Mode'}
            {currentMode === 'test' && 'Test Mode'}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>
              {correctCount} correct, {incorrectCount} incorrect
            </span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            <Badge variant="secondary" className="w-fit">
              {currentQuestion.type === 'multipleChoice' && 'Multiple Choice'}
              {currentQuestion.type === 'trueFalse' && 'True/False'}
              {currentQuestion.type === 'written' && 'Written Answer'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showAnswer ? (
              <>
                {/* Multiple Choice */}
                {currentQuestion.type === 'multipleChoice' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-4"
                        onClick={() => handleSubmitAnswer(currentQuestion, option)}
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === 'trueFalse' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleSubmitAnswer(currentQuestion, 'True')}
                    >
                      True
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleSubmitAnswer(currentQuestion, 'False')}
                    >
                      False
                    </Button>
                  </div>
                )}

                {/* Written Answer */}
                {currentQuestion.type === 'written' && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Type your answer..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim()) {
                          handleSubmitAnswer(currentQuestion, userAnswer);
                        }
                      }}
                      className="text-lg p-4"
                    />
                    <Button
                      onClick={() => handleSubmitAnswer(currentQuestion, userAnswer)}
                      disabled={!userAnswer.trim()}
                      className="w-full"
                      size="lg"
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Answer Feedback */}
                <div className={`p-6 rounded-lg ${currentQuestion.isCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {currentQuestion.isCorrect ? (
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                        <X className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {currentQuestion.isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                      {currentQuestion.type === 'written' && currentQuestion.userAnswer && (
                        <p className="text-sm text-muted-foreground">
                          {getGradeFeedback(calculateSimilarity(currentQuestion.userAnswer, currentQuestion.correctAnswer))}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.userAnswer && (
                      <div>
                        <p className="text-sm font-medium">Your answer:</p>
                        <p className="text-sm">{currentQuestion.userAnswer}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Correct answer:</p>
                      <p className="text-sm font-semibold">{currentQuestion.correctAnswer}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleNextQuestion} className="w-full" size="lg">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
