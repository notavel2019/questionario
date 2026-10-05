'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { runGeoAudit } from './actions';
import type { GeoResult } from '@/lib/geo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function GeoAudit() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<GeoResult | null>(null);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    start(async () => {
      const r = await runGeoAudit(url);
      if (r.ok) setResult(r.result);
      else { setResult(null); setError(r.error); }
    });
  }

  const failed = result?.checks.filter((c) => !c.passed).sort((a, b) => b.weight - a.weight) ?? [];

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="seusite.com.br" aria-label="Endereço do site" />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Auditar GEO
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <>
          <Card>
            <CardHeader><CardTitle>Nota GEO de {result.url}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-5xl font-bold text-primary">{result.score}<span className="text-xl text-muted-foreground">/100</span></div>
              <Progress value={result.score} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {result.checks.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  {c.passed ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                  <div>
                    <p className="font-medium">{c.label} <span className="text-xs text-muted-foreground">({c.weight} pts)</span></p>
                    {!c.passed && <p className="text-sm text-muted-foreground">{c.tip}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {failed.length > 0 && (
            <p className="text-sm text-muted-foreground">Comece por: <strong>{failed[0].label}</strong>.</p>
          )}
        </>
      )}
    </div>
  );
}
