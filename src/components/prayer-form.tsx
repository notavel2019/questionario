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
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-rose-400/10';

const card = 'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] sm:p-7';

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-800">
        {label}
        {required && <span className="ml-1 text-amber-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Soft background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-indigo-100/70 via-sky-50/40 to-transparent" />

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Projeto de Vida 2027
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            O ano dos <span className="text-indigo-700">inabaláveis</span>
          </h1>
          <blockquote className="mx-auto mt-6 max-w-xl">
            <p className="text-[15px] leading-relaxed text-slate-600">
              “Deus é o nosso refúgio e fortaleza, socorro bem-presente na angústia. Portanto, não temeremos, ainda que a terra se transtorne…”
            </p>
            <footer className="mt-2 text-xs text-slate-500">Salmos 46:1–2</footer>
          </blockquote>
          <p className="mt-6 font-semibold text-amber-700">Ainda que tudo estremeça, permaneceremos de pé!</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            Apresente seus sonhos, projetos e pedidos de oração para 2027. Preencha somente as áreas que desejar. Seus pedidos serão
            apresentados em oração ao Senhor ao longo de 365 dias.
          </p>
        </header>

        {done ? (
          <section className={`mt-12 text-center ${card}`}>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Pedidos recebidos!</h2>
            <p className="mt-3 text-slate-600">Seus pedidos serão apresentados em oração ao Senhor ao longo de 2027. Que Deus abençoe sua vida e sua família!</p>
            <p className="mt-6 text-sm font-medium text-slate-500">Profeta Stela Wilbert</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-12 space-y-6">
            {/* Identification */}
            <section className={`space-y-5 ${card}`}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Seus dados</h2>
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
            <section className={`space-y-5 ${card}`}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Suas áreas de vida</h2>
              {AREAS.map((area) => {
                const Icon = AREA_ICONS[area.key];
                return (
                  <Field key={area.key} label={area.label} error={errors[area.key]?.message}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <textarea {...register(area.key)} rows={3} placeholder={area.prompt} className={`${inputBase} resize-y`} />
                    </div>
                  </Field>
                );
              })}
              <Field
                label="Pedidos especiais"
                hint="Algum outro sonho, propósito ou pedido de oração para apresentar ao Senhor em 2027?"
                error={errors.especiais?.message}
              >
                <textarea {...register('especiais')} rows={4} placeholder="Escreva aqui…" className={`${inputBase} resize-y`} />
              </Field>
            </section>

            {serverError && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-700/20 transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar meus pedidos
            </button>
          </form>
        )}

        {/* Voluntary offering */}
        <section className={`mt-12 text-center ${card}`}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Uma semente de amor à obra de Deus</h2>
          <p className="mt-3 font-semibold text-amber-700">“Deus ama ao que dá com alegria.”</p>
          <p className="text-xs text-slate-500">2 Coríntios 9:7</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            A oferta é totalmente voluntária e não condiciona sua participação nem seus pedidos de oração.
          </p>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <OfferCard flag="🇧🇷" title="PIX (Brasil)" value={pixKey} />
            <OfferCard flag="🇺🇸" title="Zelle (Estados Unidos)" value={zelle} />
          </div>
          <p className="mt-6 text-xs text-slate-500">Independentemente da oferta, seus pedidos serão recebidos e apresentados em oração.</p>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-500">Profeta Stela Wilbert</footer>
      </div>
    </div>
  );
}

function OfferCard({ flag, title, value }: { flag: string; title: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        {flag} {title}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code className="truncate text-sm text-slate-800">{value}</code>
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
          className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label={`Copiar ${title}`}
        >
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
