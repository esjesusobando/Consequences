#!/bin/bash
# Learning URL to Knowledge - Pipeline Runner
# Usage: ./run-pipeline.sh [URL]

URL="${1:-}"

if [ -z "$URL" ]; then
    echo "Usage: ./run-pipeline.sh [URL]"
    echo "Example: ./run-pipeline.sh https://youtube.com/watch?v=..."
    exit 1
fi

echo "=== Learning URL to Knowledge Pipeline ==="
echo "URL: $URL"
echo ""

# Step 1: Fetch content
echo "[1/4] Fetching content..."
# TODO: Integrate with Firecrawl MCP

# Step 2: Extract metadata
echo "[2/4] Extracting metadata..."

# Step 3: Generate deliverables
echo "[3/4] Generating 8 deliverables..."

# Step 4: Save to Engram
echo "[4/4] Saving to Engram..."

echo ""
echo "=== Pipeline Complete ==="
echo "Check output in: 03_Resultado/10_Contenido_Learning/"