'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    // Simple mock search - in production, this would use Lunr.js
    const mockResults = [
      {
        type: 'chapter',
        title: 'Executive Summary',
        slug: 'executive-summary',
        excerpt: 'This thesis presents a novel theory of power projection...',
      },
      {
        type: 'glossary',
        title: 'Proof-of-Work',
        slug: 'proof-of-work',
        excerpt: 'A consensus mechanism requiring computational work...',
      },
      {
        type: 'concept',
        title: 'Bitpower',
        slug: 'bitpower',
        excerpt: 'The strategic power projection capability derived from...',
      },
    ];

    setResults(mockResults.filter((r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase())
    ));
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Search across chapters, glossary, figures, and quizzes
        </p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Search for concepts, terms, or chapters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-3 rounded-lg border-2 border-border bg-background"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{results.length} results found</p>
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        <Link href={`/${result.type === 'chapter' ? 'learn' : 'glossary'}/${result.slug}`} className="hover:underline">
                          {result.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{result.excerpt}</CardDescription>
                    </div>
                    <Badge variant="secondary">{result.type}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No results found for &quot;{query}&quot;
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
