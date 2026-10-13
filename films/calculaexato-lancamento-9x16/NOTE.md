# Calcula Exato · lançamento 9:16 · 20 s

**Arquivo:** `final.mp4` (1080×1920, 30 fps, 20,0 s, sem áudio: não há chave ElevenLabs, então não há VO nem música).
**Fonte editável:** `index.html` (runtime em `runtime/`, fontes da própria marca em `fonts/`, recorte real do card em `assets/card.png`).

## A ideia
"O preço que sobra." O preço parece bom; comissão, taxa fixa, frete e imposto empilham sob ele; o card real mostra o lucro em seis marketplaces; o site fecha com a própria frase: o preço certo é o que sobra mais no seu bolso.

## Os beats (conforme o storyboard aprovado)
| Tempo | Beat | Compra |
|---|---|---|
| 0,0–2,5 s | hook: "Seu preço parece bom." + R$ 48,20 | a crença de que o preço está bom |
| 2,5–5,0 s | virada: Comissão. Taxa fixa. Frete. Imposto. | as taxas comem a margem |
| 5,0–9,5 s | prova: card real do site, câmera entra no TikTok Shop com "Melhor lucro" | o lucro muda por marketplace |
| 9,5–12,5 s | prova: faixa dos seis marketplaces, nomes e cores aproximadas da página | são esses seis |
| 12,5–16,0 s | fechamento: frase do site, "sobra" sublinhado em teal | o que importa é o que sobra |
| 16,0–20,0 s | chamada: "3 cálculos grátis pra testar" + toque no botão real | próximo passo |

## O que é real e o que é ilustrativo
- **Real, capturado do site:** o card de comparação (imagem), os textos (hook, fechamento, chamada), o nome dos marketplaces, a fonte (Montserrat e Barlow Condensed), o botão "Calcular meu preço agora" e o sublinhado teal da hero.
- **Ilustrativo, já rotulado no próprio card:** os valores de preço e lucro ("Exemplo ilustrativo — margem de contribuição 15%, imposto 6%"). Nenhuma taxa foi inventada.
- **Não é real:** o cursor é um desenho vetorial simples; as cores dos nomes dos marketplaces são aproximações das cores da página.
- **Não há:** depoimentos, métricas, números novos, logo, URL na tela (decisão deliberada: a combinação logo + chamada + URL é o final de rodapé que a skill proíbe).

## Medidas (look.py, render final)
- **G0 render:** PASS. 20,00 s, 600 quadros, 1080×1920. Sem áudio.
- **G2 quadro vazio:** PASS. Nenhuma sequência de mais de 3 quadros planos.
- **G3 pausa final:** PASS. Pausa final de 0,90 s (limite 0,6–1,4 s). CTA = 3,33 s, 17% do filme (limite 25%).
- **G5 chrome:** PASS (lint.mjs, 15 de 15 regras). Sem rótulos de canto, contadores, kicker, barra de progresso ou card vibe-coded.
- **G1 prova legível:** avaliado a olho. O preço e os títulos de cada card estão legíveis em tamanho de celular. Os textos menores do card (subtítulos de margem, rodapé de "exemplo") ficam pequenos demais para ler sem zoom; o card ocupa ~0,83 da largura e é ampliado pela câmera no beat 3.
- **G4 um herói por quadro:** avaliado a olho. Cada quadro tem um herói (preço, card, faixa, frase ou botão). Nenhum quadro com dois painéis competindo.

## Descrição dos quadros (prancha do render final)
1. Hook: "Seu preço parece bom." sobre o R$ 48,20 grande, no centro.
2. Preço já encolhido no topo, com "Comissão." surgindo embaixo.
3. As quatro taxas empilhadas sob o preço reduzido.
4. "Compare os 6 de uma vez." sobre o card real, já ampliado.
5. Card em zoom sobre o TikTok Shop, com o destaque teal entrando.
6. Card com a linha TikTok destacada e "Melhor lucro" visível.
7. Faixa "Amazon (DBA)" entrando pela direita e saindo pela esquerda.
8. Faixa com "Shopee" e "TikTok" em movimento.
9. Frase de fechamento: "O preço certo não é o mais alto. É o que sobra mais no seu bolso."
10. Frase com "sobra" já sublinhado em teal.
11. Chamada "3 cálculos grátis pra testar" com o botão "Calcular meu preço agora".
12. O cursor chega e toca o botão, que afunda e responde.
13. Pausa final: botão em repouso, cursor saindo pela direita.

## Limites conhecidos
- **Movimento abaixo da faixa humana:** a média de variação de luminância é 0,7/255, contra mediana 6,8 em filmes feitos por humanos. O filme é mais parado do que a faixa de referência, de propósito: o card precisa ser lido, e a frase de fechamento tem uma pausa desenhada. Se quiser mais vida, o próximo passo é um movimento lento de câmera no card (beat 3) ou nos nomes dos marketplaces.
- **Sem áudio.** Sem ElevenLabs, o filme não tem trilha nem efeitos sonoros.
- **Recorte do card com resolução de captura.** A captura do site é 1920×1080; o card foi ampliado para o quadro 9:16, então o texto fino pode aparecer um pouco suave.
- **Sem URL e sem logo na tela.** Veja a decisão acima; se quiser, adiciono o endereço só no último quadro, sem botão.
