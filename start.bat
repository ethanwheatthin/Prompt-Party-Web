@echo off
title Prompt Party - Startup
echo ============================================
echo           PROMPT PARTY - Starting Up
echo ============================================
echo.

:: Start the backend server
echo [1/2] Starting backend server on port 3000...
cd /d "%~dp0backend"
start "Prompt Party Backend" cmd /k "npm run dev"

:: Wait for backend to be ready
echo       Waiting for backend to be ready...
timeout /t 4 /nobreak >nul

:: Start the frontend dev server
echo [2/2] Starting host UI on port 5173...
cd /d "%~dp0"
start "Prompt Party Host UI" cmd /k "npm run dev"

echo.
echo ============================================
echo   Backend:   http://localhost:3000
echo   Host UI:   http://localhost:5173
echo   Player:    http://localhost:3000/player.html
echo ============================================
echo.
echo Both servers are running in separate windows.
echo Close this window or press any key to exit.
pause >nul
