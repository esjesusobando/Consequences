# AUDITORÍA DE RUTAS DE SKILLS - DRY RUN
# ======================================
# Refactorizar referencias legacy de skills hacia la ruta canónica v4.
#
# Ejecutar con: powershell -NoProfile -ExecutionPolicy Bypass -File audit_skills_routes.ps1
# Este script hace DRY RUN: lista lo que cambiaría SIN modificar archivos.

$ErrorActionPreference = "Continue"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT = (Resolve-Path (Join-Path $SCRIPT_DIR "..\..\..\..")).Path

Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host "AUDITORIA DE RUTAS DE SKILLS - DRY RUN" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host ""

$OLD_PATHS = @(
    ".agent/02_Skills/",
    "01_Core/02_Tools/02_Skills/",
    "01_Personal_Os/01_Core/02_Tools/02_Skills/"
)
$NEW_PATH = "01_Personal_Os/01_Core/02_Tools/02_Skills/"
$PATHSPECS = @(
    "*.md", "*.py", "*.yaml", "*.yml", "*.json", "*.txt", "*.sh", "*.ps1",
    ":!**/node_modules/**", ":!**/.next/**", ":!**/dist/**", ":!**/build/**", ":!**/out/**",
    ":!**/package-lock.json", ":!**/pnpm-lock.yaml"
)

Write-Host "Rutas legacy:" -ForegroundColor Yellow
$OLD_PATHS | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
Write-Host "Ruta canonica: $NEW_PATH" -ForegroundColor Green
Write-Host ""

$results = @()
foreach ($old in $OLD_PATHS) {
    $grep = git -C $ROOT grep -n -I -F -- $old -- $PATHSPECS 2>$null
    foreach ($line in $grep) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $parts = $line -split ":", 3
        if ($parts.Count -lt 3) { continue }
        $relative = $parts[0]
        if ($relative -like ".git/*") { continue }
        $results += [PSCustomObject]@{
            Path = Join-Path $ROOT $relative
            RelativePath = $relative
            LegacyPath = $old
            LineNumber = [int]$parts[1]
            Line = $parts[2].Trim()
        }
    }
}

$grouped = $results | Group-Object -Property RelativePath
Write-Host "Total archivos con referencias: $($grouped.Count)" -ForegroundColor Cyan
Write-Host "Total lineas a revisar: $($results.Count)" -ForegroundColor Cyan
Write-Host ""

Write-Host "--- Referencias por ruta legacy ---" -ForegroundColor White
$results | Group-Object -Property LegacyPath | Sort-Object Count -Descending | ForEach-Object {
    Write-Host "  $($_.Name): $($_.Count)"
}
Write-Host ""

Write-Host "--- Archivos afectados (primeros 30) ---" -ForegroundColor White
$count = 0
foreach ($g in $grouped | Sort-Object Count -Descending) {
    $count++
    if ($count -le 30) {
        $relative = $g.Group[0].RelativePath
        Write-Host "$count. $relative" -ForegroundColor Green
        $g.Group | Select-Object -First 2 | ForEach-Object {
            $preview = $_.Line.Substring(0, [Math]::Min(90, $_.Line.Length))
            Write-Host "     L$($_.LineNumber) [$($_.LegacyPath)]: $preview" -ForegroundColor Gray
        }
    }
}

if ($grouped.Count -gt 30) {
    Write-Host ""
    Write-Host "... y $($grouped.Count - 30) archivos mas" -ForegroundColor Yellow
}

$outputFile = Join-Path $SCRIPT_DIR "migrate_list.txt"
$grouped | ForEach-Object { $_.Group[0].RelativePath } | Set-Content -LiteralPath $outputFile -Encoding UTF8
Write-Host ""
Write-Host "Lista de archivos guardada en: $outputFile" -ForegroundColor Cyan
Write-Host "DRY RUN completado. Para migrar referencias legacy, revisar migrate_skills_routes.ps1." -ForegroundColor Yellow
