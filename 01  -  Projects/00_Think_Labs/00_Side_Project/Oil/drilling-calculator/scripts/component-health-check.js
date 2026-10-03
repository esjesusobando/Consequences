#!/usr/bin/env node
/**
 * Component Health Check
 *
 * Ejecuta una suite completa de validaciones para asegurar
 * la salud del proyecto React antes de commits.
 *
 * Uso: node scripts/component-health-check.js
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";

const CHECKS = [
  {
    name: "TypeScript Compilation",
    cmd: "npx tsc --noEmit",
    critical: true,
    description: "Verifica errores de tipos",
  },
  {
    name: "Import Validation",
    cmd: "node scripts/validate-imports.js",
    critical: true,
    description: "Valida imports de lucide-react",
  },
  {
    name: "ESLint",
    cmd: "npx eslint src/ --ext .ts,.tsx --max-warnings 0",
    critical: false,
    description: "Detecta problemas de código",
  },
];

/**
 * Run a single check
 */
function runCheck(check) {
  const startTime = Date.now();

  try {
    execSync(check.cmd, {
      stdio: "pipe",
      encoding: "utf-8",
    });

    const duration = Date.now() - startTime;
    return {
      passed: true,
      duration,
      output: null,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      passed: false,
      duration,
      output: error.stdout || error.stderr,
    };
  }
}

/**
 * Format duration in human-readable format
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Print header
 */
function printHeader() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     DRILLING CALCULATOR - COMPONENT HEALTH CHECK       ║");
  console.log("╠════════════════════════════════════════════════════════╣");
}

/**
 * Print footer
 */
function printFooter(allPassed, totalDuration) {
  console.log("╠════════════════════════════════════════════════════════╣");

  if (allPassed) {
    console.log("║ STATUS: 🟢 PURE GREEN - All checks passed             ║");
  } else {
    console.log("║ STATUS: 🔴 FAILED - Some checks failed                ║");
  }

  console.log(
    `║ Total duration: ${formatDuration(totalDuration).padEnd(38)} ║`,
  );
  console.log("╚════════════════════════════════════════════════════════╝");
}

/**
 * Main execution
 */
function main() {
  printHeader();

  let allPassed = true;
  let criticalFailed = false;
  const results = [];
  const startTime = Date.now();

  CHECKS.forEach((check, index) => {
    const checkNum = (index + 1).toString().padStart(2, "0");
    console.log(`║ [${checkNum}] ${check.name.padEnd(46)} ║`);
    console.log(`║     ${check.description.padEnd(50)} ║`);

    const result = runCheck(check);
    results.push({ check, result });

    if (result.passed) {
      console.log(
        `║     ✅ PASSED (${formatDuration(result.duration)})`.padEnd(56) + "║",
      );
    } else {
      allPassed = false;
      if (check.critical) {
        criticalFailed = true;
        console.log(
          `║     ❌ FAILED (CRITICAL) (${formatDuration(result.duration)})`.padEnd(
            56,
          ) + "║",
        );
      } else {
        console.log(
          `║     ⚠️  FAILED (WARNING) (${formatDuration(result.duration)})`.padEnd(
            56,
          ) + "║",
        );
      }
    }

    console.log("║                                                        ║");
  });

  const totalDuration = Date.now() - startTime;
  printFooter(allPassed, totalDuration);

  // Print detailed errors if any
  if (!allPassed) {
    console.log("\n📋 DETALLES DE ERRORES:\n");

    results.forEach(({ check, result }) => {
      if (!result.passed && result.output) {
        console.log(`❌ ${check.name}:`);
        console.log(result.output);
        console.log("");
      }
    });
  }

  // Exit with appropriate code
  if (criticalFailed) {
    console.log(
      "❌ Checks críticos fallaron. Corrige los errores antes de continuar.\n",
    );
    process.exit(1);
  } else if (!allPassed) {
    console.log("⚠️  Algunos checks no pasaron, pero no son críticos.\n");
    process.exit(0);
  } else {
    console.log(
      "✅ Todos los checks pasaron. El proyecto está en PURE GREEN.\n",
    );
    process.exit(0);
  }
}

// Run
main();
