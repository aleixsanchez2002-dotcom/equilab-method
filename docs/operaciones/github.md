# GitHub: crear y configurar el repositorio

Los comandos son para **PowerShell en Windows** (Inicio → «Terminal» o
«PowerShell»). En macOS o Linux son iguales, salvo la ruta del paso 2.

> **Sin terminal:** `scripts/windows/crear-repo-github.cmd` hace los pasos 1
> a 6 con doble clic y se puede repetir sin riesgo.

## 0. Instalar Git y GitHub CLI (una sola vez)

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

Cierra la terminal, abre una nueva y comprueba:

```powershell
git --version
gh --version
```

## 1. Identidad de Git (una sola vez por ordenador)

```powershell
git config --global user.name "Aleix Sánchez"
git config --global user.email "EMAIL-DE-TU-CUENTA-DE-GITHUB"
git config --global init.defaultBranch main
```

Si no quieres que tu email aparezca en los commits, usa el que GitHub te
da en *Settings → Emails* (`…@users.noreply.github.com`).

## 2. Inicializar el repositorio local

```powershell
cd "$HOME\Documents\Equilab\equilab-method-rediseno"
git init -b main
```

## 3. Revisar qué se va a subir

```powershell
git add -A
git status
```

**Para y revisa la lista.** No debe aparecer ningún `.env.local`, ni
`node_modules`, ni `.next`, ni ningún archivo con datos de clientes. Si
aparece algo indebido, añádelo a `.gitignore`, ejecuta `git rm --cached
<archivo>` y repite `git add -A`.

## 4. Primer commit

```powershell
git commit -m "Estructura inicial del repositorio Equilab Method"
```

## 5. Iniciar sesión en GitHub

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

Se abre el navegador: copia el código que muestra la terminal y autoriza.
Comprueba la sesión con `gh auth status`.

## 6. Crear el repositorio PRIVADO y subir el código

En tu cuenta personal:

```powershell
gh repo create equilab-method --private --source=. --remote=origin --push `
  --description "Equilab Method: preparación física para jinetes profesionales"
```

O en una organización de GitHub (créala antes en github.com →
*Your organizations → New organization*, plan Free):

```powershell
gh repo create NOMBRE-ORGANIZACION/equilab-method --private --source=. --remote=origin --push `
  --description "Equilab Method: preparación física para jinetes profesionales"
```

Comprueba que es privado:

```powershell
gh repo view --json name,visibility,url
```

Debe decir `"visibility": "PRIVATE"`.

## 7. Configuración recomendada (opcional)

Sustituye `PROPIETARIO` por tu usuario o tu organización.

**Invitar a los socios** con permiso de escritura:

```powershell
gh api --method PUT repos/PROPIETARIO/equilab-method/collaborators/USUARIO-GIOVANNI -f permission=push
gh api --method PUT repos/PROPIETARIO/equilab-method/collaborators/USUARIO-ALEX -f permission=push
```

Después, cambia los `@USUARIO-…` de `.github/CODEOWNERS` por los usuarios
reales.

**Etiquetas** para las plantillas de issues:

```powershell
gh label create tarea --color 1d3461 --description "Algo que construir o cambiar"
gh label create error --color 6b2b33 --description "Algo que no funciona"
```

**Ajustes del repositorio:** borrar las ramas al fusionar, solo *squash
merge* y sin wiki:

```powershell
gh repo edit --delete-branch-on-merge --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --enable-wiki=false
```

**Proteger `main`** para que solo se pueda fusionar por PR y con la CI en
verde. En repositorios **privados**, GitHub solo lo permite con un plan
de pago (Pro, Team…). En el plan gratuito, seguid la norma de trabajar
siempre con ramas y PR.

```powershell
@'
{
  "required_status_checks": { "strict": true, "contexts": ["verificar"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null
}
'@ | gh api --method PUT repos/PROPIETARIO/equilab-method/branches/main/protection --input -
```

## 8. Día a día

```powershell
git switch main
git pull
git switch -c aleix/tema-del-cambio
# … trabajar …
git add -A
git commit -m "Área: qué cambia"
git push -u origin aleix/tema-del-cambio
gh pr create --fill
gh pr checks --watch        # espera a que la CI termine
gh pr merge --squash --delete-branch
```

Marcar una versión cuando se publique (ver `CHANGELOG.md`):

```powershell
git switch main
git pull
git tag -a v0.3.0 -m "v0.3.0"
git push origin v0.3.0
gh release create v0.3.0 --notes "Ver CHANGELOG.md"
```
