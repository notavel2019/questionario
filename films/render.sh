#!/usr/bin/env bash
# Render and check one film folder with the motionmaxxing skill.
# Usage: bash films/render.sh films/<nome-do-filme> [duracao_em_segundos]
# The folder needs index.html; output: final.mp4, look/ (gates), lint result on screen.
set -euo pipefail
FILM="${1:?uso: bash films/render.sh films/<pasta> [duracao]}"; DUR="${2:-20}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${MOTIONMAXXING_DIR:-$HOME/.claude/skills/motionmaxxing}"
[ -f "$SKILL/SKILL.md" ] || { echo "skill não encontrada em $SKILL. Instale: git clone https://github.com/Tejashmakwana/motionmaxxing ~/.claude/skills/motionmaxxing" >&2; exit 1; }
# Chrome as root needs --no-sandbox; this wrapper only applies on Linux containers running as root.
if [ "$(id -u)" = 0 ] && [ -x /opt/pw-browsers/chromium ]; then
  mkdir -p "$ROOT/films/.tools"
  printf '#!/bin/sh\nexec /opt/pw-browsers/chromium --no-sandbox "$@"\n' > "$ROOT/films/.tools/chrome-nosandbox"
  chmod +x "$ROOT/films/.tools/chrome-nosandbox"
  export CHROME_PATH="$ROOT/films/.tools/chrome-nosandbox"
fi
cd "$ROOT/$FILM"
node "$SKILL/scripts/render.mjs" index.html final.mp4
python3 "$SKILL/scripts/look.py" final.mp4 --out look --expect "$DUR"
node "$SKILL/scripts/lint.mjs" index.html | tail -1
echo "Pronto: $ROOT/$FILM/final.mp4"
