#!/bin/bash
# make-speed-ramp.sh — turn a long clip into a short promo:
#   START at normal speed  →  SPEED UP through the middle  →  SLOW DOWN at the end.
# Video only (no sound) so you can add music in TikTok/YouTube, like the other MOWES clips.
#
# Usage:  ./make-speed-ramp.sh  my-video.mov  [output.mp4]
#
# Tweak the feel with these 5 numbers:
NORMAL_PORTION=0.20   # first 20% of the clip plays at normal speed (the hook)
FAST_PORTION=0.60     # middle 60% gets sped up (the boring setup part)
FAST_SPEED=4.0        # how fast the middle goes (4.0 = 4x faster)
SLOW_SPEED=0.5        # end speed (0.5 = half speed / slow-mo payoff)
                      # (the last 20% is whatever's left after normal + fast)

set -e
IN="$1"
if [ -z "$IN" ] || [ ! -f "$IN" ]; then
  echo "❌ Give me a video file. Example:  ./make-speed-ramp.sh my-video.mov"
  exit 1
fi
OUT="${2:-${IN%.*}-ramp.mp4}"

# How long is the video (seconds)?
D=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$IN")
if [ -z "$D" ]; then echo "❌ Couldn't read the video length."; exit 1; fi

# Work out where each section starts/ends.
T1=$(echo "$D * $NORMAL_PORTION" | bc -l)                    # normal ends here
T2=$(echo "$D * ($NORMAL_PORTION + $FAST_PORTION)" | bc -l)  # fast ends / slow begins

echo "🎬 Input: $IN  (${D%.*}s long)"
echo "   • 0 → ${T1%.*}s   normal speed"
echo "   • ${T1%.*}s → ${T2%.*}s   ${FAST_SPEED}x fast"
echo "   • ${T2%.*}s → ${D%.*}s   ${SLOW_SPEED}x slow"
echo "   → Building $OUT ..."

ffmpeg -y -i "$IN" -filter_complex "\
[0:v]trim=0:${T1},setpts=PTS-STARTPTS[a]; \
[0:v]trim=${T1}:${T2},setpts=(PTS-STARTPTS)/${FAST_SPEED}[b]; \
[0:v]trim=${T2},setpts=(PTS-STARTPTS)/${SLOW_SPEED}[c]; \
[a][b][c]concat=n=3:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "$OUT" \
  -hide_banner -loglevel error

echo "✅ Done!  New short clip: $OUT"
