import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, Search, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12">
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Master Bitcoin & Strategic Power Theory
        </h1>
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Learn Bitcoin from the ground up, then explore Softwar's strategic insights. Track progress with quizzes, flashcards, and personal reflection.
        </p>
        <div className="flex gap-4">
          <Link href="/fundamentals">
            <Button size="lg">
              Start with Bitcoin Basics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/learn">
            <Button size="lg" variant="outline">
              Jump to Softwar
            </Button>
          </Link>
        </div>
      </section>

      {/* Learning Path */}
      <section className="mx-auto max-w-[980px] py-8">
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">Recommended Learning Path</h3>
            <div className="space-y-3 text-sm">
              <p><strong>New to Bitcoin?</strong> Start with <Link href="/fundamentals" className="text-primary underline">Bitcoin Fundamentals</Link> to master the basics (technology, economics, security).</p>
              <p><strong>Know Bitcoin already?</strong> Jump directly to <Link href="/learn" className="text-primary underline">Softwar</Link> to understand its national security significance.</p>
              <p><strong>Want deeper learning?</strong> Use the <Link href="/journal" className="text-primary underline">Personal Journal</Link> to reflect, set goals, and track habits as you learn.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to Use Section */}
      <section className="mx-auto max-w-[980px] py-8">
        <h2 className="mb-6 text-center text-3xl font-bold">How to Use This Course</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                1. Read Chapters
              </CardTitle>
              <CardDescription>
                Work through each chapter systematically from Executive Summary through the full thesis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each chapter includes key concepts, figures, and policy implications. Mark chapters complete as you finish them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                2. Practice Concepts
              </CardTitle>
              <CardDescription>
                Test your knowledge with flashcards and chapter quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Spaced repetition flashcards help retention. Take quizzes after each chapter to verify understanding.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                3. Explore Resources
              </CardTitle>
              <CardDescription>
                Use the glossary, figures gallery, and timeline to deepen understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cross-reference concepts, review visual aids, and contextualize ideas historically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                4. Track Progress
              </CardTitle>
              <CardDescription>
                Monitor your mastery and revisit weak areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The platform tracks chapter completion, quiz scores, and flashcard reviews to guide your learning.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-[980px] py-8">
        <h2 className="mb-6 text-center text-3xl font-bold">Quick Start</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/learn/executive-summary">
            <Card className="transition-colors hover:bg-accent cursor-pointer">
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>Overview of the core thesis</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/learn/ch1">
            <Card className="transition-colors hover:bg-accent cursor-pointer">
              <CardHeader>
                <CardTitle>Chapter 1</CardTitle>
                <CardDescription>Power Projection & History</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/glossary">
            <Card className="transition-colors hover:bg-accent cursor-pointer">
              <CardHeader>
                <CardTitle>Glossary</CardTitle>
                <CardDescription>Key terms and definitions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Core Concepts Preview */}
      <section className="mx-auto max-w-[980px] py-8">
        <h2 className="mb-6 text-center text-3xl font-bold">Core Concepts</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'Power Projection Theory',
            'Bitpower',
            'Proof-of-Work',
            'Softwar',
            'Physical Cost',
            'Deterrence',
            'Electro-Cyber Dome',
            'Hash Rate',
            'Byzantine Generals Problem',
          ].map((concept) => (
            <Link key={concept} href={`/glossary?q=${encodeURIComponent(concept)}`}>
              <Button variant="outline" size="sm">
                {concept}
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
