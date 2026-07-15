import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Target,
  FlaskConical,
  TestTube2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  RotateCcw,
  Download,
  FileText,
  Zap,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────

interface Phase {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ProductBrief {
  // Phase 1: Captura
  idea: string;
  targetUser: string;
  situation: string;
  constraints: string;
  // Phase 2: Hypothesis
  successCriteria: string;
  nonGoals: string;
  riskLevel: 'low' | 'medium' | 'high';
  // Phase 3: Prototype
  featureList: string;
  techApproach: string;
  timebox: string;
  // Phase 4: Test
  testMethod: string;
  testQuestions: string;
  testMetrics: string;
  // Phase 5: Synthesis
  whatWorked: string;
  whatDidnt: string;
  v2Recommendation: string;
}

const PHASES: Phase[] = [
  { id: 'capture', label: 'Captura', icon: Lightbulb, color: 'signal-amber' },
  { id: 'hypothesis', label: 'Hipótesis', icon: Target, color: 'signal-cyan' },
  { id: 'prototype', label: 'Prototipo', icon: FlaskConical, color: 'signal-lime' },
  { id: 'test', label: 'Test', icon: TestTube2, color: 'signal-magenta' },
  { id: 'synthesis', label: 'Síntesis', icon: Sparkles, color: 'signal-amber' },
];

const INITIAL_BRIEF: ProductBrief = {
  idea: '',
  targetUser: '',
  situation: '',
  constraints: '',
  successCriteria: '',
  nonGoals: '',
  riskLevel: 'medium',
  featureList: '',
  techApproach: '',
  timebox: '10 min',
  testMethod: 'Simulated usability review',
  testQuestions: '',
  testMetrics: '',
  whatWorked: '',
  whatDidnt: '',
  v2Recommendation: '',
};

// ── Export Helpers ──────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportMarkdown(brief: ProductBrief): string {
  let md = `# Product Brief: ${brief.idea || 'Untitled'}\n\n`;
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Risk Level:** ${brief.riskLevel}\n`;
  md += `**Timebox:** ${brief.timebox}\n\n`;
  md += `---\n\n`;

  md += `## 1. Captura\n\n`;
  md += `**Idea:** ${brief.idea}\n\n`;
  md += `**Target User:** ${brief.targetUser}\n\n`;
  md += `**Situation:** ${brief.situation}\n\n`;
  md += `**Constraints:** ${brief.constraints}\n\n`;

  md += `## 2. Hipótesis\n\n`;
  md += `**Success Criteria:**\n${brief.successCriteria}\n\n`;
  md += `**Non-Goals:**\n${brief.nonGoals}\n\n`;

  md += `## 3. Prototipo\n\n`;
  md += `**Feature List:**\n${brief.featureList}\n\n`;
  md += `**Tech Approach:**\n${brief.techApproach}\n\n`;

  md += `## 4. Test\n\n`;
  md += `**Method:** ${brief.testMethod}\n\n`;
  md += `**Key Questions:**\n${brief.testQuestions}\n\n`;
  md += `**Metrics:**\n${brief.testMetrics}\n\n`;

  md += `## 5. Síntesis\n\n`;
  md += `**What Worked:**\n${brief.whatWorked}\n\n`;
  md += `**What Didn't:**\n${brief.whatDidnt}\n\n`;
  md += `**V2 Recommendation:**\n${brief.v2Recommendation}\n\n`;

  return md;
}

// ── Phase Components ────────────────────────────────────────────────

function CapturePhase({ brief, onChange }: { brief: ProductBrief; onChange: (b: Partial<ProductBrief>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Qué estás construyendo?</label>
        <textarea
          value={brief.idea}
          onChange={e => onChange({ idea: e.target.value })}
          rows={3}
          placeholder="ej: Una app que convierte notas de voz en tareas estructuradas..."
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Quién lo usa?</label>
        <input
          type="text"
          value={brief.targetUser}
          onChange={e => onChange({ targetUser: e.target.value })}
          placeholder="ej: Product managers que capturan ideas en reuniones"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿En qué situación?</label>
        <input
          type="text"
          value={brief.situation}
          onChange={e => onChange({ situation: e.target.value })}
          placeholder="ej: Durante calls de 30min donde no pueden escribir"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Constraints</label>
        <input
          type="text"
          value={brief.constraints}
          onChange={e => onChange({ constraints: e.target.value })}
          placeholder="ej: Offline-first, <3 taps, mobile-only"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono"
        />
      </div>
    </div>
  );
}

function HypothesisPhase({ brief, onChange }: { brief: ProductBrief; onChange: (b: Partial<ProductBrief>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Cómo medís éxito? (criterios medibles)</label>
        <textarea
          value={brief.successCriteria}
          onChange={e => onChange({ successCriteria: e.target.value })}
          rows={3}
          placeholder={"ej:\n- 80% de usuarios completan flujo sin ayuda\n- <2s de carga\n- NPS > 7"}
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-cyan/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Qué NO es esto? (non-goals)</label>
        <textarea
          value={brief.nonGoals}
          onChange={e => onChange({ nonGoals: e.target.value })}
          rows={3}
          placeholder={"ej:\n- No es un CRM\n- No necesita auth por ahora\n- No es multi-user"}
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-cyan/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Nivel de riesgo</label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map(level => (
            <button
              key={level}
              onClick={() => onChange({ riskLevel: level })}
              className={`flex-1 px-3 py-2 rounded-xl text-[11px] font-mono border transition-all cursor-pointer ${
                brief.riskLevel === level
                  ? level === 'low' ? 'bg-signal-lime/10 text-signal-lime border-signal-lime/30'
                    : level === 'medium' ? 'bg-signal-amber/10 text-signal-amber border-signal-amber/30'
                    : 'bg-signal-magenta/10 text-signal-magenta border-signal-magenta/30'
                  : 'bg-carbon/20 text-ash/40 border-graphite/20 hover:text-bone hover:border-graphite/40'
              }`}
            >
              {level === 'low' ? 'Bajo' : level === 'medium' ? 'Medio' : 'Alto'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrototypePhase({ brief, onChange }: { brief: ProductBrief; onChange: (b: Partial<ProductBrief>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Feature list (v0)</label>
        <textarea
          value={brief.featureList}
          onChange={e => onChange({ featureList: e.target.value })}
          rows={4}
          placeholder={"ej:\n1. Botón grabar con visualización de waveform\n2. Transcripción local (Whisper)\n3. Parsing a items de tarea\n4. Botón guardar a lista"}
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-lime/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Enfoque técnico</label>
        <input
          type="text"
          value={brief.techApproach}
          onChange={e => onChange({ techApproach: e.target.value })}
          placeholder="ej: React + Web Audio API + local storage"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-lime/40 transition-colors font-mono"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Timebox</label>
        <div className="flex gap-2">
          {['5 min', '10 min', '30 min', '2h', '1d'].map(tb => (
            <button
              key={tb}
              onClick={() => onChange({ timebox: tb })}
              className={`px-3 py-2 rounded-xl text-[11px] font-mono border transition-all cursor-pointer ${
                brief.timebox === tb
                  ? 'bg-signal-lime/10 text-signal-lime border-signal-lime/30'
                  : 'bg-carbon/20 text-ash/40 border-graphite/20 hover:text-bone hover:border-graphite/40'
              }`}
            >
              {tb}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestPhase({ brief, onChange }: { brief: ProductBrief; onChange: (b: Partial<ProductBrief>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Método de test</label>
        <div className="flex gap-2">
          {['Simulated usability review', 'Real user test', 'A/B test', 'Self-review'].map(method => (
            <button
              key={method}
              onClick={() => onChange({ testMethod: method })}
              className={`px-3 py-2 rounded-xl text-[10px] font-mono border transition-all cursor-pointer ${
                brief.testMethod === method
                  ? 'bg-signal-magenta/10 text-signal-magenta border-signal-magenta/30'
                  : 'bg-carbon/20 text-ash/40 border-graphite/20 hover:text-bone hover:border-graphite/40'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Preguntas clave del test</label>
        <textarea
          value={brief.testQuestions}
          onChange={e => onChange({ testQuestions: e.target.value })}
          rows={3}
          placeholder={"ej:\n- ¿El usuario entiende qué hacer al abrir la app?\n- ¿Puede completar el flujo principal sin ayuda?\n- ¿Algún paso causa confusión?"}
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-magenta/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Métricas a observar</label>
        <input
          type="text"
          value={brief.testMetrics}
          onChange={e => onChange({ testMetrics: e.target.value })}
          placeholder="ej: task completion rate, time-on-task, error count"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-magenta/40 transition-colors font-mono"
        />
      </div>
    </div>
  );
}

function SynthesisPhase({ brief, onChange }: { brief: ProductBrief; onChange: (b: Partial<ProductBrief>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Qué funcionó?</label>
        <textarea
          value={brief.whatWorked}
          onChange={e => onChange({ whatWorked: e.target.value })}
          rows={3}
          placeholder="Lo que validó la hipótesis..."
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">¿Qué no funcionó?</label>
        <textarea
          value={brief.whatDidnt}
          onChange={e => onChange({ whatDidnt: e.target.value })}
          rows={3}
          placeholder="Friction points, drop-offs, confusion..."
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="text-[9px] font-mono text-ash/40 uppercase tracking-wider block mb-1.5">Recomendación para V2</label>
        <textarea
          value={brief.v2Recommendation}
          onChange={e => onChange({ v2Recommendation: e.target.value })}
          rows={3}
          placeholder="Basado en el feedback, ¿qué sigue?"
          className="w-full bg-graphite/30 border border-graphite/20 rounded-xl px-4 py-2.5 text-xs text-bone placeholder:text-ash/20 outline-none focus:border-signal-amber/40 transition-colors font-mono resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

interface ProductCreatorProps {
  accent?: string;
  onLogMessage?: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
}

export default function ProductCreator({ accent, onLogMessage }: ProductCreatorProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [brief, setBrief] = useState<ProductBrief>(INITIAL_BRIEF);
  const [copied, setCopied] = useState(false);

  const updateBrief = useCallback((partial: Partial<ProductBrief>) => {
    setBrief(prev => ({ ...prev, ...partial }));
  }, []);

  const handleCopy = useCallback(() => {
    const md = exportMarkdown(brief);
    navigator.clipboard.writeText(md);
    setCopied(true);
    onLogMessage?.('ok', 'Product brief copiado al portapapeles');
    setTimeout(() => setCopied(false), 1500);
  }, [brief, onLogMessage]);

  const handleExport = useCallback(() => {
    const md = exportMarkdown(brief);
    const filename = `product-brief-${(brief.idea || 'untitled').toLowerCase().replace(/\s+/g, '-').slice(0, 40)}.md`;
    downloadFile(md, filename, 'text/markdown');
    onLogMessage?.('ok', `Exportado: ${filename}`);
  }, [brief, onLogMessage]);

  const handleReset = useCallback(() => {
    setBrief(INITIAL_BRIEF);
    setCurrentPhase(0);
    onLogMessage?.('info', 'Brief reiniciado');
  }, [onLogMessage]);

  const phase = PHASES[currentPhase];
  const progress = ((currentPhase + 1) / PHASES.length) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* ── Phase Progress Bar ── */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-3">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            const isActive = i === currentPhase;
            const isDone = i < currentPhase;
            return (
              <React.Fragment key={p.id}>
                <button
                  onClick={() => setCurrentPhase(i)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                    isActive
                      ? `bg-${p.color}/10 text-${p.color} border border-${p.color}/30`
                      : isDone
                      ? 'bg-carbon/30 text-bone/60 border border-graphite/20'
                      : 'text-ash/30 border border-transparent hover:text-ash/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
                {i < PHASES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-ash/20 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="h-1 bg-carbon/40 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-${phase.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* ── Phase Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-bone font-display flex items-center gap-2">
            <phase.icon className={`w-4 h-4 text-${phase.color}`} />
            Fase {currentPhase + 1}: {phase.label}
          </h2>
          <p className="text-[10px] font-mono text-ash/50 mt-1">
            {currentPhase === 0 && "Definí la idea, el usuario y las constraints"}
            {currentPhase === 1 && "Establecé criterios de éxito y qué NO es esto"}
            {currentPhase === 2 && "Listá features, enfoque técnico y timebox"}
            {currentPhase === 3 && "Definí cómo vas a testear y qué observar"}
            {currentPhase === 4 && "Documentá learnings y planificá V2"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentPhase === 0 && <CapturePhase brief={brief} onChange={updateBrief} />}
            {currentPhase === 1 && <HypothesisPhase brief={brief} onChange={updateBrief} />}
            {currentPhase === 2 && <PrototypePhase brief={brief} onChange={updateBrief} />}
            {currentPhase === 3 && <TestPhase brief={brief} onChange={updateBrief} />}
            {currentPhase === 4 && <SynthesisPhase brief={brief} onChange={updateBrief} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-graphite/20 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono text-ash/50 bg-carbon/20 border border-graphite/15 hover:text-bone hover:border-graphite/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentPhase > 0 && (
            <button
              onClick={() => setCurrentPhase(prev => prev - 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono text-ash/60 bg-carbon/20 border border-graphite/15 hover:text-bone hover:border-graphite/30 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>
          )}

          {currentPhase < PHASES.length - 1 ? (
            <button
              onClick={() => setCurrentPhase(prev => prev + 1)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold bg-${phase.color}/10 text-${phase.color} border border-${phase.color}/30 hover:brightness-125 transition-all cursor-pointer`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono transition-all cursor-pointer ${
                  copied
                    ? 'bg-signal-lime/10 text-signal-lime border border-signal-lime/30'
                    : 'bg-carbon/20 text-ash/60 border border-graphite/15 hover:text-bone hover:border-graphite/30'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar MD'}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono bg-carbon/20 text-ash/60 border border-graphite/15 hover:text-bone hover:border-graphite/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar .md
              </button>
              <button
                onClick={() => {
                  onLogMessage?.('ok', `Product Brief completado: "${brief.idea}"`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold bg-signal-amber/10 text-signal-amber border border-signal-amber/30 hover:brightness-125 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Ship it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
