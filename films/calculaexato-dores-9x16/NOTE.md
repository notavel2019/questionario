# Calcula Exato · "Os dois cartões" · 9:16 · 20 s

**Arquivo:** `final.mp4` (1080×1920, 30 fps, 20,0 s). Sem áudio por enquanto; a narração está em `NARRACAO.md`, para gerar no Google TTS.
**Fonte editável:** `index.html` (runtime em `runtime/`, fontes da marca em `fonts/`).

## A ideia
O site conta a história com dois cartões: "Precificando no achismo" (borda magenta) e "Precificando com a Calcula Exato" (borda verde). O filme fica no cartão magenta empilhando as dores, faz um chicote de câmera até o cartão verde (as 6 plataformas) e termina no exemplo exclusivo do site: o preço desce de R$ 82,00 para R$ 78,99 e o lucro sobe R$ 1,96.

## Beats
| Tempo | Beat | Compra |
|---|---|---|
| 0,0–2,2 s | gancho: "Preço no achismo parece certo." | o vendedor reconhece o próprio hábito |
| 2,2–8,6 s | dores: três ✕ do cartão magenta | as dores são reais e são dele |
| 8,6–12,0 s | virada: chicote até o cartão verde; os seis nomes acendem | existe outro jeito, para as 6 plataformas |
| 12,0–17,2 s | herói: R$ 82,00 → R$ 78,99, tarifa e lucro mudando, "+ R$ 1,96 a mais, vendendo mais barato." | a calculadora acha lucro que ele não via |
| 17,2–20,0 s | chamada: "3 cálculos grátis pra testar" + toque no botão | próximo passo |

## O que é real e o que é recriado
- **Texto real do site:** gancho, títulos dos cartões, as três dores (duas encurtadas no fim), a linha das 6 plataformas, os números do exemplo "O aviso que ninguém mais dá", "vendendo mais barato", "3 cálculos grátis pra testar", o botão.
- **Recriado em HTML:** os cartões, no estilo do site (borda superior colorida, cores #db2777 e #15803d amostradas da página), para serem legíveis em 9:16. Não são print.
- **Aproximado:** as cores dos nomes dos marketplaces. O cursor é um desenho simples.
- **Não há:** números inventados, depoimentos, logo, URL na tela.

## Medidas (look.py e lint.mjs, render final)
- **G0:** PASS. 20,00 s, 600 quadros, sem áudio (não planejado nesta versão).
- **G2:** PASS. Nenhuma sequência de mais de 3 quadros planos.
- **G3:** PASS. Pausa final 1,17 s; última tomada 2,40 s = 12% do filme.
- **G5:** PASS (lint.mjs).
- **G1 (a olho):** dores a 64 px e linha das plataformas a 76 px, legíveis em celular; cartões com 0,89 da largura.
- **G4 (a olho):** um herói por quadro; no chicote, os dois cartões passam juntos com a câmera em movimento.
- **Movimento:** média 0,5/255, abaixo da faixa humana (mediana 6,8). É um filme de leitura; acrescentei uma aproximação lenta de câmera nos cartões e no herói, e o trecho mais parado caiu de 2,8 s para 1,8 s.

## Descrição dos quadros (prancha)
1–2. A frase "Preço no achismo parece certo." subindo palavra a palavra, luz magenta no canto.
3–4. O cartão magenta com a primeira dor; abaixo dela, espaço reservado para as próximas.
5–7. As três dores; as anteriores em cinza, a atual em tinta.
8. O cartão verde logo após o chicote, com os nomes ainda apagados.
9–10. Os seis nomes acesos nas cores de cada marketplace; luz verde no canto.
11. R$ 82,00 em magenta, tarifa R$ 11,95, lucro R$ 29,81.
12. R$ 78,99 em verde, tarifa R$ 6,75, lucro R$ 31,76.
13–14. "+ R$ 1,96 a mais, vendendo mais barato." em verde.
15–16. "3 cálculos grátis pra testar", botão e cursor; pausa final.

## O que eu ainda melhoraria
- O cartão magenta já aparece com a altura das três dores, então no início há espaço branco abaixo da primeira.
- O herói poderia ganhar mais trabalho visual (por exemplo, os dois cartões do site, R$ 82,00 e R$ 78,99, lado a lado com a câmera passando de um ao outro).
