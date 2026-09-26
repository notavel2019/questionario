'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pix, setPix] = useState<{ qrCode?: string; ticketUrl?: string } | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/billing/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isFirstSubscription: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.message ?? 'Não foi possível iniciar a assinatura agora.');
        return;
      }
      setPix({ qrCode: data.qrCode, ticketUrl: data.ticketUrl });
    } catch {
      setCheckoutError('Falha de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

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
          <p className="text-xs text-muted-foreground">Depois, R$ 19,90/mês. Cancele quando quiser. Pagamento via PIX.</p>
          <ul className="mt-2 space-y-1 text-sm">
            {['Conversões ilimitadas todos os dias', 'Histórico de conversões', 'Suporte prioritário'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {!pix ? (
          <div className="space-y-2">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {checkoutError && <p className="text-sm text-destructive">{checkoutError}</p>}
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-sm">Escaneie o QR Code do PIX ou copie o código para pagar:</p>
            {pix.qrCode && (
              <code className="block max-h-24 overflow-auto rounded bg-muted p-2 text-left text-xs break-all">
                {pix.qrCode}
              </code>
            )}
          </div>
        )}

        <DialogFooter>
          {!pix && (
            <Button onClick={handleSubscribe} disabled={loading || !email} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? 'Gerando cobrança PIX...' : 'Assinar com PIX'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
