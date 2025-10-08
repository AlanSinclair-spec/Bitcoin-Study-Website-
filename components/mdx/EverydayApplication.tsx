import { Lightbulb } from 'lucide-react';

export function EverydayApplication({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="mb-2 font-semibold text-primary">💡 Everyday Application</div>
          <div className="text-sm leading-relaxed text-foreground/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
