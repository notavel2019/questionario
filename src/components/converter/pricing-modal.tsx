'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ExternalLink, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCaktoCheckoutUrl } from '@/lib/billing/cakto';
import { useAuth } from '@/hooks/use-auth';

function useCountdown(target: string | null) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setLabel('00:00:00');
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setLabel(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return label;
}

export function PricingModal({
  open,
  onOpenChange,
  resetAt,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetAt: string | null;
  reason: 'limit' | 'upgrade';
}) {
  const countdown = useCountdown(resetAt);
  const { user } = useAuth();
  const checkoutUrl = getCaktoCheckoutUrl();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            {reason === 'limit' ? 'Limite diário atingido' : 'Plano ilimitado'}
          </DialogTitle>
          <DialogDescription>
            {reason === 'limit'
              ? 'Você já usou suas 3 conversões grátis de hoje.'
              : 'Converta etiquetas sem limite, com histórico e suporte prioritário.'}
          </DialogDescription>
        </DialogHeader>

        {reason === 'limit' && countdown && (
          <div className="flex items-center justify-center gap-2 rounded-md bg-muted py-3 text-lg font-mono font-semibold">
            <Clock className="h-5 w-5 text-muted-foreground" />
            {countdown}
          </div>
        )}

        <div className="space-y-2 rounded-lg border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Plano ilimitado mensal</span>
            <span className="text-2xl font-bold">
              R$ 9,90 <span className="text-sm font-normal text-muted-foreground">na 1ª assinatura</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Depois, R$ 19,90/mês. Cancele quando quiser. Pagamento via PIX, cartão ou boleto.
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {['Conversões ilimitadas todos os dias', 'Histórico de conversões', 'Suporte prioritário'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {user?.email && (
          <p className="text-xs text-muted-foreground">
            Use o e-mail <span className="font-medium text-foreground">{user.email}</span> na hora de pagar — é
            assim que liberamos o plano na sua conta automaticamente.
          </p>
        )}

        {!checkoutUrl && (
          <p className="text-sm text-destructive">
            Checkout ainda não configurado. Defina NEXT_PUBLIC_CAKTO_CHECKOUT_URL com o link do produto na Cakto.
          </p>
        )}

        <DialogFooter>
          {checkoutUrl ? (
            <Button asChild className="w-full gap-2">
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                <Sparkles className="h-4 w-4" />
                Assinar na Cakto
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <Button disabled className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Assinar na Cakto
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
