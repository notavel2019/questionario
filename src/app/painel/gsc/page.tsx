import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGscData } from '@/lib/gsc';

const erros: Record<string, string> = {
  estado: 'A verificação de segurança do login falhou. Tente de novo.',
  sem_refresh: 'O Google não devolveu permissão offline. Remova o acesso do app na sua conta Google e conecte de novo.',
  token: 'Não foi possível concluir o login com o Google.',
};

export default async function GscPage({ searchParams }: { searchParams: { site?: string; erro?: string } }) {
  const data = await getGscData(searchParams.site);
  const rows = [...data.rows].sort((a, b) => b.impressions - a.impressions);
  const erro = data.error ?? (searchParams.erro ? erros[searchParams.erro] : undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meu site no Google</h1>
          <p className="text-muted-foreground">Consultas do Search Console (28 dias). Posições 11–20 são &quot;quase lá&quot;.</p>
        </div>
        {data.source === 'real' ? (
          <form action="/api/auth/logout" method="post" className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{data.email}</span>
            <Button variant="outline" size="sm" type="submit">Desconectar</Button>
          </form>
        ) : data.configured ? (
          <Button asChild><a href="/api/auth/google">Conectar Search Console</a></Button>
        ) : null}
      </div>

      {erro && <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}

      {!data.configured && (
        <div className="rounded-md border p-4 text-sm">
          <p className="font-semibold">Conexão com o Google ainda não configurada.</p>
          <p className="text-muted-foreground">Defina GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET e APP_URL (veja <code>.env.example</code>). Enquanto isso, os dados abaixo são de demonstração.</p>
        </div>
      )}
      {data.configured && data.source === 'demo' && !erro && (
        <p className="text-sm text-muted-foreground">Mostrando dados de demonstração. Conecte sua conta para ver os dados reais.</p>
      )}

      {data.sites.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {data.sites.map((s) => (
            <Button key={s} asChild size="sm" variant={s === data.site ? 'default' : 'outline'}>
              <Link href={`/painel/gsc?site=${encodeURIComponent(s)}`}>{s}</Link>
            </Button>
          ))}
        </div>
      )}
      {data.source === 'real' && data.site && <p className="text-sm">Propriedade: <strong>{data.site}</strong></p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consulta</TableHead><TableHead className="text-right">Cliques</TableHead>
            <TableHead className="text-right">Impressões</TableHead><TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">Posição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.query}>
              <TableCell>{r.query} {r.position > 10 && r.position <= 20 && <Badge className="ml-2">Quase lá</Badge>}</TableCell>
              <TableCell className="text-right">{r.clicks}</TableCell>
              <TableCell className="text-right">{r.impressions}</TableCell>
              <TableCell className="text-right">{r.ctr}%</TableCell>
              <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sem dados no período.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
