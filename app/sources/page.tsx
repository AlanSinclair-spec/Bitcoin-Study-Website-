import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';

export default function SourcesPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Sources & License</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Attribution and licensing information for this learning platform
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Original Thesis
              </CardTitle>
              <CardDescription>
                Softwar: A Novel Theory on Power Projection and the National Strategic Significance of Bitcoin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Author:</span>
                  <span className="col-span-2">Jason P. Lowery</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Institution:</span>
                  <span className="col-span-2">MIT, System Design and Management</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Year:</span>
                  <span className="col-span-2">2023</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">License:</span>
                  <span className="col-span-2">CC BY 4.0</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Original PDF (Local)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License: Creative Commons Attribution 4.0 (CC BY 4.0)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This work is licensed under the Creative Commons Attribution 4.0 International License.
                You are free to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li><strong>Share</strong> — copy and redistribute the material in any medium or format</li>
                <li><strong>Adapt</strong> — remix, transform, and build upon the material for any purpose, even commercially</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Under the following terms:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Attribution</strong> — You must give appropriate credit, provide a link to the license,
                  and indicate if changes were made. You may do so in any reasonable manner, but not in any way
                  that suggests the licensor endorses you or your use.
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Read Full License
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attribution for This Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg text-sm font-mono">
                This learning platform is based on &quot;Softwar: A Novel Theory on Power Projection
                and the National Strategic Significance of Bitcoin&quot; by Jason P. Lowery (MIT, 2023).
                <br /><br />
                Original work licensed under CC BY 4.0:
                https://creativecommons.org/licenses/by/4.0/
                <br /><br />
                Content has been adapted for educational purposes including chapter summaries,
                flashcards, quizzes, and interactive learning features.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Critical Perspectives & Open Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This thesis presents a speculative framework. Common critiques include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Speculative Scope:</strong> The strategic significance of Bitcoin as described
                  remains largely theoretical and unproven at national scale
                </li>
                <li>
                  <strong>PoW Dependence:</strong> The framework assumes continued viability and dominance
                  of Proof-of-Work, which faces sustainability and regulatory challenges
                </li>
                <li>
                  <strong>Practicality:</strong> Implementation details for integrating PoW into national
                  security frameworks remain unclear
                </li>
                <li>
                  <strong>Centralization Risks:</strong> Hash rate concentration and mining pool dynamics
                  may undermine the decentralization assumptions
                </li>
                <li>
                  <strong>Alternative Approaches:</strong> Other consensus mechanisms and cyber security
                  strategies may provide similar benefits without PoW&apos;s resource intensity
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Students are encouraged to critically evaluate these arguments and explore counterarguments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
