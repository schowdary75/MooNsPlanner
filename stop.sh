#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PID_FILE="$SCRIPT_DIR/moons.pid"
LOG_FILE="$SCRIPT_DIR/moons.log"

echo "[INFO] Stopping MooNs Application..."

# 1. Stop Docker containers if docker compose is active
if command -v docker &>/dev/null && docker compose ps -q 2>/dev/null | grep -q .; then
  echo "[INFO] Stopping Docker Compose containers..."
  docker compose down 2>/dev/null || true
elif command -v docker-compose &>/dev/null && docker-compose ps -q 2>/dev/null | grep -q .; then
  echo "[INFO] Stopping Docker Compose containers..."
  docker-compose down 2>/dev/null || true
fi

# 2. Stop process via PID file if present
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE" 2>/dev/null || echo "")
  if [ -n "$PID" ]; then
    echo "[INFO] Stopping recorded process (PID: $PID)..."
    
    # Windows taskkill (Git Bash / MSYS / Windows)
    if command -v taskkill &>/dev/null || [ -n "$WINDIR" ] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
      cmd.exe /c "taskkill /F /T /PID $PID" 2>/dev/null || true
      powershell.exe -NoProfile -Command "Stop-Process -Id $PID -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
    fi
    
    # Unix kill fallback
    pkill -P "$PID" 2>/dev/null || true
    kill -15 "$PID" 2>/dev/null || true
    kill -9 "$PID" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
fi

# 3. Kill any remaining processes listening on MooNs ports (3000, 3001, and 5173)
echo "[INFO] Cleaning up processes on ports 3000, 3001, and 5173..."

# Windows PowerShell cleanup (handles Git Bash on Windows)
if command -v powershell.exe &>/dev/null; then
  powershell.exe -NoProfile -Command 'Get-NetTCPConnection -LocalPort 3000,3001,5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }' 2>/dev/null || true
fi

# Windows cmd.exe fallback
if command -v cmd.exe &>/dev/null; then
  cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /T /PID %a" 2>/dev/null || true
  cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /F /T /PID %a" 2>/dev/null || true
  cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /T /PID %a" 2>/dev/null || true
fi

# Linux / macOS fallback
if command -v lsof &>/dev/null; then
  lsof -ti :3000 | xargs -r kill -9 2>/dev/null || true
  lsof -ti :3001 | xargs -r kill -9 2>/dev/null || true
  lsof -ti :5173 | xargs -r kill -9 2>/dev/null || true
fi

if command -v fuser &>/dev/null; then
  fuser -k 3000/tcp 2>/dev/null || true
  fuser -k 3001/tcp 2>/dev/null || true
  fuser -k 5173/tcp 2>/dev/null || true
fi

echo "[SUCCESS] MooNs stopped completely."
