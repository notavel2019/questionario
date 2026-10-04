import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { gscQueries } from '@/lib/demo-data';

export default function GscPage() {
  const rows = [...gscQueries].sort((a, b) => b.impressions - a.impressions);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu site no Google</h1>
        <p className="text-muted-foreground">Consultas do Search Console. Posições 11–20 são &quot;quase lá&quot;.</p>
      </div>
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
        </TableBody>
      </Table>
    </div>
  );
}
