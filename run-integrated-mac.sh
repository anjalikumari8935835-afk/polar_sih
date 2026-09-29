#!/bin/zsh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

find_free_port() {
  local port="$1"
  while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
    port=$((port+1))
  done
  echo "$port"
}

AI_PORT="${AI_PORT:-$(find_free_port 8000)}"
WEB_PORT="${WEB_PORT:-$(find_free_port 3000)}"

if [[ ! -d "ai_backend/.venv" ]]; then
  python3 -m venv ai_backend/.venv
fi
source ai_backend/.venv/bin/activate
python -m pip install -q -r ai_backend/requirements.txt

# Verify the environment is actually usable. If a previous/broken .venv exists,
# rebuild it once instead of starting Flask with missing dependencies.
if ! python -c 'import flask, fitz, sklearn, dotenv' >/dev/null 2>&1; then
  echo "Existing Python environment is incomplete; rebuilding ai_backend/.venv..."
  deactivate 2>/dev/null || true
  rm -rf ai_backend/.venv
  python3 -m venv ai_backend/.venv
  source ai_backend/.venv/bin/activate
  python -m pip install -q --upgrade pip
  python -m pip install -q -r ai_backend/requirements.txt
fi

export AI_BACKEND_URL="http://127.0.0.1:${AI_PORT}"
export AI_BACKEND_PORT="$AI_PORT"
export AI_PORT

echo "Starting Polar AI backend on http://127.0.0.1:${AI_PORT}"
AI_BACKEND_PORT="$AI_PORT" python ai_backend/app.py > ai_backend/backend.log 2>&1 &
AI_PID=$!
trap 'kill $AI_PID 2>/dev/null || true' EXIT

backend_ready=0
for i in {1..40}; do
  if curl -fsS "http://127.0.0.1:${AI_PORT}/api/status" >/dev/null 2>&1; then
    backend_ready=1
    break
  fi
  sleep 0.5
done

if [[ "$backend_ready" -ne 1 ]]; then
  echo "Polar AI backend did not start on port ${AI_PORT}."
  echo "---- ai_backend/backend.log ----"
  tail -80 ai_backend/backend.log 2>/dev/null || true
  exit 1
fi

if [[ ! -d node_modules ]]; then npm ci
fi

echo "Polar AI backend is ready on http://127.0.0.1:${AI_PORT}"
echo "Starting Polar Science Portal on http://localhost:${WEB_PORT}"
PORT="$WEB_PORT" npm run dev
