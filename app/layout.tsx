import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AskChatbot } from '@/components/ask-chatbot';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Softwar Learning Platform - Master Bitcoin & Power Projection Theory',
  description: 'Learn Bitcoin from the ground up and explore Softwar\'s strategic insights on power projection, proof-of-work, and national security. Interactive lessons, quizzes, and flashcards.',
  keywords: ['Bitcoin', 'Softwar', 'Power Projection', 'Cryptocurrency', 'Strategy', 'Learning Platform'],
  authors: [{ name: 'Based on Softwar by Jason P. Lowery' }],
  openGraph: {
    title: 'Softwar Learning Platform',
    description: 'Master Bitcoin & Strategic Power Theory',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, inter.variable, 'min-h-screen bg-background antialiased')}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b glass animate-slide-in">
            <div className="container flex h-16 items-center">
              <div className="mr-8 flex">
                <a
                  className="mr-8 flex items-center space-x-2 group transition-all"
                  href="/"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform">
                    S
                  </div>
                  <span className="font-bold text-lg gradient-text">Softwar Learning</span>
                </a>
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                  <a
                    href="/fundamentals"
                    className="transition-all hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    Bitcoin Basics
                  </a>
                  <a
                    href="/learn"
                    className="transition-all hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    Softwar
                  </a>
                  <a
                    href="/journal"
                    className="transition-all hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    Journal
                  </a>
                  <a
                    href="/flashcards"
                    className="transition-all hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    Flashcards
                  </a>
                  <a
                    href="/glossary"
                    className="transition-all hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    Glossary
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <AskChatbot />
          <footer className="border-t py-8 md:py-12 bg-muted/30">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <p className="text-sm font-medium">
                    Based on Softwar by Jason P. Lowery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Educational platform • CC BY 4.0 License
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <a href="/sources" className="hover:text-primary transition-colors">
                    Sources
                  </a>
                  <a href="/about" className="hover:text-primary transition-colors">
                    About
                  </a>
                  <a href="/glossary" className="hover:text-primary transition-colors">
                    Glossary
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
