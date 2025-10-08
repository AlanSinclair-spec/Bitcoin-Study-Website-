import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, Search, Clock, CheckCircle2, Sparkles, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { ModuleProgressBar } from '@/components/progress-tracker';

export default function HomePage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-6 py-12 md:py-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-scale-in">
          <Sparkles className="h-4 w-4" />
          <span>Interactive Learning Platform</span>
        </div>
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          Master Bitcoin &<br />
          <span className="gradient-text">Strategic Power Theory</span>
        </h1>
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl leading-relaxed">
          Learn Bitcoin from the ground up, then explore Softwar's strategic insights on power projection and national security. Track your progress with interactive quizzes, flashcards, and personal reflection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/fundamentals">
            <Button size="lg" className="group glow hover:shadow-2xl transition-all">
              Start with Bitcoin Basics
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/learn">
            <Button size="lg" variant="outline" className="border-2 hover:border-primary hover:text-primary transition-all">
              Jump to Softwar
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-8 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>6 Bitcoin Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>7 Softwar Chapters</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>100+ Flashcards</span>
          </div>
        </div>
      </section>

      {/* What to Do First - 3-Step Checklist */}
      <section className="mx-auto max-w-[980px] py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">What to Do First</h2>
          <p className="text-muted-foreground">Choose your learning path based on your current knowledge</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 stagger-children">
          <Card className="border-2 hover-lift cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="pt-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-bg text-primary-foreground font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-2 text-lg flex items-center gap-2">
                    New Learner?
                    <Target className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Start with Bitcoin Fundamentals Lesson 1 to build a solid foundation.
                  </p>
                  <Link href="/fundamentals/1-introduction-to-bitcoin">
                    <Button size="sm" className="w-full group-hover:shadow-lg transition-shadow">
                      Begin Learning
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="pt-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-bg text-primary-foreground font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-2 text-lg flex items-center gap-2">
                    Know the Basics?
                    <Zap className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Jump to Softwar Executive Summary for strategic insights.
                  </p>
                  <Link href="/learn/executive-summary">
                    <Button size="sm" className="w-full" variant="outline">
                      Read Softwar
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="pt-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-bg text-primary-foreground font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-2 text-lg flex items-center gap-2">
                    Build Memory
                    <Brain className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Review 10 flashcards daily using spaced repetition.
                  </p>
                  <Link href="/flashcards">
                    <Button size="sm" className="w-full" variant="outline">
                      Practice Now
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Module Progress Bars */}
      <section className="mx-auto max-w-[980px] py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Your Progress</h2>
          <p className="text-muted-foreground">Track your learning journey across both modules</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 hover-lift group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Bitcoin Fundamentals
                  </CardTitle>
                  <CardDescription className="mt-1">Master the technology and economics</CardDescription>
                </div>
                <BookOpen className="h-8 w-8 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <ModuleProgressBar module="fundamentals" />
              <div className="mt-6">
                <Link href="/fundamentals">
                  <Button size="sm" variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-all">
                    View All Lessons
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Softwar Strategy
                  </CardTitle>
                  <CardDescription className="mt-1">Understand national security implications</CardDescription>
                </div>
                <Target className="h-8 w-8 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <ModuleProgressBar module="softwar" />
              <div className="mt-6">
                <Link href="/learn">
                  <Button size="sm" variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-all">
                    View All Chapters
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="mx-auto max-w-[980px] py-12 bg-muted/30 rounded-3xl px-6 md:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">How to Use This Course</h2>
          <p className="text-muted-foreground">Follow these four steps for effective learning</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 hover-lift group bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span>Read Chapters</span>
              </CardTitle>
              <CardDescription className="ml-13">
                Work through each chapter systematically from Executive Summary through the full thesis
              </CardDescription>
            </CardHeader>
            <CardContent className="ml-13">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each chapter includes key concepts, figures, and policy implications. Mark chapters complete as you finish them.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift group bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Brain className="h-5 w-5" />
                </div>
                <span>Practice Concepts</span>
              </CardTitle>
              <CardDescription className="ml-13">
                Test your knowledge with flashcards and chapter quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="ml-13">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Spaced repetition flashcards help retention. Take quizzes after each chapter to verify understanding.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift group bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Search className="h-5 w-5" />
                </div>
                <span>Explore Resources</span>
              </CardTitle>
              <CardDescription className="ml-13">
                Use the glossary, figures gallery, and timeline to deepen understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="ml-13">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cross-reference concepts, review visual aids, and contextualize ideas historically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover-lift group bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Clock className="h-5 w-5" />
                </div>
                <span>Track Progress</span>
              </CardTitle>
              <CardDescription className="ml-13">
                Monitor your mastery and revisit weak areas
              </CardDescription>
            </CardHeader>
            <CardContent className="ml-13">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The platform tracks chapter completion, quiz scores, and flashcard reviews to guide your learning.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-[980px] py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Quick Start</h2>
          <p className="text-muted-foreground">Jump directly into key topics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/learn/executive-summary">
            <Card className="border-2 hover-lift cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Executive Summary
                </CardTitle>
                <CardDescription>Overview of the core thesis</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/learn/ch1">
            <Card className="border-2 hover-lift cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Chapter 1
                </CardTitle>
                <CardDescription>Power Projection & History</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/glossary">
            <Card className="border-2 hover-lift cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Glossary
                </CardTitle>
                <CardDescription>Key terms and definitions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Core Concepts Preview */}
      <section className="mx-auto max-w-[980px] py-12 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Core Concepts</h2>
          <p className="text-muted-foreground">Explore fundamental ideas from the course</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
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
              <Button
                variant="outline"
                size="sm"
                className="border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                {concept}
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
