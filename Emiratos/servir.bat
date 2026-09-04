@echo off
REM Arranca la maqueta de eDoc Emiratos en local y abre el navegador.
REM Se enlaza a 127.0.0.1 porque en algunos Windows «localhost» resuelve
REM primero a IPv6 y el servidor de Python solo escucha en IPv4.

cd /d "%~dp0"

set PUERTO=8000
if not "%~1"=="" set PUERTO=%~1

echo.
echo   eDoc Emiratos - maqueta de alcance
echo   http://127.0.0.1:%PUERTO%/
echo.
echo   Cierra esta ventana para detener el servidor.
echo.

start "" "http://127.0.0.1:%PUERTO%/"
python -m http.server %PUERTO% --bind 127.0.0.1
