# Script de migración de rutas de skills — DRY RUN por defecto
# ============================================================

$ErrorActionPreference = "Continue"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT = (Resolve-Path (Join-Path $SCRIPT_DIR "..\..\..\..")).Path

$OLD_PATHS = @(
    ".agent/02_Skills/",
    "01_Core/02_Tools/02_Skills/",
    "01_Personal_Os/01_Core/02_Tools/02_Skills/"
)
$NEW_PATH = "01_Personal_Os/01_Core/02_Tools/02_Skills/"

# Cambiar a $false solo después de revisar audit_skills_routes.ps1 y migrate_list.txt.
$DRY_RUN = $true

$listFile = Join-Path $SCRIPT_DIR "migrate_list.txt"
if (-not (Test-Path $listFile)) {
    Write-Host "No existe migrate_list.txt. Ejecuta primero audit_skills_routes.ps1." -ForegroundColor Yellow
    exit 0
}

$files = Get-Content -LiteralPath $listFile | Where-Object { $_.Trim().Length -gt 0 }
$protectedPatterns = @(
    "00_Winter_is_Coming/ROUTES.md",
    "02_Playground/01_OS_Runtime_Test.py",
    "01_Personal_Os/04_Operations/03_Scripts_Os/12_Audits/",
    "01_Personal_Os/04_Operations/00_Context_LLM/",
    "03_Resultado/04_Reportes/"
)

if ($DRY_RUN) {
    Write-Host "DRY RUN - No se modifico nada" -ForegroundColor Yellow
    Write-Host "Archivos candidatos: $($files.Count)" -ForegroundColor Cyan
    $files | Select-Object -First 50 | ForEach-Object { Write-Host "  $_" }
    if ($files.Count -gt 50) { Write-Host "  ... y $($files.Count - 50) mas" }
    exit 0
}

foreach ($file in $files) {
    $normalized = $file -replace "\\", "/"
    $isProtected = $false
    foreach ($pattern in $protectedPatterns) {
        if ($normalized.StartsWith($pattern) -or $normalized -eq $pattern) {
            $isProtected = $true
            break
        }
    }
    if ($isProtected) {
        Write-Host "Skipped protected context: $file" -ForegroundColor DarkYellow
        continue
    }

    $fullPath = Join-Path $ROOT $file
    if (Test-Path $fullPath) {
        $content = Get-Content -LiteralPath $fullPath -Raw
        foreach ($old in $OLD_PATHS) {
            $content = $content.Replace($old, $NEW_PATH)
        }
        Set-Content -LiteralPath $fullPath -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $file" -ForegroundColor Green
    }
}

Write-Host "Migracion completada." -ForegroundColor Green
