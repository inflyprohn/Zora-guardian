import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_NAME = "gemini-4-neon";

interface ContactInquiry {
  referenceCode: string;
  name: string;
  email: string;
  interest: string;
  tankCapacity: string;
  city: string;
  receivedAt: string;
}

const inquiriesStore: ContactInquiry[] = [];

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze-tank", async (req, res) => {
    try {
      const {
        imageBase64,
        mimeType,
        tankCategory,
        mountingMaterial,
        tankContext,
        notes,
      } = req.body ?? {};

      if (!imageBase64 || typeof imageBase64 !== "string") {
        return res.status(400).json({
          error: "Debes adjuntar una fotografía válida para realizar la inspección.",
        });
      }

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      const safeMimeType =
        typeof mimeType === "string" && allowedMimeTypes.includes(mimeType)
          ? mimeType
          : "image/jpeg";

      const ai = createGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            "El servicio de análisis con Gemini no tiene una clave configurada en Settings > Secrets.",
        });
      }

      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
      const categoryLabel =
        typeof tankCategory === "string" && tankCategory.trim()
          ? tankCategory.trim()
          : typeof tankContext === "string" && tankContext.trim()
            ? tankContext.trim()
            : "Cisterna o tanque de almacenamiento";
      const materialLabel =
        typeof mountingMaterial === "string" && mountingMaterial.trim()
          ? mountingMaterial.trim()
          : "No especificado";
      const extraNotes =
        typeof notes === "string" && notes.trim()
          ? `Notas adicionales del usuario: ${notes.trim()}`
          : "Sin notas adicionales del usuario.";

      const promptText = [
        "Eres el ingeniero especialista en campo de Zora Guardian, una plataforma de monitoreo ultrasónico del nivel de agua (caja electrónica IP65 + transductor ultrasónico dual IP67).",
        `Categoría seleccionada por el usuario: ${categoryLabel}.`,
        `Material o superficie declarada donde irá el sensor: ${materialLabel}.`,
        extraNotes,
        "Analiza la fotografía adjunta con rigor técnico y responde estrictamente en español claro y directo.",
        "Evalúa en detalle:",
        "1) Qué depósito, tapa, superficie o instalación se observa en la foto y si coincide con la categoría y material declarados.",
        "2) Diagnóstico real de la superficie de montaje para fijar el sensor IP67 y la caja IP65 según el material (planitud, rigidez, grosor aparente, corrosión, grietas, condensación, exposición solar o curvatura que pueda desviar el haz ultrasónico).",
        "3) Si el nivel de agua es visible, estima el porcentaje aproximado (0 a 100), o usa -1 si está cerrado o no aplica.",
        "4) Condición del agua y estructura (sedimentos, biopelícula, sellado de tapa, humedad o filtraciones).",
        "5) Guía exacta de ubicación del sensor ultrasónico Zora Guardian (zona muerta mínima de 25 cm sobre nivel máximo, separación lateral respecto a paredes y tubo de llenado, método de fijación recomendado para ese material).",
        "6) Calificación de aptitud ('Apta para instalación directa', 'Requiere ajuste previo' o 'Imagen no concluyente'), hallazgos clave y acciones prácticas.",
        "Si la imagen no corresponde a un tanque, cisterna, tapa ni instalación hidráulica, sé honesto y marca 'Imagen no concluyente'.",
      ].join("\n");

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: safeMimeType,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction:
            "Responde siempre en JSON válido siguiendo el esquema solicitado. Usa español técnico de ingeniería hidráulica, conciso y accionable.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedSubject: {
                type: Type.STRING,
                description:
                  "Descripción breve del tipo de depósito, tapa o instalación detectada en la fotografía.",
              },
              detectedMaterialMatch: {
                type: Type.STRING,
                description:
                  "Confirmación de si la superficie observada en la foto coincide con el material seleccionado y qué material se aprecia realmente.",
              },
              estimatedLevelPercent: {
                type: Type.INTEGER,
                description:
                  "Porcentaje estimado del nivel de agua de 0 a 100 si es visible, o -1 si no es visible.",
              },
              suitabilityRating: {
                type: Type.STRING,
                description:
                  "Una de estas tres opciones exactas: 'Apta para instalación directa', 'Requiere ajuste previo', 'Imagen no concluyente'.",
              },
              surfaceMountingDiagnostic: {
                type: Type.STRING,
                description:
                  "Diagnóstico técnico específico de la superficie o material donde irá montado el sensor (fijación, sellado, rigidez, corrosión o inclinación).",
              },
              waterAndStructureCondition: {
                type: Type.STRING,
                description:
                  "Diagnóstico visual del estado del agua, paredes, sedimentos, corrosión o sellado de tapa.",
              },
              sensorPlacementGuide: {
                type: Type.STRING,
                description:
                  "Recomendación técnica de ubicación para el sensor ultrasónico Zora Guardian y la caja IP65.",
              },
              keyFindings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 3 a 4 hallazgos concretos observados en la imagen.",
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 2 a 4 acciones prácticas recomendadas para ese material y depósito.",
              },
            },
            required: [
              "detectedSubject",
              "detectedMaterialMatch",
              "estimatedLevelPercent",
              "suitabilityRating",
              "surfaceMountingDiagnostic",
              "waterAndStructureCondition",
              "sensorPlacementGuide",
              "keyFindings",
              "recommendedActions",
            ],
          },
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        return res.status(502).json({
          error: "El modelo no devolvió contenido legible para esta imagen.",
        });
      }

      const parsed = JSON.parse(rawText);
      return res.json({
        model: MODEL_NAME,
        analysis: parsed,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error inesperado al analizar la fotografía.";
      const status =
        message.includes("403") || message.includes("PERMISSION_DENIED")
          ? 403
          : message.includes("429") || message.includes("RESOURCE_EXHAUSTED")
            ? 429
            : message.includes("400") || message.includes("API_KEY_INVALID")
              ? 400
              : 500;

      let userMessage =
        "No se pudo completar el análisis de la fotografía en este momento.";
      if (status === 403 || status === 400) {
        userMessage =
          "Verifica la clave de API en Settings > Secrets para habilitar el análisis con gemini-4-neon.";
      } else if (status === 429) {
        userMessage =
          "El modelo gemini-4-neon requiere una clave de API con facturación activa o alcanzó su límite de cuota en Settings > Secrets.";
      }

      return res.status(status).json({
        error: userMessage,
        details: message,
      });
    }
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, interest, tankCapacity, city } = req.body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Ingresa tu nombre completo." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Ingresa un correo electrónico válido." });
    }

    const referenceCode = `ZG-${Math.floor(100000 + Math.random() * 900000)}`;
    const inquiry: ContactInquiry = {
      referenceCode,
      name: name.trim(),
      email: email.trim(),
      interest:
        typeof interest === "string" && interest.trim()
          ? interest.trim()
          : "Instalación en mi hogar",
      tankCapacity:
        typeof tankCapacity === "string" && tankCapacity.trim()
          ? tankCapacity.trim()
          : "10,000 L",
      city: typeof city === "string" && city.trim() ? city.trim() : "Honduras",
      receivedAt: new Date().toISOString(),
    };

    inquiriesStore.push(inquiry);

    return res.status(201).json({
      inquiry,
      message: `Consulta registrada con referencia ${referenceCode}. Nuestro equipo revisará los detalles de tu instalación.`,
    });
  });

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build no encontrado.");
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zora Guardian server running on http://localhost:${PORT}`);
  });
}

startServer();
