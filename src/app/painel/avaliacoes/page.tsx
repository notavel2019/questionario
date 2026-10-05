import { ReviewsBoard } from './reviews-board';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avaliações do Google</h1>
        <p className="text-muted-foreground">Responda às avaliações do seu Perfil da Empresa.</p>
      </div>
      <p className="rounded-md border p-3 text-sm text-muted-foreground">
        Demonstração: as avaliações são fictícias e &quot;Publicar&quot; só atualiza esta tela, sem enviar nada ao Google.
        A conexão real depende da aprovação de acesso à API do Google Business Profile.
      </p>
      <ReviewsBoard />
    </div>
  );
}
