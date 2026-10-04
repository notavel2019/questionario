import Link from 'next/link';
import { APP_NAME, panelNav } from '@/lib/content';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-bold text-primary">{APP_NAME}</Link>
          <span className="rounded bg-accent/10 px-2 py-1 text-xs text-accent">Dados de demonstração (exceto Nota GEO)</span>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {panelNav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm hover:bg-secondary">{n.label}</Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
