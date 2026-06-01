import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { FootprintFinding } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

const FP_ICON: Record<string, string> = {
  "Perfil social": "user", 
  "Directorio": "map", 
  "Data broker": "building",
  "Cuenta antigua": "clock", 
  "Artículo": "file", 
  "Contacto expuesto": "mail", 
  "Riesgo reputacional": "flag",
};

interface FootprintScannerProps {
  findings: FootprintFinding[];
  inlineAI: boolean;
  onToast: (msg: string) => void;
  onOpenDeletion: () => void;
}

export const FootprintScanner: React.FC<FootprintScannerProps> = ({
  findings,
  inlineAI,
  onToast,
  onOpenDeletion
}) => {
  const [filter, setFilter] = useState<string>("Todos");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const translateType = (t: string) => {
    if (t === "Social profile") return "Perfil social";
    if (t === "Directory") return "Directorio";
    if (t === "Data broker") return "Data broker";
    if (t === "Old account") return "Cuenta antigua";
    if (t === "Article") return "Artículo";
    if (t === "Exposed contact info") return "Contacto expuesto";
    return t;
  };

  const types = ["Todos", ...Array.from(new Set(findings.map(f => translateType(f.type))))];
  const list = findings.filter(f => filter === "Todos" || translateType(f.type) === filter);
  
  const counts = {
    Total: findings.length,
    High: findings.filter(f => f.level === "High").length,
    Medium: findings.filter(f => f.level === "Medium").length,
    Low: findings.filter(f => f.level === "Low").length
  };

  const handleToggleDismiss = (id: string) => {
    setDone(prev => {
      const nextVal = !prev[id];
      onToast(nextVal ? "Hallazgo descartado temporalmente" : "Hallazgo reabierto para monitoreo");
      return { ...prev, [id]: nextVal };
    });
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Escáner de Huella Digital Pública</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Tu huella digital pública</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Hallazgos simulados
        </span>
      </div>

      {/* Grid of exposure summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4.5">
        {[
          ["Hallazgos totales", counts.Total, "globe", "t-1"],
          ["Alta visibilidad", counts.High, "eye", "crit"],
          ["Riesgo medio", counts.Medium, "alert", "med"],
          ["Riesgo bajo", counts.Low, "check-circle", "low"]
        ].map(([k, v, ic, c], i) => (
          <div 
            key={i} 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-4 bg-bg-2 shadow-premium"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
            }} />
            <div className="flex items-center gap-2 text-t-2 mb-2.5 relative z-10">
              <Icon name={ic as string} size={15} style={{ color: `var(--${c})` }} />
              <span className="text-[12px] font-semibold">{k}</span>
            </div>
            <div className="font-mono text-[26px] font-semibold text-t-0 leading-none relative z-10">{v}</div>
          </div>
        ))}
      </div>

      {inlineAI && (
        <div className="mb-4 animate-fadeIn">
          <AIInsightCard 
            tag="Analista de Huella Digital IA" 
            lead 
            confidence="High"
            body="El listado del directorio telefónico público en PeopleLookup asocia tu nombre completo con tu dirección física de domicilio. Recomiendo iniciar un trámite de exclusión legal inmediato." 
            action="Redactar exclusión de datos" 
            onAction={onOpenDeletion} 
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4.5 overflow-x-auto pb-1.5 animate-fadeIn">
        {types.map(tp => (
          <button 
            key={tp} 
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-120 whitespace-nowrap ${
              filter === tp 
                ? "bg-bg-3 border-line-2 text-t-0 shadow-premium" 
                : "bg-bg-2 border-line text-t-1 hover:text-t-0 hover:border-line-2"
            }`} 
            onClick={() => setFilter(tp)}
          >
            {tp}
          </button>
        ))}
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(f => (
          <div 
            key={f.id} 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between transition-all duration-150"
            style={{ opacity: done[f.id] ? 0.55 : 1 }}
          >
            {/* Radial Hover Glow & Specular Glass Reflection */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
            }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-[38px] h-[38px] rounded-lg bg-bg-inset border border-line-2 flex items-center justify-center text-teal flex-shrink-0">
                    <Icon name={FP_ICON[translateType(f.type)] || "globe"} size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-t-0 truncate leading-tight">{f.title}</div>
                    <div className="text-t-2 text-[11.5px] truncate mt-1">{f.source}</div>
                  </div>
                </div>
                <Badge level={f.level} />
              </div>

              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">{translateType(f.type)}</span>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                  <Icon name="eye" size={12} style={{ marginRight: 3 }} />
                  {f.visibility === "Public" ? "Público" : "Público"}
                </span>
                {f.riskReduced && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal">
                    <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                    {f.riskReduced === "Restricts passive profiling" ? "Restringe perfilado pasivo" : f.riskReduced.includes("home address") ? "Suprime dirección en web (+3 pts)" : f.riskReduced.includes("data broker") ? "Bloquea venta comercial (+3 pts)" : f.riskReduced.includes("historical footprint") ? "Disminuye huella histórica (+3 pts)" : f.riskReduced.includes("professional") ? "Huella profesional estándar" : "Cierra vector de phishing (+3 pts)"}
                  </span>
                )}
              </div>

              <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1.5">Datos expuestos</div>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {f.exposes.map(e => (
                  <span key={e} className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-2 py-0.2 rounded-md bg-bg-3 border border-line text-t-1">
                    {e === "Photo" ? "Foto" : e === "City" ? "Ciudad" : e === "Employer" ? "Empleador" : e === "Full name" ? "Nombre completo" : e === "Home address" ? "Domicilio particular" : e === "Age range" ? "Rango de edad" : e === "Name" ? "Nombre" : e === "Relatives" ? "Familiares" : e === "Past addresses" ? "Domicilios anteriores" : e === "Username" ? "Usuario" : e === "Old posts" ? "Mensajes antiguos" : e === "Email" ? "Correo" : e === "Job title" ? "Puesto laboral" : e}
                  </span>
                ))}
              </div>

              <div className="border border-teal-line/35 bg-gradient-to-br from-teal/6 to-bg-2 rounded-md p-3.5 relative overflow-hidden mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-teal" />
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-teal mb-1">
                  <Icon name="sparkles" size={12} style={{ marginRight: 3 }} />
                  Recomendado por la IA
                </span>
                <div className="flex flex-col gap-1.5">
                  <div>
                    <span className="text-[9px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Por qué importa</span>
                    <span className="text-[12.1px] text-t-1 leading-[1.45] font-medium">{f.ai}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-t-3 text-[10px] mb-3.5 flex items-center gap-1.2 font-semibold">
                <Icon name="shield-check" size={11} />
                <span>Análisis de IA · Requiere revisión humana antes de actuar</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 relative z-10">
              {f.type === "Data broker" || f.type === "Directory" ? (
                <button 
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
                  onClick={onOpenDeletion}
                >
                  <Icon name="file" size={14} />
                  Redactar remoción
                </button>
              ) : (
                <button 
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => onToast(f.action)}
                >
                  <Icon name="arrow-right" size={14} />
                  Tomar acción
                </button>
              )}
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                onClick={() => handleToggleDismiss(f.id)}
                title={done[f.id] ? "Reabrir hallazgo" : "Descartar hallazgo"}
              >
                <Icon name="check" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FootprintScanner;
