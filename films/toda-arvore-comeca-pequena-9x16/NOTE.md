# Toda árvore começa pequena · 9:16 · 60 s

**Arquivo:** `final.mp4` (1080×1920, 30 fps, 60,0 s). Sem áudio nesta versão: a narração está em `NARRACAO.md`, para gerar no Google TTS (5 faixas, uma por cena).
**Fonte editável:** `index.html` (runtime em `runtime/`, fontes em `fonts/`).

## A ideia
A semente é o objeto que liga as cinco cenas: o micro-ondas vira relógio que quebra; a semente cai, abre o raio-X com a floresta dentro; planta-se e vira raiz; o galho seco e o galho vivo nascem da mesma base; por fim, a semente cai na mão.

## Cenas e tempos
| Tempo | Cena | Visual |
|---|---|---|
| 0–10 s | O imediatismo | "RÁPIDO", "AGORA", "RESULTADOS" piscam; micro-ondas gira, vira relógio que acelera e quebra |
| 10–22 s | A engenharia de Deus | Semente cai; raio-X mostra floresta dentro; "O MILAGRE ESTÁ NO DNA" |
| 22–38 s | O processo invisível | Câmera mergulha na terra; raízes disparam para baixo; chão treme, raiz fica; "CRESCIMENTO INVISÍVEL" |
| 38–52 s | O contraste do fruto | Galho seco, reto, à esquerda; galho vivo, com frutos, arqueado à direita |
| 52–60 s | O apelo | Semente cai na mão; tela escurece; "TODA ÁRVORE COMEÇA PEQUENA." e "Gênesis 1:11" |

## O que é recriado
- Tudo é desenho vetorial em HTML/SVG: micro-ondas, relógio, semente, floresta, raízes, galhos, frutos e mão. Nada é foto.
- As raízes são geradas por uma função determinística (sem aleatoriedade), então o render é sempre igual.
- A mão é simplificada: uma forma côncava para receber a semente.
- Os frutos foram posicionados sobre a curva real do galho, medida pelo próprio caminho SVG.

## Paleta
Terrosa (fundo escuro #151311, creme #efe6d6, barro #d9d4c7, terra #2a1d14), com verde vivo #2fbf4e para a vida e dourado #f2b632 para os frutos e as raízes iluminadas. Escolhi essas cores a partir da sua descrição; não há marca de referência.

## Medidas (look.py e lint.mjs, render final)
- **G0:** PASS. 60,00 s, 1800 quadros, 1080×1920, sem áudio.
- **G2:** PASS. Nenhuma sequência de mais de 3 quadros planos. Corrigido: o fundo da cena 1 ficava liso entre as palavras, então adicionei um brilho dourado lento.
- **G3:** PASS. Pausa final de 1,30 s; última tomada de 8,00 s = 13% do filme.
- **G5:** PASS (lint.mjs).
- **G1 (a olho):** as palavras, a frase "O MILAGRE ESTÁ NO DNA" e "TODA ÁRVORE COMEÇA PEQUENA." são legíveis em celular. As raízes e a floresta são pequenas, mas sem texto precisam ser lidas só pela forma.
- **G4 (a olho):** um herói por quadro. Na cena 4 os dois galhos aparecem juntos, mas são o mesmo elemento em estados diferentes.
- **Movimento:** média 0,7/255, abaixo da faixa humana (mediana 6,8). É um filme de contemplação, com trechos parados de propósito (o raio-X, a árvore escura). O brilho da cena 1 e o zoom de mergulho mantêm o quadro vivo.

## Descrição dos quadros (prancha)
1. "AGORA" em dourado sobre o fundo escuro, com brilho.
2. Micro-ondas em giro acelerado.
3. Fragmentos do relógio se afastando.
4. Semente no creme, "O MILAGRE ESTÁ NO" entrando.
5–6. Semente com floresta dentro e "O MILAGRE ESTÁ NO DNA".
7–8. Raízes dourados descendo sobre o solo escuro, "CRESCIMENTO INVISÍVEL".
9–10. Raízes ramificando, câmera mais perto.
11–12. Galho seco, reto, à esquerda; galho vivo começando a arquear à direita.
13–14. Galho vivo com frutos dourados sobre a curva.
15–16. Semente na mão, tela escurecendo, "TODA ÁRVORE COMEÇA PEQUENA."

## O que eu ainda melhoraria
- A mão é a parte mais simples do desenho; uma ilustração de mão real melhoraria o último quadro.
- A narração ainda não existe em áudio; depois de gerar as faixas, eu posiciono e refaço o render com som.
