import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Edit, GraduationCap, LayoutGrid } from 'lucide-react';
import type { StudyMode } from '@/lib/flashcards/types';

interface ModeSelectorProps {
  onSelectMode: (mode: StudyMode) => void;
  cardCount: number;
}

export function ModeSelector({ onSelectMode, cardCount }: ModeSelectorProps) {
  const modes = [
    {
      id: 'flashcards' as StudyMode,
      name: 'Flashcards',
      description: 'Flip through cards, shuffle, and star favorites',
      icon: LayoutGrid,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'learn' as StudyMode,
      name: 'Learn',
      description: 'Adaptive study with mixed question types',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'write' as StudyMode,
      name: 'Write',
      description: 'Type answers with smart grading',
      icon: Edit,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'test' as StudyMode,
      name: 'Test',
      description: 'Mixed quiz: MCQ, True/False, and written',
      icon: GraduationCap,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Study Flashcards</h1>
          <p className="text-muted-foreground">
            {cardCount} cards available • Choose your study mode
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectMode(mode.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${mode.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary" variant="outline">
                    Start {mode.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
