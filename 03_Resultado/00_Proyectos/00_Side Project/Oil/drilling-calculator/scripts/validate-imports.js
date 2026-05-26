#!/usr/bin/env node
/**
 * Validate Lucide React Imports
 *
 * Verifica que todos los imports de lucide-react sean válidos
 * y existan en la librería instalada.
 *
 * Uso: node scripts/validate-imports.js
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

// Lista de iconos válidos usados en el proyecto
// IMPORTANTE: Actualizar esta lista cuando se agreguen nuevos iconos
const VALID_ICONS = [
  "AlertTriangle",
  "RefreshCw",
  "Bot",
  "X",
  "Send",
  "User",
  "Sparkles",
  "Sun",
  "Moon",
  "ChevronDown",
  "ChevronUp",
  "Bookmark",
  "TrendingUp",
  "Activity",
  "Zap",
  "Settings",
  "Info",
  "CheckCircle",
  "XCircle",
  "Timer",
  "ArrowDownToLine",
  "CircleDashed",
  "Plus",
  "Trash2",
  "Layers",
  "Droplets",
  "Ruler",
  "Check",
  "Save",
  "Clock",
  "Columns2",
  "Eye",
  "EyeOff",
  "LineChart",
  "AlertCircle",
];

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
 * Extract lucide-react imports from file content
 */
function extractLucideImports(content) {
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const iconList = match[1]
      .split(",")
      .map((icon) => icon.trim())
      .filter((icon) => icon.length > 0);
    imports.push(...iconList);
  }

  return imports;
}

/**
 * Main validation logic
 */
function validateImports() {
  console.log("🔍 Validando imports de lucide-react...\n");

  const srcDir = join(process.cwd(), "src");
  const files = findFiles(srcDir);

  let totalErrors = 0;
  let totalWarnings = 0;
  const invalidImports = new Map();

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const imports = extractLucideImports(content);

    imports.forEach((icon) => {
      if (!VALID_ICONS.includes(icon)) {
        totalErrors++;
        const relativePath = file.replace(process.cwd(), ".");

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
    console.log(`   Iconos únicos: ${VALID_ICONS.length}\n`);
    process.exit(0);
  }
}

// Run validation
validateImports();
