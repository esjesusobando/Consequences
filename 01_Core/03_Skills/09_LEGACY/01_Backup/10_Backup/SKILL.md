---
name: backup-system
description: "Sistema de backup y recuperación del PersonalOS. Triggers: backup, restore, recover, respaldo, recuperar, sync backup."
version: 1.0.0
---

# Backup System

## Esencia Original

> **Metaskill**: Habilidad para gestionar backups automáticos y recuperación del sistema, asegurando continuidad y protección de datos del PersonalOS.

Esta skill es el **escudo de protección** del PersonalOS. Garantiza que ningún cambio rompa el sistema irrevocablemente.

## Propósito

Gestión de backups y recuperación del sistema PersonalOS.

## Cuándo Usar

- "backup"
- "respaldar"
- "restore"
- "recuperar"
- Antes de cambios importantes

## Categorías

- 01_Local: Backups locales
- 02_Cloud: Backups en nube
- 03_Archive: Archivos históricos

## Scripts Relacionados

- Ritual de cierre incluye backup automático

---

## ⚠️ Gotchas

### ERROR 1: Backup sin verificar integridad
- **Por qué**: Backups corruptos no se detectan hasta que se necesitan恢复
- **Solución**: Always verificar checksum después de crear backup. Usar --checksum en rsync

### ERROR 2: Backups sin rotación
- **Por qué**: Disco se llena con versiones antiguas innecesarias
- **Solución**: Implementar retención: 7 diarios, 4 semanales, 12 mensuales

### ERROR 3: No probar restore
- **Por qué**: Backup que no se puede restaurar es inútil
- **Solución**: Testear restore mensualmente en ambiente separado

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
