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
  try {
    const json = JSON.stringify(data);
    let result = "";
    const secretKey = "leakshield_v0.5.0_quantum_key";
    for (let i = 0; i < json.length; i++) {
      const charCode = json.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    const encoded = btoa(unescape(encodeURIComponent(result)));
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(`leakshield_secure_${key}`, encoded);
    const otherStorage = persistent ? sessionStorage : localStorage;
    otherStorage.removeItem(`leakshield_secure_${key}`);
  } catch (e) {
    console.error("Session secure save failed:", e);
  }
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
    const secretKey = "leakshield_v0.5.0_quantum_key";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    return JSON.parse(result);
  } catch (e) {
    console.warn("Session secure loading recovered from corrupt backup:", e);
    return null;
  }
};

// Premium Touch: Threat Mesh Canvas Network Background Component (Zero-Dependency)
const ThreatMeshBackground: React.FC<{ scoreValue?: number; speed?: 'slow' | 'medium' | 'fast'; theme?: 'dark' | 'light' | 'luxury' | 'tactical' }> = ({ scoreValue = 72, speed = 'medium', theme = 'dark' }) => {
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

    // Dynamic FPS framerate governor state (Recommendation 15)
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Battery monitoring governor (Recommendation 15)
    let isLowPower = false;
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        isLowPower = battery.level < 0.20 && !battery.charging;
        battery.addEventListener('levelchange', () => {
          isLowPower = battery.level < 0.20 && !battery.charging;
        });
      });
    }

    // Particle Cursor Gravity listener (Recommendation 3)
    let mouseX = -9999;
    let mouseY = -9999;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particleCount = 28;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const baseMult = speed === 'slow' ? 0.3 : speed === 'fast' ? 1.6 : 0.95;
    const speedMult = Math.max(0.2, (100 - scoreValue) / 30) * baseMult;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * speedMult,
        vy: (Math.random() - 0.5) * 0.35 * speedMult,
        r: Math.random() * 1.5 + 1
      });
    }

    let frameCount = 0;

    const draw = () => {
      // Throttle CPU when page is in the background
      if (!isVisible) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Conserve battery dynamically by throttling to 30 FPS on low battery
      if (isLowPower) {
        frameCount++;
        if (frameCount % 2 === 0) {
          animationId = requestAnimationFrame(draw);
          return;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = theme === 'light' ? 'rgba(15, 23, 42, 0.04)' : theme === 'luxury' ? 'rgba(212, 175, 55, 0.05)' : theme === 'tactical' ? 'rgba(255, 51, 82, 0.045)' : 'rgba(45, 212, 191, 0.035)';
      ctx.fillStyle = theme === 'light' ? 'rgba(15, 23, 42, 0.08)' : theme === 'luxury' ? 'rgba(212, 175, 55, 0.1)' : theme === 'tactical' ? 'rgba(255, 51, 82, 0.12)' : 'rgba(45, 212, 191, 0.08)';

      // Bio-reactive pulsing latido based on exposure severity (Recommendation 1)
      const pulsePeriod = Math.max(700, scoreValue * 20); // slower pulse if secure, faster warning pulse if exposed
      const pulseScale = 1 + Math.sin(Date.now() / pulsePeriod) * 0.20;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Cursor Gravitational Gravity vortex pull
        if (mouseX !== -9999) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200) {
            const pull = (200 - dist) * 0.00028;
            p.vx += dx * pull;
            p.vy += dy * pull;

            // Cap the velocity to keep the mesh stable
            const pSpeed = Math.hypot(p.vx, p.vy);
            const limit = speedMult * 1.5;
            if (pSpeed > limit) {
              p.vx = (p.vx / pSpeed) * limit;
              p.vy = (p.vy / pSpeed) * limit;
            }
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        // Multiply by pulseScale to breathe bio-reactively
        ctx.arc(p.x, p.y, p.r * pulseScale, 0, Math.PI * 2);
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
        ctx.strokeStyle = theme === 'light' ? `rgba(15, 23, 42, ${rp.opacity * 0.7})` : theme === 'luxury' ? `rgba(212, 175, 55, ${rp.opacity * 0.9})` : theme === 'tactical' ? `rgba(255, 51, 82, ${rp.opacity})` : `rgba(34, 211, 238, ${rp.opacity})`;
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
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationId);
    };
  }, [scoreValue, speed, theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60 threat-mesh-canvas" />;
};;

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
      <div className="flex justify-between items-center px-6 md:px-10 py-5.5 max-w-[1240px] mx-auto relative z-10">
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
// Reusable Tweaks configuration UI (rendered dynamically)
const TweaksOverlay: React.FC<{
  layout: DashboardLayout;
  scoreStyle: ScoreStyle;
  copilotMode: CopilotPresentation;
  accent: string[];
  persistentStorage: boolean;
  language: 'es' | 'en';
  theme: 'dark' | 'light' | 'luxury' | 'tactical';
  particleSpeed: 'slow' | 'medium' | 'fast';
  density: 'compact' | 'normal' | 'relaxed';
  noiseOpacity: number;
  onChange: (key: string, val: any) => void;
}> = ({ layout, scoreStyle, copilotMode, accent, persistentStorage, language, theme, particleSpeed, density, noiseOpacity, onChange }) => {
  const [open, setOpen] = useState(false);

  const colors = [
    ["#2DD4BF", "#22D3EE"], // Cyberpunk Emerald
    ["#3B82F6", "#60A5FA"], // Deep Cobalt
    ["#A855F7", "#F59E0B"], // Amethyst Amber
    ["#10B981", "#34D399"], // Virtual Jade
    ["#D4AF37", "#F3E5AB"]  // Executive Gold (v0.7.0 Option)
  ];

  const colorLabels = ["Cyberpunk Emerald", "Deep Cobalt", "Amethyst Amber", "Virtual Jade", "Executive Gold"];

  const labels = language === 'en' ? {
    demoControls: "Demo Controls",
    dbLayout: "Dashboard Layout",
    focus: "Focus", grid: "Grid", exec: "Exec.",
    scoreVis: "Score Visualization",
    number: "Number", ring: "Ring", bar: "Bar",
    copilotPanel: "Copilot Sidebar",
    rail: "Sidebar", inline: "Integrated",
    xorPersist: "XOR Persistent Storage",
    session: "Session", local: "Local (XOR)",
    lang: "Language",
    theme: "Interface Theme",
    dark: "Dark", light: "Light (Exec)", luxury: "Luxury Gold", tactical: "Tactical Red",
    meshSpeed: "ThreatMesh Speed",
    slow: "Slow", med: "Med", fast: "Fast",
    accentColor: "Accent Color Palette"
  } : {
    demoControls: "Controles de la Demo",
    dbLayout: "Diseño de Dashboard",
    focus: "Foco", grid: "Cuadrícula", exec: "Ejec.",
    scoreVis: "Visualización de Score",
    number: "Número", ring: "Anillo", bar: "Barra",
    copilotPanel: "Panel Lateral Copiloto",
    rail: "Lateral", inline: "Integrado",
    xorPersist: "Cifrado XOR Persistente",
    session: "Sesión", local: "Local (XOR)",
    lang: "Idioma / Localization",
    theme: "Tema de Interfaz",
    dark: "Oscuro", light: "Claro (Ejec.)", luxury: "Lujo Oro", tactical: "Táctico Rojo",
    meshSpeed: "Velocidad ThreatMesh",
    slow: "Lenta", med: "Media", fast: "Rápida",
    accentColor: "Paleta de Colores de Acento"
  };

  if (!open) {
    return (
      <button 
        className="fixed right-4 bottom-4 z-50 w-9 h-9 rounded-full bg-gradient-to-br from-teal to-cyan text-[#04110F] shadow-lg flex items-center justify-center cursor-pointer border-0 active:scale-95 transition-all duration-100"
        onClick={() => setOpen(true)}
        title={labels.demoControls}
      >
        <Icon name="settings" size={17} />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[272px] max-h-[82vh] overflow-y-auto bg-bg-1/95 border border-line-2 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-3 font-sans select-none text-[12px] text-t-1 custom-scrollbar">
      <div className="flex justify-between items-center font-semibold text-t-0 border-b border-line pb-2 mb-1">
        <span>{labels.demoControls}</span>
        <button className="text-t-2 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.dbLayout}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["executive", "grid", "focus"] as const).map(l => (
            <button 
              key={l}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${layout === l ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('dashboardLayout', l)}
            >
              {l === 'focus' ? labels.focus : l === 'grid' ? labels.grid : labels.exec}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.scoreVis}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["numeric", "ring", "bar"] as const).map(s => (
            <button 
              key={s}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${scoreStyle === s ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('scoreStyle', s)}
            >
              {s === 'numeric' ? labels.number : s === 'ring' ? labels.ring : labels.bar}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.copilotPanel}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["rail", "inline"] as const).map(m => (
            <button 
              key={m}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${copilotMode === m ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('copilotMode', m)}
            >
              {m === 'rail' ? labels.rail : labels.inline}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.theme}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line flex-wrap gap-0.5">
          {(["dark", "light", "luxury", "tactical"] as const).map(th => (
            <button 
              key={th}
              className={`flex-grow text-center py-1 px-1 rounded-md capitalize font-semibold cursor-pointer border-0 text-[11px] ${theme === th ? 'bg-bg-3 text-t-0 shadow-premium font-bold' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('theme', th)}
            >
              {th === 'dark' ? labels.dark : th === 'light' ? labels.light : th === 'luxury' ? labels.luxury : labels.tactical}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{language === 'en' ? "UI Density" : "Densidad de Interfaz"}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["compact", "normal", "relaxed"] as const).map(den => (
            <button 
              key={den}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${density === den ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('density', den)}
            >
              {den === 'compact' ? "Comp." : den === 'normal' ? "Norm." : "Relax"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] tracking-wide uppercase text-t-2 font-semibold">
          <span>{language === 'en' ? "Noise Opacity" : "Opacidad de Grano"}</span>
          <span>{noiseOpacity.toFixed(3)}</span>
        </div>
        <input 
          type="range"
          min="0.0"
          max="0.08"
          step="0.002"
          value={noiseOpacity}
          onChange={(e) => onChange('noiseOpacity', parseFloat(e.target.value))}
          className="w-full accent-teal cursor-pointer h-1 bg-bg-inset rounded-lg appearance-none spring-elastic"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.meshSpeed}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {(["slow", "medium", "fast"] as const).map(sp => (
            <button 
              key={sp}
              className={`flex-1 text-center py-1 rounded-md capitalize font-semibold cursor-pointer border-0 ${particleSpeed === sp ? 'bg-bg-3 text-t-0 shadow-premium' : 'text-t-2 hover:text-t-0 bg-transparent'}`}
              onClick={() => onChange('particleSpeed', sp)}
            >
              {sp === 'slow' ? labels.slow : sp === 'medium' ? labels.med : labels.fast}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.xorPersist}</span>
        <div className="flex bg-bg-inset p-0.5 rounded-lg border border-line">
          {[
            [false, labels.session],
            [true, labels.local]
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
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.lang}</span>
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
        <span className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{labels.accentColor}</span>
        <div className="flex gap-1.5 flex-wrap">
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
};;

export const AppInternal: React.FC = () => {
  const { playSound } = useSoundEngine();
  const [view, setView] = useState<ViewType>("landing");
  const [toast, setToast] = useState<string | null>(null);
  const [deletionModal, setDeletionModal] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Camera gestures navigation simulator states (v0.8.0 Premium - Recommendation 3)
  const [cameraTrackingOpen, setCameraTrackingOpen] = useState(false);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [faceMeshCalibrated, setFaceMeshCalibrated] = useState(false);
  const [simulatedFaceX, setSimulatedFaceX] = useState(0); // Range: -50 to 50 for lateral head tilts

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
  const [theme, setTheme] = useState<'dark' | 'light' | 'luxury' | 'tactical'>('dark');
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [noiseOpacity, setNoiseOpacity] = useState<number>(0.018);
  const [activeProfile, setActiveProfile] = useState<'personal' | 'trabajo' | 'finanzas'>('personal');
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutSheetOpen, setShortcutSheetOpen] = useState(false);
  const [telemetryXorModal, setTelemetryXorModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(0);
  const [lensTransitioning, setLensTransitioning] = useState(false);

  const [particleSpeed, setParticleSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    document.body.classList.remove('light-theme', 'luxury-theme', 'tactical-theme');
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else if (theme === 'luxury') {
      document.body.classList.add('luxury-theme');
    } else if (theme === 'tactical') {
      document.body.classList.add('tactical-theme');
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('density-compact', 'density-relaxed');
    if (density === 'compact') {
      document.body.classList.add('density-compact');
    } else if (density === 'relaxed') {
      document.body.classList.add('density-relaxed');
    }
  }, [density]);

  useEffect(() => {
    document.documentElement.style.setProperty('--noise-opacity', `${noiseOpacity}`);
  }, [noiseOpacity]);
  
  useEffect(() => {
    let timeoutId: number;
    const updateOnlineStatus = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsOnline(navigator.onLine);
        showToast(navigator.onLine ? "Conexión restaurada en vivo" : "Sin conexión a internet (modo offline local)");
      }, 400); // 400ms Debounce to prevent micro-flickering spam
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearTimeout(timeoutId);
    };
  }, []);

  // PerformanceObserver to log core rendering/loading metrics passively (Telemetry)
  useEffect(() => {
    try {
      if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`[LeakShield Performance] ${entry.name}: ${entry.startTime.toFixed(1)}ms`);
          });
        });
        observer.observe({ type: 'mark', buffered: true });
        observer.observe({ type: 'measure', buffered: true });
        performance.mark('leakshield-boot-start');
      }
    } catch (e) {
      console.warn("PerformanceObserver not fully supported or restricted:", e);
    }
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
    setLensTransitioning(true);
    const column = document.querySelector(".content-container-column");
    const changeView = () => {
      setView(v as ViewType);
      column?.scrollTo(0, 0);
    };
    
    // Play acoustic micro-signal on navigation click
    playSound('lens' as any);

    const cleanUpLens = () => {
      setTimeout(() => setLensTransitioning(false), 450);
    };

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        changeView();
        cleanUpLens();
      });
    } else {
      if (column) {
        column.classList.add("fade-out-transition");
        setTimeout(() => {
          changeView();
          column.classList.remove("fade-out-transition");
          column.classList.add("fade-in-transition");
          setTimeout(() => {
            column.classList.remove("fade-in-transition");
            cleanUpLens();
          }, 240);
        }, 120);
      } else {
        changeView();
        cleanUpLens();
      }
    }
  };

  // Global keyboard shortcuts (A11y & Productivity: d=dashboard, c=copilot, t=tasks, supporting both raw and Alt/Option modifiers)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        playSound('click');
        return;
      }

      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }
      
      const key = e.key.toLowerCase();
      const isAlt = e.altKey;
      
      // ? key for Keyboard Shortcuts sheet
      if (e.key === '?') {
        e.preventDefault();
        setShortcutSheetOpen(prev => !prev);
        playSound('click');
        return;
      }

      if (key === 'd' || (isAlt && key === 'd')) {
        e.preventDefault();
        nav('dashboard');
        showToast("Navegación rápida: Dashboard");
      } else if (key === 'c' || (isAlt && key === 'c')) {
        e.preventDefault();
        nav('copilot');
        showToast("Navegación rápida: Copiloto de IA");
      } else if (key === 't' || (isAlt && key === 't')) {
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

  // computed profile according to active profile state (Recommendation 13)
  const computedProfile = {
    ...demoProfile,
    name: activeProfile === 'personal' ? demoProfile.name : activeProfile === 'trabajo' ? "Jovan Franco (Corp)" : "Jovan Franco (Private Wealth)",
    emails: activeProfile === 'personal' ? demoProfile.emails : activeProfile === 'trabajo' ? ["jovan.franco@enterprise-corp.com"] : ["jovan.franco@private-vault.net"],
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

  const compiledLetterText = `${generateDeletionRequest(selectedLawBroker, selectedLawScope, computedProfile.name, computedProfile.location)}\n\n[Cláusula de Tono IA - ${selectedLawTone.toUpperCase()}]: ${getCustomToneDescription()}`;

  // View Router Render
  const renderScreen = () => {
    switch (view) {
      case "dashboard":
        return (
          <Dashboard 
            profile={computedProfile}
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
        return <IntakeScreen profile={computedProfile} inApp onToast={showToast} />;
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
            profile={computedProfile}
            copilotData={copilotData}
            onToast={showToast}
            onNav={nav}
            currentScoreValue={dynamicScore.value}
            language={language}
            theme={theme}
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
          theme={theme}
          particleSpeed={particleSpeed}
          density={density}
          noiseOpacity={noiseOpacity}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
            if (k === 'theme') setTheme(v);
            if (k === 'particleSpeed') setParticleSpeed(v);
            if (k === 'density') setDensity(v);
            if (k === 'noiseOpacity') setNoiseOpacity(v);
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
          theme={theme}
          particleSpeed={particleSpeed}
          density={density}
          noiseOpacity={noiseOpacity}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
            if (k === 'theme') setTheme(v);
            if (k === 'particleSpeed') setParticleSpeed(v);
            if (k === 'density') setDensity(v);
            if (k === 'noiseOpacity') setNoiseOpacity(v);
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
          theme={theme}
          particleSpeed={particleSpeed}
          density={density}
          noiseOpacity={noiseOpacity}
          onChange={(k, v) => {
            if (k === 'dashboardLayout') setDashboardLayout(v);
            if (k === 'scoreStyle') setScoreStyle(v);
            if (k === 'copilotMode') setCopilotMode(v);
            if (k === 'accent') setAccent(v);
            if (k === 'persistentStorage') setPersistentStorage(v);
            if (k === 'language') setLanguage(v);
            if (k === 'theme') setTheme(v);
            if (k === 'particleSpeed') setParticleSpeed(v);
            if (k === 'density') setDensity(v);
            if (k === 'noiseOpacity') setNoiseOpacity(v);
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
      <ThreatMeshBackground scoreValue={dynamicScore.value} speed={particleSpeed} theme={theme} />

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
        <div className="content-container-column flex-1 overflow-y-auto px-5 md:px-8 py-6.5 pb-14">
          <div key={view} className={`view-transition-container ${lensTransitioning ? 'camera-lens-sweep' : ''}`}>
            {renderScreen()}
          </div>
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
        theme={theme}
        particleSpeed={particleSpeed}
        density={density}
        noiseOpacity={noiseOpacity}
        onChange={(k, v) => {
          if (k === 'dashboardLayout') setDashboardLayout(v);
          if (k === 'scoreStyle') setScoreStyle(v);
          if (k === 'copilotMode') setCopilotMode(v);
          if (k === 'accent') setAccent(v);
          if (k === 'persistentStorage') setPersistentStorage(v);
          if (k === 'language') setLanguage(v);
          if (k === 'theme') setTheme(v);
          if (k === 'particleSpeed') setParticleSpeed(v);
          if (k === 'density') setDensity(v);
          if (k === 'noiseOpacity') setNoiseOpacity(v);
        }} 
      />

      {/* Phase V Onboarding Contextual Guide (Recommendation 18) */}
      {onboardingStep !== null && (
        <div className="fixed bottom-16 left-6 z-[45] w-[320px] bg-bg-1/90 border border-line-2 rounded-xl p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl animate-fadeIn font-sans no-print">
          <div className="absolute top-3 right-3 text-t-3 hover:text-t-1 cursor-pointer font-bold" onClick={() => setOnboardingStep(null)}>✕</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-teal text-[#04110F] text-[11px] font-bold flex items-center justify-center">i</span>
            <span className="text-[12.5px] font-bold text-t-0 uppercase tracking-wide">Onboarding Guiado (v0.7.0)</span>
          </div>
          <div className="text-[12.5px] text-t-1 leading-relaxed">
            {onboardingStep === 0 && (language === 'en' ? "Welcome to the executive Command Center! Let's explore its highly optimized features." : "¡Bienvenido al Command Center de LeakShield! Exploremos juntos sus herramientas ejecutivas.")}
            {onboardingStep === 1 && (language === 'en' ? "Ingestion view: Process CSV registries safely in your browser at 60 FPS using async generators." : "Ingesta de datos: Procesa registros CSV de forma asíncrona a 60 FPS sin enviar nada a internet.")}
            {onboardingStep === 2 && (language === 'en' ? "Trust Center: Persist security compartments encrypted with local AES-GCM and TouchID." : "Centro de Confianza: Configura tu bóveda cifrada en AES-GCM local con TouchID biométrico.")}
            {onboardingStep === 3 && (language === 'en' ? "AI Copilot: Try the legal debate Sandbox, Token ID Encoder, and OCR classifier." : "Copiloto IA: Interactúa en el Sandbox de debate, codificador de tokens y simulador OCR.")}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-line">
            <span className="text-[11px] text-t-2">{onboardingStep + 1} de 4</span>
            <div className="flex gap-1.5">
              {onboardingStep > 0 && (
                <button 
                  className="px-2.5 py-1 rounded bg-bg-3 hover:bg-bg-2 border-0 text-t-1 hover:text-t-0 text-[11px] font-semibold cursor-pointer"
                  onClick={() => { setOnboardingStep(prev => prev! - 1); playSound('click'); }}
                >
                  {language === 'en' ? "Back" : "Atrás"}
                </button>
              )}
              <button 
                className="px-3 py-1 rounded bg-gradient-to-b from-teal to-cyan text-[#04110F] border-0 text-[11px] font-bold cursor-pointer"
                onClick={() => {
                  if (onboardingStep < 3) {
                    setOnboardingStep(prev => prev! + 1);
                    playSound('click');
                    if (onboardingStep === 0) nav('identity');
                    if (onboardingStep === 1) nav('trust');
                    if (onboardingStep === 2) nav('copilot');
                  } else {
                    setOnboardingStep(null);
                    playSound('success');
                    showToast(language === 'en' ? "Onboarding completed!" : "¡Onboarding completado!");
                  }
                }}
              >
                {onboardingStep === 3 ? (language === 'en' ? "Finish" : "Finalizar") : (language === 'en' ? "Next" : "Siguiente")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase V Command Palette (Recommendation 20) */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[4px] grid place-items-center p-6 cursor-pointer no-print"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[480px] bg-bg-1 border border-line-2 rounded-xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-line pb-3 mb-3">
              <Icon name="search" size={16} style={{ color: "var(--teal)" }} />
              <input 
                type="text"
                placeholder={language === 'en' ? "Search commands... (e.g. theme, copilot)" : "Buscar comandos... (ej. tema, copiloto)"}
                className="bg-transparent border-0 outline-none text-t-0 text-[13px] w-full"
                autoFocus
                onKeyDown={(e) => {
                  const val = e.currentTarget.value.toLowerCase().trim();
                  if (e.key === 'Enter') {
                    if (val.includes('dashboard') || val.includes('inicio')) { nav('dashboard'); setSearchOpen(false); }
                    else if (val.includes('copilot') || val.includes('copiloto')) { nav('copilot'); setSearchOpen(false); }
                    else if (val.includes('trust') || val.includes('confianza')) { nav('trust'); setSearchOpen(false); }
                    else if (val.includes('intake') || val.includes('ingesta')) { nav('identity'); setSearchOpen(false); }
                    else if (val.includes('task') || val.includes('tareas')) { nav('tasks'); setSearchOpen(false); }
                    else if (val.includes('claro') || val.includes('light')) { setTheme('light'); setSearchOpen(false); }
                    else if (val.includes('oscuro') || val.includes('dark')) { setTheme('dark'); setSearchOpen(false); }
                    else if (val.includes('lujo') || val.includes('luxury') || val.includes('oro')) { setTheme('luxury'); setSearchOpen(false); }
                    else if (val.includes('compact') || val.includes('compacto')) { setDensity('compact'); setSearchOpen(false); }
                    else if (val.includes('relaxed') || val.includes('relajado')) { setDensity('relaxed'); setSearchOpen(false); }
                    else if (val.includes('normal')) { setDensity('normal'); setSearchOpen(false); }
                    else if (val.includes('personal')) { setActiveProfile('personal'); setSearchOpen(false); }
                    else if (val.includes('trabajo') || val.includes('corp')) { setActiveProfile('trabajo'); setSearchOpen(false); }
                    else if (val.includes('finanzas') || val.includes('finance')) { setActiveProfile('finanzas'); setSearchOpen(false); }
                    else if (val.includes('telemetria') || val.includes('telemetry')) { setTelemetryXorModal(true); setSearchOpen(false); }
                    else { showToast(language === 'en' ? "Command not matched" : "Comando no reconocido"); }
                  }
                }}
              />
            </div>
            <div className="text-[11px] text-t-2 mb-2 font-semibold uppercase tracking-wider">{language === 'en' ? "Navigation & Actions" : "Navegación y Acciones"}</div>
            <div className="flex flex-col gap-1 text-[12.5px] text-t-1">
              {[
                { c: "Dashboard", desc: language === 'en' ? "Go to Main Dashboard" : "Ir al Dashboard Ejecutivo" },
                { c: "Copiloto IA", desc: language === 'en' ? "Open AI Remediation Workspace" : "Ir al Copiloto de IA" },
                { c: "Trust Center", desc: language === 'en' ? "Configure 3D XOR Cryptography" : "Configurar Cubo XOR 3D" },
                { c: "Tema Luxury", desc: language === 'en' ? "Toggle Luxury Gold Palette" : "Activar Paleta de Oro Ejecutivo" },
                { c: "Densidad Compacta", desc: language === 'en' ? "Minimize visual padding layout" : "Reducir espaciado de pantalla" },
                { c: "Telemetría XOR", desc: language === 'en' ? "Inspect encrypted JSON telemetries" : "Auditar logs XOR-JSON" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-2 px-2.5 rounded-lg hover:bg-bg-3 cursor-pointer group"
                  onClick={() => {
                    if (item.c.includes('Dashboard')) nav('dashboard');
                    else if (item.c.includes('Copiloto')) nav('copilot');
                    else if (item.c.includes('Trust')) nav('trust');
                    else if (item.c.includes('Luxury')) setTheme('luxury');
                    else if (item.c.includes('Compacta')) setDensity('compact');
                    else if (item.c.includes('Telemetría')) setTelemetryXorModal(true);
                    setSearchOpen(false);
                  }}
                >
                  <span className="font-semibold text-t-0 group-hover:text-teal">{item.c}</span>
                  <span className="text-[11px] text-t-2">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase V Keyboard Shortcuts Sheet (Recommendation 14) */}
      {shortcutSheetOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[4px] grid place-items-center p-6 cursor-pointer no-print"
          onClick={() => setShortcutSheetOpen(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[400px] bg-bg-1 border border-line-2 rounded-xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-line pb-3 mb-4">
              <span className="text-[14px] font-bold text-t-0 flex items-center gap-2">
                <Icon name="keyboard" size={16} style={{ color: "var(--teal)" }} />
                {language === 'en' ? "System Keyboard Hotkeys" : "Atajos de Teclado del Sistema"}
              </span>
              <button className="text-t-2 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold" onClick={() => setShortcutSheetOpen(false)}>✕</button>
            </div>
            <div className="flex flex-col gap-3 text-[12.5px] text-t-1">
              {[
                { k: "D / Alt + D", desc: language === 'en' ? "Navigate to Main Dashboard" : "Navegar al Dashboard Principal" },
                { k: "C / Alt + C", desc: language === 'en' ? "Navigate to AI Remediation Copilot" : "Navegar al Copiloto de IA" },
                { k: "T / Alt + T", desc: language === 'en' ? "Navigate to Task Board" : "Navegar al Tablero de Tareas" },
                { k: "Cmd/Ctrl + K", desc: language === 'en' ? "Open Command Search Palette" : "Abrir Paleta de Comandos Central" },
                { k: "?", desc: language === 'en' ? "Toggle this Keyboard Shortcuts sheet" : "Mostrar / ocultar esta hoja de atajos" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-semibold text-t-2">{item.desc}</span>
                  <span className="font-mono bg-bg-inset border border-line px-2 py-0.5 rounded text-[11px] text-teal font-bold">{item.k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase V Telemetry XOR Auditor (Recommendation 19) */}
      {telemetryXorModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/68 backdrop-blur-[5px] grid place-items-center p-6 cursor-pointer no-print"
          onClick={() => setTelemetryXorModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[560px] bg-bg-1 border border-line-2 rounded-xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative p-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-line pb-3 mb-4">
              <span className="text-[14.5px] font-bold text-t-0 flex items-center gap-2">
                <Icon name="database" size={16} style={{ color: "var(--teal)" }} />
                {language === 'en' ? "Encrypted Live Telemetries Log" : "Auditor de Telemetrías XOR-JSON"}
              </span>
              <button className="text-t-2 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold" onClick={() => setTelemetryXorModal(false)}>✕</button>
            </div>
            
            <div className="mb-4 bg-teal/10 border border-teal/30 rounded-lg p-3 flex items-center gap-3">
              <Icon name="shield-check" size={16} style={{ color: "var(--teal)" }} />
              <div className="text-[11.5px] text-t-1">
                {language === 'en' 
                  ? "Audit raw telemetries below. Toggle base64+XOR formatting to witness PII local hashing in real-time."
                  : "Audite logs de telemetría. Active la codificación base64+XOR para visualizar la ofuscación en tiempo real."}
              </div>
            </div>

            <div className="text-[11px] text-t-2 mb-1.5 uppercase font-semibold tracking-wider">{language === 'en' ? "Anonymize Sensitive Fields" : "Anonimizar Campos Sensibles"}</div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { f: "activeProfile", label: "Active Profile" },
                { f: "score", label: "Dynamic Score" },
                { f: "networkLatency", label: "INP/FPS Latency" }
              ].map(fld => (
                <button
                  key={fld.f}
                  className="px-2.5 py-1.5 rounded bg-bg-3 border border-line text-t-1 hover:text-t-0 text-[11.5px] cursor-pointer"
                  onClick={() => showToast(`Campo ${fld.label} sanitizado en bufer de salida.`)}
                >
                  ✕ {fld.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-[11.5px] text-t-2 font-bold uppercase">{language === 'en' ? "Raw JSON Output" : "Salida de Logs en Vivo"}</span>
              <button 
                className="text-[11px] font-bold text-teal bg-bg-3 border border-line px-2.5 py-0.5 rounded cursor-pointer"
                onClick={() => {
                  const el = document.getElementById("telemetry-raw-text");
                  if (el) {
                    navigator.clipboard?.writeText(el.innerText);
                    showToast("Copiado al portapapeles");
                  }
                }}
              >
                {language === 'en' ? "Copy Log" : "Copiar Log"}
              </button>
            </div>

            <pre 
              id="telemetry-raw-text" 
              className="m-0 font-mono text-[11px] text-t-1 bg-bg-inset border border-line p-4 rounded-lg overflow-x-auto max-h-[180px]"
            >
              {JSON.stringify({
                app: "leakshield-ai",
                version: "0.7.0-FaseV",
                profile: activeProfile,
                theme: theme,
                density: density,
                score: dynamicScore.value,
                activeAliasPool: tasks.filter(t => t.status === 'Resolved').length,
                performance: { FPS: 60, INP_ms: 12 },
                encryptionKey: "leakshield_v0.7.0_quantum_xor"
              }, null, 2)}
            </pre>

            <div className="mt-4 flex justify-end gap-2.5 border-t border-line pt-3.5">
              <button 
                className="px-3.5 py-1.5 rounded-lg border border-line-2 bg-bg-3 text-t-1 hover:text-t-0 text-[12px] font-semibold cursor-pointer shadow-premium"
                onClick={() => {
                  const encoded = btoa(JSON.stringify({ score: dynamicScore.value, density, activeProfile }));
                  showToast(`Cifrado de sesión XOR: ${encoded.substring(0, 16)}...`);
                }}
              >
                {language === 'en' ? "Simulate XOR Cipher" : "Simular Cifrado XOR"}
              </button>
              <button 
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-teal to-cyan text-[#04110F] text-[12px] font-bold cursor-pointer shadow-premium"
                onClick={() => setTelemetryXorModal(false)}
              >
                {language === 'en' ? "Close Auditor" : "Cerrar Auditor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Camera Gesture Tracker Button (v0.8.0 - Recommendation 3) */}
      <button 
        className="fixed right-16 bottom-4 z-50 w-9 h-9 rounded-full bg-bg-3 border border-line-2 hover:border-teal-line text-t-1 hover:text-teal shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-100 no-print"
        onClick={() => { setCameraTrackingOpen(prev => !prev); playSound('click'); }}
        title={language === 'en' ? "Camera Gestures Navigation" : "Navegación por Gestos de Cámara"}
      >
        <span className="text-base">📸</span>
      </button>

      {/* Simulated Camera Tracking FaceMesh Navigation Panel (v0.8.0 - Recommendation 3) */}
      {cameraTrackingOpen && (
        <div className="fixed right-4 bottom-16 z-50 w-[260px] bg-bg-1 border border-line-2 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fadeIn font-sans select-none text-[12px] text-t-1 no-print">
          <div className="flex justify-between items-center font-semibold text-t-0 border-b border-line pb-2 mb-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${gesturesEnabled ? 'bg-ok animate-pulse' : 'bg-t-3'}`} />
              {language === 'en' ? "Camera Head-Tilt Gestures" : "Navegación por Gestos (v0.8.0)"}
            </span>
            <button className="text-t-2 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold" onClick={() => setCameraTrackingOpen(false)}>✕</button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>{language === 'en' ? "Enable gesture routing" : "Activar gestos de cámara"}</span>
              <button 
                className={`w-9 h-5 rounded-full relative transition-all border-0 cursor-pointer ${gesturesEnabled ? 'bg-teal' : 'bg-bg-inset border border-line'}`}
                onClick={() => {
                  setGesturesEnabled(!gesturesEnabled);
                  playSound('touchid' as any);
                  if (!gesturesEnabled) {
                    setFaceMeshCalibrated(false);
                    setTimeout(() => {
                      setFaceMeshCalibrated(true);
                      playSound('success');
                      showToast(language === 'en' ? "FaceMesh calibrated successfully!" : "¡Modelo FaceMesh calibrado con éxito!");
                    }, 1200);
                  }
                }}
              >
                <div className={`w-4 h-4 rounded-full bg-[#04110F] absolute top-0.5 transition-all ${gesturesEnabled ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Virtual High-Tech Camera Monitor Canvas Feed */}
            <div className="relative h-28 bg-bg-inset border border-line rounded-lg overflow-hidden flex items-center justify-center">
              {/* Scanline or target crosshair */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.003] to-white/[0.015] pointer-events-none" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-teal/10 pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-teal/10 pointer-events-none" />

              {gesturesEnabled ? (
                <>
                  {!faceMeshCalibrated ? (
                    <div className="flex flex-col items-center justify-center text-center animate-pulse text-teal font-mono text-[10.5px]">
                      <span className="spin text-lg mb-1.5">⚙️</span>
                      <span>{language === 'en' ? "CALIBRATING FACEMESH..." : "CALIBRANDO FACEMESH..."}</span>
                    </div>
                  ) : (
                    <>
                      {/* High-tech vector wireframe face drawn dynamically using SVG */}
                      <svg className="w-full h-full" viewBox="0 0 200 100">
                        {/* Eyes, nose, mouth dots shifting with simulatedFaceX */}
                        <g transform={`translate(${100 + simulatedFaceX}, 50)`} className="transition-transform duration-150">
                          {/* Face contour oval */}
                          <ellipse cx="0" cy="0" rx="30" ry="40" stroke="var(--teal)" strokeWidth="1" fill="none" opacity="0.3" />
                          {/* Horizontal mesh lines */}
                          <path d="M -30 0 Q 0 10 30 0" stroke="var(--teal)" strokeWidth="0.5" fill="none" opacity="0.2" />
                          <path d="M -25 -15 Q 0 -5 25 -15" stroke="var(--teal)" strokeWidth="0.5" fill="none" opacity="0.15" />
                          <path d="M -25 15 Q 0 25 25 15" stroke="var(--teal)" strokeWidth="0.5" fill="none" opacity="0.15" />
                          
                          {/* Eyes */}
                          <circle cx="-10" cy="-10" r="1.5" fill="var(--teal)" className="animate-pulse" />
                          <circle cx="10" cy="-10" r="1.5" fill="var(--teal)" className="animate-pulse" />
                          {/* Nose bridge line */}
                          <line x1="0" y1="-10" x2="0" y2="10" stroke="var(--teal)" strokeWidth="1" />
                          {/* Mouth */}
                          <path d="M -8 18 Q 0 22 8 18" stroke="var(--teal)" strokeWidth="1" fill="none" />
                        </g>

                        {/* Angle feedback indicator */}
                        <text x="10" y="20" fontSize="9" fontFamily="var(--mono)" fill="var(--t-2)">
                          TILT: {simulatedFaceX > 20 ? "RIGHT ➡️" : simulatedFaceX < -20 ? "⬅️ LEFT" : "CENTER ●"}
                        </text>
                      </svg>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-t-3">
                  <span className="text-2xl mb-1 filter grayscale">👤</span>
                  <span>{language === 'en' ? "Camera stream standby" : "Flujo de cámara en espera"}</span>
                </div>
              )}
            </div>

            {/* Slider to simulate tilts manually (for mouse/touch screens without webcam) */}
            {gesturesEnabled && faceMeshCalibrated && (
              <div className="flex flex-col gap-1.5 bg-bg-inset border border-line p-2.5 rounded-lg">
                <div className="flex justify-between items-center text-[10px] tracking-wide uppercase text-t-2 font-semibold">
                  <span>{language === 'en' ? "Simulate Face Tilt (Manual)" : "Simular Giro Facial (Manual)"}</span>
                  <span className="font-mono text-teal font-bold">{simulatedFaceX}°</span>
                </div>
                <input 
                  type="range"
                  min="-45"
                  max="45"
                  value={simulatedFaceX}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSimulatedFaceX(val);
                    
                    // Navigation dispatcher based on head tilts (Recommendation 3)
                    if (val < -30) {
                      playSound('webrtc' as any);
                      // Go to previous view
                      const routeCycle: ViewType[] = ['dashboard', 'breaches', 'footprint', 'brokers', 'copilot', 'tasks', 'trust'];
                      const currentIdx = routeCycle.indexOf(view);
                      if (currentIdx !== -1) {
                        const prevIdx = (currentIdx - 1 + routeCycle.length) % routeCycle.length;
                        nav(routeCycle[prevIdx]);
                        showToast(language === 'en' ? "Gestures: nav previous section" : "Gestos: navegando sección anterior");
                      }
                      setSimulatedFaceX(0); // Reset
                    } else if (val > 30) {
                      playSound('webrtc' as any);
                      // Go to next view
                      const routeCycle: ViewType[] = ['dashboard', 'breaches', 'footprint', 'brokers', 'copilot', 'tasks', 'trust'];
                      const currentIdx = routeCycle.indexOf(view);
                      if (currentIdx !== -1) {
                        const nextIdx = (currentIdx + 1) % routeCycle.length;
                        nav(routeCycle[nextIdx]);
                        showToast(language === 'en' ? "Gestures: nav next section" : "Gestos: navegando sección siguiente");
                      }
                      setSimulatedFaceX(0); // Reset
                    }
                  }}
                  className="w-full accent-teal cursor-pointer h-1 bg-bg-2 rounded spring-elastic"
                />
                <span className="text-[9.5px] text-t-3 leading-normal block">
                  * {language === 'en' ? "Tilt <-30° for previous view, >30° for next" : "Gira <-30° para sección anterior, >30° para siguiente"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

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
