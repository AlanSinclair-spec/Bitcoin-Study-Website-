'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Lightbulb } from 'lucide-react';
import { journalStorage } from '@/lib/journal/storage';
import { REFLECTION_PROMPTS } from '@/lib/journal/prompts';
import type { JournalEntry } from '@/lib/journal/types';

export default function NewJournalEntry() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState<number>(3);
  const [showPrompts, setShowPrompts] = useState(false);

  async function handleSave() {
    if (!title || !content) {
      alert('Please add a title and content');
      return;
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      title,
      contentMD: content,
      tags,
      links: [],
      goalsChecked: [],
      habits: {},
      rating,
      weekOf: weekStart.toISOString(),
    };

    await journalStorage.saveEntry(entry);
    router.push(`/journal/${entry.id}`);
  }

  function insertPrompt(prompt: string) {
    setContent(content + (content ? '\n\n' : '') + `**Prompt**: ${prompt}\n\n`);
    setShowPrompts(false);
  }

  function addTag() {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 rounded-lg border-2 border-border bg-background"
              />
            </div>

            {/* Prompt Picker */}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrompts(!showPrompts)}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {showPrompts ? 'Hide' : 'Show'} Reflection Prompts
              </Button>

              {showPrompts && (
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto p-4 bg-muted rounded-lg">
                  {REFLECTION_PROMPTS.map(prompt => (
                    <div key={prompt.id} className="p-3 bg-background rounded cursor-pointer hover:bg-accent" onClick={() => insertPrompt(prompt.text)}>
                      <p className="text-sm">{prompt.text}</p>
                      <div className="flex gap-1 mt-2">
                        {prompt.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown supported)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your reflection..."
                rows={12}
                className="w-full p-3 rounded-lg border-2 border-border bg-background font-mono text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="flex-1 p-2 rounded-lg border-2 border-border bg-background"
                />
                <Button onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Confidence Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Confidence Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-12 h-12 rounded-lg border-2 transition-colors ${
                      rating === num ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                How confident are you applying this concept?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => router.push('/journal')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
