'use server';

import { z } from 'zod';

const formSchema = z.object({
  companyName: z.string(),
  city: z.string(),
  clients: z.string(),
  needs: z.string(),
  unique: z.string(),
  benefits: z.string(),
  visualId: z.string(),
  services: z.string(),
  pricing: z.string(),
  social: z.string(),
  scheduling: z.string(),
  referenceSite: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export async function generateWhatsAppMessage(values: FormValues) {
  try {
    const validatedData = formSchema.parse(values);

    const message = `
*📝 Novo Briefing de Projeto Web 📝*

*Empresa e Atividade:*
${validatedData.companyName}

*Localização:*
${validatedData.city}

*Principais Clientes:*
${validatedData.clients}

*Necessidades Atendidas:*
${validatedData.needs}

*Diferenciais:*
${validatedData.unique}

*Principais Benefícios:*
${validatedData.benefits}

*Identidade Visual:*
${validatedData.visualId}

*Produtos/Serviços:*
${validatedData.services}

*Preços e Pagamento:*
${validatedData.pricing}

*Redes Sociais/Site:*
${validatedData.social}

*Ferramenta de Agendamento:*
${validatedData.scheduling}

*Site de Referência:*
${validatedData.referenceSite || 'Nenhum'}
    `.trim();

    return { success: true, message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Erro de validação nos dados do formulário.' };
    }
    return { success: false, message: 'Ocorreu um erro ao gerar a mensagem.' };
  }
}
