#!/bin/bash
# Extrayendo Leads con Firecrawl CLI
# Este script demuestra cómo la skill puede saltarse firewalls para scrapear datos JSON limpios

echo "[Firecrawl AI] Iniciando escaneo profundo en tienda competidora..."
echo "Comando: npx @firecrawl/cli crawl https://competidor.example.com --format markdown --limit 5"
sleep 2
echo "..."
echo "Extracción exitosa (Anti-Bot Bypass: OK)."
echo "Guardado en: leads_competencia.md"
