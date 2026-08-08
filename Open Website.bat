@echo off
title In.Reality - Brand Site
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found on this computer.
  echo   Install it from https://nodejs.org  then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist "out\index.html" (
  echo.
  echo   The exported site is missing ^(out\index.html^).
  echo   Open a terminal here and run:  npm run export
  echo.
  pause
  exit /b 1
)

node "scripts\serve-static.js"
pause
