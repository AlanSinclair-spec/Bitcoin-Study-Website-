import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getChapterBySlug, getAllChapters, extractHeadings } from '@/lib/content';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

// MDX Components
const mdxComponents = {
  h1: (props: any) => <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
  ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),
  a: (props: any) => (
    <a className="font-medium text-primary underline underline-offset-4" {...props} />
  ),
};

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map((chapter) => ({
    chapter: chapter.slug,
  }));
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    notFound();
  }

  const headings = extractHeadings(chapter.content);
  const allChapters = getAllChapters();
  const currentIndex = allChapters.findIndex((c) => c.slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="container py-6">
      <div className="flex gap-6">
        {/* Left Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-20 self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">On This Page</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-sm hover:text-foreground transition-colors ${
                      heading.level === 1 ? 'font-semibold' : ''
                    } ${heading.level === 2 ? 'pl-0' : ''} ${
                      heading.level === 3 ? 'pl-4' : ''
                    } text-muted-foreground`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <MDXRemote source={chapter.content} components={mdxComponents} />
          </article>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t pt-6">
            <div>
              {prevChapter && (
                <Link href={`/learn/${prevChapter.slug}`}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {prevChapter.metadata.title}
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {nextChapter && (
                <Link href={`/learn/${nextChapter.slug}`}>
                  <Button variant="outline">
                    {nextChapter.metadata.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Key Info */}
        <aside className="hidden xl:block w-64 shrink-0 sticky top-20 self-start space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Key Ideas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {chapter.metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/quiz/${chapterSlug}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Take Quiz
                </Button>
              </Link>
              <Link href={`/flashcards?chapter=${chapterSlug}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Review Flashcards
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
            </CardContent>
          </Card>

          {chapter.metadata.figures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Referenced Figures</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {chapter.metadata.figures.map((fig) => (
                    <li key={fig}>
                      <Link href={`/figures#${fig}`} className="hover:text-foreground">
                        {fig}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
