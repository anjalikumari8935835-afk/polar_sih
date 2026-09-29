@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "FRONTEND_PORT=%~1"
set "AI_BACKEND_URL=%~2"
if "%FRONTEND_PORT%"=="" set "FRONTEND_PORT=3000"
if "%AI_BACKEND_URL%"=="" set "AI_BACKEND_URL=http://127.0.0.1:8000"
echo Starting Polar Science Portal on http://localhost:%FRONTEND_PORT%
echo AI backend: %AI_BACKEND_URL%
echo.
call npm run dev -- -p %FRONTEND_PORT%
echo.
echo Frontend stopped.
pause
