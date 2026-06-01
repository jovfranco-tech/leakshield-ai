import React from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { StatusPill } from '../../components/ui/StatusPill';
import { AIInsightCard } from '../../components/ui/AIInsightCard';
import { DataBroker, OldAccount } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

interface DataBrokersProps {
  brokers: DataBroker[];
  oldAccounts: OldAccount[];
  inlineAI: boolean;
  onToast: (msg: string) => void;
  onOpenDeletion: () => void;
}

export const DataBrokers: React.FC<DataBrokersProps> = ({
  brokers,
  oldAccounts,
  inlineAI,
  onToast,
  onOpenDeletion
}) => {
  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Rastreador de Data Brokers</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Exposición en data brokers</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Registros simulados
        </span>
      </div>

      {inlineAI && (
        <div className="mb-4">
          <AIInsightCard 
            tag="Localizador de Brokers IA" 
            lead 
            confidence="High"
            body="Los data brokers recopilan y comercializan tus registros públicos sin tu consentimiento explícito. Generé borradores de solicitudes de exclusión (ARCO/CCPA) para ambos: revísalos ahora." 
            action="Revisar borradores" 
            onAction={onOpenDeletion} 
          />
        </div>
      )}

      {/* Active Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brokers.map(db => {
          const isDataFind = db.name === 'DataFind';
          const why = isDataFind 
            ? "Recopila e intermedia registros comerciales como tu historial de domicilios y familiares directos, facilitando el perfilado de datos sin consentimiento."
            : "Harvests y empaqueta direcciones de correo, teléfonos y nombres de usuario para campañas de telemarketing y rastreo publicitario masivo.";
          const reduced = isDataFind
            ? "Riesgo mitigado: Exclusión de búsqueda de domicilio (+3 puntos)"
            : "Riesgo mitigado: Cierra perfilado de contacto digital (+3 puntos)";
          
          return (
            <div 
              key={db.id} 
              onMouseMove={handleMouseMove}
              className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
            >
              {/* Radial Hover Glow & Specular Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
              }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-lg bg-bg-3 border border-line-2 flex items-center justify-center text-t-0">
                      <Icon name="building" size={18} />
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold text-t-0 leading-tight">{db.name}</div>
                      <div className="text-t-2 text-[11.5px] mt-0.5">{db.since === "Listed since 2021" ? "Listado desde 2021" : "Listado desde 2022"}</div>
                    </div>
                  </div>
                  <StatusPill status={db.status.includes("progreso") || db.status.includes("progress") ? "In Progress" : "Sent"} />
                </div>

                <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1.5">Listado sobre ti</div>
                <div className="flex gap-1.5 mb-3.5 flex-wrap">
                  {db.exposes.map(e => (
                    <span key={e} className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                      {e === "Nombre" ? "Nombre completo" : e === "Historial de domicilios" ? "Domicilios anteriores" : e === "Familiares" ? "Familiares directos" : e === "Teléfono" ? "Número telefónico" : "Correo electrónico"}
                    </span>
                  ))}
                </div>

                <div className="border border-teal-line/35 bg-gradient-to-br from-teal/6 to-bg-2 rounded-lg p-3.5 relative overflow-hidden mb-3.5">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-teal" />
                  
                  <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-teal">
                      <Icon name="sparkles" size={12} style={{ marginRight: 3 }} />
                      Recomendado por la IA
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded border border-teal-line bg-teal-dim text-teal">
                      <Icon name="trending-up" size={11} style={{ marginRight: 3 }} />
                      {reduced}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] tracking-wide uppercase text-t-3 font-semibold block mb-0.5">Por qué importa</span>
                    <p className="text-t-1 text-[12.2px] leading-relaxed m-0 font-medium">{why}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-t-1 text-[12.5px] mb-3.5">
                  <Icon name="refresh" size={14} style={{ color: "var(--cyan)" }} />
                  <span>{db.status}</span>
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-t-3 text-[10.5px] mb-3 flex items-center gap-1 font-semibold">
                  <Icon name="shield-check" size={12} />
                  <span>Requiere revisión humana antes de enviar la solicitud de remoción</span>
                </div>
                <button 
                  className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={onOpenDeletion}
                >
                  <Icon name="file" size={14} />
                  Ver solicitud de exclusión
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Old Accounts Closet */}
      <div 
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium mt-4"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(450px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
        }} />
        
        <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3 relative z-10">
          <Icon name="clock" size={16} />
          <h2 className="text-[15px] font-semibold text-t-0">Cuentas inactivas que amplían tu exposición</h2>
        </div>
        
        <div className="flex flex-col relative z-10 animate-fadeIn">
          {oldAccounts.map(o => (
            <div key={o.id} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
              <div className="w-[38px] h-[38px] rounded-lg bg-bg-inset border border-line-2 flex items-center justify-center text-t-2 flex-shrink-0">
                <Icon name="clock" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-t-0 truncate leading-tight">{o.service}</div>
                <div className="text-t-2 text-[11.5px] truncate mt-1">
                  Inactividad: {o.lastSeen === "4 years ago" ? "hace 4 años" : o.lastSeen === "2 years ago" ? "hace 2 años" : "hace 3 años"} · {o.reason === "Compromised + inactive" || o.reason === "Comprometida + inactiva" ? "Comprometida + inactiva" : o.reason === "Contains date of birth" ? "Contiene fecha de nacimiento" : "Comercializa bases de datos"}
                </div>
              </div>
              <Badge level={o.risk} />
              <button 
                className="inline-flex items-center justify-center gap-1 text-t-2 hover:text-teal font-semibold text-[12.5px] bg-transparent border-0 px-2 py-1 cursor-pointer transition-all duration-130"
                onClick={() => onToast("Abriendo guía para cierre definitivo de cuenta (demo)")}
              >
                Cerrar cuenta
                <Icon name="arrow-right" size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DataBrokers;
