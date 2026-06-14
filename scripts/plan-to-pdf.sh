#!/usr/bin/env bash
# Render PLAN.md -> PLAN.pdf using pandoc (md->html) + headless Chrome (html->pdf).
# Brand-styled, no LaTeX required. Safe to run repeatedly; called by the PostToolUse hook.
set -euo pipefail

ROOT="/Users/coreylaverdiere/Documents/Claude/PlayPulse"
SRC="$ROOT/PLAN.md"
HTML="$(mktemp -t playpulse-plan.XXXXXX).html"
OUT="$ROOT/PLAN.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

[ -f "$SRC" ] || { echo "plan-to-pdf: $SRC not found" >&2; exit 0; }

CSS="$ROOT/scripts/plan.css"

pandoc "$SRC" \
  --standalone --embed-resources \
  --metadata pagetitle="PlayPulse — Project Plan" \
  --css "$CSS" \
  -f gfm -t html5 \
  -o "$HTML"

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "file://$HTML" >/dev/null 2>&1

rm -f "$HTML"
echo "plan-to-pdf: wrote $OUT"
