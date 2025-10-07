import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const glossaryTerms = [
  {
    term: 'Bitpower',
    definition:
      'The strategic power projection capability derived from controlling or accumulating hash rate in Proof-of-Work systems.',
    chapters: ['executive-summary'],
  },
  {
    term: 'Proof-of-Work (PoW)',
    definition:
      'A consensus mechanism requiring computational work to validate transactions, imposing physical costs on cyber operations through energy and hardware expenditure.',
    chapters: ['executive-summary', 'ch1'],
  },
  {
    term: 'Softwar',
    definition:
      'The projection of power through Proof-of-Work systems that impose real physical costs on cyber operations, bridging physical and digital domains.',
    chapters: ['executive-summary'],
  },
  {
    term: 'Electro-Cyber Dome',
    definition:
      'A defensive perimeter established through accumulated hash power that protects a PoW network from attack, analogous to military defensive systems.',
    chapters: ['executive-summary'],
  },
  {
    term: 'Power Projection',
    definition:
      'The capacity of a state to deploy and sustain forces outside its territory to accomplish strategic objectives.',
    chapters: ['ch1'],
  },
  {
    term: 'Hash Rate',
    definition:
      'The computational power dedicated to mining and securing a Proof-of-Work blockchain, measured in hashes per second.',
    chapters: ['executive-summary'],
  },
  {
    term: 'Byzantine Generals Problem',
    definition:
      'A distributed consensus problem where actors must agree on strategy despite unreliable communication and potential traitors.',
    chapters: ['executive-summary'],
  },
  {
    term: 'Physical Cost Gap',
    definition:
      'The absence of physical constraints in traditional cyberspace operations, where code can be copied infinitely at near-zero cost.',
    chapters: ['ch1'],
  },
];

export default function GlossaryPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Glossary</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Key terms and concepts from the Softwar thesis
        </p>

        <div className="space-y-4">
          {glossaryTerms.map((item) => (
            <Card key={item.term}>
              <CardHeader>
                <CardTitle className="text-xl">{item.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.definition}</p>
                <div className="flex flex-wrap gap-2">
                  {item.chapters.map((chapter) => (
                    <Link key={chapter} href={`/learn/${chapter}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {chapter}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
