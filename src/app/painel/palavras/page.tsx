import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { keywords, apiUsage } from '@/lib/demo-data';

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Palavras-chave e concorrentes</h1>
        <p className="text-muted-foreground">Sua posição versus a do principal concorrente em cada termo.</p>
      </div>
      <div className="max-w-sm space-y-1">
        <p className="text-sm">Uso de API no mês: US${apiUsage.spent.toFixed(2)} de US${apiUsage.budget}</p>
        <Progress value={(apiUsage.spent / apiUsage.budget) * 100} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Palavra-chave</TableHead><TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">Dificuldade</TableHead><TableHead className="text-right">CPC (US$)</TableHead>
            <TableHead className="text-right">Você</TableHead><TableHead>Concorrente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((k) => (
            <TableRow key={k.keyword}>
              <TableCell>{k.keyword}</TableCell>
              <TableCell className="text-right">{k.volume.toLocaleString('pt-BR')}</TableCell>
              <TableCell className="text-right">{k.difficulty}</TableCell>
              <TableCell className="text-right">{k.cpc.toFixed(2)}</TableCell>
              <TableCell className="text-right">{k.you ?? '—'}</TableCell>
              <TableCell>{k.competitor.name} (#{k.competitor.position})</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
