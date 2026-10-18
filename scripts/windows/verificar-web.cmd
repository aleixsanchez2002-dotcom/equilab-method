@echo off
setlocal
rem Verificacion de la web de Equilab: instala dependencias, pasa el lint y compila.
rem No modifica el codigo: solo crea la carpeta node_modules y la compilacion .next.
cd /d "%~dp0..\.."
set "LOG=%~dp0..\..\verificacion.log"
echo Verificacion Equilab %date% %time% > "%LOG%"
where node >nul 2>nul
if errorlevel 1 goto sinnode
echo Node: >> "%LOG%"
node -v >> "%LOG%" 2>&1
echo npm: >> "%LOG%"
call npm -v >> "%LOG%" 2>&1
echo.
echo [1/3] Instalando dependencias, puede tardar unos minutos...
echo ===== npm ci ===== >> "%LOG%"
call npm ci --no-audit --no-fund >> "%LOG%" 2>&1
echo [npm ci codigo %errorlevel%] >> "%LOG%"
echo [2/3] Revisando el codigo con lint...
echo ===== npm run lint ===== >> "%LOG%"
call npm run lint >> "%LOG%" 2>&1
echo [lint codigo %errorlevel%] >> "%LOG%"
echo [3/3] Compilando la web...
echo ===== npm run build ===== >> "%LOG%"
call npm run build >> "%LOG%" 2>&1
echo [build codigo %errorlevel%] >> "%LOG%"
echo FIN >> "%LOG%"
echo.
echo Listo. El resultado esta en verificacion.log, en la carpeta del proyecto.
pause
exit /b 0
:sinnode
echo NO SE ENCUENTRA NODE >> "%LOG%"
echo.
echo No se encuentra Node.js en este ordenador.
echo Instala la version LTS desde https://nodejs.org/ y vuelve a abrir este archivo.
pause
exit /b 1
