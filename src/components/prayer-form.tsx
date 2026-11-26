'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet, Heart, House, BookOpen, HeartPulse, Sparkles, CheckCircle2, Loader2, Copy } from 'lucide-react';
import { AREAS, prayerSchema, type PrayerValues } from '@/lib/prayer-schema';
import { submitPrayerRequest } from '@/app/actions';

const AREA_ICONS = {
  financeiro: Wallet,
  sentimental: Heart,
  familiar: House,
  espiritual: BookOpen,
  saude: HeartPulse,
} as const;

const inputBase =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-slate-100 placeholder:text-slate-500 transition focus:border-amber-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-amber-400/10 aria-[invalid=true]:border-rose-400/70';

function Field({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="ml-1 text-amber-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}

export function PrayerForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrayerValues>({
    resolver: zodResolver(prayerSchema),
    defaultValues: { whatsapp: '', fullName: '', financeiro: '', sentimental: '', familiar: '', espiritual: '', saude: '', especiais: '' },
  });

  const onSubmit = (values: PrayerValues) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitPrayerRequest(values);
      if (res.ok) setDone(true);
      else setServerError(res.error);
    });
  };

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY ?? 'Chave PIX a configurar';
  const zelle = process.env.NEXT_PUBLIC_ZELLE_EMAIL ?? 'E-mail Zelle a configurar';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070d1a] text-slate-100">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[480px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium tracking-wide text-amber-300">
            <Sparkles className="h-3.5 w-3.5" /> Projeto de Vida 2027
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            O ano dos <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">inabaláveis</span>
          </h1>
          <blockquote className="mx-auto mt-6 max-w-xl border-l-0 text-slate-300">
            <p className="text-[15px] leading-relaxed">
              “Deus é o nosso refúgio e fortaleza, socorro bem-presente na angústia. Portanto, não temeremos, ainda que a terra se transtorne…”
            </p>
            <footer className="mt-2 text-xs text-slate-500">Salmos 46:1–2</footer>
          </blockquote>
          <p className="mt-6 font-medium text-amber-200">Ainda que tudo estremeça, permaneceremos de pé!</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
            Apresente seus sonhos, projetos e pedidos de oração para 2027. Preencha somente as áreas que desejar. Seus pedidos serão
            apresentados em oração ao Senhor ao longo de 365 dias.
          </p>
        </header>

        {done ? (
          <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h2 className="mt-4 text-2xl font-semibold">Pedidos recebidos!</h2>
            <p className="mt-3 text-slate-400">Seus pedidos serão apresentados em oração ao Senhor ao longo de 2027. Que Deus abençoe sua vida e sua família!</p>
            <p className="mt-6 text-sm text-slate-500">Profeta Stela Wilbert</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-12 space-y-6">
            {/* Identification */}
            <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur sm:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Seus dados</h2>
              <Field label="Qual é o seu WhatsApp com código do país e DDD?" required error={errors.whatsapp?.message}>
                <input
                  {...register('whatsapp')}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+55 11 99999-9999"
                  aria-invalid={!!errors.whatsapp}
                  className={inputBase}
                />
              </Field>
              <Field label="Qual é o seu nome completo?" required error={errors.fullName?.message}>
                <input {...register('fullName')} autoComplete="name" placeholder="Seu nome completo" aria-invalid={!!errors.fullName} className={inputBase} />
              </Field>
            </section>

            {/* Areas */}
            <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur sm:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Suas áreas de vida</h2>
              {AREAS.map((area) => {
                const Icon = AREA_ICONS[area.key];
                return (
                  <Field key={area.key} label={area.label} error={errors[area.key]?.message}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <textarea
                        {...register(area.key)}
                        rows={3}
                        placeholder={area.prompt}
                        className={`${inputBase} resize-y`}
                      />
                    </div>
                  </Field>
                );
              })}
              <Field label="Pedidos especiais" hint="Algum outro sonho, propósito ou pedido de oração para apresentar ao Senhor em 2027?" error={errors.especiais?.message}>
                <textarea {...register('especiais')} rows={4} placeholder="Escreva aqui…" className={`${inputBase} resize-y`} />
              </Field>
            </section>

            {serverError && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{serverError}</p>}

            <button
              type="submit"
              disabled={pending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar meus pedidos
            </button>
          </form>
        )}

        {/* Voluntary offering */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Uma semente de amor à obra de Deus</h2>
          <p className="mt-3 font-medium text-amber-200">“Deus ama ao que dá com alegria.”</p>
          <p className="text-xs text-slate-500">2 Coríntios 9:7</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            A oferta é totalmente voluntária e não condiciona sua participação nem seus pedidos de oração.
          </p>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <OfferCard flag="🇧🇷" title="PIX (Brasil)" value={pixKey} />
            <OfferCard flag="🇺🇸" title="Zelle (Estados Unidos)" value={zelle} />
          </div>
          <p className="mt-6 text-xs text-slate-500">Independentemente da oferta, seus pedidos serão recebidos e apresentados em oração.</p>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-600">Profeta Stela Wilbert</footer>
      </div>
    </div>
  );
}

function OfferCard({ flag, title, value }: { flag: string; title: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-medium text-slate-400">
        {flag} {title}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code className="truncate text-sm text-slate-100">{value}</code>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard indisponível: o valor continua visível */
            }
          }}
          className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
          aria-label={`Copiar ${title}`}
        >
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
