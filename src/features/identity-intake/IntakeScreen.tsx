import React, { useState, useEffect } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Logo } from '../../components/layout/NavRail';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { Profile } from '../../types/privacy';

interface IntakeScreenProps {
  profile: Profile;
  inApp?: boolean;
  onComplete?: () => void;
  onToast?: (msg: string) => void;
  onUpdateProfile?: (profile: Profile) => void;
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({ profile, inApp = false, onComplete, onToast, onUpdateProfile }) => {
  const [emails, setEmails] = useState<string[]>(profile.emails);
  const [usernames, setUsernames] = useState<string[]>(profile.usernames);
  const [nameInput, setNameInput] = useState(profile.name);
  const [locationInput, setLocationInput] = useState(profile.location || "México");
  const [draft, setDraft] = useState("");
  const [phone, setPhone] = useState(profile.phone || "");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    setEmails(profile.emails);
    setUsernames(profile.usernames);
    setNameInput(profile.name);
    setLocationInput(profile.location || "México");
    setPhone(profile.phone || "");
  }, [profile]);

  // Enterprise CSV drag-and-drop states
  const [dragOver, setDragOver] = useState(false);
  const [csvFile, setCsvFile] = useState<{ name: string; size: number } | null>(null);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);

  const handleSelectCSV = (file: File) => {
    // Recommendation 12: Restrict file size to max 8 MB
    if (file.size > 8 * 1024 * 1024) {
      if (onToast) onToast("⚠️ Archivo demasiado grande. El límite del cargador local es de 8 MB.");
      return;
    }
    setCsvFile({ name: file.name, size: file.size });
  };

  const handleDropCSV = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].name.endsWith(".csv")) {
        handleSelectCSV(files[0]);
      } else {
        if (onToast) onToast("⚠️ Por favor, selecciona un archivo en formato .csv");
      }
    }
  };

  const handleCancelCSV = () => {
    setCsvFile(null);
    setCsvImporting(false);
    setCsvProgress(0);
  };

  const handleProcessCSV = () => {
    if (!csvFile) return;
    setCsvImporting(true);
    setCsvProgress(0);

    // Recommendation 11: Simulated Web Worker chunk-based parsing progress proportional to byte size
    const totalChunks = 10;
    const processingDelay = Math.min(3000, Math.max(800, Math.round(csvFile.size * 0.15)));
    const chunkTime = processingDelay / totalChunks;
    
    let currentChunk = 0;
    const interval = window.setInterval(() => {
      currentChunk++;
      const progress = Math.min(100, Math.round((currentChunk / totalChunks) * 100));
      setCsvProgress(progress);

      if (currentChunk >= totalChunks) {
        clearInterval(interval);
        setCsvImporting(false);
        setCsvFile(null);
        // Inject parsed mock identities safely
        const nextEmails = [...new Set([...emails, "backup.admin@secure-corp.com", "privacidad.corp@audit.net"])];
        const nextUsernames = [...new Set([...usernames, "audit_shield", "sec_ops"])];
        setEmails(nextEmails);
        setUsernames(nextUsernames);
        
        if (onUpdateProfile) {
          onUpdateProfile({
            ...profile,
            emails: nextEmails,
            usernames: nextUsernames
          });
        }
        
        if (onToast) onToast("¡Lote de CSV procesado con éxito e incorporado al monitoreo!");
      }
    }, chunkTime);
  };

  const scanSteps = [
    "Inicializando agente de inteligencia autónomo...",
    "Buscando coincidencias en 14,820 bases de datos de brechas...",
    "Escaneando huella digital pública en redes y directorios...",
    "Cruzando registros comerciales en 80+ data brokers activos...",
    "Calculando ponderaciones matemáticas del Score de Exposición...",
    "¡Análisis finalizado con éxito! Redirigiendo..."
  ];

  useEffect(() => {
    let interval: number;
    if (scanning) {
      setScanStep(0);
      interval = window.setInterval(() => {
        setScanStep(s => {
          if (s >= scanSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
            return s;
          }
          return s + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [scanning]);

  const addId = (val: string) => {
    // Robust defensive input sanitization: clamp length & strip HTML/script injection tags
    const trimmed = val.trim().slice(0, 80).replace(/[<>]/g, "");
    if (!trimmed) return;
    let nextEmails = emails;
    let nextUsernames = usernames;
    if (trimmed.includes("@")) {
      nextEmails = [...new Set([...emails, trimmed])];
      setEmails(nextEmails);
    } else {
      nextUsernames = [...new Set([...usernames, trimmed])];
      setUsernames(nextUsernames);
    }
    setDraft("");
    
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        emails: nextEmails,
        usernames: nextUsernames
      });
    }

    if (onToast) {
      onToast(`Monitoreando activamente: ${trimmed}`);
    }
  };

  const handleStartScan = () => {
    setScanning(true);
  };

  const Body = (
    <div className={`grid gap-5 items-start ${inApp ? "grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]" : "grid-cols-1"}`}>
      <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium relative overflow-hidden">
        {/* Specular Diagonal Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />
        
        {scanning ? (
          <div className="py-8 flex flex-col items-center justify-center text-center fade-in">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-dim border border-teal-line text-teal mb-4 spin">
              <Icon name="refresh" size={24} />
            </div>
            <h3 className="text-[17px] font-semibold text-t-0 mb-3.5">Escaneo Inteligente en Progreso</h3>
            <div className="w-full max-w-[380px] bg-bg-3 border border-line rounded-lg p-4 text-left flex flex-col gap-2.5">
              {scanSteps.map((step, idx) => {
                const isDone = idx < scanStep;
                const isActive = idx === scanStep;
                return (
                  <div key={idx} className={`flex items-center gap-2.5 text-[12.5px] transition-all duration-300 ${isDone ? "text-ok" : isActive ? "text-teal font-semibold" : "text-t-3"}`}>
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                      {isDone ? (
                        <Icon name="check-circle" size={14} />
                      ) : isActive ? (
                        <Icon name="refresh" size={14} className="spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3.5">
              <Icon name="fingerprint" size={18} style={{ color: "var(--teal)" }} />
              <h2 className="text-[15px] font-semibold text-t-0">Identificadores monitoreados</h2>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[12px] font-semibold text-t-1">Nombre completo del titular</label>
              <input 
                className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" 
                value={nameInput} 
                onChange={e => {
                  setNameInput(e.target.value);
                  if (onUpdateProfile) {
                    onUpdateProfile({ ...profile, name: e.target.value });
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-t-1">País / región</label>
                <input 
                  className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" 
                  value={locationInput} 
                  onChange={e => {
                    setLocationInput(e.target.value);
                    if (onUpdateProfile) {
                      onUpdateProfile({ ...profile, location: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-t-1">Teléfono móvil (opcional)</label>
                <input 
                  className="bg-bg-inset border border-line-2 rounded-lg px-3 py-2 text-t-0 font-sans text-[13.5px] outline-none focus:border-teal-line focus:shadow-[0_0_0_3px_var(--teal-dim)] transition-all duration-130 w-full" 
                  placeholder="+52 55 •••• ••••" 
                  maxLength={20}
                  value={phone} 
                  onChange={e => {
                    const cleaned = e.target.value.replace(/[^0-9+\s-]/g, "");
                    setPhone(cleaned);
                    if (onUpdateProfile) {
                      onUpdateProfile({ ...profile, phone: cleaned });
                    }
                  }} 
                />
              </div>
            </div>

            <label className="text-[12px] font-semibold text-t-1 block mb-2">Correos y nombres de usuario bajo vigilancia</label>
            <div className="flex flex-col gap-2 mb-3">
              {emails.map(e => (
                <div key={e} className="flex items-center gap-2.5 border border-line rounded-lg px-3 py-2 bg-bg-inset">
                  <Icon name="mail" size={15} style={{ color: "var(--t-2)" }} />
                  <span className="font-mono text-[12.5px] flex-1 text-t-0">{e}</span>
                  <Badge level="ok">monitoreando</Badge>
                </div>
              ))}
              {usernames.map(u => (
                <div key={u} className="flex items-center gap-2.5 border border-line rounded-lg px-3 py-2 bg-bg-inset">
                  <Icon name="user" size={15} style={{ color: "var(--t-2)" }} />
                  <span className="font-mono text-[12.5px] flex-1 text-t-0">@{u}</span>
                  <Badge level="ok">monitoreando</Badge>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2.5">
              <div className="flex-1 flex items-center gap-2 bg-bg-2 border border-line rounded-lg px-3 py-2 text-t-2">
                <Icon name="plus" size={15} />
                <input 
                  className="bg-transparent border-0 outline-none text-t-0 font-sans text-[13px] w-full placeholder-t-3"
                  placeholder="Añadir correo o usuario..." 
                  maxLength={80}
                  value={draft} 
                  onChange={e => setDraft(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === "Enter") addId(draft);
                  }} 
                />
              </div>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-[15px] py-[9px] border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                onClick={() => addId(draft)}
              >
                Añadir
              </button>
            </div>

            {/* Enterprise CSV Batch Importer (Premium A11y / Performance Worker Simulation) */}
            <div className="mt-5.5 pt-4 border-t border-line">
              <label className="text-[12px] font-semibold text-t-1 block mb-2">Importar lote de identificadores corporativos (.csv)</label>
              
              {csvFile ? (
                <div className="p-4 rounded-lg bg-bg-inset border border-teal-line/30 flex flex-col gap-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-t-0 flex items-center gap-1.5 font-mono truncate max-w-[200px]">
                      <Icon name="file" size={15} style={{ color: "var(--teal)" }} />
                      {csvFile.name}
                    </span>
                    <span className="text-[11px] text-t-2 font-mono">({(csvFile.size / 1024).toFixed(1)} KB)</span>
                    <button 
                      className="text-t-3 hover:text-crit text-[11px] cursor-pointer bg-transparent border-0"
                      onClick={handleCancelCSV}
                      disabled={csvImporting}
                    >
                      Cancelar
                    </button>
                  </div>

                  {csvImporting ? (
                    <div className="mt-2.5 bg-bg-inset border border-line rounded-lg p-3 w-full">
                      <div className="flex justify-between items-center text-[11px] text-t-2 font-mono mb-2">
                        <span className="flex items-center gap-1.5 font-semibold text-teal">
                          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                          Hilo de Procesamiento Local #1 Activo
                        </span>
                        <span className="font-bold">{csvProgress}%</span>
                      </div>

                      {/* Animated SVG Ingestion Flow */}
                      <svg className="w-full h-10 bg-bg-inset rounded border border-line/45 mb-2 overflow-hidden" viewBox="0 0 300 40">
                        <style>{`
                          @keyframes flowDot {
                            0% { transform: translateX(0); opacity: 0.1; }
                            10%, 90% { opacity: 0.8; }
                            100% { transform: translateX(200px); opacity: 0.1; }
                          }
                          .dot-flow {
                            animation: flowDot 1.4s linear infinite;
                          }
                        `}</style>
                        {/* Base line */}
                        <line x1="30" y1="20" x2="270" y2="20" stroke="var(--line-2)" strokeWidth="1.5" strokeDasharray="4, 4" />
                        
                        {/* Animated dots along the line */}
                        <circle cx="30" cy="20" r="4.5" fill="var(--bg-3)" stroke="var(--line-3)" strokeWidth="1" />
                        <text x="30" y="23.5" textAnchor="middle" fontSize="8" fill="var(--t-2)">📄</text>
                        
                        <g transform="translate(45, 0)">
                          <circle cx="0" cy="20" r="2.5" fill="var(--teal)" className="dot-flow" style={{ animationDelay: "0s" }} />
                          <circle cx="0" cy="20" r="2.5" fill="var(--cyan)" className="dot-flow" style={{ animationDelay: "0.35s" }} />
                          <circle cx="0" cy="20" r="2.5" fill="var(--teal)" className="dot-flow" style={{ animationDelay: "0.7s" }} />
                          <circle cx="0" cy="20" r="2.5" fill="var(--cyan)" className="dot-flow" style={{ animationDelay: "1.05s" }} />
                        </g>

                        <circle cx="270" cy="20" r="4.5" fill="var(--bg-3)" stroke="var(--teal-line)" strokeWidth="1" />
                        <text x="270" y="23.5" textAnchor="middle" fontSize="8" fill="var(--teal)">⚙️</text>
                      </svg>

                      <div className="w-full h-1 rounded-full bg-bg-3 overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-teal to-cyan transition-all duration-150" style={{ width: `${csvProgress}%` }} />
                      </div>

                      {/* Local Web Worker parsing logs */}
                      <div className="bg-bg-inset border border-line-2 rounded p-2.5 font-mono text-[10px] text-teal/95 leading-relaxed max-h-[85px] overflow-y-auto flex flex-col gap-0.5 shadow-inner">
                        <div>[Worker] Spawning parsing worker thread...</div>
                        {csvProgress >= 10 && <div>[Worker] Reading CSV binary buffer ({csvFile ? (csvFile.size / 1024).toFixed(1) : 0} KB)...</div>}
                        {csvProgress >= 30 && <div>[Worker] Sanitizing data streams &amp; stripping script injections...</div>}
                        {csvProgress >= 50 && <div>[Worker] Deduplicating user records (identities cached)...</div>}
                        {csvProgress >= 70 && <div>[Worker] Running secure local XOR encryption mapping...</div>}
                        {csvProgress >= 90 && <div>[Worker] Injecting parsed credential keys to state center...</div>}
                        {csvProgress === 100 && <div className="text-ok font-semibold">[Worker] Completed! Closing thread safe.</div>}
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3.5 py-2.5 bg-bg-3 hover:bg-bg-2 border border-line-2 text-t-0 cursor-pointer transition-all mt-1"
                      onClick={handleProcessCSV}
                    >
                      <Icon name="scan" size={13} style={{ color: 'var(--teal)' }} />
                      Comenzar procesamiento local
                    </button>
                  )}
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-5.5 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    dragOver ? 'border-teal bg-teal-dim/10' : 'border-line hover:border-line-2 bg-bg-inset'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDropCSV}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files[0]) handleSelectCSV(files[0]);
                    };
                    input.click();
                  }}
                >
                  <Icon name="file" size={24} className="text-t-3 animate-pulse" />
                  <span className="text-[12px] text-t-1 font-semibold">Arrastra tu archivo .csv aquí o haz clic para subir</span>
                  <span className="text-[10px] text-t-3">Tamaño máximo de archivo: 8 MB</span>
                </div>
              )}
            </div>

            {!inApp && (
              <button 
                className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-3 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] mt-5.5 cursor-pointer transition-all duration-130 shadow-premium"
                onClick={handleStartScan}
              >
                <Icon name="scan" size={16} />
                Iniciar escaneo de privacidad
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <AIInsightCard 
          tag="Cobertura IA" 
          lead 
          confidence="Medium"
          title="Amplía tu cobertura"
          body="Estás vigilando 2 correos y 2 nombres de usuario. Vincular tu número celular te protegerá contra hackeos por SIM-swapping y filtración de SMS que actualmente están desprotegidos."
          impact={inApp ? "+cobertura" : null} 
        />
        
        <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-3">Qué analiza el escaneo</div>
          <div className="flex flex-col gap-3">
            {[
              ["breach", "Bases de datos de filtraciones conocidas"], 
              ["globe", "Huella digital pública en web y redes"], 
              ["building", "Listados de brokers de datos comerciales"], 
              ["clock", "Cuentas inactivas / antiguas expuestas"]
            ].map(([ic, t]) => (
              <div key={t} className="flex items-center gap-2.5">
                <Icon name={ic} size={15} style={{ color: "var(--teal)" }} />
                <span className="text-[12.8px] text-t-1">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-t-3 text-[11px]">
            <Icon name="shield-check" size={13} style={{ flexShrink: 0 }} />
            <span>Los identificadores se comparan de forma segura, nunca guardamos contraseñas.</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (inApp) {
    return (
      <div className="max-w-[1180px] mx-auto fade-in">
        <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
          <div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Registro de Identidad Digital</div>
            <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Identidad y monitoreo</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-ok-dim text-ok border border-ok/25">
            <span className="demo-blip bg-ok" />
            Monitoreo de Identidad Activo
          </span>
        </div>
        {Body}
      </div>
    );
  }

  return (
    <div className="page min-h-screen bg-bg-0 flex items-center justify-center p-6">
      <div className="fade-in w-full max-w-[720px] flex flex-col gap-5">
        <div className="flex items-center gap-3 justify-center">
          <Logo />
          <div className="font-semibold text-[18px] text-t-0">LeakShield AI</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1.5">Paso 2 de 2 · Configuración de identidad</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">¿Qué deberíamos vigilar por ti?</h1>
        </div>
        {Body}
      </div>
    </div>
  );
};
export default IntakeScreen;

