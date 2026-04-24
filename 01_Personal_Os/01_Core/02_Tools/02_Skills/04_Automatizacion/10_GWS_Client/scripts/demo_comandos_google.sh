#!/bin/bash
# GWS CLI Demo Script
# Demostrando la velocidad increíble del manejo asíncrono con Google Workspace en lugar de la UI.

echo "[GWS CLI] Identificando documentos inactivos de RRHH..."
echo "Ejecutando: gws drive list --folder 'RRHH_Archivos' --older-than 2024-01-01"
sleep 1
echo "- Contrato_2023.pdf"
echo "- Planilla_Onboarding_V1.xlsx"
echo "[GWS CLI] Borrando acceso público para asegurar confidencialidad..."
echo "Ejecutando: gws drive permissions revoke --user 'ALL' --file-id X8F..."
echo "Completado en 120ms."
