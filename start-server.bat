@echo off
title Spiritual Parking Notice Generator - OBS Server
echo ======================================================================
echo    Spiritual Program Parking Notice Generator - OBS Local Server
echo ======================================================================
echo.
echo Starting local broadcast server on port 3000...
echo.
echo * Web Interface:        http://localhost:3000
echo * OBS Browser Source:   http://localhost:3000/obs.html
echo.
echo Opening web application in your default browser...
start http://localhost:3000
echo.
node server.js
pause
