# 10_Git_Directions — Regla de Configuración de Remotes

> Evita confusiones entre proyectos verificando siempre el remote antes de hacer push.

## Los 2 Repos Principales

### 1. Think Different OS (este proyecto)
- **Remote**: `origin`
- **URL**: `https://github.com/iastrongmagazine/Dream_Team.git`
- **Rama**: `master`
- **Path local**: `personal-os/Think_Different`
- **Push command**: `git push origin master`

### 2. OIM Website / Office Installations
- **Remote**: `oim-web`
- **URL**: `https://github.com/esjesusobando/Office_Installations_.git`
- **Rama**: `master`
- **Path local**: `personal-os/Think_Different/03_Resultado/OIM_Website_Backup`
- **Push command**: `git push oim-web master`

## Antes de Hacer Push — Checklist

1. **¿Estoy en el proyecto correcto?**
   - `git remote -v` → verificar que el remote apunta al repo correcto

2. **¿Cuál es mi remote?**
   - `origin` = Think Different OS (Dream_Team)
   - `oim-web` = OIM Website (Office_Installations_)

3. **¿El remote existe?**
   - `iastrongmagazine/Dream_Team` ✓ (existe)
   - `esjesusobando/Office_Installations_` ✓ (existe)
   - `iastrongmagazine/Think_Different` ✗ NO existe
   - `esjesusobando/Think_Different` ✗ NO existe

## Si Te Pierdes

```bash
# Ver remotes configurados
git remote -v

# Ver rama actual y tracking
git branch -vv

# Ver commits recientes
git log --oneline -3
```

## Configuración Guardada

Ver archivo: `01_Personal_Os/04_Operations/01_Auto_Improvement/REPO_CONFIG.md`

## Símbolos de Warning

⚠️ **"Repository not found"** → Verificaste mal el remote, checkea `git remote -v`
⚠️ **"Permission denied"** → Estás en el repo equivocado o no tienes acceso
⚠️ **Confusión de proyectos** → Recuerda: Think Different ≠ OIM Website