@echo off
title Vocacion GO - Servidor Local
color 0A
echo.
echo  ================================================
echo   VOCACION GO - Iniciando servidor local...
echo  ================================================
echo.
echo  Abre tu navegador en: http://localhost:8000
echo  Para cerrar esta ventana: Ctrl+C
echo.

REM Verificar que Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Python no encontrado.
    echo  Descarga Python desde: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Lanzar el servidor
python servidor.py

pause
