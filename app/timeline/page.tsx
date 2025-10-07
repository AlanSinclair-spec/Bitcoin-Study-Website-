import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import timeline from '@/data/timeline.json';

export default function TimelinePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Historical Timeline</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Key events in the evolution of power projection technologies
        </p>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {timeline.map((event) => (
              <div key={event.year} className="relative pl-20">
                <div className="absolute left-0 top-2 w-16 text-right">
                  <Badge variant="outline" className="w-16 justify-center">
                    {event.year}
                  </Badge>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.label}</CardTitle>
                    <CardDescription>{event.sourceSection}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
