'use client';

import { useEffect, useState } from 'react';
import { progressStorage, type LessonProgress, type ModuleProgress } from '@/lib/progress/storage';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  lessonId: string;
  module: 'fundamentals' | 'softwar';
}

export function LessonCompletionButton({ lessonId, module }: ProgressTrackerProps) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressStorage.getLessonProgress(lessonId).then(progress => {
      setCompleted(progress?.completed || false);
      setLoading(false);
    });
  }, [lessonId]);

  const toggleCompletion = async () => {
    if (!completed) {
      await progressStorage.markCompleted(lessonId, module);
      setCompleted(true);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleCompletion}
      className="flex items-center gap-2 px-4 py-2 rounded-md border transition-colors hover:bg-accent"
    >
      {completed ? (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Completed</span>
        </>
      ) : (
        <>
          <Circle className="h-5 w-5" />
          <span className="text-sm font-medium">Mark Complete</span>
        </>
      )}
    </button>
  );
}

export function ModuleProgressBar({ module }: { module: 'fundamentals' | 'softwar' }) {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);

  useEffect(() => {
    progressStorage.getModuleProgress(module).then(setProgress);

    // Listen for progress changes
    const handler = () => {
      progressStorage.getModuleProgress(module).then(setProgress);
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [module]);

  if (!progress) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Overall Progress</span>
        <span>{progress.completedLessons} of {progress.totalLessons} lessons</span>
      </div>
      <Progress value={progress.percentComplete} className="h-2" />
      {progress.averageQuizScore > 0 && (
        <p className="text-xs text-muted-foreground">
          Average quiz score: {Math.round(progress.averageQuizScore)}%
        </p>
      )}
    </div>
  );
}

export function LessonCheckmark({ lessonId }: { lessonId: string }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    progressStorage.getLessonProgress(lessonId).then(progress => {
      setCompleted(progress?.completed || false);
    });
  }, [lessonId]);

  if (!completed) return null;

  return <CheckCircle2 className="h-5 w-5 text-green-600" />;
}
