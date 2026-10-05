'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { reviews as initial, type Review } from '@/lib/demo-data';
import { suggestReply } from '@/lib/review-reply';

type Filter = 'todas' | 'pendentes' | 'baixas';

export function ReviewsBoard() {
  const [items, setItems] = useState<Review[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>('pendentes');

  const avg = items.reduce((s, r) => s + r.stars, 0) / items.length;
  const pending = items.filter((r) => !r.reply).length;
  const shown = items.filter((r) =>
    filter === 'pendentes' ? !r.reply : filter === 'baixas' ? r.stars <= 3 : true,
  );

  const publish = (id: string) => {
    const text = drafts[id]?.trim();
    if (!text) return;
    setItems((cur) => cur.map((r) => (r.id === id ? { ...r, reply: text } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-3xl text-primary">{avg.toFixed(1)} ★</CardTitle><p className="text-sm text-muted-foreground">Nota média</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl text-primary">{items.length}</CardTitle><p className="text-sm text-muted-foreground">Avaliações</p></CardHeader></Card>
        <Card><CardHeader><CardTitle className="text-3xl text-primary">{pending}</CardTitle><p className="text-sm text-muted-foreground">Sem resposta</p></CardHeader></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['pendentes', 'baixas', 'todas'] as Filter[]).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
            {f === 'pendentes' ? 'Sem resposta' : f === 'baixas' ? 'Até 3 estrelas' : 'Todas'}
          </Button>
        ))}
      </div>

      {shown.length === 0 && <p className="text-muted-foreground">Nada por aqui.</p>}

      {shown.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">{r.author}</CardTitle>
              <span className="text-xs text-muted-foreground">{new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex" aria-label={`${r.stars} de 5 estrelas`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{r.text}</p>
            {r.reply ? (
              <div className="rounded-md bg-secondary p-3 text-sm">
                <Badge variant="outline" className="mb-1">Sua resposta</Badge>
                <p>{r.reply}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  rows={3}
                  placeholder="Escreva a resposta ou peça uma sugestão"
                  value={drafts[r.id] ?? ''}
                  onChange={(e) => setDrafts({ ...drafts, [r.id]: e.target.value })}
                />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDrafts({ ...drafts, [r.id]: suggestReply(r.author, r.stars, r.text) })}>
                    Sugerir resposta
                  </Button>
                  <Button size="sm" disabled={!drafts[r.id]?.trim()} onClick={() => publish(r.id)}>
                    Publicar resposta
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
