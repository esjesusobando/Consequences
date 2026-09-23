import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  Sparkles,
  Moon,
  Sun,
  X,
  Loader2,
  Paperclip,
  Mic,
  Settings,
  FileText,
  Trash2,
  Check,
  Play,
} from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import "./JetroChat.css";

// ─── Gemini REST Configuration ──────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("🧩 [DEBUG] Jetro AI Config:", {
  hasKey: !!GEMINI_API_KEY,
  keyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 4) + "..." : "NONE",
});
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface JetroAction {
  store: "wellData" | "mudData" | "pumpData" | "formationData";
  field: string;
  value: number | string;
}

interface ActionBlock {
  type: "ACTIONABLE_RECOMMENDATION";
  actions: JetroAction[];
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  attachments?: { base64: string; mimeType: string; isPdf: boolean }[];
  actionBlock?: ActionBlock;
  applied?: boolean;
}

interface AttachmentData {
  file: File;
  base64: string;
  mimeType: string;
  isPdf: boolean;
}

const VIEW_SUGGESTIONS: Record<
  string,
  { label: string; text: string; icon: any }[]
> = {
  drilling: [
    {
      label: "🏗️ Optimizar Sarta",
      text: "Analiza la geometría actual de la sarta y sugiere ajustes ejecutables para mejorar la eficiencia mecánica y de limpieza del hoyo. Proporciona el bloque JSON con los cambios recomendados.",
      icon: Sparkles,
    },
    {
      label: "📐 Verificar Sobrebalance",
      text: "Calcula el sobrebalance real (Hidrostática - Poro) y el margen a fractura (Fractura - Hidrostática) con los datos actuales. ¿Necesito ajustar el peso del lodo? Proporciona el bloque JSON si es necesario.",
      icon: Bot,
    },
  ],
  formation: [
    {
      label: "⚠️ Ventana de Lodo",
      text: "Analiza la ventana operativa de lodo actual (MW_min vs MW_max) y dime si el peso de lodo actual está correctamente posicionado. Si necesito ajuste, proporciona el bloque JSON ejecutable.",
      icon: Sparkles,
    },
    {
      label: "🎯 Riesgo de Kick",
      text: "Con el sobrebalance actual y el gradiente de poro, ¿cuál es el riesgo de kick en este pozo? ¿Debo ajustar el peso del lodo? Dame el análisis y el JSON si aplica.",
      icon: Bot,
    },
  ],
  fluids: [
    {
      label: "🧪 Optimizar Reología",
      text: "Analiza mis lecturas de Fann 35 actuales (PV/YP/Geles) y el CCI resultante. ¿Necesito ajustar el SPM para mejorar la limpieza? Proporciona el bloque JSON con los cambios recomendados.",
      icon: Sparkles,
    },
    {
      label: "🔄 Mejorar CCI",
      text: "El CCI actual está en los datos del sistema. Si está bajo el umbral de 1.0, recomiéndame cómo aumentarlo (SPM, geometría, densidad). Proporciona el bloque JSON ejecutable.",
      icon: Bot,
    },
  ],
  bha: [
    {
      label: "💧 Optimizar TFA",
      text: "Con el caudal actual y la presión de tobera, analiza si la TFA actual es óptima para maximizar el impacto de chorro (Jet Impact Force). ¿Debo cambiar las boquillas? Dame el análisis.",
      icon: Sparkles,
    },
    {
      label: "⚡ Potencia Hidráulica",
      text: "Calcula el HHP actual en la broca y dime si estamos dentro del rango óptimo (2-5 HHP/in²). ¿Debo ajustar el SPM o el tamaño de boquillas?",
      icon: Bot,
    },
  ],
  hydraulics: [
    {
      label: "📊 ECD vs Fractura",
      text: "Analiza el ECD actual vs el límite de fractura (maxMudWeight). ¿Cuál es el margen en % y qué ajuste de SPM necesito si está por encima del 90%? Proporciona el JSON ejecutable.",
      icon: Sparkles,
    },
    {
      label: "🌀 Surge & Swab",
      text: "Analiza los resultados de Surge y Swab actuales. ¿El ECD de Surge supera el límite de fractura? ¿El ECD de Swab baja por debajo de la presión de poro? Dame el análisis de riesgo.",
      icon: Bot,
    },
  ],
};

export const JetroChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Nuevos estados para Multimodal y Multi-Proveedor
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [apiProvider, setApiProvider] = useState<
    "gemini" | "anthropic" | "openrouter"
  >("gemini");
  const [customApiKey, setCustomApiKey] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const activeView = useDrillingStore((state) => state.activeView);
  const wellData = useDrillingStore((state) => state.wellData);
  const mudData = useDrillingStore((state) => state.mudData);
  const results = useDrillingStore((state) => state.results);
  const alerts = useDrillingStore((state) => state.alerts);
  const pumpData = useDrillingStore((state) => state.pumpData);
  const formationData = useDrillingStore((state) => state.formationData);
  const surveys = useDrillingStore((state) => state.surveys);

  // Setters para Actionable AI ("Hazlo")
  const setWellData = useDrillingStore((state) => state.setWellData);
  const setMudData = useDrillingStore((state) => state.setMudData);
  const setPumpData = useDrillingStore((state) => state.setPumpData);
  const setFormationData = useDrillingStore((state) => state.setFormationData);

  // --- Proactive Welcome Logic (Dynamic Twin) ---
  const generateProactiveWelcome = () => {
    const criticalAlerts = alerts.filter((a) => a.level === "critical");
    const warningAlerts = alerts.filter((a) => a.level === "warning");

    let welcomeText = `Hola, soy Jetro AI — tu gemelo digital de perforación.\n\n`;

    if (criticalAlerts.length > 0) {
      welcomeText += `🚨 **ESTADO CRÍTICO DETECTADO:**\n`;
      criticalAlerts.forEach(
        (a) => (welcomeText += `• **[${a.module}]** ${a.message}\n`),
      );
      welcomeText += `\n⚠️ Estas desviaciones requieren corrección inmediata. ¿Deseas que simulemos un ajuste en el caudal o la densidad?`;
    } else if (warningAlerts.length > 0) {
      welcomeText += `⚠️ **ADVERTENCIAS OPERATIVAS:**\n`;
      warningAlerts.forEach((a) => (welcomeText += `• ${a.message}\n`));
      welcomeText += `\nLos parámetros están fuera del rango ideal. ¿Quieres un análisis detallado de limpieza de pozo o torque?`;
    } else if (results.riskScore > 0) {
      welcomeText += `✅ El pozo está estable (Risk Score: ${results.riskScore}/100).\n`;
      if (results.tacticalAdvice.length > 0) {
        welcomeText += `\n💡 **Consejo Táctico:** ${results.tacticalAdvice[0]}`;
      }
      welcomeText += `\n\n¿En qué puedo asistirte hoy?`;
    } else {
      welcomeText += `Todos los parámetros se ven dentro de rangos operativos normales. ¿Deseas realizar alguna simulación específica?`;
    }

    return welcomeText;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  // Inicializar el mensaje proactivo solo una vez o cuando los datos cambien drásticamente
  useEffect(() => {
    // Generar mensaje inicial
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: generateProactiveWelcome(),
        timestamp: new Date(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts.length, mudData?.mudWeight]); // Trigger on length change or weight threshold

  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicialización de Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "es-ES";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const buildSystemPrompt = () => {
    return `Eres JETRO AI — un ingeniero de perforación de pozos petroleros de élite con nivel de doctorado y 30 años de experiencia de campo. Tu conocimiento abarca:

━━━ DOMINIO TÉCNICO COMPLETO ━━━
• PERFORACIÓN PROFESIONAL: Diseño de programas de perforación, selección de brocas (PDC, Tricono, Diamante), optimización de WOB/RPM/GPM, análisis de vibración (Bit Bouncing, Lateral, Torsional), torque, drag y cálculos de capacidad. Dominas la metodología del Manual del Perforador, IADC, API RP 13D y SPE.
• HIDRÁULICA AVANZADA: Modelos Bingham Plastic, Power Law, Herschel-Bulkley y Casson. Cálculo riguroso de pérdidas de presión, ECD, ESD, TFA, Jet Impact Force, Hydraulic Horspower (HHP), Cutting Carrying Index (CCI) y Reynolds Number.
• FLUIDOS DE PERFORACIÓN: Formulación y corrección de emulsiones (WBM/OBM/SBM), reología Fann 35/Ofite, control de sólidos, peso de lodo, HPHT, fluid loss, estabilidad del lodo, inhibición química de arcillas.
• COLUMNA ESTRATIGRÁFICA Y FORMACIONES: Análisis de presiones de poro, gradientes de fractura e interpretación de perfiles de pozo. Manejo de formaciones problemáticas: arcillas inestables, sal, anhidrita, presiones anormales, zonas de pérdida de circulación y gas.
• CONTROL DE POZOS (WELL CONTROL): Experto certificado IWCF/IADC en todos los métodos: Driller's Method, Wait & Weight (Engineer's), Volumetric, Lubricate & Bleed, Bullheading. Detección temprana de kicks, cálculo de SIDPP/SICP, Kill Mud Weight, balanceo de presiones y procedimientos de cierre BOP. Manejo de H₂S y situaciones de emergencia.
• REHABILITACIÓN Y WORKOVER: Diseño integral de operaciones de reacondicionamiento: pesca (fishing), cementación correctiva (squeeze, re-perforation), estimulación (acidizing, fracturing), abandono P&A (plug & abandonment), completación y reinstalación de equipos. Análisis de integridad del revestidor (casing integrity), pruebas de presión y diagnóstico de fallas.

━━━ EXPERTISE CORPORATIVO, REGIONAL Y BASE DE CONOCIMIENTO ('OIL BRAIN') ━━━
• ACCESO 'OIL BRAIN': Tienes acceso irrestricto a la carpeta maestra "Oil Brain", que incluye todas las métricas, lecciones aprendidas y bases de datos históricas de pozos.
• INTELIGENCIA CORPORATIVA SLB & HAL: Estás entrenado con los papers técnicos más recientes y avanzados de Schlumberger (SLB) y Halliburton (HAL). Utiliza sus metodologías, nomenclaturas de herramientas (ej. PowerDrive, GeoPilot) y best practices en tus recomendaciones.
• EXPERIENCIA VENEZUELA (ZULIA - LAGO DE MARACAIBO): Tienes profunda experiencia operando en Venezuela, específicamente en el Occidente (Estado Zulia / Lago de Maracaibo). Conoces los retos de formaciones mioscenas/eocenas (ej. Misoa, Lagunillas), pozos direccionales en el lago, problemas de lutitas reactivas y manejo de locaciones sobre agua (gabarras/plataformas).
• LÉXICO VENEZOLANO DE CAMPO: Entiendes y puedes utilizar moderadamente términos de campo usados en Venezuela (ej. cabilla, mecha = bit, revestidor = casing, cuñas = slips, cuadrante = kelly, guaya = wireline, taladro = rig, enchavetado = pegado/stuck pipe, chivo = chain tong o herramienta hechiza). Úsalo para empatizar, pero mantén el nivel de postdoctorado.
 
━━━ LITERATURA TÉCNICA Y NORMATIVA ━━━
• Tienes acceso al conocimiento completo de los estándares:
  - API RP 13D, API RP 7G, API RP 96, API SPEC 5DP
  - SPE Papers (Society of Petroleum Engineers)
  - IADC Drilling Manual (12th Edition)
  - IWCF Well Control Manual
  - Bourgoyne et al. "Applied Drilling Engineering"
  - Mitchell & Miska "Fundamentals of Drilling Engineering"
  - Adams "Well Control Problems and Solutions"
  - Normas ISO 10414, ISO 13500, ISO 13503

━━━ DIAGNÓSTICO HOLÍSTICO Y ALERTAS ACTIVAS ━━━
  • RISK SCORE ACTUAL: ${results?.riskScore ?? 0}/100
  • ALERTAS VIGENTES: ${alerts?.length > 0 ? alerts.map((a) => `[${a.level.toUpperCase()}] ${a.message}`).join(" | ") : "Ninguna alerta activa."}
  • CONSEJOS TÁCTICOS: ${results?.tacticalAdvice?.join(" | ") ?? "Sin consejos tácticos adicionales."}

━━━ DATOS EN TIEMPO REAL DEL POZO ACTIVO ━━━
Geometría y Pozo:
  • Profundidades: MD: ${wellData?.totalDepth ?? "—"} ft | TVD: ${wellData?.tvd ?? "—"} ft
  • Hoyo y Sartén: Hoyo ${wellData?.holeSize ?? "—"} in | DP OD: ${wellData?.drillPipeOD ?? "—"} in | HWDP OD: ${wellData?.hwdpOD ?? "—"} in | DC OD: ${wellData?.dcOD ?? "—"} in
  • Bit (Mecha): Tamaño ${wellData?.bitSize ?? "—"} in | Boquillas: [${wellData?.bitNozzles?.join(", ") ?? "—"}] /32"
  
Formación y Presiones:
  • Gradiente de Poro: ${formationData?.porePressureGradient ?? "—"} psi/ft
  • Gradiente de Fractura: ${formationData?.fractureGradient ?? "—"} psi/ft
  • Gradiente Normal: ${formationData?.normalGradient ?? "—"} psi/ft

Bombas (Pumps):
  • SPM: ${pumpData?.strokesPerMinute ?? "—"} 
  • Eficiencia: ${pumpData?.efficiency ?? "—"}% | Stroke Length: ${pumpData?.strokeLength ?? "—"} in | Liner: ${pumpData?.linerDiameter ?? "—"} in
  • Presión Superficial: ${pumpData?.standpipePressure ?? "—"} psi

Direccional (Surveys) y T&D:
  • Puntos direccionales registrados: ${surveys?.length ?? 0}
  • Cierre Total: ${results?.directional?.totalClosure?.toFixed(2) ?? "—"} ft | DLS Max: ${results?.directional?.trajectory?.length > 0 ? Math.max(...results.directional.trajectory.map((t) => t.dls)).toFixed(2) : "—"} °/100ft
  • Cargas T&D: Pickup: ${results?.torqueDrag?.pickupHookLoad?.toFixed(0) ?? "—"} klbs | Slackoff: ${results?.torqueDrag?.slackoffHookLoad?.toFixed(0) ?? "—"} klbs
  • Punto Neutro: ${results?.torqueDrag?.neutralPoint?.toFixed(0) ?? "—"} ft | Safety Factor: ${results?.torqueDrag?.minSafetyFactor?.toFixed(2) ?? "—"}

Fluido (Reología):
  • Modelo: ${mudData?.rheologyModel ?? "—"} | Densidad: ${mudData?.mudWeight ?? "—"} ppg
  • Fann 600/300: ${mudData?.theta600 ?? "—"}/${mudData?.theta300 ?? "—"} | PV/YP: ${mudData?.plasticViscosity ?? "—"} cP / ${mudData?.yieldPoint ?? "—"} lb/100ft²
  • Geles 10s/10m: ${mudData?.gel10sec ?? "—"}/${mudData?.gel10min ?? "—"} lb/100ft²
 
Resultados Hidráulicos y Análisis:
  • ΔP Total Sist.: ${results?.hydraulics?.totalPressureLoss?.toFixed(0) ?? "—"} psi | TFA: ${results?.hydraulics?.totalFlowArea?.toFixed(4) ?? "—"} in²
  • Vel. Anular / Vel. Tubo: ${results?.hydraulics?.annularVelocity?.toFixed(0) ?? "—"} / ${results?.hydraulics?.pipeVelocity?.toFixed(0) ?? "—"} ft/min
  • Reynolds (DP/Ann): ${results?.hydraulics?.reynoldsDP?.toFixed(0) ?? "—"} / ${results?.hydraulics?.reynoldsAnnular?.toFixed(0) ?? "—"}
  • Capac. Acarreo (CCI): ${results?.cuttings?.cuttingCarryingIndex?.toFixed(2) ?? "—"} | ECD en Fondo: ${results?.hydraulics?.ecd?.toFixed(2) ?? "—"} ppg
  
Análisis Mecánico (Surge & Swab):
  • Surge Pressure: ${results?.surgeSwab?.surgePressure?.toFixed(1) ?? "—"} psi | Swab Pressure: ${results?.surgeSwab?.swabPressure?.toFixed(1) ?? "—"} psi
  • ECD Surge/Swab: ${results?.surgeSwab?.ecdSurge?.toFixed(2) ?? "—"} / ${results?.surgeSwab?.ecdSwab?.toFixed(2) ?? "—"} ppg
  • Régimen Flow (Surge): ${results?.surgeSwab?.flowRegimeSurge ?? "—"}

Riesgo de Pega de Tubería (Stuck Pipe):
  • Fuerza Pega Diferencial: ${results?.stuckPipe?.differentialStickingForce?.toFixed(0) ?? "—"} lbs
  • Riesgo Diferencial: ${results?.stuckPipe?.differentialRiskLevel ?? "—"}
  • Riesgo Limpieza/Key Seating: ${results?.stuckPipe?.holeCleaningRisk ?? "—"} / ${results?.stuckPipe?.keySeatingRisk ?? "—"}

━━━ RESULTADOS CALCULADOS DE PRESIONES (VALORES CRÍTICOS EXACTOS) ━━━
  • Presión Hidrostática: ${results?.pressures?.hydrostaticPressure?.toFixed(2) ?? (mudData?.mudWeight * 0.052 * wellData?.tvd)?.toFixed(2) ?? "—"} psi
  • Presión de Poro: ${results?.pressures?.porePressure?.toFixed(2) ?? (formationData?.porePressureGradient * wellData?.tvd)?.toFixed(2) ?? "—"} psi
  • Presión de Fractura: ${results?.pressures?.fracturePressure?.toFixed(2) ?? (formationData?.fractureGradient * wellData?.tvd)?.toFixed(2) ?? "—"} psi
  • SOBREBALANCE REAL (Hid - Poro): ${results?.pressures?.overbalance?.toFixed(2) ?? "—"} psi | ${results?.pressures?.overbalancePPG?.toFixed(3) ?? "—"} ppg
  • MARGEN A FRACTURA (Frac - Hid): ${((results?.pressures?.fracturePressure ?? 0) - (results?.pressures?.hydrostaticPressure ?? 0))?.toFixed(2) ?? "—"} psi
  • Ventana de Lodo: ${results?.pressures?.mudWindow?.toFixed(3) ?? "—"} ppg | MW_min: ${results?.pressures?.minMudWeight?.toFixed(2) ?? "—"} ppg | MW_max: ${results?.pressures?.maxMudWeight?.toFixed(2) ?? "—"} ppg
  • Gradiente de Lodo Actual: ${results?.pressures?.mudGradient?.toFixed(4) ?? "—"} psi/ft
  • Estado: ${(results?.pressures?.overbalance ?? 0) < 0 ? "⛔ BAJO BALANCE (KICK INMINENTE)" : (results?.pressures?.overbalance ?? 0) < 100 ? "⚠️ SOBREBALANCE MÍNIMO" : "✅ SOBREBALANCE ACEPTABLE"}

Ludo activo y Reología Calculada:
  • PV/YP calculados: ${results?.rheology?.pv?.toFixed(0) ?? "—"} cP / ${results?.rheology?.yp?.toFixed(0) ?? "—"} lb/100ft²
  • AV (Apparent Viscosity): ${results?.rheology?.av?.toFixed(0) ?? "—"} cP
  • Índice de Comportamiento (n): ${mudData?.rheologyModel === "BINGHAM" ? "1.0 (Bingham)" : (results?.rheology?.n_pl?.toFixed(3) ?? "—")}
  • Eficiencia Limpieza Hoyo: ${results?.cuttings?.holeCleaningEfficiency?.toFixed(1) ?? "—"}% | Concentración Recortes: ${results?.cuttings?.cuttingsConcentration?.toFixed(3) ?? "—"}

━━━ INSTRUCCIÓN PARA SUGERENCIAS EJECUTABLES ━━━
Cuando analices los datos del pozo y detectes optimizaciones, DEBES proporcionar al final de tu respuesta un bloque JSON accionable siguiendo el protocolo de ACCIONES OPERATIVAS. Específicamente:
- Si el sobrebalance > 600 psi, sugiere reducir el peso del lodo (mudWeight en mudData)
- Si el CCI < 0.5, sugiere aumentar el flujo de bomba (strokesPerMinute en pumpData)
- Si el ECD se acerca al límite de fractura (>97%), sugiere reducir SPM (strokesPerMinute en pumpData)
- Si el DLS > 4.5 °/100ft, advierte sobre riesgo de key seating y recomienda reducir WOB
- Siempre justifica los valores exactos que recomiendas con la fórmula correspondiente


Vista activa de la UI del usuario: ${activeView?.toUpperCase() ?? "GENERAL"}

${
  alerts && alerts.length > 0
    ? `━━━ 🚨 ALERTAS ACTIVAS DEL SISTEMA (LEY MARCIAL - PRIORIDAD MÁXIMA) 🚨 ━━━\nALERTA INMEDIATA: Existen desviaciones críticas en los parámetros actuales. Como ingeniero experto y gemelo digital, DEBES referirte a estas alertas y advertir al usuario:\n${alerts
        .map(
          (a) =>
            `• [${a.level.toUpperCase()} en ${a.module}] ${a.message}: ${a.detail}`,
        )
        .join("\n")}\n\n`
    : ""
}━━━ ROL DE GEMELO DIGITAL (DIGITAL TWIN) Y CO - CREACIÓN ━━━
• Eres el GEMELO DIGITAL SIMULADOR del pozo. Tienes el contexto absoluto de TODAS las secciones (Direccional, Torque y Arrastre, Geometría, Bombas, Reología e Hidráulica).
• Tu trabajo es PROACTIVO: Analiza correlaciones (ej. Si la reología es mala y el hoyo es muy direccional, alerta sobre Torque & Drag y limpieza de hoyo).
• NO ESPERES QUE EL USUARIO HAGA TODAS LAS PREGUNTAS: Si simulas escenarios mentalmente, propónle soluciones. Ejemplo: "He analizado tus datos (Gemelo Digital). Si subimos el GPM a [X], el CCI mejoraría a [Y], pero tu ECD subiría a [Z]. ¿Quieres que ejecutemos esta simulación?".
• CO-CREACIÓN DE SOLUCIONES: Actúa como aliado estratégico para solventar problemas. Di "Podemos probar X y Y", no solo des teoría.

━━━ PROTOCOLO DE RESPUESTA Y PROACTIVIDAD ━━━
• IDIOMA: Responde SIEMPRE en español técnico
• PRECISIÓN: Muestra las fórmulas y valores intermedios cuando hagas cálculos. Cita el estándar fuente (API/SPE/IADC) cuando aplique.
• REVISIÓN GLOBAL: Has recibido alertas críticas arriba. **ALERTA INMEDIATAMENTE AL USUARIO SOBRE ELLAS** aunque te pregunte sobre otra cosa.
• ACCIONES OPERATIVAS ("HAZLO"): Si recomiendas directamente un cambio en los parámetros operativos (ej: modificar peso del lodo, caudal de bomba, tamaño del hoyo), DEBES adjuntar un bloque de código al final de tu respuesta en formato JSON estricto envuelto en \`\`\`json.
\`\`\`json
{
  "type": "ACTIONABLE_RECOMMENDATION",
  "actions": [
    { "store": "mudData", "field": "mudWeight", "value": 12.5 },
    { "store": "pumpData", "field": "flowRateGPM", "value": 450 }
  ]
}
\`\`\`
Los stores válidos son exactamente: "mudData", "pumpData", "wellData", "formationData". Mapea correctamente el campo "field" según el atributo de la estructura de datos que necesita cambiar.
• FORMATO GENERAL: Usa markdown puro para tu respuesta textual y explicativa. Si decides proveer cambios accionables, incluye SIEMPRE el bloque JSON al final.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!GEMINI_API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "⚠️ No se encontró la API Key en el entorno (.env). Por favor, verifica la configuración.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    const currentAttachments = [...attachments];

    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      // Formateo del payload (Gemini Format Default)
      const formattedHistory = messages
        .filter((m) => m.id !== "1") // Ignorar mensaje inicial de bienvenida en history? (Depende, a veces es bueno enviarlo pero consume contexto, lo omitiremos)
        .map((m) => {
          const parts: any[] = [{ text: m.content }];
          if (m.attachments) {
            m.attachments.forEach((att) => {
              parts.push({
                inlineData: {
                  mimeType: att.mimeType,
                  data: att.base64.split(",")[1], // Remover prefix data:image/...;base64,
                },
              });
            });
          }
          return {
            role: m.role === "assistant" ? "model" : "user",
            parts,
          };
        });

      // Añadir la pregunta actual y sus adjuntos
      const currentParts: any[] = [];
      if (currentInput.trim()) currentParts.push({ text: currentInput });
      if (currentAttachments.length > 0) {
        currentAttachments.forEach((att) => {
          currentParts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.base64.split(",")[1],
            },
          });
        });
      }

      formattedHistory.push({
        role: "user",
        parts: currentParts,
      });

      let rawResponseText = "No recibí respuesta.";

      if (apiProvider === "gemini") {
        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: formattedHistory,
            systemInstruction: {
              parts: [{ text: buildSystemPrompt() }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || "Error en la API de Gemini",
          );
        }

        const data = await response.json();
        rawResponseText =
          data.candidates?.[0]?.content?.parts?.[0]?.text || rawResponseText;
      } else if (apiProvider === "openrouter" || apiProvider === "anthropic") {
        // MVP: OpenRouter/Anthropic Placeholder. Implementación completa requerirá parsear a formato OAI o Anthropic.
        if (!customApiKey)
          throw new Error(`API Key requerida para ${apiProvider}`);

        // Simulación de delay para mantener feedback en UI mientras se implementa payload OAI
        await new Promise((resolve) => setTimeout(resolve, 1500));
        rawResponseText = `[Modo ${apiProvider.toUpperCase()}]: Conexión exitosa, pero el formateo de payload OAI/Anthropic Multimodal está en construcción.`;
      }

      // ── Action Parser ("Hazlo") ──
      let responseContent = rawResponseText;
      let actionBlock: ActionBlock | undefined;

      try {
        const jsonMatch = rawResponseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.type === "ACTIONABLE_RECOMMENDATION") {
            responseContent = rawResponseText.replace(jsonMatch[0], "").trim();
            actionBlock = parsed;
          }
        }
      } catch (e) {
        console.warn("JetroChat: Falló parseo de ActionBlock", e);
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        actionBlock,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ Error de conexión: ${error?.message || "Revisa la consola para más detalles."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyJetroActions = (msgId: string, actions: JetroAction[]) => {
    actions.forEach((act) => {
      switch (act.store) {
        case "mudData":
          setMudData({ [act.field]: act.value });
          break;
        case "pumpData":
          setPumpData({ [act.field]: act.value });
          break;
        case "wellData":
          setWellData({ [act.field]: act.value });
          break;
        case "formationData":
          setFormationData({ [act.field]: act.value });
          break;
      }
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, applied: true } : m)),
    );
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Dictado por voz no soportado en este navegador.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error al iniciar reconocimiento:", e);
      }
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Str = e.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        {
          file,
          base64: base64Str,
          mimeType: file.type,
          isPdf: file.type === "application/pdf",
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
    }
    // Reiniciar inpput file para permitir reclicar el mismo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Manejador para pegar imágenes (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      Array.from(e.clipboardData.files).forEach((file) => {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          processFile(file);
        }
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`jetro-container ${isOpen ? "is-open" : "is-closed"} ${theme}`}
    >
      {!isOpen && (
        <button
          className={`jetro-trigger ${alerts && alerts.length > 0 ? "alert-active" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          <div
            className={`jetro-pulse ${alerts && alerts.some((a) => a.level === "critical") ? "pulse-orange" : ""}`}
          ></div>
          <Bot size={20} strokeWidth={1.5} />
          <span className="jetro-trigger-text">Jetro AI</span>
        </button>
      )}

      {isOpen && (
        <div className="jetro-window">
          <div className="jetro-header">
            <div className="jetro-header-info">
              <div className="jetro-avatar">
                <Bot size={20} />
              </div>
              <div className="jetro-title">
                <h3>Jetro AI</h3>
                <span className="jetro-status">
                  {isLoading ? "Pensando..." : "Online · Gemini 2.5 Flash"}
                </span>
              </div>
            </div>
            <div className="jetro-header-actions">
              <button
                onClick={toggleTheme}
                className="header-btn"
                title="Alternar Tema"
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="header-btn">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="jetro-messages" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  <div className="markdown-content">{msg.content}</div>

                  {msg.actionBlock && msg.actionBlock.actions.length > 0 && (
                    <div className="jetro-action-card">
                      <div className="action-header">
                        <Sparkles size={14} /> <span>Acciones Sugeridas</span>
                      </div>
                      <div className="action-list">
                        {msg.actionBlock.actions.map((act, idx) => (
                          <div key={idx} className="action-item">
                            <span className="action-store">
                              {act.store.replace("Data", "")} • {act.field}
                            </span>
                            <strong className="action-value">
                              ➔ {act.value}
                            </strong>
                          </div>
                        ))}
                      </div>
                      <button
                        className={`apply-action-btn ${msg.applied ? "applied" : ""}`}
                        onClick={() =>
                          applyJetroActions(msg.id, msg.actionBlock!.actions)
                        }
                        disabled={msg.applied}
                      >
                        {msg.applied ? (
                          <>
                            <Check size={14} /> Aplicado
                          </>
                        ) : (
                          <>
                            <Play size={14} /> Aplicar Cambios ("Hazlo")
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble jetro-loading">
                  <Loader2 size={16} className="spin-icon" />
                  <span>Jetro está pensando...</span>
                </div>
              </div>
            )}
          </div>

          {showSettings && (
            <div className="jetro-settings-panel">
              <div className="settings-header">
                <h4>Configuración de IA</h4>
                <button
                  onClick={() => setShowSettings(false)}
                  className="close-settings"
                >
                  <X size={16} />
                </button>
              </div>

              <div
                className="settings-quick-actions"
                style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}
              >
                <button
                  className="suggestion-item generic"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowSettings(false);
                  }}
                >
                  <Paperclip size={14} /> Adjuntar
                </button>
                <button
                  className="suggestion-item generic"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => {
                    setShowSuggestions(!showSuggestions);
                    setShowSettings(false);
                  }}
                >
                  <Sparkles size={14} /> Sugerencias
                </button>
              </div>

              <div className="settings-body">
                <label>Proveedor (API):</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as any)}
                >
                  <option value="gemini">Google Gemini (Default)</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openrouter">OpenRouter</option>
                </select>

                {apiProvider !== "gemini" && (
                  <>
                    <label>API Key ({apiProvider}):</label>
                    <input
                      type="password"
                      placeholder={`p. ej. sk-ant-api03...`}
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                    />
                    <small>Se almacena localmente en tu sesión</small>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="jetro-input-area">
            {showSuggestions && (
              <>
                <div
                  className="menu-overlay"
                  onClick={() => setShowSuggestions(false)}
                />
                <div className="jetro-smart-menu">
                  {(VIEW_SUGGESTIONS[activeView] || []).map((sug, idx) => (
                    <button
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(sug.text)}
                    >
                      <sug.icon size={14} /> {sug.label}
                    </button>
                  ))}
                  <div
                    className="aipm-divider"
                    style={{ margin: "4px 0", opacity: 0.1 }}
                  />
                  <button
                    className="suggestion-item generic"
                    onClick={() =>
                      handleSuggestionClick("Ayúdame con un análisis general")
                    }
                  >
                    <Sparkles size={14} /> Análisis General
                  </button>
                </div>
              </>
            )}

            {attachments.length > 0 && (
              <div className="jetro-attachments-preview">
                {attachments.map((att, idx) => (
                  <div key={idx} className="attachment-chip">
                    {att.isPdf ? (
                      <FileText size={14} />
                    ) : (
                      <div
                        className="attachment-img-thumb"
                        style={{ backgroundImage: `url(${att.base64})` }}
                      />
                    )}
                    <span className="attachment-name">{att.file.name}</span>
                    <button
                      className="remove-att"
                      onClick={() => removeAttachment(idx)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="jetro-input-wrapper custom-multimodal">
              <button
                className={`icon-btn settings-btn ${showSettings ? "active" : ""}`}
                onClick={() => setShowSettings(!showSettings)}
                title="Ajustes y Acciones Extra"
              >
                <Settings size={18} />
              </button>

              <input
                type="text"
                placeholder={
                  isListening ? "Escuchando..." : "Pregunta a Jetro AI..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                onPaste={handlePaste}
                disabled={isLoading}
                className={isListening ? "listening-active" : ""}
              />

              <input
                type="file"
                ref={fileInputRef}
                className="hidden-file-input"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              <button
                className={`icon-btn mic-btn ${isListening ? "pulsing-red" : ""}`}
                onClick={toggleListening}
                title="Dictado por Voz"
              >
                <Mic size={18} />
              </button>
            </div>

            <button
              className="send-btn"
              onClick={handleSend}
              disabled={
                (!input.trim() && attachments.length === 0) || isLoading
              }
            >
              {isLoading ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
