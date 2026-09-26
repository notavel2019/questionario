'use client';

import { authFetch } from '@/lib/client-api';
import { useState } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NumberLabelsToggle } from './number-labels-toggle';
import { ResultPanel, type ConversionResult } from './result-panel';

export function MlFullMode({
  onLimitExceeded,
  onConverted,
}: {
  onLimitExceeded: (resetAt: string) => void;
  onConverted: () => void;
}) {
  const [pastedZpl, setPastedZpl] = useState('');
  const [numberLabels, setNumberLabels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleConvert() {
    if (!pastedZpl.trim()) {
      setResult({ status: 'error', message: 'Cole o código ZPL da etiqueta Full ML (8x2,5cm).' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('zplText', pastedZpl.trim());
      formData.append('numberLabels', String(numberLabels));

      const res = await authFetch('/api/convert/ml-full', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.status === 429) {
        onLimitExceeded(data.resetAt);
        return;
      }
      if (!res.ok) {
        setResult({ status: 'error', message: data.message ?? 'Erro ao converter.' });
        return;
      }

      setResult({ status: 'success', labelPdfBase64: data.pdfBase64, labelFilename: 'etiquetas-full-ml.pdf' });
      onConverted();
    } catch {
      setResult({ status: 'error', message: 'Falha de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Colar ZPL da etiqueta Full ML (8×2,5cm)</label>
        <Textarea
          rows={8}
          placeholder="^XA^FO20,20^A0N,25,25^FDFULL^FS^XZ"
          value={pastedZpl}
          onChange={(e) => setPastedZpl(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      <NumberLabelsToggle checked={numberLabels} onCheckedChange={setNumberLabels} />

      <Button onClick={handleConvert} disabled={loading} className="w-full gap-2 sm:w-auto" size="lg">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageSearch className="h-4 w-4" />}
        {loading ? 'Convertendo...' : 'Converter para PDF'}
      </Button>

      {result && <ResultPanel result={result} onReset={() => setResult(null)} />}
    </div>
  );
}
