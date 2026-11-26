import { z } from 'zod';

export const AREAS = [
  { key: 'financeiro', label: 'Área financeira', prompt: 'Quais são seus pedidos e projetos para 2027?' },
  { key: 'sentimental', label: 'Área sentimental', prompt: 'Quais são seus sonhos e pedidos para sua vida sentimental em 2027?' },
  { key: 'familiar', label: 'Área familiar', prompt: 'Quais são seus pedidos de oração pela sua família para 2027?' },
  { key: 'espiritual', label: 'Área espiritual', prompt: 'Quais são seus pedidos de oração e seus propósitos espirituais para 2027?' },
  { key: 'saude', label: 'Área física — saúde e cura', prompt: 'Quais são seus pedidos de oração relacionados à saúde, cura e bem-estar para 2027?' },
] as const;

export type AreaKey = (typeof AREAS)[number]['key'];

export const prayerSchema = z
  .object({
    whatsapp: z
      .string()
      .trim()
      .min(1, 'Informe seu WhatsApp com código do país e DDD.')
      .regex(/^\+?[\d\s()-]{10,20}$/, 'Use apenas números, com código do país e DDD.'),
    fullName: z.string().trim().min(3, 'Informe seu nome completo.').max(120),
    financeiro: z.string().max(2000),
    sentimental: z.string().max(2000),
    familiar: z.string().max(2000),
    espiritual: z.string().max(2000),
    saude: z.string().max(2000),
    especiais: z.string().max(2000),
  })
  .refine(
    (d) => AREAS.some((a) => d[a.key].trim().length > 0) || d.especiais.trim().length > 0,
    { message: 'Preencha pelo menos uma área ou pedido especial.', path: ['financeiro'] },
  );

export type PrayerValues = z.output<typeof prayerSchema>;
