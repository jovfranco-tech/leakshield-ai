import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { CopilotData, PlanItem } from '../../types/privacy';

export const Typed: React.FC<{ text: string; speed?: number }> = ({ text, speed = 14 }) => {
  const [n, setN] = useState(0);
  
  useEffect(() => { 
    setN(0); 
  }, [text]);
  
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(id);
  }, [n, text, speed]);
  
  const done = n >= text.length;
  return (
    <span>
      {text.slice(0, n)}
      {!done && <span className="border-r-2 border-teal animate-[pulse_1s_infinite] ml-0.5" />}
    </span>
  );
};

export const RAIL_CONTEXT: Record<string, { label: string; summary: string }> = {
  landing: {
    label: "Explorando LeakShield",
    summary: "Te damos la bienvenida a LeakShield AI. Revisa la pantalla de inicio, comprende nuestros límites de seguridad y haz clic en 'Iniciar escaneo de privacidad' para comenzar."
  },
  consent: {
    label: "Límites de consentimiento",
    summary: "Vigilo tus parámetros de consentimiento. Proteger tu identidad comienza con establecer las reglas de juego claras del command center."
  },
  intake: {
    label: "Configurando tu escudo",
    summary: "Monitoreo tus identificadores. Añadir correos y nombres de usuario clave me permite cruzar toda la matriz de amenazas en tiempo real."
  },
  dashboard: {
    label: "Revisando tu exposición",
    summary: "He analizado 4 brechas, 6 hallazgos en tu huella y 2 listados en brokers. Tu mayor brecha es una contraseña reutilizada en dos cuentas comprometidas. Corregir esto sumará +12 puntos."
  },
  identity: {
    label: "Vigilando tus identificadores",
    summary: "Monitoreo 2 correos y 2 nombres de usuario. Añadir tu número celular permitiría capturar alertas de SIM-swap a las que estás ciego actualmente."
  },
  breaches: {
    label: "Priorizando brechas",
    summary: "Ordeno tus brechas por sensibilidad, no solo fecha. ConnectHub y DevForum comparten la misma contraseña filtrada: soluciónalas juntas hoy."
  },
  footprint: {
    label: "Mapeando tu huella pública",
    summary: "De los 6 hallazgos públicos, removería primero el listado del directorio telefónico, ya que asocia tu nombre a tu dirección física. Puedo redactar la solicitud de exclusión."
  },
  brokers: {
    label: "Rastreando data brokers",
    summary: "2 brokers comercializan tu perfil. Una remoción está en progreso; redacté la solicitud para el segundo para que solo la revises y apruebes."
  },
  copilot: {
    label: "Tu plan de remediación",
    summary: "Aquí está tu secuencia priorizada. Clasifico por impacto en el puntaje ÷ esfuerzo para que resuelvas lo rápido primero. Nada se envía sin tu aprobación."
  },
  tasks: {
    label: "Tablero de tareas",
    summary: "2 de 9 tareas resueltas. Los 2 elementos críticos son rápidos (menos de 5 min) y desbloquean la mayor ganancia de puntaje. Despéjalos hoy mismo."
  },
  trust: {
    label: "Límites de privacidad",
    summary: "Opero bajo estrictas reglas: solo datos autorizados, sin contraseñas guardadas y cada plantilla de solicitud requiere tu aprobación humana antes de enviarse."
  }
};

interface CopilotRailProps {
  view: string;
  copilotData: CopilotData;
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
  onOpenDeletion: () => void;
  className?: string;
}

export const CopilotRail: React.FC<CopilotRailProps> = ({
  view,
  copilotData,
  onNav,
  onToast,
  onOpenDeletion,
  className = ""
}) => {
  const ctx = RAIL_CONTEXT[view] || RAIL_CONTEXT.dashboard;

  const translateBucket = (b: string) => {
    if (b === 'Today') return 'Hoy mismo';
    if (b === 'This Week') return 'Esta semana';
    return 'Más tarde';
  };

  return (
    <aside className={`w-[var(--rail-w)] bg-gradient-to-b from-bg-1 to-bg-0 border-l border-line flex flex-col h-full overflow-hidden select-none flex-shrink-0 ${className}`}>
      {/* Header */}
      <div className="px-[18px] py-4 border-b border-line z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal">
            <Icon name="sparkles" size={17} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-t-0 font-sans">Copiloto de Privacidad</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok shadow-[0_0_8px_var(--ok)]" />
              <span className="text-[11.5px] text-t-2 font-medium">{ctx.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Scroll */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Context Summary card */}
        <div className="relative border border-teal-line bg-gradient-to-b from-teal/6 to-bg-2 rounded-lg p-3.5 overflow-hidden flex-shrink-0" key={view}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-2">
            <Icon name="sparkles" size={13} style={{ marginRight: 4 }} />
            Resumen de contexto
          </span>
          <div className="text-[12.8px] leading-[1.6] text-t-0 font-medium">
            <Typed text={ctx.summary} />
          </div>
        </div>

        {/* Next Best Action Card */}
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Siguiente mejor acción</div>
          <div className="border border-teal-line bg-bg-2 rounded-lg p-3.5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
            <div className="text-[13.5px] font-semibold text-t-0 mb-1">{copilotData.nextBest.title}</div>
            <div className="text-t-1 text-[12.3px] leading-[1.55] mb-3">{copilotData.nextBest.why}</div>
            <div className="flex gap-1.5 mb-3.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-teal-line bg-teal-dim text-teal">
                <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                {copilotData.nextBest.impact}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={11} style={{ marginRight: 3 }} />
                {copilotData.nextBest.effort}
              </span>
            </div>
            <button 
              className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100"
              onClick={() => {
                onNav("breaches");
                onToast("Se abrió la corrección en Inteligencia de Brechas");
              }}
            >
              <Icon name="key" size={14} />
              Iniciar corrección
            </button>
          </div>
        </div>

        {/* Mini Plan Board */}
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Secuencia de Remediación</div>
          <div className="flex flex-col gap-3">
            {Object.entries(copilotData.plan).map(([bucket, items]) => (
              <div key={bucket} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] font-semibold text-t-1">{translateBucket(bucket)}</span>
                  <span className="flex-1 h-[1px] bg-line" />
                  <span className="font-mono text-[10.5px] text-t-2">{items.length}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {items.map((it: PlanItem) => (
                    <div key={it.id} className="flex gap-2.5 py-1.5 items-start">
                      <span 
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          it.priority === "Critical" ? "bg-crit" : 
                          it.priority === "High" ? "bg-high" : 
                          it.priority === "Medium" ? "bg-med" : "bg-low"
                        }`} 
                      />
                      <span className="text-[12.3px] text-t-1 flex-1 leading-normal">{it.text}</span>
                      <span className={`font-mono text-[11px] font-semibold ${it.impact === "—" ? "text-t-3" : "text-teal"}`}>
                        {it.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-2 flex-shrink-0">
          <button 
            className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold text-[12.5px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={onOpenDeletion}
          >
            <Icon name="file" size={14} />
            Borrador de solicitud ARCO/CCPA
          </button>
          <button 
            className="w-full text-center text-t-2 hover:text-teal font-semibold text-[11.5px] mt-2.5 flex items-center justify-center gap-1.5 bg-transparent border-0 cursor-pointer transition-all duration-130"
            onClick={() => onNav("copilot")}
          >
            Ver plan de remediación completo
            <Icon name="arrow-right" size={13} />
          </button>
        </div>
      </div>

      {/* Footer input */}
      <div className="border-t border-line p-4 bg-bg-1 flex-shrink-0">
        <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2">
          <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
          <input 
            className="bg-transparent border-0 outline-none text-t-0 font-sans text-[13px] w-full placeholder-t-3"
            placeholder="Preguntar al copiloto..." 
            onKeyDown={e => {
              if (e.key === "Enter") {
                onToast("El copiloto es una demo simulada — las respuestas son ilustrativas");
                (e.target as HTMLInputElement).value = "";
              }
            }} 
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 text-t-3 text-[10.5px]">
          <Icon name="shield-check" size={12} />
          <span>Las respuestas de IA requieren revisión humana · demo simulada</span>
        </div>
      </div>
    </aside>
  );
};
export default CopilotRail;
