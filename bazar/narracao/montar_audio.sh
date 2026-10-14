#!/usr/bin/env bash
# Monta a narração final a partir dos clipes do TTS (um arquivo por linha), no tempo exato do vídeo.
# Uso:  ./montar_audio.sh [pasta_dos_clipes]    (padrão: ./clipes)
# Espera arquivos L01.wav … L10.wav (ou .mp3). Gera narracao_final.wav (30 s) e narracao_final.m4a.
# Se um clipe for mais longo que a sua janela, ele é acelerado (atempo, no máx. 1.30x) para caber.
set -euo pipefail
DIR="${1:-clipes}"
# id  início(s)  duração_máxima(s)
CUES="L01 0.3 2.6
L02 3.2 2.8
L03 6.3 3.1
L04 9.7 2.3
L05 12.6 1.6
L06 14.4 5.6
L07 20.4 2.6
L08 23.3 4.2
L09 27.8 2.0"
inputs=(); filters=(); n=0
while read -r id start maxd; do
  f=$(ls "$DIR/$id".wav "$DIR/$id".mp3 "$DIR/$id".m4a "$DIR/$id".ogg "$DIR/$id".flac 2>/dev/null | head -n1 || true)
  [ -z "$f" ] && { echo "faltando $id em $DIR" >&2; continue; }
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  tempo=$(python3 -c "d=float('$dur');m=float('$maxd');print(round(min(1.30,max(1.0,d/m)),4))")
  ms=$(python3 -c "print(int(float('$start')*1000))")
  echo "$id: dur=${dur}s janela=${maxd}s tempo=${tempo}x início=${start}s"
  inputs+=(-i "$f")
  filters+=("[$n:a]aresample=48000,atempo=${tempo},adelay=${ms}|${ms},apad=whole_dur=30[a$n]")
  n=$((n+1))
done <<< "$CUES"
[ "$n" -eq 0 ] && { echo "nenhum clipe encontrado" >&2; exit 1; }
mix=""; for i in $(seq 0 $((n-1))); do mix+="[a$i]"; done
fc=$(IFS=';'; echo "${filters[*]}")";${mix}amix=inputs=${n}:normalize=0,atrim=0:30[out]"
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$fc" -map "[out]" -ar 48000 -t 30 narracao_final.wav
ffmpeg -y -loglevel error -i narracao_final.wav -c:a aac -b:a 160k narracao_final.m4a
echo "OK → narracao_final.wav / narracao_final.m4a"
echo "Para juntar ao vídeo:  ffmpeg -i ../bazar.mp4 -i narracao_final.m4a -c:v copy -c:a copy -shortest bazar_com_audio.mp4"
