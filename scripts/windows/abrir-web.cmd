@echo off
setlocal
rem Arranca la web de Equilab en este ordenador (modo desarrollo).
cd /d "%~dp0..\.."
if not exist node_modules goto sininstalar
echo Arrancando la web de Equilab...
echo Cuando aparezca la palabra Ready, abre http://localhost:3000 en el navegador.
echo Deja esta ventana abierta mientras uses la web. Para pararla, cierrala.
echo.
call npm run dev
pause
exit /b 0
:sininstalar
echo Faltan las dependencias. Abre primero verificar-web.cmd y espera a que termine.
pause
exit /b 1
