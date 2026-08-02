@echo off
title moons Application Launcher
cd /d "%~dp0"

echo ===================================================
echo [INFO] Starting moons Application...
echo ===================================================

if not exist node_modules (
    echo [INFO] Installing root dependencies...
    call npm install
    if errorlevel 1 goto error
)

echo [INFO] Building shared workspace...
call npm run build --workspace=shared
if errorlevel 1 goto error

echo [INFO] Launching moons (Server + Client)...
echo [INFO] Press Ctrl+C to stop the application.
echo ===================================================
call npm run dev

goto end

:error
echo.
echo [ERROR] Failed to start moons. Please check error messages above.
echo.

:end
pause
