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
          <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 animate-slide-in">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <a href="/" className="flex items-center space-x-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F7931A] to-[#FDB931] transform group-hover:scale-110 transition-transform duration-200">
                      <span className="font-bold text-white">S</span>
                    </div>
                    <span className="text-xl font-semibold text-[#0F172A]">Softwar Learning</span>
                  </a>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                  {["Bitcoin Basics", "Softwar", "Journal", "Flashcards", "Glossary"].map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase().replace(' ', '-') === 'bitcoin-basics' ? 'fundamentals' : item.toLowerCase().replace(' ', '-')}`}
                      className="relative text-[#0F172A] hover:text-[#F7931A] transition-colors duration-200 group font-medium"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7931A] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
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
