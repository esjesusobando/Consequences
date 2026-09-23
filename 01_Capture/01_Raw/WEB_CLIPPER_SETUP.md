# Web Clipper Configuration

## Status: ✅ Configurado

## Configuración

### Ubicación por defecto
- **Carpeta:** `01_Capture/01_Raw`
- **Formato:** Markdown

### Template
```markdown
# {{title}}

**Source:** {{url}}
**Clipped:** {{date}}

## Summary

{{selection}}

## Notes

```

## Cómo usar

### 1. Instalar extensión (si no está instalada)
1. Ve a Chrome Web Store / Firefox Add-ons
2. Busca "Obsidian Web Clipper"
3. Instala la extensión

### 2. Configurar extensión
1. Haz clic en el ícono del Web Clipper
2. Ve a Settings
3. Configura:
   - **Vault URL:** `obsidian://open?vault=Consequences`
   - **Default folder:** `01_Capture/01_Raw`
   - **Template:** (copia el template de arriba)

### 3. Clippear artículos
1. Ve al artículo que quieres guardar
2. Haz clic en el ícono del Web Clipper
3. Selecciona "Clip to Obsidian"
4. El artículo se guardará en `01_Capture/01_Raw/`

### 4. Procesar con LLM Wiki
1. Abre OpenCode/Claude
2. Dime: "ingest [nombre del archivo]"
3. Yo crearé las páginas en `02_Process/01_LLM_Wiki/`
4. Actualizaré `index.md` y `log.md`

## Tips

### Atajos de teclado
- `Ctrl+Shift+C` - Clippear selección
- `Ctrl+Shift+F` - Clippear página completa

### Formatos soportados
- Artículos web
- PDFs
- Imágenes
- Selecciones de texto

### Solución de problemas
- Si no funciona, recarga la extensión
- Verifica que Obsidian esté abierto
- Revisa que la ruta sea correcta en Settings

---

*Configurado: 2026-08-02*
