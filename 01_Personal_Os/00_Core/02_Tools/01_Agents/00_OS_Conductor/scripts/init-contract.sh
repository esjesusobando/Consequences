#!/usr/bin/env bash
# ============================================================================
# init-contract.sh — Sprint Contract Scaffolder
# ============================================================================
# Usage: ./scripts/init-contract.sh "Flow Name" "2026-05-28" "Feature description"
#
# Scaffolds a Sprint Contract markdown file in references/contracts/
# ============================================================================

set -euo pipefail

CONDUCTOR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="${CONDUCTOR_DIR}/references/contracts"

FLOW_NAME="${1:-}"
DATE="${2:-$(date +%Y-%m-%d)}"
FEATURE="${3:-}"

if [ -z "$FLOW_NAME" ]; then
    echo "❌ Usage: $0 \"Flow Name\" [date] [feature description]"
    echo "   Example: $0 \"lanzamiento-producto\" 2026-05-28 \"Lanzar newsletter semanal\""
    exit 1
fi

mkdir -p "$CONTRACTS_DIR"

ID="${FLOW_NAME// /-}-${DATE}"
FILENAME="${ID}.md"
FILEPATH="${CONTRACTS_DIR}/${FILENAME}"

if [ -f "$FILEPATH" ]; then
    echo "⚠️  Contract already exists: $FILEPATH"
    echo "   Use a different flow name or date."
    exit 1
fi

cat > "$FILEPATH" << CONTRACT
# 📜 Sprint Contract: ${FLOW_NAME}

**ID:** ${ID}
**Date:** ${DATE}
**Feature:** ${FEATURE:-TBD}
**Status:** PROPOSED

## 📋 Criterios Acordados

| # | Criterio | Verificación | Estado |
|---|----------|-------------|--------|
| 1 | [Criterio 1] | automated/manual/test | [ ] |
| 2 | [Criterio 2] | automated/manual/test | [ ] |
| 3 | [Criterio 3] | automated/manual/test | [ ] |

## 📝 Notas

- Sprint contract negociado entre OS Conductor y usuario
- Los criterios definen "done" — no se modifican durante la ejecución
- Cada skill reporta contra sus criterios asignados
CONTRACT

echo "✅ Sprint Contract created: $FILEPATH"
echo "   Edit the criteria list and start executing."
