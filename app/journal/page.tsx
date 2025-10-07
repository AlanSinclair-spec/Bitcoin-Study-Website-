'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Plus, TrendingUp, Target, Calendar, BookOpen } from 'lucide-react';
import { journalStorage } from '@/lib/journal/storage';
import type { JournalEntry, Goal, Habit, JournalStats } from '@/lib/journal/types';

export default function JournalDashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<JournalStats>({
    entriesThisWeek: 0,
    currentStreak: 0,
    longestStreak: 0,
    avgConfidence: 0,
    totalEntries: 0,
    goalsCompleted: 0,
    habitCompletionRate: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [loadedEntries, loadedGoals, loadedHabits] = await Promise.all([
      journalStorage.getEntries(),
      journalStorage.getGoals(),
      journalStorage.getHabits(),
    ]);

    setEntries(loadedEntries.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setGoals(loadedGoals.filter(g => g.status !== 'done'));
    setHabits(loadedHabits.filter(h => h.active));

    // Calculate stats
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const entriesThisWeek = loadedEntries.filter(e =>
      new Date(e.createdAt) >= weekStart
    ).length;

    const totalConfidence = loadedEntries
      .filter(e => e.rating)
      .reduce((sum, e) => sum + (e.rating || 0), 0);
    const avgConfidence = loadedEntries.length > 0
      ? totalConfidence / loadedEntries.filter(e => e.rating).length
      : 0;

    setStats({
      entriesThisWeek,
      currentStreak: calculateStreak(loadedEntries),
      longestStreak: calculateStreak(loadedEntries),
      avgConfidence,
      totalEntries: loadedEntries.length,
      goalsCompleted: loadedGoals.filter(g => g.status === 'done').length,
      habitCompletionRate: calculateHabitCompletion(loadedEntries, loadedHabits),
    });
  }

  function calculateStreak(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;

    const dates = entries
      .map(e => new Date(e.createdAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();

    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      if (dates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function calculateHabitCompletion(entries: JournalEntry[], habits: Habit[]): number {
    if (habits.length === 0) return 0;
    const recentEntries = entries.slice(0, 7);
    let completions = 0;
    let total = 0;

    recentEntries.forEach(entry => {
      habits.forEach(habit => {
        total++;
        if (entry.habits[habit.id]) completions++;
      });
    });

    return total > 0 ? (completions / total) * 100 : 0;
  }

  function groupEntriesByWeek(entries: JournalEntry[]) {
    const weeks: Record<string, JournalEntry[]> = {};
    entries.forEach(entry => {
      const week = entry.weekOf;
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(entry);
    });
    return Object.entries(weeks).sort(([a], [b]) => b.localeCompare(a));
  }

  const weeklyEntries = groupEntriesByWeek(entries);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Personal Journal</h1>
            <p className="text-muted-foreground">
              Reflect on your learning and track your Bitcoin journey
            </p>
          </div>
          <Link href="/journal/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.entriesThisWeek}</div>
              <p className="text-xs text-muted-foreground">journal entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">consecutive days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgConfidence.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">applying concepts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">all time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Active Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active goals</p>
              ) : (
                <div className="space-y-3">
                  {goals.slice(0, 3).map(goal => (
                    <div key={goal.id} className="text-sm">
                      <p className="font-medium">{goal.title}</p>
                      {goal.targetDate && (
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Link href="/journal/settings">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Manage Goals
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Habit Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Habit Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={stats.habitCompletionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.habitCompletionRate.toFixed(0)}% this week
                </p>
              </div>
              {habits.slice(0, 3).map(habit => (
                <div key={habit.id} className="text-sm mb-2">
                  <Badge variant="secondary">{habit.cadence}</Badge>
                  <span className="ml-2">{habit.label}</span>
                </div>
              ))}
              <Link href="/journal/settings">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Manage Habits
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Weak Areas Nudge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Based on recent quiz scores, consider reviewing:
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Proof-of-Work</Badge>
                <Badge variant="outline">Private Keys</Badge>
                <Badge variant="outline">Deterrence</Badge>
              </div>
              <Link href="/journal/new">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Reflect on These
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries by Week */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your journal organized by week</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No journal entries yet</p>
                <Link href="/journal/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {weeklyEntries.slice(0, 4).map(([week, weekEntries]) => (
                  <div key={week}>
                    <h3 className="font-semibold mb-3">
                      Week of {new Date(week).toLocaleDateString()}
                    </h3>
                    <div className="space-y-2">
                      {weekEntries.map(entry => (
                        <Link key={entry.id} href={`/journal/${entry.id}`}>
                          <div className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{entry.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {entry.contentMD.slice(0, 150)}...
                                </p>
                                <div className="flex gap-2 mt-2">
                                  {entry.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground ml-4">
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
