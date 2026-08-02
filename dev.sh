#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

cleanup() { kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; }
trap cleanup EXIT INT TERM

# Kill anything already on these ports
lsof -ti:8000 -ti:5173 | xargs kill -9 2>/dev/null || true

# Backend
cd backend
source .venv/bin/activate
python app/seed.py
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

# Frontend
cd frontend
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "[dev] Backend:  http://localhost:8000"
echo "[dev] Frontend: http://localhost:5173"
echo "[dev] Press Ctrl+C to stop"

wait