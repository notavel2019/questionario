'use client';

import { authFetch } from '@/lib/client-api';
import { useState } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from './dropzone';
import { NumberLabelsToggle } from './number-labels-toggle';
import { ResultPanel, type ConversionResult } from './result-panel';

export function TiktokMode({
  onLimitExceeded,
  onConverted,
}: {
  onLimitExceeded: (resetAt: string) => void;
  onConverted: () => void;
}) {
  const [labelFile, setLabelFile] = useState<File | null>(null);
  const [nfeFile, setNfeFile] = useState<File | null>(null);
  const [numberLabels, setNumberLabels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleConvert() {
    if (!labelFile) {
      setResult({ status: 'error', message: 'Envie o PDF "Shipping label + Packing slip" do Seller Center.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('labelFile', labelFile);
      if (nfeFile) formData.append('nfeFile', nfeFile);
      formData.append('numberLabels', String(numberLabels));

      const res = await authFetch('/api/convert/tiktok', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.status === 429) {
        onLimitExceeded(data.resetAt);
        return;
      }
      if (!res.ok) {
        setResult({ status: 'error', message: data.message ?? 'Erro ao converter.' });
        return;
      }

      setResult({
        status: 'success',
        labelPdfBase64: data.pdfBase64,
        labelFilename: 'etiquetas-tiktok-shop.pdf',
        warning: data.warning,
        info: nfeFile
          ? `${data.matchedCount} de ${data.totalLabels} etiqueta(s) casada(s) com a NF-e.`
          : `${data.totalLabels} etiqueta(s) convertida(s).`,
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
        label='PDF "Shipping label + Packing slip"'
        hint="Apenas .pdf, máx 50MB"
        accept=".pdf"
        file={labelFile}
        onChange={setLabelFile}
      />

      <Dropzone
        label="PDF de NF-e"
        hint="Apenas .pdf, máx 50MB — casado pelo código de rastreio"
        accept=".pdf"
        file={nfeFile}
        onChange={setNfeFile}
        optional
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
