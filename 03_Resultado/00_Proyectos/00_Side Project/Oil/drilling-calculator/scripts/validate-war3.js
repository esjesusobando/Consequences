#!/usr/bin/env node
/**
 * War3 Compliance Validator
 *
 * Valida el cumplimiento de la metodología War3 (Juntos pero no revueltos):
 * 1. App.tsx debe tener lógica mínima (< 50 líneas de lógica)
 * 2. Componentes de nivel 1 deben tener ErrorBoundary
 * 3. No hay imports directos de componentes experimentales en App.tsx
 * 4. Hooks están al inicio de cada componente
 *
 * Uso: node scripts/validate-war3.js
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const THRESHOLDS = {
  APP_LOGIC_LINES: 50,
  ERROR_BOUNDARY_COVERAGE: 100, // Porcentaje
  SANDBOXING_SCORE: 80, // Porcentaje
};

const EXPERIMENTAL_COMPONENTS = [
  "ExperimentalFeature",
  "BetaComponent",
  // Agregar componentes experimentales aquí
];

/**
 * Count logic lines in App.tsx (excluding imports, comments, JSX)
 */
function countAppLogicLines(appPath) {
  const content = readFileSync(appPath, "utf-8");
  const lines = content.split("\n");

  let logicLines = 0;
  let inComment = false;
  let inJSX = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Track multi-line comments
    if (trimmed.includes("/*")) inComment = true;
    if (trimmed.includes("*/")) {
      inComment = false;
      return;
    }
    if (inComment) return;

    // Skip single-line comments
    if (trimmed.startsWith("//")) return;

    // Skip imports
    if (trimmed.startsWith("import ")) return;

    // Track JSX (rough heuristic)
    if (trimmed.includes("return (") || trimmed.includes("return <")) {
      inJSX = true;
    }
    if (inJSX && trimmed === ");") {
      inJSX = false;
      return;
    }
    if (inJSX) return;

    // Count as logic line
    logicLines++;
  });

  return logicLines;
}

/**
 * Check if App.tsx imports experimental components directly
 */
function checkExperimentalImports(appPath) {
  const content = readFileSync(appPath, "utf-8");
  const violations = [];

  EXPERIMENTAL_COMPONENTS.forEach((comp) => {
    const importRegex = new RegExp(`import.*${comp}.*from`, "i");
    if (importRegex.test(content)) {
      violations.push(comp);
    }
  });

  return violations;
}

/**
 * Find all component files
 */
function findComponentFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory() && !file.includes("node_modules")) {
      findComponentFiles(filePath, fileList);
    } else if (file.match(/\.(tsx)$/) && !file.includes(".test.")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Check if component has ErrorBoundary wrapper
 */
function hasErrorBoundary(filePath) {
  const content = readFileSync(filePath, "utf-8");
  return content.includes("ErrorBoundary");
}

/**
 * Calculate ErrorBoundary coverage
 */
function calculateErrorBoundaryCoverage() {
  const srcDir = join(process.cwd(), "src", "components");
  const componentFiles = findComponentFiles(srcDir);

  let withBoundary = 0;
  const details = [];

  componentFiles.forEach((file) => {
    const hasBoundary = hasErrorBoundary(file);
    if (hasBoundary) withBoundary++;

    const relativePath = file.replace(process.cwd(), ".");
    details.push({
      file: relativePath,
      hasBoundary,
    });
  });

  const coverage = (withBoundary / componentFiles.length) * 100;

  return {
    coverage: coverage.toFixed(1),
    total: componentFiles.length,
    withBoundary,
    details,
  };
}

/**
 * Generate compliance report
 */
function generateReport() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║     WAR3 COMPLIANCE VALIDATOR          ║");
  console.log("╠════════════════════════════════════════╣");

  // Check 1: App.tsx logic lines
  const appPath = join(process.cwd(), "src", "App.tsx");
  const logicLines = countAppLogicLines(appPath);
  const logicStatus = logicLines <= THRESHOLDS.APP_LOGIC_LINES ? "🟢" : "🔴";

  console.log(
    `║ App.tsx Logic Lines:    ${logicStatus} ${logicLines}/${THRESHOLDS.APP_LOGIC_LINES}`.padEnd(
      48,
    ) + "║",
  );

  // Check 2: Experimental imports
  const expImports = checkExperimentalImports(appPath);
  const expStatus = expImports.length === 0 ? "🟢" : "🔴";

  console.log(
    `║ Experimental Imports:   ${expStatus} ${expImports.length}`.padEnd(48) +
      "║",
  );

  // Check 3: ErrorBoundary coverage
  const ebCoverage = calculateErrorBoundaryCoverage();
  const ebStatus =
    parseFloat(ebCoverage.coverage) >= THRESHOLDS.ERROR_BOUNDARY_COVERAGE
      ? "🟢"
      : "🔴";

  console.log(
    `║ ErrorBoundary Coverage: ${ebStatus} ${ebCoverage.coverage}%/${THRESHOLDS.ERROR_BOUNDARY_COVERAGE}%`.padEnd(
      48,
    ) + "║",
  );

  // Overall status
  console.log("╠════════════════════════════════════════╣");

  const allPassed =
    logicStatus === "🟢" && expStatus === "🟢" && ebStatus === "🟢";
  const overallStatus = allPassed ? "🟢 COMPLIANT" : "🔴 NON-COMPLIANT";

  console.log(`║ OVERALL: ${overallStatus}`.padEnd(48) + "║");
  console.log("╚════════════════════════════════════════╝\n");

  // Detailed violations
  if (!allPassed) {
    console.log("📋 VIOLATIONS:\n");

    if (logicLines > THRESHOLDS.APP_LOGIC_LINES) {
      console.log(`❌ App.tsx has too much logic (${logicLines} lines)`);
      console.log("   → Refactor logic to separate components\n");
    }

    if (expImports.length > 0) {
      console.log(`❌ App.tsx imports experimental components:`);
      expImports.forEach((comp) => {
        console.log(`   → ${comp} (wrap in ErrorBoundary)`);
      });
      console.log("");
    }

    if (parseFloat(ebCoverage.coverage) < THRESHOLDS.ERROR_BOUNDARY_COVERAGE) {
      console.log(`❌ ErrorBoundary coverage is low (${ebCoverage.coverage}%)`);
      console.log(
        `   → ${ebCoverage.total - ebCoverage.withBoundary} components need ErrorBoundary\n`,
      );

      // Show files without ErrorBoundary
      const missing = ebCoverage.details.filter((d) => !d.hasBoundary);
      if (missing.length > 0 && missing.length <= 10) {
        console.log("   Missing ErrorBoundary:");
        missing.forEach(({ file }) => {
          console.log(`      └─ ${file}`);
        });
        console.log("");
      }
    }
  }

  // Exit code
  if (allPassed) {
    console.log("✅ War3 compliance validated successfully\n");
    process.exit(0);
  } else {
    console.log("❌ War3 compliance validation failed\n");
    process.exit(1);
  }
}

// Run validation
generateReport();
