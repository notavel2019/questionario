"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Building2, Briefcase, Calendar, CircleDollarSign, HeartHandshake,
  Loader2, MapPin, Palette, Send, Share2, Sparkles, ThumbsUp, Users, Globe, Copy, MessageCircle
} from 'lucide-react';

import { generateWhatsAppMessage } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

const formSchema = z.object({
  companyName: z.string().min(1, 'O nome da empresa é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  clients: z.string().min(1, 'A descrição dos clientes é obrigatória.'),
  needs: z.string().min(1, 'A descrição das necessidades é obrigatória.'),
  unique: z.string().min(1, 'A descrição dos diferenciais é obrigatória.'),
  benefits: z.string().min(1, 'A descrição dos benefícios é obrigatória.'),
  visualId: z.string().min(1, 'A identidade visual é obrigatória.'),
  services: z.string().min(1, 'A descrição dos serviços é obrigatória.'),
  pricing: z.string().min(1, 'A informação sobre preços é obrigatória.'),
  social: z.string().min(1, 'As redes sociais são obrigatórias.'),
  scheduling: z.string().min(1, 'A ferramenta de agendamento é obrigatória.'),
  referenceSite: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'companyName', label: 'Nome da sua empresa e o que ela faz?', placeholder: 'Ex: Notável Mídia. Somos uma agência de marketing digital...', icon: Building2, type: 'textarea' },
  { name: 'city', label: 'Em que cidade ela está localizada?', placeholder: 'Ex: São Paulo, SP', icon: MapPin, type: 'input' },
  { name: 'clients', label: 'Quem são seus principais clientes?', placeholder: 'Ex: Pequenas e médias empresas do setor de serviços.', icon: Users, type: 'textarea' },
  { name: 'needs', label: 'Quais necessidades ou desejos seus produtos/serviços atendem?', placeholder: 'Ex: Ajudamos empresas a terem uma presença online profissional.', icon: HeartHandshake, type: 'textarea' },
  { name: 'unique', label: 'O que torna seus produtos ou serviços únicos?', placeholder: 'Ex: Nosso atendimento personalizado e foco em resultados.', icon: Sparkles, type: 'textarea' },
  { name: 'benefits', label: 'Quais são os principais benefícios que você oferece?', placeholder: 'Ex: Aumento da visibilidade da marca, mais leads qualificados.', icon: ThumbsUp, type: 'textarea' },
  { name: 'visualId', label: 'Qual é a identidade visual da sua empresa (cores, logo)?', placeholder: 'Ex: Cores principais são azul e dourado.', icon: Palette, type: 'textarea' },
  { name: 'services', label: 'Quais são os principais produtos ou serviços?', placeholder: 'Ex: Criação de sites, Lojas Virtuais, Gestão de Tráfego.', icon: Briefcase, type: 'textarea' },
  { name: 'pricing', label: 'Quais são os preços e formas de pagamento?', placeholder: 'Ex: Planos a partir de R$ X. PIX, boleto e cartão.', icon: CircleDollarSign, type: 'textarea' },
  { name: 'social', label: 'A empresa tem redes sociais e site? Quais?', placeholder: 'Ex: Instagram: @suaempresa, Site: www.seusite.com.br', icon: Share2, type: 'textarea' },
  { name: 'scheduling', label: 'Vocês usam alguma ferramenta de agendamento online?', placeholder: 'Ex: Sim, Calendly. Ou: Não utilizamos.', icon: Calendar, type: 'input' },
  { name: 'referenceSite', label: 'Que site você acha interessante como referência?', placeholder: 'Ex: www.apple.com (Opcional)', icon: Globe, type: 'input' },
] as const;

export function BriefingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '', city: '', clients: '', needs: '', unique: '',
      benefits: '', visualId: '', services: '', pricing: '', social: '', scheduling: '',
      referenceSite: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const result = await generateWhatsAppMessage(values);
    setIsLoading(false);

    if (result.success) {
      setWhatsAppMessage(result.message!);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao gerar mensagem",
        description: result.message,
      });
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(whatsAppMessage);
    toast({
      title: "Copiado!",
      description: "A mensagem do briefing foi copiada para a área de transferência.",
    });
  };

  const handleSendWhatsApp = () => {
    // Insira seu número de WhatsApp aqui
    const yourWhatsAppNumber = '5511999999999';
    const encodedMessage = encodeURIComponent(whatsAppMessage);
    window.open(`https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <>
      <Card className="shadow-2xl rounded-2xl border-2 border-primary/10">
        <CardHeader className="text-center p-8">
          <CardTitle className="text-3xl font-bold text-primary">Formulário de Briefing</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Preencha os campos abaixo para darmos o primeiro passo na criação do seu site.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {formFields.map((fieldInfo) => (
                <FormField
                  key={fieldInfo.name}
                  control={form.control}
                  name={fieldInfo.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-3 text-base font-semibold">
                        <fieldInfo.icon className="h-6 w-6 text-primary" />
                        <span>{fieldInfo.label}</span>
                      </FormLabel>
                      <FormControl>
                        {fieldInfo.type === 'textarea' ? (
                          <Textarea placeholder={fieldInfo.placeholder} {...field} rows={3} className="bg-secondary/50 border-border focus:bg-white transition-colors" />
                        ) : (
                          <Input placeholder={fieldInfo.placeholder} {...field} className="bg-secondary/50 border-border focus:bg-white transition-colors" />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" className="w-full font-bold py-7 text-lg bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg" disabled={isLoading} size="lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Send className="mr-3 h-5 w-5" />
                )}
                {isLoading ? 'Gerando Mensagem...' : 'Enviar Informações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Briefing Pronto!</DialogTitle>
            <DialogDescription>
              Sua mensagem está pronta. Copie e envie para nós no WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Textarea
              readOnly
              value={whatsAppMessage}
              rows={12}
              className="bg-secondary/30 text-sm"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="mr-2" /> Copiar Texto
            </Button>
            <Button onClick={handleSendWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
              <MessageCircle className="mr-2" /> Enviar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
