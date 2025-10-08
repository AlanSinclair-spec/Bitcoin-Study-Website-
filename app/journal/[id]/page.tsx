'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';
import { LocalJournalStorage } from '@/lib/journal/storage';
import type { JournalEntry } from '@/lib/journal/types';
import ReactMarkdown from 'react-markdown';

const storage = new LocalJournalStorage();

export default function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [id]);

  async function loadEntry() {
    const entries = await storage.getEntries();
    const found = entries.find(e => e.id === id);
    if (found) {
      setEntry(found);
      setEditTitle(found.title);
      setEditContent(found.contentMD);
      setEditTags(found.tags);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!entry) return;

    const updated: JournalEntry = {
      ...entry,
      title: editTitle,
      contentMD: editContent,
      tags: editTags,
      updatedAt: new Date().toISOString(),
    };

    await storage.saveEntry(updated);
    setEntry(updated);
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this journal entry? This cannot be undone.')) return;

    await storage.deleteEntry(id);
    router.push('/journal');
  }

  function handleCancel() {
    if (entry) {
      setEditTitle(entry.title);
      setEditContent(entry.contentMD);
      setEditTags(entry.tags);
    }
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Entry not found</p>
              <div className="mt-4 flex justify-center">
                <Link href="/journal">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Journal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/journal">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold"
                placeholder="Entry title"
              />
            ) : (
              <CardTitle>{entry.title}</CardTitle>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {(isEditing ? editTags : entry.tags).map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Created: {new Date(entry.createdAt).toLocaleDateString()}
              {entry.updatedAt !== entry.createdAt && (
                <> • Updated: {new Date(entry.updatedAt).toLocaleDateString()}</>
              )}
            </p>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Write your reflection using Markdown..."
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{entry.contentMD}</ReactMarkdown>
              </div>
            )}

            {entry.rating && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium">Confidence Rating: {entry.rating}/5</p>
              </div>
            )}

            {entry.links && entry.links.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Related Lessons</h3>
                <div className="space-y-1">
                  {entry.links.map((link, idx) => (
                    <Link key={idx} href={link.url} className="block text-sm text-primary hover:underline">
                      → {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
