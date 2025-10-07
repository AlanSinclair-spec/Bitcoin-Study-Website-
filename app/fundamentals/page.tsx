import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const lessons = [
  { id: '1-introduction-to-bitcoin', title: 'Introduction to Bitcoin', description: 'What Bitcoin is, Satoshi\'s story, and decentralization', order: 1 },
  { id: '2-how-bitcoin-works', title: 'How Bitcoin Works', description: 'Blockchain, mining, halving, nodes, and Proof-of-Work', order: 2 },
  { id: '3-bitcoin-economics', title: 'Bitcoin Economics', description: '21M limit, digital gold, inflation vs deflation, market cycles', order: 3 },
  { id: '4-security-and-technology', title: 'Security and Technology', description: 'Private keys, double-spending, wallet security, energy debate', order: 4 },
  { id: '5-bitcoin-in-the-real-world', title: 'Bitcoin in the Real World', description: 'El Salvador, unbanked, daily use, myths, regulations', order: 5 },
  { id: '6-future-of-bitcoin', title: 'The Future of Bitcoin', description: 'Lightning Network, altcoins, AI integration, 50-year outlook', order: 6 },
];

export default function FundamentalsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Bitcoin Fundamentals</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Master the essentials of Bitcoin technology, economics, and real-world use. Start here if you're new to Bitcoin, then explore Softwar for strategic insights.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>0 of {lessons.length} lessons</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/fundamentals/${lesson.id}`}>
              <Card className="transition-all hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <span className="text-sm font-bold">{lesson.order}</span>
                      </div>
                      <div>
                        <CardTitle className="mb-2">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                      </div>
                    </div>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-lg border bg-muted/50">
          <h3 className="font-semibold mb-2">Learning Path</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• <strong>New to Bitcoin?</strong> Start with Lesson 1 and work through in order</li>
            <li>• <strong>Have Bitcoin basics?</strong> Skip to Lesson 3 (Economics) or Lesson 6 (Future)</li>
            <li>• <strong>Ready for strategy?</strong> Head to the Softwar section to understand Bitcoin's strategic significance</li>
            <li>• <strong>Want to apply?</strong> Use the Journal to reflect on what you're learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
