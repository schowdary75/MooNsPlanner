@echo off
title Stop moons Application
cd /d "%~dp0"

echo ===================================================
echo [INFO] Stopping moons Application...
echo ===================================================

if exist moons.pid (
    set /p moons_PID=moonNs.pid
    echo [INFO] Stopping recorded PID %moons_PID%...
    taskkill /F /T /PID %moons_PID% 2>nul
    del /f /q moons.pid 2>nul
)

echo [INFO] Terminating processes listening on ports 3000, 3001, and 5173...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,3001,5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" 2>nul

echo [SUCCESS] moons stopped successfully.
echo.
pause
