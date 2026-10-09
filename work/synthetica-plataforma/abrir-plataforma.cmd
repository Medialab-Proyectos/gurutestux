@echo off
rem Abre la plataforma Synthetica con su servidor local: los archivos que subas
rem quedan en proyectos\<proyecto>\fuentes\ dentro de esta carpeta.
cd /d "%~dp0"
python servidor.py
