import { CheckCircle2 } from 'lucide-react';

export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <div className="mb-2 font-semibold text-green-700 dark:text-green-300">✓ Key Takeaway</div>
          <div className="text-sm leading-relaxed text-foreground/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
