# SDD — Elite_Portfolio Migration
**Fecha:** 2026-05-22
**Proyecto:** 08_Elite_Portfolio
**Prioridad:** P0 — CRÍTICA

---

## 1. Problem

El proyecto `08_Elite_Portfolio` está en Next 14.2.25 / React 18.3.1, muy desactualizado respecto a:
- Next 16.2.6 (stable)
- React 19.2.6 (stable)
- Tailwind CSS 4.x

Los upgrades disponibles son todos **majors**, requieren SDD propio.

---

## 2. Objetivo

Migrar a:
- **Next:** 14.2.25 → 16.2.6
- **React:** 18.3.1 → 19.2.6
- **React DOM:** 18.3.1 → 19.2.6
- **Tailwind:** 3.4.17 → 4.x (o 3.4.x latest)
- **ESLint:** 8.57.1 → 10.4.0

---

## 3. Estado Actual

```
08_Elite_Portfolio/
├── package.json
├── next: 14.2.25
├── react: 18.3.1
├── react-dom: 18.3.1
├── eslint: 8.57.1
├── eslint-config-next: 14.2.25
├── framer-motion: 11.18.2
├── tailwind-merge: 2.6.0
└── src/
```

---

## 4. Riesgos

| Componente | Riesgo | Mitigation |
|------------|--------|------------|
| Next 14 → 16 | Breaking changes en App Router | Testing completo |
| React 18 → 19 | Breaking changes en hooks | Revisar breaking changes |
| ESLint 8 → 10 | Reglas deprecated | `--fix` automatico |
| Tailwind | Cambios en config | Migración guiada |

---

## 5. Plan de Migración

### Fase 1: Pre-migration
1. Crear branch: `migration/next16-react19`
2. Backup package.json y config
3. Documentar custom configs (next.config.js, tailwind.config.ts)

### Fase 2: Dependencies
```bash
npm install next@16 react@19 react-dom@19 --save
npm install eslint@10 eslint-config-next@16 --save
npm install framer-motion@latest tailwind-merge@latest --save
```

### Fase 3: Config Updates
- `next.config.ts` → revisar breaking changes
- `tailwind.config.ts` → compat with Tailwind 4 or latest 3.x
- `tsconfig.json` → actualizar target si necesario

### Fase 4: Testing
```bash
npm run lint
npm run build
npm run dev
```

---

## 6. Success Criteria

- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] App funciona en dev mode
- [ ] No hay console errors en runtime

---

## 7. Timeline

- **Branch creado:** 2026-05-22
- **Dependencies actualizadas:** 2026-05-22
- **Config migrated:** 2026-05-22
- **Testing:** 2026-05-22
- **Merge:** Pending review