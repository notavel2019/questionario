# Narração — Bazar Bola de Neve Jaraguá (30 s)

Tom: caloroso, próximo, com energia crescente; no fecho, firme e convidativo.
Ritmo-alvo: ~2,5 palavras por segundo. **Gere uma linha por vez** no seu TTS (arquivos `L01` … `L09`) e use o `montar_audio.sh` para encaixar cada clipe no tempo exato do vídeo.

| Arquivo | Início | Janela | Na tela | Texto para o TTS (leia exatamente assim) | Dica de entonação |
|---|---|---|---|---|---|
| L01 | 0,3 s | 2,6 s | Guarda-roupa cheio… ? | Guarda-roupa cheio… e nada para vestir? | Pergunta, leve ironia. |
| L02 | 3,2 s | 2,8 s | Smile + "novo!" | Renovar o visual também renova o ânimo. | Sorrindo; sobe em "ânimo". |
| L03 | 6,3 s | 3,1 s | Caixa "DOE" | O que você não usa mais… pode vestir alguém. | Pausa curta nas reticências. |
| L04 | 9,7 s | 2,3 s | Etiqueta R$ 5 | Peças a partir de cinco reais. | Direto e animado. |
| L05 | 12,6 s | 1,6 s | "o mais importante" | E o mais importante: | Mais lento e grave, cria expectativa. |
| L06 | 14,4 s | 5,6 s | Palco, congresso, bolo | Cada peça ajuda a realizar o congresso anual de aniversário da Bola de Neve Jaraguá. | O momento principal. Cresce até "Jaraguá". |
| L07 | 20,4 s | 2,6 s | Camiseta + coração | Você veste bem… e faz o bem. | Pausa pequena entre "bem" e "e faz". |
| L08 | 23,3 s | 4,2 s | Cartaz do bazar | Bazar Bola de Neve. Dia vinte e quatro de outubro, às dez horas. | Claro e pausado; informação. |
| L09 | 27,8 s | 2,0 s | Venha renovar | Venha renovar. Venha ajudar. | Firme, convite final. |

O endereço fica na tela (cartaz) e na legenda; não cabe em 30 s de áudio.
Dados que usei vêm do cartaz: 24 de outubro, 10h, peças a partir de R$ 5,00.

## Regras para o TTS acertar o tempo

- Números por extenso: **"cinco reais"**, **"vinte e quatro de outubro"**, **"dez horas"**.
- Se um clipe passar da janela, o script acelera até 1,30× (acima disso soa artificial). Se ainda passar, reduza a velocidade/`rate` do TTS ou corte uma palavra.
- Se o clipe for bem mais curto que a janela, tudo bem: o script o encaixa no início da janela.
- Exporte cada clipe em `.wav` ou `.mp3` com o nome exato (`L01.wav`, `L02.wav` …) e coloque na pasta `clipes/`.

## Como montar

```bash
cd bazar/narracao
./montar_audio.sh clipes              # gera narracao_final.wav e .m4a (30 s)
ffmpeg -i ../bazar.mp4 -i narracao_final.m4a -c:v copy -c:a copy -shortest bazar_com_audio.mp4
```

Ou me envie os clipes (ou o áudio completo) e eu monto e exporto o MP4 final.

## Arquivos

- `texto/L01.txt` … `L09.txt`: uma linha de texto limpa por arquivo (cole no TTS).
- `texto/L01.ssml` … `L09.ssml`: versão SSML com pausas (`<break>`), para TTS que aceitam SSML (Google, Azure, Polly…).
- `narracao_tts.txt`: as 9 linhas num só arquivo.
- `narracao.srt`: legendas com os tempos.
- `guia-de-tempo.wav`: 30 s com um bip agudo no início de cada linha e um bip grave a cada 5 s. Serve para conferir o encaixe, ou para você gravar sua própria voz.
- `montar_audio.sh`: encaixa os clipes nos tempos e ajusta a velocidade.

## Texto corrido

Guarda-roupa cheio… e nada para vestir? Renovar o visual também renova o ânimo. O que você não usa mais… pode vestir alguém. Peças a partir de cinco reais. E o mais importante: cada peça ajuda a realizar o congresso anual de aniversário da Bola de Neve Jaraguá. Você veste bem… e faz o bem. Bazar Bola de Neve. Dia vinte e quatro de outubro, às dez horas. Venha renovar. Venha ajudar.
