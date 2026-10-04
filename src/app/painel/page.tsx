import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { keywords, apiUsage } from '@/lib/demo-data';
import { getGscData } from '@/lib/gsc';

export default async function Overview() {
  const gsc = await getGscData();
  const gscQueries = gsc.rows;
  const nearly = gscQueries.filter((q) => q.position > 10 && q.position <= 20).length;
  const clicks = gscQueries.reduce((s, q) => s + q.clicks, 0);
  const cards = [
    { href: '/painel/gsc', title: String(clicks), desc: 'Cliques nas buscas (28 dias)' },
    { href: '/painel/gsc', title: String(nearly), desc: 'Consultas quase na 1ª página' },
    { href: '/painel/palavras', title: String(keywords.length), desc: 'Palavras-chave monitoradas' },
    { href: '/painel/palavras', title: `US$${apiUsage.spent.toFixed(2)}`, desc: `de US$${apiUsage.budget} de API no mês` },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão geral</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.desc} href={c.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader><CardTitle className="text-3xl text-primary">{c.title}</CardTitle><CardDescription>{c.desc}</CardDescription></CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          Rode a <Link href="/painel/geo" className="font-semibold text-primary underline">auditoria GEO</Link> do seu site para ver sua nota de 0 a 100.
        </CardContent>
      </Card>
    </div>
  );
}
