@echo off
echo Starting API and Dashboard...
echo.

start "API Server" cmd /k "npm run dev:api"
timeout /t 2 /nobreak >nul
start "Dashboard" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Press any key to exit this window (servers will continue running)...
pause >nul
