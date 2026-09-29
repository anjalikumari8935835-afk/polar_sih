@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "BACKEND_PORT=%~1"
if "%BACKEND_PORT%"=="" set "BACKEND_PORT=8000"
set "AI_BACKEND_PORT=%BACKEND_PORT%"
echo Starting Polar AI backend on http://127.0.0.1:%BACKEND_PORT%
echo.
call "%~dp0ai_backend\.venv\Scripts\python.exe" "%~dp0ai_backend\app.py"
echo.
echo AI backend stopped.
pause
