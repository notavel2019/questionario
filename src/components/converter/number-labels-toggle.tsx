'use client';

import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function NumberLabelsToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch id="number-labels" checked={checked} onCheckedChange={onCheckedChange} />
      <label htmlFor="number-labels" className="text-sm font-medium">
        Numerar pedidos
      </label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 cursor-help text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              Imprime um número sequencial no canto de cada etiqueta (formato 12/28), útil para conferir se todas
              foram impressas. A NF-e nunca é numerada.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
