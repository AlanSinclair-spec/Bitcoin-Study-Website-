import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Softwar Learning Platform',
  description: 'Learn the complete content of Softwar: A Novel Theory on Power Projection and Bitcoin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="font-bold">Softwar Learning</span>
                </a>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <a href="/fundamentals" className="transition-colors hover:text-foreground/80">
                    Bitcoin Basics
                  </a>
                  <a href="/learn" className="transition-colors hover:text-foreground/80">
                    Softwar
                  </a>
                  <a href="/journal" className="transition-colors hover:text-foreground/80">
                    Journal
                  </a>
                  <a href="/flashcards" className="transition-colors hover:text-foreground/80">
                    Flashcards
                  </a>
                  <a href="/glossary" className="transition-colors hover:text-foreground/80">
                    Glossary
                  </a>
                  <a href="/search" className="transition-colors hover:text-foreground/80">
                    Search
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Based on{' '}
                <a
                  href="/sources"
                  className="font-medium underline underline-offset-4"
                >
                  Softwar by Jason P. Lowery
                </a>
                {' • '}
                <a
                  href="/sources"
                  className="font-medium underline underline-offset-4"
                >
                  CC BY 4.0
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
