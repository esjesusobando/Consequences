import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set substantial JSON limits for base64 image uploads
  app.use(express.json({ limit: "20mb" }));

  // Initialize Gemini Client
  let ai: GoogleGenAI | null = null;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API initialized successfully for OCR.");
    } else {
      console.warn("WARNING: GEMINI_API_KEY is not defined. OCR will run in simulation mode.");
    }
  } catch (error) {
    console.error("Error initializing Gemini client:", error);
  }

  // REAL GOOGLE GEMINI OCR API ENDPOINT
  app.post("/api/ocr", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64 payload" });
      }

      // If local API key is configured, perform real OCR call
      if (ai) {
        console.log("Calling Gemini API for OCR text extraction...");
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: "Extract all the text found in this image, retaining layout as closely as possible. Do not add conversational intro/outro text, just output the extracted text.",
            },
          ],
        });

        const extractedText = response.text || "No text could be extracted or recognized by the model.";
        return res.json({ success: true, text: extractedText, simulated: false });
      } else {
        // High-Fidelity Simulation Fallback with realistic OCR metadata
        console.log("Simulating OCR text extraction...");
        
        setTimeout(() => {
          const mockTexts = [
            "TACTICAL OPERATIONAL GUIDE\n\n- Phase 1: Establish project objectives\n- Phase 2: Design system variables\n- Phase 3: Deliver prototype\n\nAUTHORIZATION KEY: 994-OS-CNCT",
            "PERSONAL OS - COMPRA #9042\nProveedor: Industrial Logix S.A.\nFactura para: ia.strongmagazine@gmail.com\n\nSKU-CHIP-V1  x10  $450.00\nSKU-WIRE-FX  x25  $125.00\nTotal Compra: $575.00- USD\nEstado: PAGADO",
            "SOTA SYSTEM PERFORMANCE AUDIT\nCPU Utilization: 12.4%\nSync Quality: OPTIMAL (100% Parity)\nUTC Synchronizer: Active\nDB status: Connected (Postgres Client)"
          ];
          const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
          return res.json({
            success: true,
            text: `[SIMULANDO OCR - FALTA GEMINI_API_KEY EN CONFIGURACIÓN]\n\n${randomText}\n\n*Nota: Para habilitar el motor real de Inteligencia Artificial con Gemini 3.5, agregue la llave 'GEMINI_API_KEY' en el panel de Configuración de AI Studio > Secretos.*`,
            simulated: true
          });
        }, 1500);
      }
    } catch (error: any) {
      console.error("OCR API Route error:", error);
      res.status(500).json({ error: error.message || "Internal server error during text extraction" });
    }
  });

  // REAL GOOGLE GEMINI AUDIO TRANSCRIPTION ENDPOINT
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: "Missing audioBase64 payload" });
      }

      const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");

      if (ai) {
        console.log("Calling Gemini API for voice note audio transcription...");
        
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "audio/webm",
                data: cleanBase64,
              },
            },
            {
              text: "You are an expert audio transcriber. Direct transcription instruction: Transcribe exactly what is being spoken in this audio. Output ONLY the transcribed text. Do not summarize, do not add translation warnings, and do not put any conversational intro or outro.",
            },
          ],
        });

        const transcribed = response.text || "No speech could be detected or transcribed in the audio file.";
        return res.json({ success: true, text: transcribed, simulated: false });
      } else {
        console.log("Simulating voice note audio transcription (Fallback mode)...");
        
        setTimeout(() => {
          const sampleTranscripts = [
            "Revisar el stock mínimo de los procesadores Aura Core V5 en el Almacén de Sucursal Sur.",
            "Contactar al proveedor Logística Europea Express para coordinar la entrega rápida de variantes.",
            "Nueva meta operativa: Implementar el módulo de códigos de barra para rotación rápida de mercancía de hardware."
          ];
          const text = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
          return res.json({
            success: true,
            text: `[SIMULACIÓN DE DICTADO POR VOZ - FALTA GEMINI_API_KEY]\n"${text}"`,
            simulated: true
          });
        }, 1500);
      }
    } catch (error: any) {
      console.error("Transcription API Route error:", error);
      res.status(500).json({ error: error.message || "Internal server error during speech transcription" });
    }
  });

  // Serve static assets in production, otherwise Vite dev server handles it
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Dynamically loading createServer within function scope to support building CommonJS
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
