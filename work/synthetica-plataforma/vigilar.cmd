@echo off
rem Vigilante de Synthetica: cada minuto lee lo que hace el motor de agentes y lo muestra en la plataforma.
rem Deja esta ventana abierta mientras trabajas; ciérrala (o Ctrl+C) para detenerlo.
title Synthetica - vigilante del motor
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
python -u operador.py vigilar
pause
