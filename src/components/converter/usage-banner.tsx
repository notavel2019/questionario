'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UsageStatus } from '@/hooks/use-usage';

export function UsageBanner({
  usage,
  onUpgradeClick,
}: {
  usage: UsageStatus | null;
  onUpgradeClick: () => void;
}) {
  if (!usage || usage.isPaid) {
    return usage?.isPaid ? (
      <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
        <Sparkles className="h-4 w-4" />
        Plano ilimitado ativo — converta à vontade.
      </div>
    ) : null;
  }

  const remaining = Math.max(0, usage.limit - usage.used);

  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Você usou <span className="font-semibold text-foreground">{usage.used} de {usage.limit}</span>{' '}
        conversões grátis hoje
        {remaining === 0 ? '.' : ` (restam ${remaining}).`}
      </p>
      <Button size="sm" variant="outline" onClick={onUpgradeClick} className="gap-1.5">
        <Sparkles className="h-4 w-4" />
        Assinar plano ilimitado
      </Button>
    </div>
  );
}
