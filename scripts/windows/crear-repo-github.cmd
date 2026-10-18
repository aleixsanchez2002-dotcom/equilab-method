@echo off
rem Se vuelve a abrir dentro de una consola que no se cierra sola,
rem para que siempre se pueda leer lo que ha pasado.
if not "%~1"=="dentro" (
  start "Equilab - crear repositorio" cmd /k ""%~f0" dentro"
  exit /b
)
setlocal
echo Creando el repositorio de Equilab Method...
echo Carpeta: "%~dp0..\.."
echo.
rem Crea el repositorio PRIVADO de Equilab Method en GitHub y sube el proyecto.
rem Se puede volver a abrir sin miedo: si algo ya esta hecho, lo salta.
cd /d "%~dp0..\.."

where git >nul 2>nul
if errorlevel 1 goto singit
where gh >nul 2>nul
if errorlevel 1 goto singh

echo === 1/5 Identidad de Git ===
git config --global user.name >nul 2>nul
if errorlevel 1 goto pedirnombre
goto repo
:pedirnombre
set /p NOMBRE=Tu nombre para los commits, por ejemplo Aleix Sanchez: 
set /p CORREO=El email de tu cuenta de GitHub: 
git config --global user.name "%NOMBRE%"
git config --global user.email "%CORREO%"

:repo
echo === 2/5 Repositorio local ===
if exist .git goto revisar
git init -b main

:revisar
echo === 3/5 Archivos que se van a subir ===
git add -A
git status --short
echo.
echo Revisa la lista: NO debe aparecer ningun .env.local ni datos de clientes.
echo Pulsa una tecla para continuar o cierra esta ventana para cancelar.
pause >nul
git diff --cached --quiet
if errorlevel 1 git commit -m "Estructura inicial del repositorio Equilab Method"

echo === 4/5 Sesion en GitHub ===
gh auth status >nul 2>nul
if errorlevel 1 gh auth login --hostname github.com --git-protocol https --web

echo === 5/5 Repositorio privado en GitHub ===
git remote get-url origin >nul 2>nul
if errorlevel 1 goto crear
git push -u origin main
goto fin
:crear
gh repo create equilab-method --private --source=. --remote=origin --push --description "Equilab Method: preparacion fisica para jinetes profesionales"

:fin
echo.
gh repo view --json name,visibility,url
echo.
echo Listo. Comprueba arriba que visibility dice PRIVATE.
pause
exit /b 0

:singit
echo Falta Git. Instalalo desde https://git-scm.com/download/win
echo o en una terminal con: winget install --id Git.Git -e
pause
exit /b 1
:singh
echo Falta GitHub CLI. Instalalo desde https://cli.github.com/
echo o en una terminal con: winget install --id GitHub.cli -e
echo Despues cierra y vuelve a abrir este archivo.
pause
exit /b 1
