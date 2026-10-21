#!/bin/bash
# Encode captured JPEG frames to H.264, then mux the VO track.
set -euo pipefail
cd "$(dirname "$0")"
OUT="../output/trader-life-3d.mp4"

echo "=== concat frames -> video ==="
ls chunks/*/*.jpg | sort | sed "s|^|file '$PWD/|" | sed "s|\$|'|" > /tmp/tl3d-frames.txt
COUNT=$(wc -l < /tmp/tl3d-frames.txt)
echo "frames: $COUNT"

ffmpeg -y -v error -f concat -safe 0 -r 30 -i /tmp/tl3d-frames.txt \
  -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -r 30 \
  -movflags +faststart video-only.mp4

echo "=== mux audio ==="
ffmpeg -y -v error -i video-only.mp4 -i audio/dialogue.mp3 \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart "$OUT"

echo "OK $OUT"
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames \
  -of default=noprint_wrappers=1 "$OUT"
