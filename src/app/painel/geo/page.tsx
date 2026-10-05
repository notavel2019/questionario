import { GeoAudit } from './geo-audit';

export default function GeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nota GEO</h1>
        <p className="text-muted-foreground">Quão fácil é para ChatGPT, Gemini e Perplexity citarem o seu site.</p>
      </div>
      <GeoAudit />
    </div>
  );
}
