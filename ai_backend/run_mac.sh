#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
PYTHON="${PYTHON:-python3}"

command -v "$PYTHON" >/dev/null 2>&1 || { echo "Python not found: $PYTHON"; exit 1; }
echo "Using Python: $($PYTHON --version 2>&1)"
if ! "$PYTHON" - <<'PY_CHECK'
import flask, fitz, sklearn, dotenv, google.genai, reportlab, matplotlib
PY_CHECK
then
  "$PYTHON" -m pip install -r requirements.txt
fi
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Add your Gemini configuration if needed."
fi
exec "$PYTHON" app.py
