import React, { useState, useEffect } from 'react';
import { NavRail } from '../components/layout/NavRail';
import { Topbar } from '../components/layout/Topbar';
import { CopilotRail } from '../components/layout/CopilotRail';
import { Icon } from '../components/ui/Icon';
import { ScoreRing } from '../components/ui/ScoreRing';
import { AIInsightCard } from '../components/ui/AIInsightCard';

// Primitives
import { demoProfile } from '../data/demoPersona';
import { demoBreaches, highRiskDataClasses } from '../data/demoBreaches';
import { demoFootprint, demoOldAccounts, demoDataBrokers } from '../data/demoFootprint';

// Features
import { Dashboard } from '../features/dashboard/Dashboard';
import { ConsentScreen } from '../features/identity-intake/ConsentScreen';
import { IntakeScreen } from '../features/identity-intake/IntakeScreen';
import { BreachIntelligence } from '../features/breach-intelligence/BreachIntelligence';
import { FootprintScanner } from '../features/public-footprint/FootprintScanner';
import { DataBrokers } from '../features/public-footprint/DataBrokers';
import { CopilotWorkspace } from '../features/remediation-copilot/CopilotWorkspace';
import { TaskBoard } from '../features/task-board/TaskBoard';
import { TrustCenter } from '../features/trust-center/TrustCenter';

// Libs & Hooks & Services
import { useScoring } from '../hooks/useScoring';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { useSoundEngine } from '../hooks/useSoundEngine';
import { generateDeletionRequest } from '../lib/aiOrchestration';
import { taskService } from '../services/taskService';
import { aiService } from '../services/aiService';
import { firebaseService } from '../services/firebaseService';
import { ViewType, DashboardLayout, ScoreStyle, CopilotPresentation, getTitles } from './routes';
import { Task, CopilotData, BreachFinding } from '../types/privacy';

// Security Boundary: Encrypted Session Storage Hydration with Quantum XOR Cipher (OWASP PII)
const secureSave = (key: string, data: any, persistent = false) => {
  const json = JSON.stringify(data);
  let result = "";
  const secretKey = "leakshield_v0.3.0_quantum_key";
  for (let i = 0; i < json.length; i++) {
    const charCode = json.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
    result += String.fromCharCode(charCode);
  }
  const encoded = btoa(unescape(encodeURIComponent(result)));
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(`leakshield_secure_${key}`, encoded);
  // Remove from the other storage to prevent conflicts
  const otherStorage = persistent ? sessionStorage : localStorage;
  otherStorage.removeItem(`leakshield_secure_${key}`);
};

const secureLoad = (key: string) => {
  try {
    let encoded = localStorage.getItem(`leakshield_secure_${key}`);
    if (!encoded) {
      encoded = sessionStorage.getItem(`leakshield_secure_${key}`);
    }
    if (!encoded) return null;
    const decoded = decodeURIComponent(escape(atob(encoded)));
    let result = "";
    const secretKey = "leakshield_v0.3.0_quantum_key";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    return JSON.parse(result);
  } catch (e) {
    return null;
  }
};

// Premium Touch: Threat Mesh Canvas Network Background Component (Zero-Dependency)
const ThreatMeshBackground: React.FC<{ scoreValue?: number }> = ({ scoreValue = 72 }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const ripples: Array<{ x: number; y: number; r: number; maxR: number; opacity: number }> = [];

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 2,
        maxR: 90,
        opacity: 0.28
      });
    };
    window.addEventListener('click', handleClick);

    const particleCount = 28;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const speedMult = Math.max(0.2, (100 - scoreValue) / 30);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * speedMult,
        vy: (Math.random() - 0.5) * 0.35 * speedMult,
        r: Math.random() * 1.5 + 1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.035)';
      ctx.fillStyle = 'rgba(45, 212, 191, 0.08)';

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw expanding click ripples/radar waves
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rp = ripples[k];
        rp.r += 2.2;
        rp.opacity -= 0.007;
        if (rp.opacity <= 0 || rp.r >= rp.maxR) {
          ripples.splice(k, 1);
          continue;
        }
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 211, 238, ${rp.opacity})`;
        ctx.lineWidth = 1.4;
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
};

// Centralized Error Boundary Component to isolate failures beautifully
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("[ErrorBoundary] Catastrophic isolated error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-0 grid place-items-center text-center p-6 font-sans">
          <div className="border border-line rounded-lg p-8 bg-bg-2 shadow-premium max-w-[480px]">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-crit-dim border border-crit/30 text-crit mx-auto mb-4 animate-bounce">
              <Icon name="alert" size={24} />
            </div>
            <h1 className="text-[20px] font-semibold text-t-0 mb-2">Sistema de Seguridad Aislado</h1>
            <p className="text-t-2 text-[13.5px] leading-relaxed mb-6">
              Detectamos una excepción inusual en el hilo principal. Para proteger tu privacidad local, hemos aislado el hilo de ejecución de la demo.
            </p>
            <button 
              className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-4 py-2.5 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Reiniciar Command Center
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Toast Component
const Toast: React.FC<{ msg: string | null }> = ({ msg }) => {
  if (!msg) return null;
  return (
    <div className="fade-in fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-bg-3 border border-line-2 rounded-xl px-4 py-2.5 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.7)] flex gap-2.5 items-center max-w-[90vw]">
      <Icon name="check-circle" size={17} style={{ color: "var(--teal)" }} />
      <span className="text-[13px] font-semibold text-t-0">{msg}</span>
    </div>
  );
};

// Main Landing Screen (with Hero)
const LandingScreen: React.FC<{ onStart: () => void; onTrust: () => void }> = ({ onStart, onTrust }) => {
  return (
    <div className="page min-h-screen overflow-y-auto bg-gradient-to-br from-bg-0 via-bg-0 to-bg-1 bg-[radial-gradient(1100px_620px_at_78%_-8%,rgba(34,211,238,0.10),transparent_58%),radial-gradient(900px_520px_at_-8%_4%,rgba(45,212,191,0.10),transparent_55%)] relative">
      <ThreatMeshBackground />
      {/* Top Header */}
      <div className="flex justify-between items-center px-10 py-5.5 max-w-[1240px] mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-teal to-cyan text-[#04110F] flex items-center justify-center shadow-[0_6px_18px_-6px_rgba(45,212,191,0.6)]">
            <Icon name="shield-check" size={19} />
          </div>
          <div className="font-semibold text-[15px] tracking-tight text-t-0">LeakShield AI</div>
        </div>
        <div className="flex items-center gap-2.5">
          <a 
            className="text-t-2 hover:text-teal font-semibold text-[12.5px] px-3 py-1.5 transition-all duration-130 no-underline" 
            href="Vision & Strategy.html"
          >
            Visión y estrategia
          </a>
          <button 
            className="text-t-2 hover:text-teal font-semibold text-[12.5px] px-3 py-1.5 cursor-pointer bg-transparent border-0 transition-all duration-130"
            onClick={onTrust}
          >
            Centro de Confianza
          </button>
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[12.5px] px-3.5 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={onStart}
          >
            Abrir demo
          </button>
        </div>
      </div>

      {/* Hero Body */}
      <div className="max-w-[1240px] mx-auto px-10 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center relative z-10">
        {/* Left Copy */}
        <div className="fade-in">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25 mb-5.5">
            <span className="demo-blip" />
            Demostración simulada · sin datos reales
          </span>
          <h1 className="text-[44px] md:text-[54px] leading-[1.04] tracking-tight font-semibold text-t-0 m-0">
            Tu privacidad,<br />
            <span className="bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">gestionada como un centro de control.</span>
          </h1>
          <p className="text-[17px] md:text-[18px] text-t-1 leading-[1.55] max-w-[480px] mt-5">
            Detecta filtraciones. Prioriza riesgos. Limpia tu huella digital. LeakShield AI es tu copiloto de privacidad que encuentra tu exposición y la convierte en un plan real y accionable.
          </p>
          
          <div className="flex items-center gap-3 mt-7.5">
            <button 
              className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[14px] px-5 py-3 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
              onClick={onStart}
            >
              <Icon name="scan" size={17} />
              Iniciar escaneo de privacidad
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[14px] px-5 py-3 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
              onClick={onTrust}
            >
              <Icon name="lock" size={16} />
              Cómo te protegemos
            </button>
          </div>

          <div className="flex gap-5.5 mt-8.5 text-t-2 text-[12.5px] flex-wrap">
            {["Sin contraseñas guardadas", "Tus datos, tu control", "IA revisada por humanos"].map(t => (
              <span key={t} className="flex items-center gap-1.5 font-medium">
                <Icon name="check-circle" size={15} style={{ color: "var(--teal)" }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right Preview */}
        <div className="fade-in relative hidden lg:block">
          <div className="border border-line rounded-lg p-6 bg-gradient-to-b from-bg-2 to-bg-1 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Specular highlights overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.04] pointer-events-none animate-pulse" />
            <div className="flex justify-between items-center mb-4.5 relative z-10">
              <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">Puntaje de Privacidad</span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[7px] border border-med/25 bg-med-dim text-med">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Regular
              </span>
            </div>
            
            <div className="flex items-center gap-4.5 relative z-10">
              <ScoreRing value={64} size={132} />
              <div className="flex flex-col gap-2.5 flex-1">
                {[
                  ["Riesgo de brechas", "Crítico", "crit"],
                  ["Huella pública", "Medio", "med"],
                  ["Data Brokers", "2 registros", "high"]
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center text-[12.5px]">
                    <span className="text-t-1">{k}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-t-0">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--${c})` }} />
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border border-teal-line bg-gradient-to-b from-teal/6 to-bg-2 rounded-lg p-3.5 overflow-hidden mt-4.5 z-10">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
              <span className="inline-flex items-center gap-1.2 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-1.5">
                <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
                Copiloto IA
              </span>
              <div className="text-[12.5px] leading-[1.5] text-t-0">
                Una clave reutilizada une tus 2 brechas críticas. Resuélvela primero — <span className="text-teal font-semibold">+12 puntos</span>.
              </div>
            </div>
          </div>
          
          <div className="border border-line rounded-lg p-4 bg-bg-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] absolute -right-4 -bottom-6 w-[188px] z-20">
            <div className="flex items-center gap-2">
              <Icon name="check-circle" size={18} style={{ color: "var(--ok)" }} />
              <div>
                <div className="font-semibold text-[12.5px] text-t-0 leading-tight">2 de 9 resueltas</div>
                <div className="text-t-2 text-[11px] mt-0.5 leading-none">remediación activa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Strip */}
      <div className="border-t border-b border-line bg-bg-1/50 backdrop-blur-sm mt-10 relative z-10">
        <div className="max-w-[1240px] mx-auto px-10 py-7.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {[
            ["scan", "Detecta", "Brechas, huella web, data brokers y cuentas inactivas en un solo escaneo."],
            ["sparkles", "Prioriza", "La IA clasifica los riesgos por severidad e impacto, no solo por fecha."],
            ["file", "Remedia", "Redacta solicitudes de borrado y organiza un plan secuencial hoy / esta semana."],
            ["shield-check", "Control", "Tú apruebas cada acción de la IA. Nada se comparte sin consentimiento."],
          ].map(([ic, t, d]) => (
            <div key={t}>
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal mb-3">
                <Icon name={ic} size={16} />
              </div>
              <div className="text-[14px] font-semibold text-t-0 mb-1 leading-tight">{t}</div>
              <div className="text-t-2 text-[12px] leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-6 text-t-3 text-[12px] font-semibold relative z-10">
        LeakShield AI · Prototipo de demostración · Todos los nombres, servicios y hallazgos son simulados.
      </div>
    </div>
  );
};

// Reusable Tweaks configuration UI (rendered dynamically)
const TweaksOverlay: React.FC<{
  layout: DashboardLayout;
  scoreStyle: ScoreStyle;
  copilotMode: CopilotPresentation;
  accent: string[];
  persistentStorage: boolean;
  language: 'es' | 'en';
  onChange: (key: string, val: any) => void;
}> = ({ layout, scoreStyle, copilotMode, accent, persistentStorage, language, onChange }) => {
  const [open, setOpen] = useState(false);

  const colors = [
    ["#2DD4BF", "#22D3EE"], // Cyberpunk Emerald
    ["#3B82F6", "#60A5FA"], // Deep Cobalt
    ["#A855F7", "#F59E0B"], // Amethyst Amber
    ["#10B981", "#34D399"]  // Virtual Jade
  ];

  const colorLabels = ["Cyberpunk Emerald", "Deep Cobalt", "Amethyst Amber", "Virtual Jade"];

  if (!open) {
    return (
      <button 
        className="fixed right-4 bottom-4 z-50 w-9 h-9 rounded-full bg-gradient-to-br from-teal to-cyan text-[#04110F] shadow-lg flex items-center justify-center cursor-pointer border-0 active:scale-95 transition-all duration-100"
        onClick={() => setOpen(true)}
        title="Configuración de la demo"
      >
        <Icon name="settings" size={17} />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[260px] bg-bg-1/95 border border-line-2 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-3 font-sans select-none text-[12px]">
      <div className="flex justify-between items-center font-semibold text-t-0 border-b border-line pb-2 mb-1">
        <span>Controles de la Demo</span>
        <button className="text-t-2 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Diseño de Dashboard</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["executive", "grid", "focus"] as const).map(l => (
            <button 
              key={l}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${layout === l ? 'bg-bg-3 text-t-0' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('dashboardLayout', l)}
            >
              {l === 'focus' ? 'Foco' : l === 'grid' ? 'Cuadrícula' : 'Ejec.'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Visualización de Score</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["numeric", "ring", "bar"] as const).map(s => (
            <button 
              key={s}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${scoreStyle === s ? 'bg-bg-3 text-t-0' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('scoreStyle', s)}
            >
              {s === 'numeric' ? 'Número' : s === 'ring' ? 'Anillo' : 'Barra'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Panel Lateral Copiloto</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["rail", "inline"] as const).map(m => (
            <button 
              key={m}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${copilotMode === m ? 'bg-bg-3 text-t-0' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('copilotMode', m)}
            >
              {m === 'rail' ? 'Lateral' : 'Integrado'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Cifrado XOR Persistente</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {[
            [false, "Sesión"],
            [true, "Local (XOR)"]
          ].map(([val, label]) => (
            <button 
              key={val ? 1 : 0}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${persistentStorage === val ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('persistentStorage', val)}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Idioma / Localization</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {[
            ['es', "Español"],
            ['en', "English"]
          ].map(([val, label]) => (
            <button 
              key={val}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${language === val ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('language', val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Paleta de Colores de Acento</span>
        <div className="flex gap-2">
          {colors.map((c, i) => {
            const active = accent[0] === c[0] && accent[1] === c[1];
            return (
              <button 
                key={i}
                title={colorLabels[i]}
                className={`w-7 h-7 rounded-md relative flex items-center justify-center cursor-pointer border-0 shadow-sm transition-transform duration-100 active:scale-95`}
                style={{ background: `linear-gradient(135deg, ${c[0]}, ${c[1]})` }}
                onClick={() => onChange('accent', c)}
              >
                {active && (
                  <svg className="w-3.5 h-3.5 text-bg-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5l2 2 5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AppInternal: React.FC = () => {
  const { playSound } = useSoundEngine();
  const [view, setView] = useState<ViewType>("landing");
  const [toast, setToast] = useState<string | null>(null);
  const [deletionModal, setDeletionModal] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dynamic state loaded via decoupled hooks
  const [copilotData, setCopilotData] = useState<CopilotData>({
    summary: "",
    nextBest: { title: "", why: "", impact: "", effort: "" },
    plan: { Today: [], 'This Week': [], Later: [] }
  });

  // Demo Controls State
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>("executive");
  const [scoreStyle, setScoreStyle] = useState<ScoreStyle>("numeric");
  const [copilotMode, setCopilotMode] = useState<CopilotPresentation>("rail");
  const [accent, setAccent] = useState<string[]>(["#2DD4BF", "#22D3EE"]);
  const [persistentStorage, setPersistentStorage] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      showToast(navigator.onLine ? "Conexión restaurada en vivo" : "Sin conexión a internet (modo offline local)");
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Regulatory Deletion Form State
  const [selectedLawBroker, setSelectedLawBroker] = useState<'DataFind' | 'InfoAggregate'>('DataFind');
  const [selectedLawScope, setSelectedLawScope] = useState<'CCPA' | 'GDPR' | 'ARCO' | 'Generic'>('ARCO');
  const [selectedLawTone, setSelectedLawTone] = useState<'strict' | 'cordial' | 'concise'>('strict');

  const showToast = (m: string) => {
    setToast(m);
    playSound('scan');
    const windowToken = (window as any);
    clearTimeout(windowToken.__t);
    windowToken.__t = setTimeout(() => setToast(null), 2400);
  };

  // Integration of useTaskBoard & useScoring custom hooks
  const { tasks, resetAllTasks, setTasks } = useTaskBoard(showToast);
  const dynamicScore = useScoring(tasks);

  // Set accents dynamically
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-a", accent[0]);
    document.documentElement.style.setProperty("--accent-b", accent[1]);
    document.documentElement.style.setProperty("--teal", accent[0]);
    document.documentElement.style.setProperty("--cyan", accent[1]);
  }, [accent]);

  // Load plan on mount and task updates
  useEffect(() => {
    if (tasks.length === 0) return;
    const loadPlan = async () => {
      const plan = await aiService.getRemediationPlan(tasks);
      setCopilotData({
        summary: "Tienes 2 elementos críticos vinculados a una contraseña reutilizada. Cambiar esas credenciales cierra tu brecha más vulnerable y proyectará tu score en +12 puntos.",
        nextBest: {
          title: "Rotar contraseña reutilizada",
          why: "Una contraseña está expuesta en 2 brechas (ConnectHub + DevForum). Es tu corrección individual de mayor impacto.",
          impact: "+12 score",
          effort: "~5 min",
        },
        plan
      });
    };
    loadPlan();
  }, [tasks]);

  const handleUpdateTasks = async (updated: Task[]) => {
    setTasks(updated);
    playSound('click');
    for (const t of updated) {
      await taskService.updateTaskStatus(t.id, t.status);
      await firebaseService.updateTaskStatus(t.id, t.status);
    }
    // Quantum XOR Encrypted hydration backup save
    secureSave("tasks_progress", updated, persistentStorage);
  };

  const handleResetTasks = async () => {
    await handleResetAllTasksInternal();
  };

  const handleResetAllTasksInternal = async () => {
    await resetAllTasks();
    const fresh = await taskService.getTasks();
    const plan = await aiService.getRemediationPlan(fresh);
    setCopilotData((prev: CopilotData) => ({ ...prev, plan }));
    secureSave("tasks_progress", fresh, persistentStorage);
  };

  // Load encrypted state session if it exists on mount
  useEffect(() => {
    const cached = secureLoad("tasks_progress");
    if (cached) {
      setTasks(cached);
    }
  }, [setTasks]);

  // Resize listener
  useEffect(() => {
    const mq = window.matchMedia("(max-width:1180px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const nav = (v: string) => {
    const changeView = () => {
      setView(v as ViewType);
      document.querySelector(".content-container-column")?.scrollTo(0, 0);
    };
    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(changeView);
    } else {
      changeView();
    }
  };

  // Global keyboard shortcuts (A11y & Productivity: d=dashboard, c=copilot, t=tasks)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (key === 'd') {
        e.preventDefault();
        nav('dashboard');
        showToast("Navegación rápida: Dashboard");
      } else if (key === 'c') {
        e.preventDefault();
        nav('copilot');
        showToast("Navegación rápida: Copiloto de IA");
      } else if (key === 't') {
        e.preventDefault();
        nav('tasks');
        showToast("Navegación rápida: Tablero de Tareas");
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Premium Functional Touch: ARCO/CCPA Download Letter Simulator (Real File Generation)
  const handleDownloadDraft = (letterText: string, broker: string) => {
    const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solicitud_ARCO_supresion_${broker.toLowerCase()}_leakshield.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Solicitud ARCO descargada (.txt format)");
  };

  // Dynamic risk summary card objects
  const breachesCount = demoBreaches.length;
  const criticalCount = demoBreaches.filter((b: BreachFinding) => b.severity === 'Critical' && tasks.find(t => t.id === 't1')?.status !== 'Resolved').length;
  const highCount = demoBreaches.filter((b: BreachFinding) => b.severity === 'High' && tasks.find(t => t.id === 't2')?.status !== 'Resolved').length;
  
  const brokerCount = demoDataBrokers.filter(b => tasks.find(t => t.id === (b.id === 'db1' ? 't4' : 't7'))?.status !== 'Resolved').length;

  const dynamicRisk = {
    breach: { 
      label: "Riesgo de Brechas", 
      level: criticalCount > 0 ? "Critical" : "High", 
      value: `${breachesCount} brechas`, 
      sub: `${criticalCount} críticas · ${highCount} altas`, 
      trend: -1 
    } as const,
    footprint: { 
      label: "Huella Pública", 
      level: "Medium" as const, 
      value: "6 hallazgos", 
      sub: "1 alta visibilidad", 
      trend: -2 
    },
    oldAccounts: { 
      label: "Cuentas Inactivas", 
      level: "Medium" as const, 
      value: "3 inactivas", 
      sub: "inactividad 2–4 años", 
      trend: 0 
    },
    broker: { 
      label: "Exp. en Data Brokers", 
      level: brokerCount > 0 ? "High" : "ok", 
      value: `${brokerCount} registros`, 
      sub: brokerCount > 1 ? "opt-out activo" : brokerCount === 1 ? "1 solicitud redactada" : "0 registros", 
      trend: 0 
    } as const,
  };

  // Remediation progress calculations
  const resolved = tasks.filter(t => t.status === "Resolved").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const dynamicProgress = { resolved, inProgress, total, percent };

  // AI-native actions adapters
  const handleResolveTaskFromBreach = (taskId: string, isResolved: boolean) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: (isResolved ? 'Resolved' : 'Pending') as Task['status'] } : t);
    handleUpdateTasks(updated);
  };

  const toggleRail = () => {
    if (narrow) {
      setDrawerOpen(o => !o);
    } else {
      setRailOpen(o => !o);
    }
  };

  const isLandingOrOnboarding = ["landing", "consent", "intake"].includes(view);
  const railEnabled = copilotMode === "rail" && !isLandingOrOnboarding && view !== "copilot";
  const inGridRail = railEnabled && !narrow && railOpen;
  const drawerRail = railEnabled && narrow;

  // Render modal draft depending on custom tone
  const getCustomToneDescription = () => {
    if (selectedLawTone === 'strict') return "Exijo de forma inmediata y enérgica la exclusión legal de mis registros.";
    if (selectedLawTone === 'cordial') return "Por medio de la presente, solicito cordialmente la remoción de mi perfil comercial.";
    return "Remover identificador. Derecho ARCO ejercido. Silencio administrativo interpretado como negativa.";
  };

  const compiledLetterText = `${generateDeletionRequest(selectedLawBroker, selectedLawScope, demoProfile.name, demoProfile.location)}\n\n[Cláusula de Tono IA - ${selectedLawTone.toUpperCase()}]: ${getCustomToneDescription()}`;

  // View Router Render
  const renderScreen = () => {
    switch (view) {
      case "dashboard":
        return (
          <Dashboard 
            profile={demoProfile}
            score={dynamicScore}
            remediation={dynamicProgress}
            breaches={demoBreaches}
            highRiskData={highRiskDataClasses}
            risk={dynamicRisk}
            copilot={copilotData}
            dashboardLayout={dashboardLayout}
            scoreStyle={scoreStyle}
            onNav={nav}
            onToast={showToast}
            language={language}
          />
        );
      case "identity":
        return <IntakeScreen profile={demoProfile} inApp onToast={showToast} />;
      case "breaches":
        return (
          <BreachIntelligence 
            breaches={demoBreaches}
            inlineAI={copilotMode === "inline"}
            onToast={showToast}
            onResolveTask={handleResolveTaskFromBreach}
          />
        );
      case "footprint":
        return (
          <FootprintScanner 
            findings={demoFootprint}
            inlineAI={copilotMode === "inline"}
            onToast={showToast}
            onOpenDeletion={() => setDeletionModal(true)}
          />
        );
      case "brokers":
        return (
          <DataBrokers 
            brokers={demoDataBrokers}
            oldAccounts={demoOldAccounts}
            inlineAI={copilotMode === "inline"}
            onToast={showToast}
            onOpenDeletion={() => setDeletionModal(true)}
          />
        );
      case "copilot":
        return (
          <CopilotWorkspace 
            profile={demoProfile}
            copilotData={copilotData}
            onToast={showToast}
            onNav={nav}
            currentScoreValue={dynamicScore.value}
          />
        );
      case "tasks":
        return (
          <TaskBoard 
            tasks={tasks}
            onUpdateTasks={handleUpdateTasks}
            onToast={showToast}
            language={language}
          />
        );
      case "trust":
        return <TrustCenter onToast={showToast} onResetTasks={handleResetTasks} />;
      default:
        return null;
    }
  };

  // Full-screen Onboarding Layouts
  if (view === "landing") {
    return (
      <>
        <LandingScreen onStart={() => nav("consent")} onTrust={() => nav("trust")} />
        <TweaksOverlay 
          layout={dashboardLayout} 
          scoreStyle={scoreStyle} 
          copilotMode={copilotMode} 
          accent={accent} 
          persistentStorage={persistentStorage}
          language={language}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
          }} 
        />
      </>
    );
  }

  if (view === "consent") {
    return (
      <>
        <ConsentScreen onBack={() => nav("landing")} onContinue={() => nav("intake")} />
        <TweaksOverlay 
          layout={dashboardLayout} 
          scoreStyle={scoreStyle} 
          copilotMode={copilotMode} 
          accent={accent} 
          persistentStorage={persistentStorage}
          language={language}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
          }} 
        />
      </>
    );
  }

  if (view === "intake") {
    return (
      <div className="page min-h-screen bg-bg-0">
        <IntakeScreen profile={demoProfile} onComplete={() => nav("dashboard")} onToast={showToast} />
        <TweaksOverlay 
          layout={dashboardLayout} 
          scoreStyle={scoreStyle} 
          copilotMode={copilotMode} 
          accent={accent} 
          persistentStorage={persistentStorage}
          language={language}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
          }} 
        />
        <Toast msg={toast} />
      </div>
    );
  }

  return (
    <div className={`app-shell w-full h-screen overflow-hidden ${inGridRail ? 'has-rail' : ''} relative`}>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-crit-dim border-b border-crit text-crit font-semibold text-[12px] py-1.5 px-4 flex items-center justify-center gap-2 animate-fadeIn">
          <span className="demo-blip" style={{ backgroundColor: 'var(--crit)' }} />
          <span>Modo Offline: Operando en contingencia local segura sin conexión a internet</span>
        </div>
      )}
      <ThreatMeshBackground scoreValue={dynamicScore.value} />

      {/* Left side Nav Rail */}
      <NavRail view={view} onNav={nav} profile={demoProfile} language={language} />

      {/* Main Column */}
      <main className="main-column flex flex-col h-full min-w-0 overflow-hidden relative z-10">
        <Topbar 
          view={view}
          title={getTitles(language)[view] || ""}
          onToast={showToast}
          copilotMode={copilotMode}
          onNav={nav}
          railEnabled={railEnabled}
          railOpen={railOpen}
          drawerOpen={drawerOpen}
          toggleRail={toggleRail}
        />
        
        {/* Scrollable Screen Content */}
        <div className="content-container-column flex-1 overflow-y-auto px-6.5 py-6.5 pb-14">
          {renderScreen()}
        </div>
      </main>

      {/* Persistent Copilot Rail (Wide Screens) */}
      {inGridRail && (
        <CopilotRail 
          view={view}
          copilotData={copilotData}
          onNav={nav}
          onToast={showToast}
          onOpenDeletion={() => setDeletionModal(true)}
        />
      )}

      {/* Overlay Copilot Drawer (Narrow Screens) */}
      {drawerRail && (
        <>
          {drawerOpen && (
            <div 
              className="scrim fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-fadeIn" 
              onClick={() => setDrawerOpen(false)} 
            />
          )}
          <CopilotRail 
            view={view}
            copilotData={copilotData}
            className={`fixed top-0 right-0 h-full w-[min(372px,88vw)] z-50 shadow-[-40px_0_90px_-30px_rgba(0,0,0,0.85)] transition-transform duration-[0.26s] cubic-bezier(0.2,0.7,0.2,1) ${
              drawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onNav={(v) => { 
              setDrawerOpen(false); 
              nav(v); 
            }} 
            onToast={showToast} 
            onOpenDeletion={() => { 
              setDrawerOpen(false); 
              setDeletionModal(true); 
            }} 
          />
        </>
      )}

      {/* Deletion Draft Modal Trigger */}
      {deletionModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/72 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
          onClick={() => setDeletionModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[720px] max-h-[88vh] overflow-hidden bg-bg-1 border border-line-2 rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Specular Diagonal Highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

            <div className="flex justify-between items-center px-[22px] py-[18px] border-b border-line sticky top-0 bg-bg-1 z-10 flex-shrink-0 relative z-10">
              <div>
                <div className="text-[17px] font-semibold tracking-tight text-t-0">Solicitud de Supresión de Datos (ARCO)</div>
                <div className="text-t-2 text-[12.5px] mt-0.5">Borrador compilado por el copiloto — revisa antes de enviar</div>
              </div>
              <button 
                className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 hover:text-t-0 text-t-1 flex items-center justify-center cursor-pointer transition-all duration-130"
                onClick={() => setDeletionModal(false)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            
            <div className="p-[22px] overflow-y-auto flex-1 relative z-10">
              <div className="mb-4 bg-high/10 border border-high/30 rounded-lg p-3.5 flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-high/20 text-high flex-shrink-0">
                  <Icon name="alert" size={15} style={{ color: 'var(--high)' }} />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-t-0 leading-tight">Borrador generado por IA · Requiere revisión humana</div>
                  <div className="text-t-2 text-[11.5px] mt-0.5">Verifica los detalles del titular antes de encolar. Ningún dato real sale de tu navegador en esta demo.</div>
                </div>
              </div>
              <AIInsightCard 
                tag="Redactor IA" 
                lead 
                confidence="High"
                body="Generé una solicitud de exclusión adaptada legalmente para este data broker utilizando leyes regionales de privacidad (CCPA / Ley ARCO México)." 
              />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Broker objetivo</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {["DataFind", "InfoAggregate"].map(t => (
                    <button 
                      key={t} 
                      className={`px-3 py-1 rounded-md text-[12px] font-semibold cursor-pointer border-0 transition-all duration-120 bg-transparent ${
                        (selectedLawBroker === t) 
                          ? "bg-bg-3 text-t-0 shadow-premium" 
                          : "text-t-1 hover:text-t-0"
                      }`} 
                      onClick={() => setSelectedLawBroker(t as any)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI-Native Custom Redactor Tone Selector */}
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Tono de redacción de la IA (v0.3.0 Feature)</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {[
                    ["strict", "Estricto Legal"],
                    ["cordial", "Cordial y Firme"],
                    ["concise", "Conciso/Directo"]
                  ].map(([tone, label]) => (
                    <button 
                      key={tone} 
                      className={`px-3 py-1 rounded-md text-[12px] font-semibold cursor-pointer border-0 transition-all duration-120 bg-transparent ${
                        (selectedLawTone === tone) 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0"
                      }`} 
                      onClick={() => setSelectedLawTone(tone as any)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Marco regulatorio & Leyes</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit flex-wrap">
                  {(['CCPA', 'GDPR', 'ARCO', 'Generic'] as const).map(law => (
                    <button 
                      key={law} 
                      className={`px-3.5 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 transition-all duration-120 bg-transparent ${
                        selectedLawScope === law 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0"
                      }`} 
                      onClick={() => setSelectedLawScope(law)}
                    >
                      {law === 'Generic' ? 'Soporte Genérico' : law}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Borrador formal redactado</label>
                <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-t-1 bg-bg-inset border border-line rounded-lg p-4 max-h-[220px] overflow-y-auto">
                  {compiledLetterText}
                </pre>
              </div>

              <div className="flex items-center gap-1.5 my-3.5 text-t-2 text-[11.5px]">
                <Icon name="shield-check" size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
                <span>Esta demo no realiza envíos directos. En producción real, la cola de tareas derivará las solicitudes al backend.</span>
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    navigator.clipboard?.writeText(compiledLetterText); 
                    showToast("Borrador copiado al portapapeles"); 
                  }}
                >
                  <Icon name="file" size={15} />
                  Copiar texto
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-teal cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => handleDownloadDraft(compiledLetterText, selectedLawBroker)}
                >
                  <Icon name="download" size={15} />
                  Descargar borrador (.txt)
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    showToast("Encolado para revisión del titular — nada enviado en demo"); 
                    setTimeout(() => setDeletionModal(false), 700); 
                  }}
                >
                  <Icon name="send" size={15} />
                  Encolar para revisión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Demo Tweak Controls */}
      <TweaksOverlay 
        layout={dashboardLayout} 
        scoreStyle={scoreStyle} 
        copilotMode={copilotMode} 
        accent={accent}
        persistentStorage={persistentStorage}
        language={language}
        onChange={(k, v) => {
          if (k === 'dashboardLayout') setDashboardLayout(v);
          if (k === 'scoreStyle') setScoreStyle(v);
          if (k === 'copilotMode') setCopilotMode(v);
          if (k === 'accent') setAccent(v);
          if (k === 'persistentStorage') setPersistentStorage(v);
          if (k === 'language') setLanguage(v);
        }} 
      />

      <Toast msg={toast} />
    </div>
  );
};

// Export App wrapped under the centralized ErrorBoundary
export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppInternal />
    </ErrorBoundary>
  );
};
export default App;
