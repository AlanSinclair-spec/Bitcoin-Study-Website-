import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText, BookOpen } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const lessons = [
  '1-introduction-to-bitcoin',
  '2-how-bitcoin-works',
  '3-bitcoin-economics',
  '4-security-and-technology',
  '5-bitcoin-in-the-real-world',
  '6-future-of-bitcoin',
];

const mdxComponents = {
  h1: (props: any) => <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
  ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
  table: (props: any) => <table className="w-full my-6" {...props} />,
  th: (props: any) => <th className="border px-4 py-2 text-left font-bold" {...props} />,
  td: (props: any) => <td className="border px-4 py-2" {...props} />,
  KeyTakeaway: ({ children }: any) => (
    <div className="my-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
      {children}
    </div>
  ),
  EverydayApplication: ({ children }: any) => (
    <div className="my-6 p-4 rounded-lg bg-secondary border-l-4 border-secondary-foreground">
      {children}
    </div>
  ),
};

export async function generateStaticParams() {
  return lessons.map((lesson) => ({ lesson }));
}

export default async function FundamentalsLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: lessonSlug } = await params;

  if (!lessons.includes(lessonSlug)) {
    notFound();
  }

  const filePath = path.join(process.cwd(), 'content', 'fundamentals', `${lessonSlug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);

  const currentIndex = lessons.indexOf(lessonSlug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="container py-6">
      <div className="flex gap-6">
        <main className="flex-1 min-w-0">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          <div className="mt-12 flex items-center justify-between border-t pt-6">
            <div>
              {prevLesson && (
                <Link href={`/fundamentals/${prevLesson}`}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {nextLesson && (
                <Link href={`/fundamentals/${nextLesson}`}>
                  <Button variant="outline">
                    Next Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </main>

        <aside className="hidden xl:block w-64 shrink-0 sticky top-20 self-start space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/quiz/${lessonSlug}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Take Quiz
                </Button>
              </Link>
              <Link href="/flashcards" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Review Flashcards
                </Button>
              </Link>
              <Link href="/journal/new" className="block">
                <Button variant="default" size="sm" className="w-full">
                  Reflect in Journal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {frontmatter.tags && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
