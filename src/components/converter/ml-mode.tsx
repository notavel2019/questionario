'use client';

import { authFetch } from '@/lib/client-api';
import { useState } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from './dropzone';
import { NumberLabelsToggle } from './number-labels-toggle';
import { ResultPanel, type ConversionResult } from './result-panel';

export function MercadoLivreMode({
  onLimitExceeded,
  onConverted,
}: {
  onLimitExceeded: (resetAt: string) => void;
  onConverted: () => void;
}) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numberLabels, setNumberLabels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleConvert() {
    if (!pdfFile) {
      setResult({ status: 'error', message: 'Envie o PDF de etiquetas baixado do painel do Mercado Livre.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('numberLabels', String(numberLabels));

      const res = await authFetch('/api/convert/ml', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.status === 429) {
        onLimitExceeded(data.resetAt);
        return;
      }
      if (!res.ok) {
        setResult({ status: 'error', message: data.message ?? 'Erro ao converter.' });
        return;
      }

      setResult({ status: 'success', labelPdfBase64: data.pdfBase64, labelFilename: 'etiquetas-mercado-livre.pdf' });
      onConverted();
    } catch {
      setResult({ status: 'error', message: 'Falha de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Dropzone
        label="PDF de etiquetas do Mercado Livre"
        hint="Apenas .pdf, máx 50MB (arquivo tipo XXXXXXXX_labels.pdf)"
        accept=".pdf"
        file={pdfFile}
        onChange={setPdfFile}
      />

      <NumberLabelsToggle checked={numberLabels} onCheckedChange={setNumberLabels} />

      <Button onClick={handleConvert} disabled={loading} className="w-full gap-2 sm:w-auto" size="lg">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageSearch className="h-4 w-4" />}
        {loading ? 'Convertendo...' : 'Converter para PDF'}
      </Button>

      {result && <ResultPanel result={result} onReset={() => setResult(null)} />}
    </div>
  );
}
