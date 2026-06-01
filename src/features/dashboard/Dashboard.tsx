import React from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { ScoreDisplay, Delta } from '../../components/ui/ScoreDisplay';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { PrivacyScore, BreachFinding, HighRiskDataClass, RiskTileData, Profile, RemediationProgress } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

  // Perspective 3D Tilt Parallax
  const w = rect.width;
  const h = rect.height;
  const mouseX = x - w / 2;
  const mouseY = y - h / 2;
  const rX = (mouseY / (h / 2)) * -6; // Max 6deg
  const rY = (mouseX / (w / 2)) * 6;
  e.currentTarget.style.setProperty('--tilt-rx', `${rX}deg`);
  e.currentTarget.style.setProperty('--tilt-ry', `${rY}deg`);
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  e.currentTarget.style.setProperty('--tilt-rx', '0deg');
  e.currentTarget.style.setProperty('--tilt-ry', '0deg');
};

interface ScoreCardProps {
  score: PrivacyScore;
  variant: 'numeric' | 'ring' | 'bar';
  big?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, variant, big }) => {
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-gradient-to-br from-bg-2 to-bg-1 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      {/* Radial Hover Glow & Specular Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.07), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">Puntaje de Privacidad</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
          <Icon name="clock" size={12} />
          {score.updated}
        </span>
      </div>
      <div className="relative z-10">
        <ScoreDisplay score={score} variant={variant} compact={!big} />
      </div>
      <div className="h-[1px] bg-line my-3.5 relative z-10" />
      <div className="text-t-2 text-[12.2px] leading-relaxed relative z-10">
        Métrica compuesta de severidad de brechas, reutilización de credenciales, huella pública y brokers de datos.
      </div>
    </div>
  );
};

interface FactorsCardProps {
  score: PrivacyScore;
  language?: 'es' | 'en';
}

const FactorsCard: React.FC<FactorsCardProps> = ({ score, language = 'es' }) => {
  const [showTree, setShowTree] = React.useState(false);
  const [activeExplanation, setActiveExplanation] = React.useState<number | null>(null);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      {/* Radial Hover Glow & Specular Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="sparkles" size={16} style={{ color: "var(--teal)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Factores del Score: {score.value}</h2>
        <button 
          className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim hover:bg-teal-dim/80 text-teal cursor-pointer transition-colors"
          onClick={() => setShowTree(!showTree)}
        >
          <Icon name="sparkles" size={11} />
          {showTree ? "Ver Factores" : "Árbol IA"}
        </button>
      </div>

      {showTree ? (
        <div className="flex flex-col gap-3 font-mono text-[12px] text-t-1 bg-bg-inset border border-line rounded-lg p-4 animate-fadeIn relative z-10">
          <div className="flex justify-between items-center pb-2 border-b border-line/40">
            <span className="text-[11.5px] font-semibold text-teal uppercase tracking-wider">Algoritmo de Scoring IA</span>
            <span className="text-t-3 text-[10px] font-mono">v0.3.0 Engine</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-ok font-semibold">1. Estado Inicial</span>
              <span className="text-t-3">➔</span>
              <span>Puntaje Base: 100 pts</span>
            </div>
            <div className="pl-4 border-l border-line-2 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-crit font-semibold">2. Brechas de Seguridad</span>
                <span className="text-t-3">➔</span>
                <span>Pondera severidad de datos (-12 pts cada brecha con contraseña)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-high font-semibold">3. Brokers de Datos</span>
                <span className="text-t-3">➔</span>
                <span>Castiga exposición residencial (-6 pts c/u)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-med font-semibold">4. Huella Pública</span>
                <span className="text-t-3">➔</span>
                <span>Pérdidas de metadatos de red y cuentas viejas (-4 pts c/u)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-ok font-semibold">5. Remediaciones Confirmadas</span>
                <span className="text-t-3">➔</span>
                <span>Aumenta puntaje (+8 a +12 pts) c/u</span>
              </div>
            </div>
            <div className="mt-1 pt-2.5 border-t border-line/40 text-[11px] text-t-2 leading-relaxed font-sans normal-case">
              * El motor de decisión IA correlaciona el nivel de riesgo global basándose en la accesibilidad de tus credenciales por parte de ciberdelincuentes.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 relative z-10">
          {score.factors.map((f, i) => {
            const neg = f.impact < 0;
            const w = Math.min(100, Math.abs(f.impact) / 14 * 100);
            return (
              <div 
                key={i} 
                className="relative group/factor border border-transparent hover:border-line/40 hover:bg-bg-inset rounded-lg p-2.5 transition-all duration-150 cursor-pointer"
                onClick={() => setActiveExplanation(activeExplanation === i ? null : i)}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-[12.8px] font-medium text-t-1">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: f.credit ? "var(--ok)" : neg ? "var(--crit)" : "var(--t-3)" }} 
                    />
                    {f.label}
                  </span>
                  
                  {/* Score Factor Explanation Tooltip */}
                  <span 
                    className="font-mono text-[12.5px] font-semibold cursor-help"
                    style={{ color: f.credit ? "var(--ok)" : neg ? "var(--crit)" : "var(--t-2)" }}
                    title={`${f.detail} (Impacto: ${f.impact} puntos en el score global)`}
                  >
                    {f.impact > 0 ? "+" : ""}{f.impact}
                </span>
              </div>
              <div className="h-1.2 rounded-full bg-bg-inset overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${w}%`, 
                    background: f.credit ? "var(--ok)" : neg ? "linear-gradient(90deg,var(--crit),var(--high))" : "var(--t-3)" 
                  }} 
                />
              </div>
              <div className="text-t-2 text-[11.3px] mt-1.5">{f.detail}</div>

                {activeExplanation === i && (
                  <div className="mt-2.5 p-3 rounded-lg border border-teal/20 bg-teal/5 text-[12px] text-t-1 leading-relaxed animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-semibold text-teal mb-1.5">
                      <Icon name="sparkles" size={13} />
                      {language === 'es' ? "Explicación de la IA" : "AI Explanation"}
                    </div>
                    <div>
                      {f.kind === "breach" 
                        ? (language === 'es' ? "Nuestros algoritmos correlacionaron que tu hash SHA-1 de ConnectHub fue expuesto en texto plano en la dark web, elevando la probabilidad de secuestro de cuenta por fuerza bruta masiva en un 87%." : "Our algorithms correlated that your SHA-1 hash from ConnectHub was exposed in plaintext on the dark web, raising brute-force hijacking probability by 87%.")
                        : f.kind === "password"
                        ? (language === 'es' ? "La IA detectó una entropía idéntica en hashes de credenciales de 2 bases de datos de brechas distintas, lo que facilita ataques automatizados de Credential Stuffing." : "The AI detected identical entropy in credential hashes across 2 different breach databases, facilitating automated Credential Stuffing attacks.")
                        : f.kind === "footprint"
                        ? (language === 'es' ? "Se identificaron registros de geolocalización IP vinculados a tu nick registrado en el foro de devs, facilitando el perfilado físico exacto del titular por correlación de redes." : "IP geolocation logs were identified linked to your registered dev forum username, facilitating physical profiling via network correlation.")
                        : f.kind === "broker"
                        ? (language === 'es' ? "Brokers de marketing de datos agregaron tu historial a su índice público para reventa comercial, incrementando el spam telefónico y de phishing dirigido." : "Data brokers aggregated your history into their public index for commercial resale, increasing telemarketing spam and targeted phishing.")
                        : f.kind === "oldaccount"
                        ? (language === 'es' ? "Cuentas inactivas detectadas sin rotación de contraseña en los últimos 4 años. Amplían tu superficie de vulnerabilidad digital sin beneficio activo para el titular." : "Dormant accounts detected without password rotation in the last 4 years. They widen your surface area of digital vulnerability without active benefit.")
                        : (language === 'es' ? "En base al análisis semántico continuo de metadatos, este factor impacta proporcionalmente el score general de privacidad del Command Center." : "Based on continuous semantic metadata analysis, this factor proportionally impacts the general privacy score of the Command Center.")
                      }
                    </div>
                    <div className="text-[10px] text-t-3 font-mono mt-1.5">
                      {language === 'es' ? `Criterio matemático: Penalización de ${f.impact} puntos en base a 100.` : `Math basis: Penalty of ${f.impact} points out of 100.`}
                    </div>
                  </div>
                )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SemanticStitchingCard: React.FC = () => {
  const [activeNode, setActiveNode] = React.useState<number | null>(null);

  const relationships = [
    { source: "Email Público", target: "PeopleLookup", type: "Coincidencia de Alias", risk: "Alto", desc: "El correo jovan***@gmail.com vincula directamente tu identidad con registros residenciales expuestos en bases de datos comerciales." },
    { source: "Dirección IP", target: "Foro de Devs", type: "Geolocalización Cruzada", risk: "Medio", desc: "La IP utilizada expone tu rango de proveedor de red y ubicación de ciudad, vinculando tu cuenta de desarrollo con tu actividad personal." },
    { source: "Teléfono", target: "Brecha ShopMart", type: "Identidad Cruzada", risk: "Crítico", desc: "El número de teléfono expuesto en ShopMart coincide exactamente con tu alias registrado en el broker de datos corporativos." }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <style>{`
        @keyframes signalFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .signal-line-active {
          stroke-dasharray: 6, 6;
          animation: signalFlow 1.2s linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="sparkles" size={16} style={{ color: "var(--cyan)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Correlación Semántica IA (Stitching)</h2>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border border-cyan/25 bg-cyan/10 text-cyan uppercase">
          Análisis Cruzado
        </span>
      </div>

      <p className="text-[12.5px] text-t-1 leading-relaxed mb-4 relative z-10">
        El motor de IA analiza cómo atacantes pueden cruzar datos fragmentarios e inconexos para perfilarte. Haz clic en las conexiones detectadas para ver detalles:
      </p>

      {/* SVG Link lines between exposed metadata nodes */}
      <svg viewBox="0 0 400 155" className="w-full h-[155px] select-none mb-4 relative z-10 bg-bg-inset border border-line rounded-lg p-2 overflow-visible">
        <defs>
          <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Connection Paths */}
        {relationships.map((_, idx) => {
          const isActive = activeNode === idx;
          let d = "";
          if (idx === 0) d = "M 85,25 C 200,25 200,25 315,25";
          else if (idx === 1) d = "M 85,75 C 200,75 200,125 315,125";
          else d = "M 85,125 C 200,125 200,75 315,75";

          return (
            <g key={idx} className="cursor-pointer" onClick={() => setActiveNode(activeNode === idx ? null : idx)}>
              <path 
                d={d} 
                fill="none" 
                stroke="transparent" 
                strokeWidth={12} 
              />
              <path 
                d={d} 
                fill="none" 
                stroke={isActive ? "url(#activeGrad)" : "var(--line)"} 
                strokeWidth={isActive ? 3 : 1.5} 
                className={`transition-all duration-200 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              />
              {isActive && (
                <path 
                  d={d} 
                  fill="none" 
                  stroke="url(#activeGrad)" 
                  strokeWidth={3} 
                  className="signal-line-active"
                />
              )}
            </g>
          );
        })}

        {/* Left Nodes */}
        <g className="text-[10px] font-medium font-mono" fill="var(--t-1)">
          <circle cx="85" cy="25" r="4.5" fill={activeNode === 0 ? "#2dd4bf" : "var(--bg-3)"} stroke={activeNode === 0 ? "#06b6d4" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="75" y="28" textAnchor="end" fill={activeNode === 0 ? "#2dd4bf" : "var(--t-1)"}>Email Público</text>

          <circle cx="85" cy="75" r="4.5" fill={activeNode === 1 ? "#2dd4bf" : "var(--bg-3)"} stroke={activeNode === 1 ? "#06b6d4" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="75" y="78" textAnchor="end" fill={activeNode === 1 ? "#2dd4bf" : "var(--t-1)"}>Dirección IP</text>

          <circle cx="85" cy="125" r="4.5" fill={activeNode === 2 ? "#2dd4bf" : "var(--bg-3)"} stroke={activeNode === 2 ? "#06b6d4" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="75" y="128" textAnchor="end" fill={activeNode === 2 ? "#2dd4bf" : "var(--t-1)"}>Teléfono</text>
        </g>

        {/* Right Nodes */}
        <g className="text-[10px] font-medium font-mono" fill="var(--t-1)">
          <circle cx="315" cy="25" r="4.5" fill={activeNode === 0 ? "#06b6d4" : "var(--bg-3)"} stroke={activeNode === 0 ? "#2dd4bf" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="325" y="28" textAnchor="start" fill={activeNode === 0 ? "#06b6d4" : "var(--t-1)"}>PeopleLookup</text>

          <circle cx="315" cy="75" r="4.5" fill={activeNode === 2 ? "#06b6d4" : "var(--bg-3)"} stroke={activeNode === 2 ? "#2dd4bf" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="325" y="78" textAnchor="start" fill={activeNode === 2 ? "#06b6d4" : "var(--t-1)"}>Brecha ShopMart</text>

          <circle cx="315" cy="125" r="4.5" fill={activeNode === 1 ? "#06b6d4" : "var(--bg-3)"} stroke={activeNode === 1 ? "#2dd4bf" : "var(--line-2)"} strokeWidth={1.5} />
          <text x="325" y="128" textAnchor="start" fill={activeNode === 1 ? "#06b6d4" : "var(--t-1)"}>Foro de Devs</text>
        </g>
      </svg>

      <div className="flex flex-col gap-2.5 relative z-10">
        {relationships.map((rel, idx) => (
          <div 
            key={idx} 
            className={`border rounded-lg p-3 cursor-pointer transition-all duration-150 ${
              activeNode === idx ? 'border-cyan/50 bg-cyan/5' : 'border-line bg-bg-inset hover:border-line-2'
            }`}
            onClick={() => setActiveNode(activeNode === idx ? null : idx)}
          >
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2 font-mono text-[11.5px]">
                <span className="text-t-0 font-semibold">{rel.source}</span>
                <span className="text-t-2">➔</span>
                <span className="text-cyan font-semibold">{rel.target}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                rel.risk === 'Crítico' ? 'bg-crit-dim text-crit' : rel.risk === 'Alto' ? 'bg-high-dim text-high' : 'bg-med-dim text-med'
              }`}>
                {rel.risk}
              </span>
            </div>
            
            <div className="text-[11px] text-t-2 mt-1.5 font-sans">
              Método: <span className="text-t-1 font-semibold">{rel.type}</span>
            </div>

            {activeNode === idx && (
              <div className="mt-2.5 pt-2.5 border-t border-line/40 text-[12px] text-t-1 leading-relaxed animate-fadeIn">
                {rel.desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProgressCardProps {
  remediation: RemediationProgress;
  onNav: (view: string) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ remediation, onNav }) => {
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="kanban" size={16} style={{ color: "var(--t-1)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Progreso de remediación</h2>
      </div>
      <div className="flex items-center gap-4.5 relative z-10">
        <ScoreRing value={remediation.percent} size={104} stroke={9} />
        <div className="flex flex-col gap-2.5 flex-1">
          {[
            ["Resueltas", remediation.resolved, "ok"],
            ["En progreso", remediation.inProgress, "cyan"],
            ["Pendientes", remediation.total - remediation.resolved - remediation.inProgress, "t-2"]
          ].map(([k, v, c]) => (
            <div key={k as string} className="flex justify-between items-center text-[12.5px]">
              <span className="flex items-center gap-2 text-t-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--${c})` }} />
                {k}
              </span>
              <span className="font-mono font-semibold text-t-0">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        className="relative z-10 w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 mt-4 cursor-pointer transition-all duration-130 shadow-premium"
        onClick={() => onNav("tasks")}
      >
        Ver tablero de tareas
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  );
};

interface NextActionCardProps {
  copilot: {
    nextBest: { title: string; why: string; impact: string; effort: string };
  };
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
}

const NextActionCard: React.FC<NextActionCardProps> = ({ copilot, onNav, onToast }) => {
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/7 to-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.08), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
      
      <div className="flex justify-between items-center mb-3 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-teal">
          <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
          Recomendado por IA
        </span>
        <span className="flex items-center gap-1 text-[10.5px] text-t-2 font-semibold">
          <span className="flex gap-0.5">
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
            <i className="w-1 h-2 rounded-[2px] bg-teal" />
          </span>
          Alta confianza
        </span>
      </div>
      
      <h2 className="text-[17px] font-semibold text-t-0 mb-2.5 leading-tight relative z-10">{copilot.nextBest.title}</h2>
      
      {/* AI Reasoning sections */}
      <div className="flex flex-col gap-2 mb-3.5 relative z-10">
        <div>
          <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block">Por qué es importante</span>
          <p className="text-t-1 text-[12.5px] leading-relaxed m-0">{copilot.nextBest.why}</p>
        </div>
        <div>
          <span className="text-[10px] tracking-wide uppercase text-t-3 font-semibold block">Acción sugerida</span>
          <p className="text-t-1 text-[12.5px] leading-relaxed m-0">Cambia la contraseña en ConnectHub y DevForum de inmediato para aislar el compromiso.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] border border-teal-line bg-teal-dim text-teal">
          <Icon name="trending-up" size={13} style={{ marginRight: 3 }} />
          Puntaje proyectado: {copilot.nextBest.impact}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-0.5 rounded-[7px] bg-bg-3 border border-line text-t-1">
          <Icon name="clock" size={13} style={{ marginRight: 3 }} />
          Esfuerzo: {copilot.nextBest.effort}
        </span>
      </div>

      <div className="flex gap-2.5 relative z-10">
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
          onClick={() => {
            onNav("breaches");
            onToast("Se inició la rotación de contraseña");
          }}
        >
          <Icon name="key" size={15} />
          Resolver brecha
        </button>
        <button 
          className="flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
          onClick={() => onNav("copilot")}
        >
          Ver plan completo
        </button>
      </div>
      
      <div className="text-t-3 text-[10px] mt-3.5 flex items-center gap-1 border-t border-line/40 pt-2.5 relative z-10">
        <Icon name="shield-check" size={11} />
        <span>Requiere revisión humana · Datos y recomendaciones simuladas</span>
      </div>
    </div>
  );
};

interface HighRiskCardProps {
  highRiskData: HighRiskDataClass[];
}

const HighRiskCard: React.FC<HighRiskCardProps> = ({ highRiskData }) => {
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="alert" size={16} style={{ color: "var(--crit)" }} />
        <h2 className="text-[15px] font-semibold text-t-0">Datos expuestos de alto riesgo</h2>
      </div>
      <div className="flex flex-col gap-2.5 relative z-10">
        {highRiskData.map((d, i) => (
          <div key={i} className="flex justify-between items-center border border-line rounded-md p-3 bg-bg-inset">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13.5px] text-t-0">{d.label === "Password reuse" || d.label === "Contraseña reutilizada" ? "Contraseña reutilizada" : "Dirección de domicilio"}</span>
                <Badge level={d.level} />
              </div>
              <div className="text-t-2 text-[11.8px] mt-1">{d.note === "Same password reused on ConnectHub + DevForum" || d.note === "Misma clave en ConnectHub + DevForum" ? "Misma clave en ConnectHub + DevForum" : "Expuesta en ShopMart + 1 directorio público"}</div>
            </div>
            <span className="font-mono text-[20px] font-semibold text-t-1">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TopUrgentActionsProps {
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
}

const TopUrgentActions: React.FC<TopUrgentActionsProps> = ({ onNav, onToast }) => {
  const actions = [
    {
      id: "u1",
      title: "Rotar contraseña en ConnectHub",
      level: "Critical" as const,
      why: "La filtración de hash débil expone tu credencial a hackeos y phishing.",
      reduced: "+8 puntos",
      suggested: "Cambia la contraseña a una clave única y activa 2FA.",
      navTo: "breaches"
    },
    {
      id: "u2",
      title: "Cambiar clave reutilizada en DevForum",
      level: "Critical" as const,
      why: "Credencial expuesta en texto plano. Coincide con tu contraseña de ConnectHub.",
      reduced: "+4 puntos",
      suggested: "Rota a una contraseña segura única, distinta a tus correos primarios.",
      navTo: "breaches"
    },
    {
      id: "u3",
      title: "Enviar solicitud de exclusión a PeopleLookup",
      level: "High" as const,
      why: "Tu domicilio expuesto en ShopMart coincide con un directorio comercial público.",
      reduced: "+3 puntos",
      suggested: "Genera el formato ARCO/CCPA en la pestaña de Solicitudes de Borrado.",
      navTo: "brokers"
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3 relative z-10">
        <Icon name="sparkles" size={16} style={{ color: "var(--teal)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Las 3 acciones más urgentes</h2>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal uppercase">
          <Icon name="sparkles" size={10} style={{ marginRight: 3 }} />
          Recomendado por la IA
        </span>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {actions.map(act => (
          <div key={act.id} className="border border-line rounded-lg p-4 bg-bg-inset flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-[13.5px] text-t-0">{act.title}</span>
                <Badge level={act.level} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.1px] leading-relaxed">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-t-3 font-semibold block mb-0.5">Por qué importa</span>
                  <span className="text-t-1">{act.why}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-t-3 font-semibold block mb-0.5">Acción sugerida</span>
                  <span className="text-t-1">{act.suggested}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-end gap-3.5 w-full md:w-auto border-t md:border-t-0 border-line/40 pt-3 md:pt-0 justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal whitespace-nowrap">
                <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                Riesgo mitigado: {act.reduced}
              </span>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-1.5 bg-bg-3 hover:bg-bg-2 border border-line-2 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                onClick={() => {
                  onNav(act.navTo);
                  onToast(`Navegando a: ${act.title}`);
                }}
              >
                Resolver
                <Icon name="arrow-right" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-t-3 text-[10.5px] mt-4 flex items-center gap-1 border-t border-line/40 pt-3 font-semibold relative z-10">
        <Icon name="shield-check" size={12} />
        <span>Recomendaciones generadas por IA. Requieren revisión humana antes de ejecutar cualquier plan.</span>
      </div>
    </div>
  );
};

interface MiniBreachesProps {
  breaches: BreachFinding[];
  onNav: (view: string) => void;
}

const MiniBreaches: React.FC<MiniBreachesProps> = ({ breaches, onNav }) => {
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="breach" size={16} style={{ color: "var(--t-1)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Principales brechas</h2>
        <button 
          className="inline-flex items-center justify-center gap-1.5 text-t-2 hover:text-teal font-semibold text-[12px] bg-transparent border-0 cursor-pointer transition-all duration-130"
          onClick={() => onNav("breaches")}
        >
          Todas
          <Icon name="arrow-right" size={13} />
        </button>
      </div>
      <div className="flex flex-col relative z-10">
        {breaches.slice(0, 3).map(b => (
          <div 
            key={b.id} 
            className="flex items-center gap-3 py-3 border-b border-line last:border-b-0 cursor-pointer hover:bg-bg-inset/40 rounded px-1.5 transition-all duration-130"
            onClick={() => onNav("breaches")}
          >
            <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[15px] text-t-0 flex-shrink-0">
              {b.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13.5px] text-t-0 truncate">{b.service}</span>
                <Badge level={b.severity} />
              </div>
              <div className="text-t-2 text-[11.8px] truncate mt-0.5">
                {b.dataClasses.slice(0, 3).join(" · ")}
              </div>
            </div>
            <span className="text-t-2 font-mono text-[11.5px] flex-shrink-0 ml-2">{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RiskTileProps {
  icon: string;
  data: RiskTileData;
  onClick: () => void;
}

const RiskTile: React.FC<RiskTileProps> = ({ icon, data, onClick }) => {
  return (
    <button 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group border border-line rounded-lg p-5 bg-bg-2 hover:bg-bg-3/40 hover:border-line-2 shadow-premium text-left cursor-pointer transition-all duration-150 w-full block relative overflow-hidden glossy-sweep noise-grain"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.06), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.02] pointer-events-none" />

      <div className="flex justify-between items-center mb-3.5 relative z-10">
        <div className="flex items-center gap-2 text-t-1">
          <Icon name={icon} size={17} />
          <span className="text-[12.5px] font-semibold">{data.label}</span>
        </div>
        <Badge level={data.level} />
      </div>
      <div className="flex justify-between items-end relative z-10">
        <div>
          <div className="text-[22px] font-semibold tracking-tight text-t-0 leading-none">{data.value}</div>
          <div className="text-t-2 text-[12px] mt-1.5">{data.sub}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Delta value={data.trend} invert />
          
          {/* Micro-Chart Sparkline (Premium Touch) */}
          <svg className="w-10 h-5 text-teal opacity-75 mt-0.5" viewBox="0 0 50 20" fill="none">
            <path 
              d={data.trend < 0 ? "M0,5 Q12,18 25,8 T50,15" : "M0,15 Q12,5 25,12 T50,4"} 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

const MultiAgentConsole: React.FC<{ language?: 'es' | 'en' }> = ({ language = 'es' }) => {
  const [agentLogs, setAgentLogs] = React.useState<string[]>([]);
  const [activeAgent, setActiveAgent] = React.useState(0);

  const agents = [
    { name: "BreachAuditor", status: "monitoreando", color: "var(--crit)", desc: language === 'es' ? "Escáner continuo de repositorios de la dark web." : "Continuous dark web repository scanner." },
    { name: "SMTP-Ping", status: "enrutando", color: "var(--teal)", desc: language === 'es' ? "Auditor de alias de correos y túneles MX." : "Email alias and MX tunnel auditor." },
    { name: "RedactionAgent", status: "redactando", color: "var(--cyan)", desc: language === 'es' ? "Generador contextual de plantillas ARCO/CCPA." : "Contextual CCPA/ARCO draft generator." },
    { name: "FootprintScanner", status: "escaneando", color: "var(--high)", desc: language === 'es' ? "Rastreador de IP y correlación de foros." : "IP tracker and forum correlation scanner." }
  ];

  React.useEffect(() => {
    const actions = [
      "[BreachAuditor] Escaneo del hash débil completado en DB local -> 0 coincidencias nuevas.",
      "[SMTP-Ping] Verificando enrutamiento SMTP para alias activo... [TÚNEL OK]",
      "[RedactionAgent] Lógica de tono 'Estricto' optimizada para PeopleLookup.",
      "[FootprintScanner] Correlacionando logs de IP con base de datos de ShopMart...",
      "[BreachAuditor] Analizando filtraciones de contraseñas reutilizadas... [Alerta Activa]"
    ];

    const timer = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setAgentLogs(prev => [`[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] ${randomAction}`, ...prev.slice(0, 4)]);
      setActiveAgent(prev => (prev + 1) % agents.length);
    }, 4000);

    setAgentLogs([
      `[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] [Core] Inicializando telemetría multi-agente de LeakShield...`,
      `[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] [BreachAuditor] Módulo cargado. Escaneo de dark web activo.`,
      `[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] [SMTP-Ping] Servidor SMTP en vivo. Registros MX verificados.`
    ]);

    return () => clearInterval(timer);
  }, [language]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium glossy-sweep noise-grain transition-all duration-150"
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
      }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        <Icon name="settings" size={16} style={{ color: "var(--teal)" }} />
        <h2 className="text-[15px] font-semibold text-t-0 flex-1">Consola de Telemetría Multi-Agente</h2>
        <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-wider px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal uppercase">
          En Vivo
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4 relative z-10">
        {agents.map((agent, i) => (
          <div 
            key={agent.name} 
            className={`border rounded-lg p-2.5 flex flex-col gap-1 transition-all ${
              activeAgent === i ? 'border-teal/40 bg-teal-dim/5' : 'border-line bg-bg-inset'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11.5px] font-mono font-semibold text-t-0">{agent.name}</span>
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
            </div>
            <span className="text-[10px] text-t-2 capitalize leading-none">{agent.status}</span>
            <span className="text-[9.8px] text-t-3 leading-tight mt-1">{agent.desc}</span>
          </div>
        ))}
      </div>

      <div className="bg-bg-inset border border-line rounded-lg p-3 font-mono text-[10.5px] leading-relaxed text-teal/90 select-text min-h-[92px] overflow-hidden flex flex-col gap-1 relative z-10">
        {agentLogs.map((l, idx) => (
          <div key={idx} className="truncate whitespace-nowrap animate-fadeIn">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

interface DashboardProps {
  profile: Profile;
  score: PrivacyScore;
  remediation: RemediationProgress;
  breaches: BreachFinding[];
  highRiskData: HighRiskDataClass[];
  risk: { breach: RiskTileData; footprint: RiskTileData; oldAccounts: RiskTileData; broker: RiskTileData };
  copilot: { nextBest: { title: string; why: string; impact: string; effort: string } };
  dashboardLayout: 'executive' | 'grid' | 'focus';
  scoreStyle: 'scoreStyle' | any;
  onNav: (view: string) => void;
  onToast: (msg: string) => void;
  language?: 'es' | 'en';
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  score,
  remediation,
  breaches,
  highRiskData,
  risk,
  copilot,
  dashboardLayout,
  scoreStyle,
  onNav,
  onToast,
  language = 'es'
}) => {
  const riskTiles = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RiskTile icon="breach" data={risk.breach} onClick={() => onNav("breaches")} />
      <RiskTile icon="globe" data={risk.footprint} onClick={() => onNav("footprint")} />
      <RiskTile icon="clock" data={risk.oldAccounts} onClick={() => onNav("footprint")} />
      <RiskTile icon="building" data={risk.broker} onClick={() => onNav("brokers")} />
    </div>
  );

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      {/* Custom home header */}
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Centro de Control Ejecutivo</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Hola, {profile.name.split(" ")[0]}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
            <span className="demo-blip" />
            Datos simulados
          </span>
          <button 
            className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
            onClick={() => onToast("Re-escaneando huella... (demo)")}
          >
            <Icon name="refresh" size={14} />
            Re-escanear
          </button>
        </div>
      </div>

      {dashboardLayout === "executive" && (
        <div className="flex flex-col gap-4 stagger">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4">
            <ScoreCard score={score} variant={scoreStyle} big />
            <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
          </div>
          {riskTiles}
          
          {/* Top Urgent Actions Prominent Section */}
          <TopUrgentActions onNav={onNav} onToast={onToast} />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="flex flex-col gap-4">
              <FactorsCard score={score} language={language} />
              <SemanticStitchingCard />
              <MultiAgentConsole language={language} />
            </div>
            <div className="flex flex-col gap-4">
              <ProgressCard remediation={remediation} onNav={onNav} />
              <HighRiskCard highRiskData={highRiskData} />
            </div>
          </div>
          <MiniBreaches breaches={breaches} onNav={onNav} />
        </div>
      )}

      {dashboardLayout === "grid" && (
        <div className="flex flex-col gap-4 stagger">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:row-span-2">
              <ScoreCard score={score} variant={scoreStyle} big />
            </div>
            <RiskTile icon="breach" data={risk.breach} onClick={() => onNav("breaches")} />
            <RiskTile icon="globe" data={risk.footprint} onClick={() => onNav("footprint")} />
            <RiskTile icon="clock" data={risk.oldAccounts} onClick={() => onNav("footprint")} />
            <RiskTile icon="building" data={risk.broker} onClick={() => onNav("brokers")} />
          </div>
          <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
          
          <TopUrgentActions onNav={onNav} onToast={onToast} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressCard remediation={remediation} onNav={onNav} />
            <HighRiskCard highRiskData={highRiskData} />
            <MiniBreaches breaches={breaches} onNav={onNav} />
          </div>
          <FactorsCard score={score} language={language} />
        </div>
      )}

      {dashboardLayout === "focus" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,720px)_1fr] justify-center max-w-[1040px] mx-auto gap-4 stagger">
          <div className="flex flex-col gap-4">
            <ScoreCard score={score} variant={scoreStyle} big />
            <NextActionCard copilot={copilot} onNav={onNav} onToast={onToast} />
            <TopUrgentActions onNav={onNav} onToast={onToast} />
            <MiniBreaches breaches={breaches} onNav={onNav} />
          </div>
          <div className="flex flex-col gap-4">
            <ProgressCard remediation={remediation} onNav={onNav} />
            <HighRiskCard highRiskData={highRiskData} />
            <div className="border border-line rounded-lg p-5 bg-bg-2 shadow-premium">
              <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-3">Exposición en un vistazo</div>
              <div className="flex flex-col gap-3">
                {[
                  ["breach", risk.breach],
                  ["globe", risk.footprint],
                  ["clock", risk.oldAccounts],
                  ["building", risk.broker]
                ].map(([ic, d], i) => (
                  <div key={i} className="flex justify-between items-center text-[12.8px]">
                    <span className="flex items-center gap-2 text-t-1">
                      <Icon name={ic as string} size={15} />
                      {(d as RiskTileData).label}
                    </span>
                    <Badge level={(d as RiskTileData).level}>{(d as RiskTileData).value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
