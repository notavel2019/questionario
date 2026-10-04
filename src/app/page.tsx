import Link from 'next/link';
import { Search, Users, Bot, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { APP_NAME, hero, problem, steps, benefits, faq } from '@/lib/content';

const icons = { search: Search, users: Users, bot: Bot, wallet: Wallet };

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <span className="text-lg font-bold text-primary">{APP_NAME}</span>
        <Button asChild variant="outline"><Link href="/painel">Entrar no painel</Link></Button>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">{hero.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{hero.subtitle}</p>
        <Button asChild size="lg" className="mt-8"><Link href="/painel/geo">{hero.cta}</Link></Button>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">{problem.title}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {problem.items.map((p, i) => (
            <Card key={p.name} className={i === 2 ? 'border-primary' : ''}>
              <CardHeader className="text-center">
                <CardDescription>{p.name}</CardDescription>
                <CardTitle className={i === 2 ? 'text-primary' : ''}>{p.price}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Como funciona</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title}>
              <CardHeader>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">{i + 1}</div>
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>{s.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => {
            const Icon = icons[b.icon];
            return (
              <Card key={b.title}>
                <CardHeader>
                  <Icon className="mb-2 h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{b.title}</CardTitle>
                  <CardDescription>{b.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Perguntas frequentes</h2>
        <Accordion type="single" collapsible>
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">© {APP_NAME}</footer>
    </main>
  );
}
