#!/usr/bin/env bash

# Exit on unexpected errors before backgrounding
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PID_FILE="$SCRIPT_DIR/moons.pid"
LOG_FILE="$SCRIPT_DIR/moons.log"

MODE="dev"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --dev)
      MODE="dev"
      shift
      ;;
    --prod)
      MODE="prod"
      shift
      ;;
    --docker)
      MODE="docker"
      shift
      ;;
    -h|--help)
      echo "Usage: ./start.sh [options]"
      echo ""
      echo "Options:"
      echo "  --dev       Start in development mode (default)"
      echo "  --prod      Build project and start in production mode"
      echo "  --docker    Start containerized MooNs via Docker Compose"
      echo "  -h, --help  Show this help message"
      exit 0
      ;;
  esac
done

# Function to check if PID is running
is_running() {
  local pid=$1
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

# Check if MooNs is already running
if [ -f "$PID_FILE" ]; then
  EXISTING_PID=$(cat "$PID_FILE" 2>/dev/null || echo "")
  if is_running "$EXISTING_PID"; then
    echo "[INFO] MooNs is already running (PID: $EXISTING_PID)."
    echo "[INFO] Log file: $LOG_FILE"
    echo "[INFO] Streaming live output below (press Ctrl+C to detach)..."
    echo "======================================================================"
    tail -f "$LOG_FILE"
    exit 0
  else
    echo "[WARN] Stale PID file found. Cleaning up..."
    rm -f "$PID_FILE"
  fi
fi

if [ "$MODE" = "docker" ]; then
  echo "[INFO] Starting MooNs with Docker Compose..."
  if command -v docker &>/dev/null && docker compose version &>/dev/null; then
    docker compose up -d
    echo "[SUCCESS] Docker containers started."
    echo "[INFO] Streaming logs below (press Ctrl+C to detach)..."
    docker compose logs -f
  elif command -v docker-compose &>/dev/null; then
    docker-compose up -d
    echo "[SUCCESS] Docker containers started."
    echo "[INFO] Streaming logs below (press Ctrl+C to detach)..."
    docker-compose logs -f
  else
    echo "[ERROR] Docker / docker compose is not installed or not in PATH."
    read -p "Press Enter to exit..." || true
    exit 1
  fi
  exit 0
fi

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "[INFO] Installing root dependencies..."
  npm install
fi

echo "[INFO] Building shared workspace..."
npm run build --workspace=shared

if [ "$MODE" = "prod" ]; then
  echo "[INFO] Building client & server for production..."
  npm run build --workspace=server
  npm run build --workspace=client
  echo "[INFO] Starting production server..."
  nohup npm run start --workspace=server > "$LOG_FILE" 2>&1 &
  APP_PID=$!
else
  echo "[INFO] Starting MooNs development mode..."
  nohup npm run dev > "$LOG_FILE" 2>&1 &
  APP_PID=$!
fi

# Store PID
echo "$APP_PID" > "$PID_FILE"

echo "[INFO] Initializing server (PID: $APP_PID)..."
sleep 5

if is_running "$APP_PID"; then
  echo "[SUCCESS] MooNs started successfully!"
  echo "[INFO] Logs are saved to: $LOG_FILE"
  echo "[INFO] Keeping window open and streaming live output below."
  echo "[INFO] To stop server completely, run ./stop.sh in another terminal."
  echo "======================================================================"
  tail -f "$LOG_FILE"
else
  echo "[ERROR] MooNs process exited unexpectedly. Last 30 log lines:"
  echo "----------------------------------------------------------------------"
  tail -n 30 "$LOG_FILE" 2>/dev/null || true
  echo "----------------------------------------------------------------------"
  rm -f "$PID_FILE"
  echo ""
  read -p "Press Enter to exit..." || true
  exit 1
fi
