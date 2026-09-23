#!/usr/bin/env node
/**
 * Validate Lucide React Imports
 *
 * Verifica que todos los imports de lucide-react sean válidos
 * y existan en la librería instalada (node_modules es la fuente de verdad).
 *
 * Uso: node scripts/validate-imports.js
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LUCIDE_ICONS_DIR = join(
  PKG_ROOT,
  "node_modules",
  "lucide-react",
  "dist",
  "esm",
  "icons",
);

// Componentes lucide que NO son iconos (DynamicIcon, etc.)
const NON_ICON_EXPORTS = new Set([
  "DynamicIcon",
  "Icon",
  "LucideIcon",
  "LucideProps",
  "IconNode",
  "createLucideIcon",
]);

/**
 * Recursively find all TypeScript/TSX files
 */
function findFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory() && !file.includes("node_modules")) {
      findFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract lucide-react imports from file content.
 * Ignora `import type` (tipos como LucideIcon no son iconos).
 */
function extractLucideImports(content) {
  const importRegex = /import\s+type\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]|import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const iconList = (match[1] ?? match[2])
      .split(",")
      .map((icon) => icon.trim())
      .filter((icon) => icon.length > 0 && !icon.startsWith("type "));
    imports.push(...iconList);
  }

  return imports;
}

/**
 * Static list of legacy VALID_ICONS kept for backward compat with callers
 * that reference it, but actual validation uses the installed package.
 */
export const VALID_ICONS = ["AlertTriangle"];

/**
 * Main validation logic
 */
function validateImports() {
  console.log("🔍 Validando imports de lucide-react...\n");

  if (!existsSync(LUCIDE_ICONS_DIR)) {
    console.error(
      "❌ No se encontró node_modules/lucide-react. Ejecuta npm install primero.",
    );
    process.exit(1);
  }

  // Fuente de verdad: nombres de archivos de iconos instalados (kebab-case)
  const installedIcons = new Set(
    readdirSync(LUCIDE_ICONS_DIR)
      .filter((f) => f.endsWith(".js"))
      .map((f) => f.replace(/\.js$/, "")),
  );

  // PascalCase ("Anchor") -> kebab-case ("anchor"); "BarChart3" -> "bar-chart-3"; "DRG" -> "drg"
  const pascalToKebab = (name) =>
    name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      .replace(/([a-zA-Z])(\d)/g, "$1-$2")
      .toLowerCase();

  const srcDir = join(PKG_ROOT, "src");
  const files = findFiles(srcDir);

  let totalErrors = 0;
  const invalidImports = new Map();

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const imports = extractLucideImports(content);

    imports.forEach((icon) => {
      if (NON_ICON_EXPORTS.has(icon)) return; // no es un icono, no validar
      if (!installedIcons.has(pascalToKebab(icon))) {
        totalErrors++;
        const relativePath = file.replace(PKG_ROOT, ".");

        if (!invalidImports.has(icon)) {
          invalidImports.set(icon, []);
        }
        invalidImports.get(icon).push(relativePath);
      }
    });
  });

  // Report results
  if (totalErrors > 0) {
    console.error("❌ ERRORES DETECTADOS:\n");

    invalidImports.forEach((files, icon) => {
      console.error(`   Icono inválido: "${icon}"`);
      files.forEach((file) => {
        console.error(`      └─ ${file}`);
      });
      console.error("");
    });

    console.error(`\n❌ Total: ${totalErrors} import(s) inválido(s)`);
    console.error(
      "\n💡 Sugerencia: Consulta https://lucide.dev/icons/ para iconos válidos\n",
    );
    process.exit(1);
  } else {
    console.log("✅ Todos los imports de lucide-react son válidos");
    console.log(`   Archivos analizados: ${files.length}`);
    console.log(`   Iconos únicos: ${installedIcons.size} instalados\n`);
    process.exit(0);
  }
}

// Run validation
validateImports();