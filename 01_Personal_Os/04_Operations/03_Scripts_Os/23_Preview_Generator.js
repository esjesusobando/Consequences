/**
 * Preview_Generator.js — PersonalOS v1.0
 * Genera una previsualización HTML interactiva para los carruseles.
 */

const fs = require('fs');
const path = require('path');

function generateHTML(data) {
    const slidesHTML = data.slides.map((slide, index) => `
        <div class="slide" id="slide-${index + 1}">
            <div class="slide-content">
                <span class="slide-type">${slide.type}</span>
                <h2>${slide.title}</h2>
                <p>${slide.content}</p>
                <div class="design-note">Visual: ${slide.design_prompt}</div>
            </div>
            <div class="slide-number">${index + 1}/5</div>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview: ${data.niche}</title>
    <style>
        :root {
            --bg: #0a0a0a;
            --card: #1a1a1a;
            --accent: #00ff88;
            --text: #ffffff;
        }
        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }
        .carousel-container {
            width: 400px;
            height: 500px;
            position: relative;
            perspective: 1000px;
        }
        .slide {
            width: 100%;
            height: 100%;
            background: var(--card);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: transform 0.5s;
        }
        .slide-type {
            font-size: 10px;
            text-transform: uppercase;
            color: var(--accent);
            letter-spacing: 2px;
        }
        h2 { font-size: 24px; margin: 10px 0; }
        p { font-size: 16px; color: #ccc; line-height: 1.6; }
        .design-note {
            font-size: 11px;
            color: #666;
            font-style: italic;
            border-top: 1px solid #333;
            padding-top: 10px;
        }
        .slide-number {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: var(--accent);
        }
        .nav {
            position: absolute;
            bottom: -50px;
            display: flex;
            gap: 20px;
            width: 100%;
            justify-content: center;
        }
        button {
            background: var(--accent);
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="carousel-container">
        ${slidesHTML}
        <!-- Implementación simple de navegación visual -->
    </div>
</body>
</html>
    `;
}

// Lógica de exportación si se usa como CLI
if (require.main === module) {
    const inputPath = process.argv[2];
    if (!inputPath) {
        console.error("Uso: node Preview_Generator.js <path_to_json>");
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const html = generateHTML(data);
    const outputPath = inputPath.replace('.json', '.html');
    fs.writeFileSync(outputPath, html);
    console.log("[OK] Preview generado en: " + outputPath);
}
