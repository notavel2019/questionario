# Bola de Neve Jaraguá · motion 9:16 · 60 s (com áudio)

**Arquivo:** `final.mp4` (1080×1920, 30 fps, 60,0 s, áudio AAC estéreo).
**Áudio:** o arquivo enviado (54,5 s), com silêncio até 60 s. Medido: -17,4 LUFS, pico -3,5 dBFS.
**Fonte editável:** `index.html` (gerado por `build.py` a partir de `segments.json`, a transcrição com tempo de cada palavra).

## Ideia
A narração é transcrita palavra por palavra. Cada palavra entra no quadro no instante exato em que é falada. As palavras-chave aparecem grandes em verde-limão; a legenda embaixo acompanha a fala, com a palavra atual destacada e as palavras que falam com quem assiste ("você", "te", "seu") em dourado.

## Cenas (conforme a transcrição)
| Tempo | Trecho | Destaque |
|---|---|---|
| 0–8,4 s | "A nossa geração…" | SEMENTE, SOMBRA |
| 8,4–16,9 s | "Mas em Gênesis…" | GÊNESIS, FLORESTAS, SEMENTES |
| 16,9–32,6 s | "Você acha que foi enterrado?…" | PLANTADO, RAÍZES, TEMPESTADE (a cena treme nesse ponto) |
| 32,6–46,3 s | "E o maior segredo?…" | SECA, ORGULHOSA, RÍGIDOS, CURVA |
| 46,3–54,5 s | "O seu fruto não é para você…" | FRUTO, SERVIR, PEQUENOS COMEÇOS |
| 54,5–60 s | CTA | CONHEÇA O BOLA DE NEVE JARAGUÁ; botão "Venha conhecer" |

## Texto que eu escrevi
- A legenda do CTA, "Você também pode começar pequeno. Venha conhecer.", é de minha autoria. Não está na narração original.
- O título do CTA segue o pedido ("Conheça o Bola de Neve Jaraguá"). Não há endereço, telefone nem site na tela.

## Medidas (look.py e lint.mjs)
- **G0:** PASS. 60,00 s, com áudio.
- **G2:** PASS. Nenhum trecho com mais de 3 quadros planos.
- **G3:** PASS. Pausa final 1,23 s; CTA = 5,50 s, 9% do filme.
- **G5:** PASS (lint.mjs).
- **G1 e G4 (a olho):** texto grande e legenda não se sobrepõem em nenhum quadro da prancha. Cada quadro tem um herói.

## Pontos de atenção antes de publicar
- **Unidade em Jaraguá não verificada.** A busca não confirmou uma unidade do Bola de Neve em Jaraguá. Antes de divulgar, confirme o endereço e os horários em um canal oficial.
- **Contexto público da igreja.** Há reportagens recentes sobre investigação do Ministério Público por suspeita de desvio de recursos e denúncias de abusos, e o fundador morreu em 2024. Vale checar essas informações antes de publicar uma peça de convite.
