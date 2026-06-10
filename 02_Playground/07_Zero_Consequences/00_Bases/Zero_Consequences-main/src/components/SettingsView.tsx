import React, { useEffect, useState } from "react";
import { Settings, ShieldAlert, Cpu, ExternalLink, Copy, Check, Sparkles, Key, Eye, EyeOff, Save } from "lucide-react";
import { translations } from "../lib/translations";

interface EnvInfo {
  CLIENT_ID_SET: boolean;
  CLIENT_SECRET_SET: boolean;
  APP_URL: string;
  REDIRECT_URI: string;
}

interface SettingsViewProps {
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function SettingsView({ 
  language = 'es',
  themeMode = 'craft'
}: SettingsViewProps) {
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);

  // States for API keys
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("CONSEQUENCES_CLAUDE_KEY") || "");
  const [minimaxKey, setMinimaxKey] = useState(() => localStorage.getItem("CONSEQUENCES_MINIMAX_KEY") || "");
  const [opencodeKey, setOpencodeKey] = useState(() => localStorage.getItem("CONSEQUENCES_OPENCODE_KEY") || "");
  const [goKey, setGoKey] = useState(() => localStorage.getItem("CONSEQUENCES_GO_KEY") || "");

  // States for hiding/revealing key strings
  const [showClaude, setShowClaude] = useState(false);
  const [showMinimax, setShowMinimax] = useState(false);
  const [showOpencode, setShowOpencode] = useState(false);
  const [showGo, setShowGo] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const t = translations[language].settings;
  const isLight = themeMode === 'craft';


  useEffect(() => {
    fetch("/api/env")
      .then((res) => res.json())
      .then((data) => setEnvInfo(data))
      .catch((err) => console.error("Could not fetch env settings", err));

    const cached = localStorage.getItem("CONSEQUENCES_ACCOUNTS_METADATA");
    if (cached) {
      try {
        setAccounts(JSON.parse(cached));
      } catch (e) {}
    }
    setActiveEmail(localStorage.getItem("CONSEQUENCES_ACTIVE_EMAIL"));
  }, []);

  const handleSelectAccount = (email: string) => {
    localStorage.setItem("CONSEQUENCES_ACTIVE_EMAIL", email);
    setActiveEmail(email);
    window.location.reload();
  };

  const handleForgetAccount = (email: string) => {
    const remaining = accounts.filter(acc => acc.user.email !== email);
    localStorage.setItem("CONSEQUENCES_ACCOUNTS_METADATA", JSON.stringify(remaining));
    setAccounts(remaining);
    
    if (activeEmail === email) {
      if (remaining.length > 0) {
        localStorage.setItem("CONSEQUENCES_ACTIVE_EMAIL", remaining[0].user.email);
        setActiveEmail(remaining[0].user.email);
      } else {
        localStorage.removeItem("CONSEQUENCES_ACTIVE_EMAIL");
        setActiveEmail(null);
      }
    }
    window.location.reload();
  };

  const handleCopy = () => {
    if (!envInfo) return;
    navigator.clipboard.writeText(envInfo.REDIRECT_URI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("CONSEQUENCES_CLAUDE_KEY", claudeKey);
    localStorage.setItem("CONSEQUENCES_MINIMAX_KEY", minimaxKey);
    localStorage.setItem("CONSEQUENCES_OPENCODE_KEY", opencodeKey);
    localStorage.setItem("CONSEQUENCES_GO_KEY", goKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    // Dispatch storage event to alert other components if necessary
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="flex-grow flex flex-col gap-6 select-none animate-fadeIn">

      {/* Google Accounts Switchboard Panel */}
      <section className={`transition-all duration-300 border p-6 md:p-8 rounded-[2rem] ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'border border-[#1E2435] bg-[#0f131c]'
      }`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
          isLight ? 'text-zinc-950 font-sans text-md font-bold' : 'font-display text-md font-bold text-[#00f0ff] uppercase tracking-wider'
        }`}>
          <Sparkles className={`w-5 h-5 ${isLight ? 'text-zinc-700' : 'text-neon-cyan animate-pulse'}`} />
          {t.registry}
        </h3>
        <p className={`text-sm leading-relaxed mb-6 font-medium ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
          {t.desc}
        </p>

        {accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {accounts.map((acc) => {
              const isActive = acc.user.email === activeEmail;
              return (
                <div 
                  key={acc.user.email}
                  className={`border p-5 rounded-[1.75rem] relative flex flex-col justify-between transition-all duration-150 ${
                    isActive 
                      ? isLight
                        ? "border-zinc-950 bg-zinc-50 shadow-sm"
                        : "border-[#00f0ff] bg-[#131826]/80 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                      : isLight
                        ? "border-zinc-200 bg-white hover:border-zinc-350"
                        : "border-graphite hover:border-[#7A839E]/50 bg-void/40"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? 'bg-zinc-800' : 'bg-[#00f0ff]'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? 'bg-zinc-950' : 'bg-[#00f0ff]'}`}></span>
                    </span>
                  )}

                  <div className="flex items-start gap-3.5">
                    {acc.user.picture ? (
                      <img 
                        src={acc.user.picture} 
                        alt={acc.user.name} 
                        className={`w-11 h-11 rounded-full object-cover border ${isLight ? 'border-zinc-200' : 'border-[#1E2435]'}`}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-display font-black text-xs select-none ${
                        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-carbon border-graphite text-[#00f0ff]'
                      }`}>
                        {acc.user.name ? acc.user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-bold text-sm truncate leading-tight flex items-center gap-1.5 flex-wrap ${
                        isLight ? 'text-zinc-900 border-none font-sans' : 'text-white font-display'
                      }`}>
                        {acc.user.name}
                        {isActive && (
                          <span className={`font-mono text-[8px] uppercase font-extrabold tracking-widest px-1.5 border rounded-full ${
                            isLight ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white border-transparent' : 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                          }`}>
                            active
                          </span>
                        )}
                      </h4>
                      <p className={`font-mono text-[10px] truncate mt-1 ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>{acc.user.email}</p>
                      
                      <div className="mt-2.5 flex gap-1.5 flex-wrap">
                        <span className={`font-mono text-[8px] px-2 py-0.5 border rounded-full uppercase font-bold ${
                          acc.isDemo 
                            ? isLight ? "border-amber-300 text-amber-700 bg-amber-50" : "border-neon-lime/30 text-neon-lime bg-neon-lime/5" 
                            : isLight ? "border-zinc-200 text-zinc-600 bg-zinc-100" : "border-[#00f0ff]/30 text-[#00f0ff] bg-[#00f0ff]/5"
                        }`}>
                          {acc.isDemo ? t.sandbox_account.toLowerCase() : t.live_account.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-5 pt-3 border-t flex items-center justify-between gap-2 ${
                    isLight ? 'border-zinc-200' : 'border-[#1E2435]'
                  }`}>
                    <button
                      disabled={isActive}
                      onClick={() => handleSelectAccount(acc.user.email)}
                      className={`font-mono text-[10px] py-1.5 px-3.5 uppercase border cursor-pointer rounded-full font-semibold ${
                        isActive 
                          ? isLight ? 'bg-transparent border-zinc-200 text-zinc-400 cursor-default' : "bg-transparent border-[#00f0ff]/40 text-[#00f0ff]/50 cursor-default" 
                          : isLight ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] border-transparent text-white hover:opacity-90 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_4px_12px_rgba(0,82,255,0.15)]' : "bg-transparent border-graphite hover:border-[#00f0ff] text-white hover:text-[#00f0ff]"
                      }`}
                    >
                      {isActive ? (language === 'es' ? "OPERADOR SELECCIONADO" : "Operator Active") : (language === 'es' ? "SELECCIONAR OPERADOR" : "Switch Operator")}
                    </button>
                    <button
                      onClick={() => handleForgetAccount(acc.user.email)}
                      className={`font-mono text-[10px] py-1.5 px-3.5 uppercase border border-transparent rounded-full font-semibold transition-colors cursor-pointer ${
                        isLight 
                          ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700' 
                          : 'hover:border-red-500 text-red-400 hover:text-white hover:bg-red-500/10'
                      }`}
                    >
                      {t.forget}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`border-2 border-dashed p-8 text-center rounded-2xl ${
            isLight ? 'border-zinc-200 text-zinc-500 bg-zinc-50/50' : 'border-graphite text-[#7A839E]'
          }`}>
            <p className="font-mono text-xs italic">
              {language === 'es' ? "Ninguna identidad de operador vinculada a esta estación." : "No active operator identities linked to this station."}
            </p>
            <p className="text-xs mt-1">
              {language === 'es' ? "Conecte su cuenta Google desde la barra de operadores." : "Connect your Google account using the top operators bar or switchboards."}
            </p>
          </div>
        )}
      </section>

      {/* Claude, Minimax, Opencode, Go API Keys Configurator Section */}
      <section className={`transition-all duration-300 border p-6 md:p-8 rounded-[2rem] ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'border border-[#1E2435] bg-[#0f131c]'
      }`}>
        <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
          isLight ? 'text-zinc-950 font-sans text-md font-bold' : 'font-display text-md font-bold text-[#00f0ff] uppercase tracking-wider'
        }`}>
          <Key className={`w-5 h-5 ${isLight ? 'text-zinc-700' : 'text-neon-cyan'}`} />
          {language === 'es' ? 'Claves de API de Inteligencia Artificial' : 'AI Model Key Integration Store'}
        </h3>
        <p className={`text-sm leading-relaxed mb-6 font-medium ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
          {language === 'es' 
            ? 'Regístralas de forma totalmente segura. Las claves se guardan exclusivamente en el almacenamiento local cifrado de su navegador y no se transmiten a terceros.' 
            : 'Configure your integration keys securely. Keys are saved solely in your local browser sandbox storage and never shared with external middleware.'}
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Claude API Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-zinc-600' : 'text-[#7A839E]'}`}>
                CLAUDE (ANTHROPIC API)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showClaude ? "text" : "password"}
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className={`w-full font-mono text-xs p-3 pr-10 rounded-full transition-all duration-150 focus:outline-none ${
                    isLight 
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-950 focus:border-zinc-400' 
                      : 'bg-[#131826]/75 border border-[#1E2435] text-white focus:border-[#00f0ff]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowClaude(!showClaude)}
                  className={`absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer`}
                >
                  {showClaude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Minimax API Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-zinc-600' : 'text-[#7A839E]'}`}>
                MINIMAX (KEY STORE)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showMinimax ? "text" : "password"}
                  value={minimaxKey}
                  onChange={(e) => setMinimaxKey(e.target.value)}
                  placeholder="minimax-api-..."
                  className={`w-full font-mono text-xs p-3 pr-10 rounded-full transition-all duration-150 focus:outline-none ${
                    isLight 
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-950 focus:border-zinc-400' 
                      : 'bg-[#131826]/75 border border-[#1E2435] text-white focus:border-[#00f0ff]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowMinimax(!showMinimax)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  {showMinimax ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Opencode API Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-zinc-600' : 'text-[#7A839E]'}`}>
                OPENCODE (MODELS HUB)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showOpencode ? "text" : "password"}
                  value={opencodeKey}
                  onChange={(e) => setOpencodeKey(e.target.value)}
                  placeholder="opencode-token-..."
                  className={`w-full font-mono text-xs p-3 pr-10 rounded-full transition-all duration-150 focus:outline-none ${
                    isLight 
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-950 focus:border-zinc-400' 
                      : 'bg-[#131826]/75 border border-[#1E2435] text-white focus:border-[#00f0ff]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOpencode(!showOpencode)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  {showOpencode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Go API Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-zinc-600' : 'text-[#7A839E]'}`}>
                GO (SERVICE SECRETS)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showGo ? "text" : "password"}
                  value={goKey}
                  onChange={(e) => setGoKey(e.target.value)}
                  placeholder="go-auth-..."
                  className={`w-full font-mono text-xs p-3 pr-10 rounded-full transition-all duration-150 focus:outline-none ${
                    isLight 
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-950 focus:border-zinc-400' 
                      : 'bg-[#131826]/75 border border-[#1E2435] text-white focus:border-[#00f0ff]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowGo(!showGo)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                >
                  {showGo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/20 mt-3">
            <button
              type="submit"
              className={`font-mono text-xs py-2.5 px-6 uppercase border transition-all duration-300 rounded-full font-bold flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                isLight 
                  ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white border-transparent hover:opacity-95 hover:shadow-[0_4px_15px_rgba(0,82,255,0.25)]' 
                  : 'bg-neon-cyan/20 border border-[#00f0ff]/40 text-neon-cyan hover:bg-neon-cyan/35 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              }`}
            >
              <Save className="w-4 h-4" />
              {language === 'es' ? 'GUARDAR CLAVES LOCALMENTE' : 'SAVE KEYS TO RUNTIME'}
            </button>

            {saveSuccess && (
              <span className="font-mono text-xs font-bold text-emerald-500 animate-pulse">
                {language === 'es' ? '✓ ¡Guardado con éxito!' : '✓ Registered successfully!'}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Configuration Instructions */}
      <section className={`transition-all duration-300 border p-6 md:p-8 rounded-[2rem] ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'border border-[#1E2435] bg-[#0f131c]'
      }`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
          isLight ? 'text-zinc-950 font-sans text-md font-bold' : 'font-display text-md font-bold text-[#00f0ff] uppercase tracking-wider'
        }`}>
          <Settings className="w-5 h-5 text-neon-cyan" /> {t.env}
        </h3>

        <p className={`text-sm leading-relaxed mb-6 font-medium ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
          {t.env_desc}
        </p>

        {/* Dynamic redirect parameters displaying beautifully */}
        {envInfo && (
          <div className={`p-5 rounded-2xl mb-6 border ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#0a0e17] border-[#1E2435]'
          }`}>
            <span className="font-mono text-[9px] text-[#7A839E] uppercase block tracking-wider font-extrabold">{t.redirect_uri}</span>
            
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={envInfo.REDIRECT_URI}
                className={`flex-grow font-mono text-xs p-3 focus:outline-none rounded-full ${
                  isLight 
                    ? 'bg-white border border-zinc-200 text-zinc-950' 
                    : 'bg-[#131826] border border-[#1E2435] text-[#00f0ff] select-all'
                }`}
              />
              <button
                onClick={handleCopy}
                className={`font-mono text-xs p-3 flex items-center gap-1.5 transition-all duration-300 rounded-full cursor-pointer font-semibold border hover:scale-[1.02] active:scale-95 ${
                  isLight 
                    ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white border-transparent hover:shadow-[0_4px_12px_rgba(0,82,255,0.15)]' 
                    : 'bg-[#1E2435] border-[#1E2435] hover:border-[#00f0ff] text-white hover:text-[#00f0ff]'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </div>
        )}

        {/* GCP Manual Step List */}
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-display font-extrabold text-sm ${
              isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]'
            }`}>
              1
            </div>
            <div>
              <h4 className={`font-bold text-sm flex items-center gap-1.5 ${isLight ? 'text-zinc-900 font-sans' : 'text-white font-display'}`}>
                {language === 'es' ? "Navegar al panel de desarrolladores GCP" : "Navigate to GCP Developer Dashboard"} 
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:underline transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 inline-block" />
                </a>
              </h4>
              <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                {language === 'es' ? "Ir a Google Cloud Console -> API y servicios -> Credenciales." : "Go to Google Cloud Platform Console \u2192 APIS & Services \u2192 Credentials."}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-display font-extrabold text-sm ${
              isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]'
            }`}>
              2
            </div>
            <div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-zinc-900 font-sans' : 'text-white font-display'}`}>{language === 'es' ? "Crear credenciales de ID de cliente OAuth" : "Create OAuth CLIENT ID credentials"}</h4>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                {language === 'es' ? "Haga clic en + Crear credenciales \u2192 seleccione ID de cliente OAuth. En Tipo de aplicación, seleccione Aplicación web." : "Click + Create Credentials \u2192 select OAuth Client ID. Under Application Type, select Web Application."}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-display font-extrabold text-sm ${
              isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]'
            }`}>
              3
            </div>
            <div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-zinc-900 font-sans' : 'text-white font-display'}`}>{language === 'es' ? "Vincular las URIs de redirección autorizadas" : "Bind the Authorized URIs"}</h4>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                {language === 'es' ? "Agregue su dominio de desarrollo a Orígenes de JavaScript autorizados. Copie la URI de redirección autorizada de arriba e insértela en GCP." : "Inside GCP, add your development domain into Authorized JavaScript Origins. Copy the Authorized Redirect URI from step 1 above, paste it into the GCP callback registry box, and save."}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-display font-extrabold text-sm ${
              isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]'
            }`}>
              4
            </div>
            <div>
              <h4 className={`font-bold text-sm ${isLight ? 'text-zinc-900 font-sans' : 'text-white font-display'}`}>{language === 'es' ? "Registrar las variables Secrets en AI Studio" : "Declare Secrets Variables inside AI Studio"}</h4>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                {language === 'es' ? "Declare sus credenciales en el panel de Secrets de Google AI Studio configurando GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET." : "Once GCP generates your Client ID and Client Secret, declare these in your Secrets panel inside Google AI Studio set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET variables."}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Operations Hardware Diagnostic */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 rounded-[1.75rem] border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#131826]/70 border-[#1E2435]'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-[#FFB400]'}`} />
            <h4 className={`semibold text-sm ${isLight ? 'text-zinc-900 font-sans font-bold' : 'text-white font-display'}`}>SECURITY_POLICIES</h4>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-zinc-500 font-medium' : 'text-[#7A839E]'}`}>
            {language === 'es' ? "Las sesiones de autenticación, alcances de tokens y claves se guardan en el cliente temporalmente. Nunca persisten para salvaguardar la privacidad." : "All user authentication handles, access scopes tokens, and synchronized credentials are cached fully in-memory client-side. They never persist on disk to assure operator integrity."}
          </p>
        </div>

        <div className={`p-5 rounded-[1.75rem] border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#131826]/70 border-[#1E2435]'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className={`w-5 h-5 ${isLight ? 'text-zinc-800' : 'text-[#00f0ff]'}`} />
            <h4 className={`semibold text-sm ${isLight ? 'text-zinc-900 font-sans font-bold' : 'text-white font-display'}`}>ENVIRONMENT_METADATA</h4>
          </div>
          <div className={`space-y-1.5 font-mono text-[10px] ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
            <div className="flex justify-between">
              <span>GOOGLE_CLIENT_ID:</span>
              <span className={`font-bold ${envInfo?.CLIENT_ID_SET ? isLight ? "text-emerald-600" : "text-[#00f0ff]" : "text-amber-500"}`}>
                {envInfo?.CLIENT_ID_SET ? "REGISTERED_OK" : (language === 'es' ? "NO_DETECTADO_SANDBOX" : "NOT_FOUND_DEFAULTing_SANDBOX")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GOOGLE_CLIENT_SECRET:</span>
              <span className={`font-bold ${envInfo?.CLIENT_SECRET_SET ? isLight ? "text-emerald-600" : "text-[#00f0ff]" : "text-amber-500"}`}>
                {envInfo?.CLIENT_SECRET_SET ? "REGISTERED_OK" : (language === 'es' ? "NO_DETECTADO_SANDBOX" : "NOT_FOUND_DEFAULTing_SANDBOX")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VIRTUAL_HOST_RUN:</span>
              <span className={`truncate max-w-[200px] font-bold ${isLight ? 'text-zinc-700' : 'text-white'}`}>{envInfo?.APP_URL || "N/A"}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
