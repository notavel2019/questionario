'use client';

import { authFetch } from '@/lib/client-api';
import { useState } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dropzone } from './dropzone';
import { NumberLabelsToggle } from './number-labels-toggle';
import { ResultPanel, type ConversionResult } from './result-panel';

export function ShopeeMode({
  onLimitExceeded,
  onConverted,
}: {
  onLimitExceeded: (resetAt: string) => void;
  onConverted: () => void;
}) {
  const [zplFile, setZplFile] = useState<File | null>(null);
  const [pastedZpl, setPastedZpl] = useState('');
  const [packingList, setPackingList] = useState<File | null>(null);
  const [numberLabels, setNumberLabels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleConvert() {
    if (!zplFile && !pastedZpl.trim()) {
      setResult({ status: 'error', message: 'Envie o ZIP/TXT da Shopee ou cole o código ZPL.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      if (zplFile) formData.append('zplFile', zplFile);
      if (pastedZpl.trim()) formData.append('zplText', pastedZpl.trim());
      if (packingList) formData.append('packingList', packingList);
      formData.append('numberLabels', String(numberLabels));

      const res = await authFetch('/api/convert/shopee', { method: 'POST', body: formData });
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
        labelPdfBase64: data.labelPdfBase64,
        labelFilename: 'etiquetas-shopee.pdf',
        pickingListPdfBase64: data.pickingListPdfBase64,
        pickingListFilename: 'lista-separacao-shopee.pdf',
        warning: data.warning,
        info: `${data.labelCount} etiqueta(s) convertida(s)${
          data.pickingListPdfBase64 ? `, ${data.matchedCount} casada(s) com a planilha` : ''
        }.`,
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
        label="Arquivo da Shopee (.zip ou .txt)"
        hint="Apenas .zip ou .txt, máx 50MB"
        accept=".zip,.txt"
        file={zplFile}
        onChange={setZplFile}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium">Ou cole o ZPL aqui</label>
        <Textarea
          rows={5}
          placeholder="^XA^FO50,50^A0N,30,30^FDPedido 123456^FS^XZ"
          value={pastedZpl}
          onChange={(e) => setPastedZpl(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      <Dropzone
        label="Planilha de lista de embalagem"
        hint="Apenas .xlsx, máx 50MB"
        accept=".xlsx,.xls"
        file={packingList}
        onChange={setPackingList}
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
