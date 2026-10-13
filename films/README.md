# Filmes (motionmaxxing)

Cada filme fica numa pasta própria, com `index.html`, `runtime/`, `fonts/`, `assets/`, `final.mp4`, `NOTE.md` e `look/` (gates).

## Fazer um filme novo
1. Copie a pasta de referência e troque o nome:
   `cp -r films/calculaexato-lancamento-9x16 films/<novo-nome>`
   Depois apague `final.mp4`, `final.mp4.events.json` e `look/`.
2. Edite `films/<novo-nome>/index.html` (roteiro, cenas, tempos). Os assets da marca ficam em `assets/` e `fonts/`.
3. Renderize e confira os gates:
   `bash films/render.sh films/<novo-nome> 20`
   (o segundo argumento é a duração planejada em segundos)
4. Veja `look/sheet.jpg` e o `NOTE.md`. O `final.mp4` fica na própria pasta do filme.

## Pré-requisitos
- A skill motionmaxxing em `~/.claude/skills/motionmaxxing` (ou outro caminho definido em `MOTIONMAXXING_DIR`).
- Node 22+, Python 3, ffmpeg e Chromium/Chrome.
- Em containers rodando como root, o `render.sh` cria `films/.tools/chrome-nosandbox` sozinho.

## Captura de marca
Para um site novo, rode a captura antes de montar o filme:
`node ~/.claude/skills/motionmaxxing/scripts/brand.mjs https://<site> films/<novo-nome>/brand`
Use as imagens e textos capturados nos beats; não invente números nem depoimentos.
