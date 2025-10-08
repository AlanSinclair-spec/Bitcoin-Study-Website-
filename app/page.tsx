import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen, Brain, Search, Clock, CheckCircle2, Sparkles, Target, Zap, Book } from 'lucide-react';
import Link from 'next/link';
import { ModuleProgressBar } from '@/components/progress-tracker';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FDB931] blur-3xl"></div>
          <div className="absolute top-40 right-20 h-48 w-48 rounded-full bg-gradient-to-br from-[#FDB931] to-[#F7931A] blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FDB931] blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Floating Badge */}
            <div className="mb-8 flex justify-center">
              <Badge className="bg-gradient-to-r from-[#F7931A] to-[#FDB931] text-white px-6 py-2 text-sm font-medium shadow-lg animate-pulse">
                ✨ Interactive Learning Platform
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              Master{" "}
              <span className="bg-gradient-to-r from-[#F7931A] to-[#FDB931] bg-clip-text text-transparent">
                Bitcoin
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-[#FDB931] to-[#F7931A] bg-clip-text text-transparent">
                Strategic Power Theory
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#64748B]">
              Dive deep into Bitcoin fundamentals and strategic power dynamics with our comprehensive,
              interactive learning platform designed for serious students.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/fundamentals">
                <Button
                  size="lg"
                  className="bg-[#F7931A] hover:bg-[#E88514] text-white px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#F7931A] text-[#F7931A] hover:bg-[#F7931A] hover:text-white px-8 py-4 transition-all duration-200"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-[#64748B]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#F7931A]" />
                <span>6 Bitcoin Lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#F7931A]" />
                <span>7 Softwar Chapters</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#F7931A]" />
                <span>100+ Flashcards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Cards - Premium Design */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Choose Your Learning Path
            </h2>
            <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
              Structured learning paths designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: 1,
                icon: Book,
                title: "New Learner?",
                description: "Start with Bitcoin Fundamentals Lesson 1 to build a solid foundation in cryptocurrency basics.",
                buttonText: "Begin Learning",
                href: "/fundamentals/1-introduction-to-bitcoin"
              },
              {
                id: 2,
                icon: Zap,
                title: "Know the Basics?",
                description: "Jump to Softwar Executive Summary for strategic insights on power projection and security.",
                buttonText: "Read Softwar",
                href: "/learn/executive-summary"
              },
              {
                id: 3,
                icon: Brain,
                title: "Build Memory",
                description: "Review 10 flashcards daily using spaced repetition to cement your knowledge.",
                buttonText: "Practice Now",
                href: "/flashcards"
              }
            ].map((path) => {
              const IconComponent = path.icon;
              return (
                <Card
                  key={path.id}
                  className="relative group cursor-pointer border-0 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-[#F7931A]/20 to-[#FDB931]/20 rounded-bl-full"></div>

                  {/* Number badge */}
                  <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F7931A] to-[#FDB931] text-white font-bold text-lg shadow-lg">
                    {path.id}
                  </div>

                  <CardHeader className="pt-8">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-lg bg-gradient-to-br from-[#F7931A]/10 to-[#FDB931]/10 mb-4">
                      <IconComponent className="h-8 w-8 text-[#F7931A]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-center text-[#0F172A]">
                      {path.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-center pb-8">
                    <CardDescription className="text-[#64748B] mb-6 leading-relaxed">
                      {path.description}
                    </CardDescription>
                    <Link href={path.href}>
                      <Button
                        className="w-full bg-[#F7931A] hover:bg-[#E88514] text-white group-hover:shadow-lg transition-all duration-200"
                      >
                        {path.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Progress Dashboard - Premium Design */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Your Learning Progress
            </h2>
            <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
              Track your advancement through each module and celebrate your achievements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                title: "Bitcoin Fundamentals",
                icon: BookOpen,
                module: "fundamentals" as const,
                href: "/fundamentals"
              },
              {
                title: "Softwar Strategy",
                icon: Target,
                module: "softwar" as const,
                href: "/learn"
              }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.title}
                  className="group cursor-pointer border-0 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Pulsing dot indicator */}
                        <div className="relative">
                          <div className="h-3 w-3 bg-[#F7931A] rounded-full animate-pulse"></div>
                          <div className="absolute top-0 left-0 h-3 w-3 bg-[#F7931A] rounded-full animate-ping opacity-50"></div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#F7931A]/10 to-[#FDB931]/10">
                          <IconComponent className="h-6 w-6 text-[#F7931A]" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-[#0F172A] mt-4">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ModuleProgressBar module={item.module} />

                    <Link href={item.href}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-[#F7931A] text-[#F7931A] hover:bg-[#F7931A] hover:text-white group-hover:shadow-md transition-all duration-200"
                      >
                        View Lessons
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
              Four simple steps to master Bitcoin and strategic theory
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Read Lessons", desc: "Work through structured content" },
              { icon: Brain, title: "Practice", desc: "Test with flashcards & quizzes" },
              { icon: Search, title: "Explore", desc: "Use glossary & resources" },
              { icon: Clock, title: "Track Progress", desc: "Monitor your mastery" }
            ].map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.title} className="text-center">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-[#F7931A] to-[#FDB931] shadow-lg mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#64748B]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
