// Sugestão de resposta por regras (demonstração). Será trocada por geração com Claude.
export function suggestReply(author: string, stars: number, text: string): string {
  const name = author.split(' ')[0];
  if (stars >= 4) {
    return `Olá, ${name}! Muito obrigado pela avaliação e pelo carinho. Ficamos felizes que tenha gostado do nosso trabalho. Estamos à disposição sempre que precisar!`;
  }
  if (stars === 3) {
    return `Olá, ${name}! Obrigado pelo seu retorno. Queremos entender como podemos melhorar: pode nos chamar para conversarmos sobre a sua experiência?`;
  }
  const delay = /demor|lent|respond|comunica/i.test(text);
  return `Olá, ${name}. Sentimos muito pela sua experiência${delay ? ' com a nossa comunicação' : ''}. Levamos o seu comentário a sério e gostaríamos de resolver isso: pode nos chamar diretamente para conversarmos?`;
}
