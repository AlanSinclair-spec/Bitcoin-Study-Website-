import { getAllChapters } from '@/lib/content';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function LearnPage() {
  const chapters = getAllChapters();

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Course Chapters</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Work through each chapter systematically. Your progress is tracked automatically.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>0 of {chapters.length} chapters</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <Link key={chapter.slug} href={`/learn/${chapter.slug}`}>
              <Card className="transition-all hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <CardTitle className="mb-2">{chapter.metadata.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {chapter.metadata.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-lg border bg-muted/50">
          <h3 className="font-semibold mb-2">Study Tips</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Take notes as you read each chapter</li>
            <li>• Complete the quiz after finishing each chapter</li>
            <li>• Review flashcards regularly using spaced repetition</li>
            <li>• Use the glossary to clarify unfamiliar terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
