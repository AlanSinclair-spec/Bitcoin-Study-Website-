'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, ChevronRight } from 'lucide-react';
import {
  calculateNextReview,
  ReviewQuality,
  saveReview,
  loadReviews,
  getReviewStats,
  type CardReview,
} from '@/lib/spaced-rep/sm2';

interface FlashCard {
  id: string;
  chapterId: string;
  front: string;
  back: string;
  tags: string[];
}

export default function FlashcardsPage() {
  const [allCards, setAllCards] = useState<FlashCard[]>([]);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [sessionComplete, setSessionComplete] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [filter, setFilter] = useState<'all' | 'fundamentals' | 'softwar'>('all');

  useEffect(() => {
    // Load flashcards
    fetch('/data/flashcards.json')
      .then((res) => res.json())
      .then((data: FlashCard[]) => {
        setAllCards(data);
        setCards(data.slice(0, 20)); // Limit to 20 cards per session
      });

    // Load existing reviews
    const existingReviews = loadReviews();
    setReviews(existingReviews);
  }, []);

  useEffect(() => {
    // Filter cards when filter changes
    let filtered = allCards;
    if (filter === 'fundamentals') {
      filtered = allCards.filter(card =>
        card.chapterId.includes('fund') ||
        card.id.includes('fund') ||
        card.tags.some(tag => ['bitcoin', 'fundamentals', 'basics'].includes(tag.toLowerCase()))
      );
    } else if (filter === 'softwar') {
      filtered = allCards.filter(card =>
        card.chapterId.includes('ch') ||
        card.chapterId.includes('exec') ||
        card.id.includes('exec') ||
        card.id.includes('ch') ||
        card.tags.some(tag => ['softwar', 'power-projection', 'strategy'].includes(tag.toLowerCase()))
      );
    }
    setCards(filtered.slice(0, 20));
    setCurrentCardIndex(0);
    setCardsReviewed(0);
    setSessionComplete(false);
  }, [filter, allCards]);

  const currentCard = cards[currentCardIndex];
  const stats = getReviewStats(Object.values(reviews));

  const handleReview = (quality: ReviewQuality) => {
    if (!currentCard) return;

    const existingReview = reviews[currentCard.id];
    const newReview = calculateNextReview(
      existingReview ? { ...existingReview, cardId: currentCard.id } : null,
      quality
    );
    newReview.cardId = currentCard.id;

    saveReview(newReview);
    setReviews({ ...reviews, [currentCard.id]: newReview });
    setCardsReviewed(cardsReviewed + 1);

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading flashcards...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Session Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{cardsReviewed}</div>
                <p className="text-muted-foreground">Cards reviewed</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.dueToday}</div>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalCards}</div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.averageEaseFactor}</div>
                  <p className="text-sm text-muted-foreground">Avg Ease</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setSessionComplete(false);
                  setCardsReviewed(0);
                }}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Cards ({allCards.length})
          </Button>
          <Button
            variant={filter === 'fundamentals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('fundamentals')}
          >
            Bitcoin Basics
          </Button>
          <Button
            variant={filter === 'softwar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('softwar')}
          >
            Softwar Strategy
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <span>{cardsReviewed} reviewed</span>
          </div>
          <Progress value={((currentCardIndex + 1) / cards.length) * 100} className="h-2" />
        </div>

        <Card className="min-h-[400px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <CardContent className="flex flex-col items-center justify-center p-12 min-h-[400px]">
            <div className="text-center space-y-4">
              <Badge variant="secondary">{currentCard.chapterId}</Badge>
              <div className="text-2xl font-bold mb-8">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              {!isFlipped && (
                <p className="text-sm text-muted-foreground">
                  Click card to reveal answer
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {isFlipped && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            <Button
              variant="destructive"
              onClick={() => handleReview(ReviewQuality.AGAIN)}
              className="w-full"
            >
              Again
              <br />
              <span className="text-xs">1 day</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleReview(ReviewQuality.HARD)}
              className="w-full"
            >
              Hard
              <br />
              <span className="text-xs">3 days</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReview(ReviewQuality.GOOD)}
              className="w-full"
            >
              Good
              <br />
              <span className="text-xs">6 days</span>
            </Button>
            <Button
              variant="default"
              onClick={() => handleReview(ReviewQuality.EASY)}
              className="w-full"
            >
              Easy
              <br />
              <span className="text-xs">14+ days</span>
            </Button>
          </div>
        )}

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
