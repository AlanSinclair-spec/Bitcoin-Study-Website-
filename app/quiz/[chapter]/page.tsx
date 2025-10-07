'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  chapterId: string;
  type: 'mcq' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  section: string;
}

export default function QuizPage({ params }: { params: { chapter: string } }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load quiz questions for this chapter
    fetch('/data/quizzes.json')
      .then((res) => res.json())
      .then((data: QuizQuestion[]) => {
        const chapterQuestions = data.filter((q) => q.chapterId === params.chapter);
        setQuestions(chapterQuestions);
      });
  }, [params.chapter]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    setUserAnswers({ ...userAnswers, [currentQuestion.id]: selectedAnswer });
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const isCorrect =
      currentQuestion.type === 'mcq'
        ? selectedAnswer === currentQuestion.correctAnswer
        : true; // Short answer marked correct for demo

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading quiz...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>Here's how you did</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{percentage}%</div>
                <p className="text-muted-foreground">
                  {score} out of {questions.length} correct
                </p>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setScore(0);
                    setQuizComplete(false);
                  }}
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
                <Button variant="outline" className="flex-1">
                  Back to Chapter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge variant="secondary">{currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}</Badge>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            <CardDescription>{currentQuestion.section}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'mcq' && currentQuestion.options ? (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={option}
                      onClick={() => !showExplanation && handleAnswerSelect(option)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected && !showResult
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      } ${
                        showResult && isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : ''
                      } ${
                        showResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50 dark:bg-red-950'
                          : ''
                      } ${!showExplanation ? 'hover:border-primary cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showExplanation}
                className="w-full p-4 rounded-lg border-2 border-border min-h-32 bg-background"
                placeholder="Type your answer here..."
              />
            )}

            {showExplanation && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-semibold mb-2">Explanation:</p>
                <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                {currentQuestion.type === 'short-answer' && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-semibold mb-1">Sample Answer:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {!showExplanation ? (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
