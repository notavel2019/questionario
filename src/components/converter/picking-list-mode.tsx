'use client';

import { authFetch } from '@/lib/client-api';
import { useState } from 'react';
import { Loader2, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from './dropzone';
import { ResultPanel, type ConversionResult } from './result-panel';

export function PickingListMode({
  onLimitExceeded,
  onConverted,
}: {
  onLimitExceeded: (resetAt: string) => void;
  onConverted: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleConvert() {
    if (!file) {
      setResult({ status: 'error', message: 'Envie a planilha de lista de embalagem (.xlsx).' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('packingList', file);

      const res = await authFetch('/api/convert/picking-list', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.status === 429) {
        onLimitExceeded(data.resetAt);
        return;
      }
      if (!res.ok) {
        setResult({ status: 'error', message: data.message ?? 'Erro ao gerar a lista de separação.' });
        return;
      }

      setResult({
        status: 'success',
        labelPdfBase64: data.pdfBase64,
        labelFilename: 'lista-separacao.pdf',
        info: `${data.entryCount} SKU(s) agrupado(s).`,
      });
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
        label="Planilha de lista de embalagem"
        hint="Apenas .xlsx, máx 50MB"
        accept=".xlsx,.xls"
        file={file}
        onChange={setFile}
      />

      <Button onClick={handleConvert} disabled={loading} className="w-full gap-2 sm:w-auto" size="lg">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListChecks className="h-4 w-4" />}
        {loading ? 'Gerando...' : 'Gerar lista de separação'}
      </Button>

      {result && <ResultPanel result={result} onReset={() => setResult(null)} />}
    </div>
  );
}
