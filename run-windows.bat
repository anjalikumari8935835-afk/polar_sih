@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo ============================================================
echo       POLAR SCIENCE PORTAL - WINDOWS LAUNCHER
echo ============================================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python was not found.
  echo Install Python 3.10+ and enable "Add Python to PATH".
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js/npm was not found.
  echo Install Node.js 18+ and reopen this terminal.
  pause
  exit /b 1
)

for /f "delims=" %%P in ('powershell -NoProfile -Command "$p=8000; while($true){try{$c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',$p); $c.Close(); $p++}catch{break}}; Write-Output $p"') do set "BACKEND_PORT=%%P"
for /f "delims=" %%P in ('powershell -NoProfile -Command "$p=3000; while($true){try{$c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',$p); $c.Close(); $p++}catch{break}}; Write-Output $p"') do set "FRONTEND_PORT=%%P"

set "AI_BACKEND_URL=http://127.0.0.1:%BACKEND_PORT%"
set "AI_BACKEND_PORT=%BACKEND_PORT%"

echo Backend : %AI_BACKEND_URL%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo.

if not exist "ai_backend\.venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  python -m venv ai_backend\.venv
  if errorlevel 1 (
    echo ERROR: Could not create the Python virtual environment.
    pause
    exit /b 1
  )
)

echo Checking Python dependencies...
"ai_backend\.venv\Scripts\python.exe" -m pip install -r ai_backend\requirements.txt
if errorlevel 1 (
  echo ERROR: Python dependencies could not be installed.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: Frontend dependencies could not be installed.
    pause
    exit /b 1
  )
)

echo.
echo Starting AI backend...
start "Polar AI Backend" cmd /k call "%~dp0start-backend-windows.bat" "%BACKEND_PORT%"

echo Waiting for AI backend...
set "READY="
for /l %%N in (1,1,40) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:%BACKEND_PORT%/api/status' -TimeoutSec 1; if($r.StatusCode -eq 200){exit 0}else{exit 1} } catch { exit 1 }"
  if not errorlevel 1 (
    set "READY=1"
    goto :backend_ready
  )
  timeout /t 1 /nobreak >nul
)

:backend_ready
if not defined READY (
  echo ERROR: AI backend did not become ready on port %BACKEND_PORT%.
  echo Check the "Polar AI Backend" window.
  pause
  exit /b 1
)

echo AI backend is ready.
echo.
echo Starting Polar Science Portal...
start "Polar Science Portal" cmd /k call "%~dp0start-frontend-windows.bat" "%FRONTEND_PORT%" "%AI_BACKEND_URL%"

timeout /t 4 /nobreak >nul
start "" "http://localhost:%FRONTEND_PORT%"

echo.
echo ============================================================
echo   Polar Science Portal is running
echo   Website: http://localhost:%FRONTEND_PORT%
echo   AI API : http://127.0.0.1:%BACKEND_PORT%
echo ============================================================
echo.
echo Two terminal windows were opened for the backend and frontend.
echo Close those windows to stop the project.
echo.
pause
