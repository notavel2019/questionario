import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gscQueries, keywords } from '@/lib/demo-data';

export default function PlanPage() {
  const tasks = [
    ...gscQueries
      .filter((q) => q.position > 10 && q.position <= 20)
      .map((q) => ({
        score: q.impressions / q.position,
        title: `Reforçar a página para "${q.query}"`,
        why: `Está na posição ${q.position.toFixed(1)} com ${q.impressions} impressões: pequeno ajuste pode levar à 1ª página.`,
      })),
    ...keywords
      .filter((k) => k.you === null)
      .map((k) => ({
        score: k.volume / (k.difficulty + 1),
        title: `Criar conteúdo para "${k.keyword}"`,
        why: `Volume ${k.volume}, dificuldade ${k.difficulty}, e o concorrente já está na posição ${k.competitor.position}.`,
      })),
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plano de ação</h1>
        <p className="text-muted-foreground">Tarefas ordenadas por impacto. A geração com Claude entra na próxima etapa.</p>
      </div>
      {tasks.map((t, i) => (
        <Card key={t.title}>
          <CardHeader><CardTitle className="text-base">{i + 1}. {t.title}</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t.why}</CardContent>
        </Card>
      ))}
    </div>
  );
}
