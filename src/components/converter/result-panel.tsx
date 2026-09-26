'use client';

import { AlertTriangle, CheckCircle2, Download, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadBase64Pdf } from '@/lib/download';

export type ConversionSuccess = {
  status: 'success';
  labelPdfBase64: string;
  labelFilename: string;
  pickingListPdfBase64?: string | null;
  pickingListFilename?: string;
  warning?: string | null;
  info?: string | null;
};

export type ConversionError = { status: 'error'; message: string };

export type ConversionResult = ConversionSuccess | ConversionError;

export function ResultPanel({ result, onReset }: { result: ConversionResult; onReset: () => void }) {
  if (result.status === 'error') {
    return (
      <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Não foi possível converter</p>
            <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={onReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Converter outro arquivo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-medium">Conversão concluída!</p>
          {result.info && <p className="mt-1 text-sm text-muted-foreground">{result.info}</p>}

          {result.warning && (
            <div className="mt-2 flex items-start gap-2 rounded-md bg-amber-500/10 p-2.5 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {result.warning}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => downloadBase64Pdf(result.labelPdfBase64, result.labelFilename)}
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            {result.pickingListPdfBase64 && (
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                onClick={() =>
                  downloadBase64Pdf(result.pickingListPdfBase64!, result.pickingListFilename ?? 'lista-separacao.pdf')
                }
              >
                <Download className="h-4 w-4" />
                Baixar lista de separação
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={onReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Converter outro arquivo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
