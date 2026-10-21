#!/bin/bash
# Render trader-life-3d on the Mac runner.
# Starts a local static server, captures frames chunk by chunk, encodes, muxes.
set -euo pipefail
cd "$(dirname "$0")"
OUT_DIR="${1:-out}"
mkdir -p "$OUT_DIR"

echo "=== node $(node --version) / npm $(npm --version) ==="

# Dependencies + the Chrome guarantee come from package.json / postinstall.js.
if [ ! -d node_modules/three ]; then
  npm install --no-audit --no-fund
fi

# Chrome headless shell. The workflow may hand us a path that is relative to the
# repo root while we run inside trader-life-3d/, so resolve and verify it, then
# fall back to postinstall.js which publishes an absolute path.
CHROME_BIN="${CHROME:-}"

resolve() {
  # try as given, then relative to the repo root, then absolute
  for p in "$1" "$(cd .. && pwd)/$1" "$(pwd)/$1"; do
    [ -n "$p" ] && [ -x "$p" ] && { echo "$p"; return 0; }
  done
  return 1
}

if [ -n "$CHROME_BIN" ]; then
  if R="$(resolve "$CHROME_BIN")"; then
    CHROME_BIN="$R"
  else
    echo "!! CHROME=$CHROME_BIN is not executable, discarding"
    CHROME_BIN=""
  fi
fi

if [ -z "$CHROME_BIN" ]; then
  for c in "$HOME/.cache/remotion/chrome-headless-shell" \
           "$HOME/Library/Caches/remotion/chrome-headless-shell" ; do
    if [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi

if [ -z "$CHROME_BIN" ]; then
  echo "!! no usable chrome-headless-shell; running postinstall"
  node postinstall.js
  for c in "$HOME/.cache/remotion/chrome-headless-shell" \
           "$HOME/Library/Caches/remotion/chrome-headless-shell" ; do
    if [ -x "$c" ]; then CHROME_BIN="$c"; break; fi
  done
fi

if [ -z "$CHROME_BIN" ]; then
  echo "!! still no chrome; last resort scan"
  CHROME_BIN="$(find "$(cd .. && pwd)/.chrome" ./.chrome -type f -name 'chrome-headless-shell' 2>/dev/null | head -1)"
fi

test -n "$CHROME_BIN" || { echo "FATAL: no chrome"; exit 1; }
echo "chrome: $CHROME_BIN"
export CHROME="$CHROME_BIN"

# Static server for the ES module importmap.
node serve.js &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
for i in $(seq 1 30); do
  curl -sf -o /dev/null http://localhost:8920/index.html && break
  sleep 0.5
done
echo "server up"

FPS="${FPS:-30}"
DUR=68
CHUNKS="${CHUNKS:-8}"
N=$((DUR*FPS))

rm -rf chunks
for i in $(seq 0 $((CHUNKS-1))); do
  echo "=== chunk $i/$CHUNKS ==="
  node capture_chunk.js "$i" "$CHUNKS" "$FPS"
  echo "frames so far: $(find chunks -name '*.jpg' | wc -l)"
done

TOTAL=$(find chunks -name '*.jpg' | wc -l)
echo "captured $TOTAL / $N"
if [ "$TOTAL" -lt "$N" ]; then
  echo "!! frame count short"; exit 1
fi

# Concat list needs absolute paths, otherwise ffmpeg resolves them next to the list file.
ls chunks/*/*.jpg | sort | sed "s|^|file '$PWD/|;s|\$|'|" > frames.txt

ffmpeg -y -v error -f concat -safe 0 -r "$FPS" -i frames.txt \
  -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -r "$FPS" \
  -movflags +faststart video-only.mp4

if [ -f audio/final.mp3 ]; then AUD=audio/final.mp3; else AUD=audio/dialogue.mp3; fi
ffmpeg -y -v error -i video-only.mp4 -i "$AUD" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart "$OUT_DIR/trader-life-3d.mp4"

echo "=== RESULT ==="
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames \
  -of default=noprint_wrappers=1 "$OUT_DIR/trader-life-3d.mp4"
echo "OK $OUT_DIR/trader-life-3d.mp4"
