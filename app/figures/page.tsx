import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import figures from '@/data/figures.json';

export default function FiguresPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">Figures & Tables</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Visual aids and data tables referenced in the thesis
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {figures.map((figure) => (
            <Card key={figure.id} id={figure.id}>
              <CardHeader>
                <CardTitle className="text-sm font-mono">{figure.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Figure Placeholder</span>
                </div>
                <p className="text-sm mb-3">{figure.caption}</p>
                <Link href={`/learn/${figure.chapterGuess}`}>
                  <Badge variant="secondary" className="cursor-pointer">
                    {figure.chapterGuess}
                  </Badge>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
