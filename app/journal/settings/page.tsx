'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, Plus, Trash2, Save } from 'lucide-react';
import { LocalJournalStorage } from '@/lib/journal/storage';
import type { Goal, Habit } from '@/lib/journal/types';

const storage = new LocalJournalStorage();

export default function JournalSettingsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });
  const [newHabit, setNewHabit] = useState({ label: '', cadence: 'weekly' as 'daily' | 'weekly' });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [loadedGoals, loadedHabits] = await Promise.all([
      storage.getGoals(),
      storage.getHabits(),
    ]);
    setGoals(loadedGoals);
    setHabits(loadedHabits);
  }

  async function addGoal() {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await storage.saveGoal(goal);
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetDate: '' });
    setShowAddGoal(false);
  }

  async function deleteGoal(id: string) {
    await storage.deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  }

  async function toggleGoalStatus(id: string) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const updated = {
      ...goal,
      status: goal.status === 'done' ? 'active' : 'done' as 'active' | 'paused' | 'done',
    };

    await storage.saveGoal(updated);
    setGoals(goals.map(g => g.id === id ? updated : g));
  }

  async function addHabit() {
    if (!newHabit.label.trim()) return;

    const habit: Habit = {
      id: `habit-${Date.now()}`,
      label: newHabit.label,
      cadence: newHabit.cadence,
      active: true,
      createdAt: new Date().toISOString(),
    };

    await storage.saveHabit(habit);
    setHabits([...habits, habit]);
    setNewHabit({ label: '', cadence: 'weekly' });
    setShowAddHabit(false);
  }

  async function deleteHabit(id: string) {
    await storage.deleteHabit(id);
    setHabits(habits.filter(h => h.id !== id));
  }

  async function exportMarkdown() {
    const entries = await storage.getEntries();

    let markdown = '# Journal Entries\n\n';
    markdown += `Exported: ${new Date().toISOString()}\n\n`;
    markdown += `Total entries: ${entries.length}\n\n`;
    markdown += '---\n\n';

    for (const entry of entries) {
      markdown += `## ${entry.title}\n\n`;
      markdown += `**Date**: ${new Date(entry.createdAt).toLocaleDateString()}\n\n`;
      if (entry.tags.length > 0) {
        markdown += `**Tags**: ${entry.tags.join(', ')}\n\n`;
      }
      if (entry.rating) {
        markdown += `**Confidence**: ${entry.rating}/5\n\n`;
      }
      markdown += `${entry.contentMD}\n\n`;
      markdown += '---\n\n';
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJSON() {
    const [entries, goals, habits] = await Promise.all([
      storage.getEntries(),
      storage.getGoals(),
      storage.getHabits(),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      entries,
      goals,
      habits,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/journal">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Journal Settings</h1>

        {/* Export Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download your journal entries, goals, and habits for backup or offline reading.
            </p>
            <div className="flex gap-4">
              <Button onClick={exportMarkdown} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as Markdown
              </Button>
              <Button onClick={exportJSON} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Goals</CardTitle>
              <Button size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddGoal && (
              <div className="p-4 border rounded-md space-y-3">
                <Input
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addGoal}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Goal
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddGoal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {goals.length === 0 && !showAddGoal && (
              <p className="text-sm text-muted-foreground">No goals yet. Click &quot;Add Goal&quot; to create one.</p>
            )}

            {goals.map((goal) => (
              <div key={goal.id} className="flex items-start justify-between p-4 border rounded-md">
                <div className="flex-1">
                  <h3 className="font-medium">{goal.title}</h3>
                  {goal.description && <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>}
                  {goal.targetDate && (
                    <p className="text-xs text-muted-foreground mt-1">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  )}
                  <p className="text-xs mt-1">
                    <span className={goal.status === 'done' ? 'text-green-600' : 'text-orange-600'}>
                      {goal.status === 'done' ? '✓ Done' : goal.status === 'paused' ? '⏸ Paused' : '○ Active'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleGoalStatus(goal.id)}>
                    {goal.status === 'done' ? 'Reopen' : 'Mark Done'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habits Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Habits</CardTitle>
              <Button size="sm" onClick={() => setShowAddHabit(!showAddHabit)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddHabit && (
              <div className="p-4 border rounded-md space-y-3">
                <Input
                  placeholder="Habit description"
                  value={newHabit.label}
                  onChange={(e) => setNewHabit({ ...newHabit, label: e.target.value })}
                />
                <select
                  className="w-full p-2 border rounded-md"
                  value={newHabit.cadence}
                  onChange={(e) => setNewHabit({ ...newHabit, cadence: e.target.value as 'daily' | 'weekly' })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addHabit}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Habit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddHabit(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {habits.length === 0 && !showAddHabit && (
              <p className="text-sm text-muted-foreground">No habits yet. Click &quot;Add Habit&quot; to create one.</p>
            )}

            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">{habit.label}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{habit.cadence}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => deleteHabit(habit.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="font-semibold text-sm mb-2">Privacy Note</h3>
          <p className="text-xs text-muted-foreground">
            All journal data is stored locally in your browser. Nothing is sent to any server unless you explicitly enable sync in the future.
            Export your data regularly to prevent loss.
          </p>
        </div>
      </div>
    </div>
  );
}
