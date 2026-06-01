import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard, Confidence } from '../../components/ui/AIInsightCard';
import { generateDeletionRequest } from '../../lib/aiOrchestration';
import { CopilotData, LogEntry, Profile, PlanItem } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

interface CopilotWorkspaceProps {
  profile: Profile;
  copilotData: CopilotData;
  onToast: (msg: string) => void;
  onNav: (view: string) => void;
  currentScoreValue: number;
}

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({
  profile,
  copilotData,
  onToast,
  onNav,
  currentScoreValue
}) => {
  const projected = Math.min(100, currentScoreValue + 12);
  const [log, setLog] = useState<LogEntry[]>([
    { t: "Borrador de solicitud de supresión generado para InfoAggregate", tag: "Generación", time: "hace 2h" },
    { t: "Brechas re-priorizadas después de la detección de ConnectHub", tag: "Análisis", time: "hace 3h" },
  ]);

  const [target, setTarget] = useState<'DataFind' | 'InfoAggregate'>('DataFind');
  const [lawType, setLawType] = useState<'CCPA' | 'GDPR' | 'ARCO' | 'Generic'>('ARCO');
  const [sent, setSent] = useState(false);
  const [innerModal, setInnerModal] = useState(false);

  // Alias Sandbox State
  const [sandboxEmail, setSandboxEmail] = useState("alex.rivera");
  const [sandboxTag, setSandboxTag] = useState("compras");
  const [sandboxCategory, setSandboxCategory] = useState<'banking' | 'shopping' | 'newsletters'>('shopping');

  const letter = generateDeletionRequest(target, lawType, profile.name, profile.location);

  const pushLog = (t: string, tag: string) => {
    setLog(l => [{ t, tag, time: "ahora" }, ...l]);
  };

  // Dynamic Alias Generator Sandbox Logic
  const generateSandboxAlias = () => {
    const domain = "shield.leakshield.net";
    const cleanedEmail = sandboxEmail.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const cleanedTag = sandboxTag.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    
    if (sandboxCategory === 'shopping') {
      return `${cleanedEmail}+${cleanedTag || 'compras'}@example.com`;
    } else if (sandboxCategory === 'banking') {
      return `${cleanedEmail}.vault.${cleanedTag || 'finanzas'}@secure-bank.com`;
    } else {
      const hash = Math.floor(100 + Math.random() * 900).toString(16);
      return `shield.temp-${cleanedTag || 'boletin'}-${hash}@${domain}`;
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Copiloto de Remediación de IA</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Tu plan de remediación</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-teal-dim border border-teal-line text-teal">
          <span className="demo-blip" />
          Recomendaciones Inteligentes
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
        {/* Summary & Projection / Score Optimizer */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/6 to-bg-2 shadow-premium flex flex-col justify-between"
        >
          {/* Radial Hover Glow & Specular Glass Reflection */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.07), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-3">
              <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
              Análisis del Copiloto
            </span>
            <p className="text-[15.5px] leading-[1.55] text-t-0 mb-4.5 font-medium">
              Tienes 2 elementos críticos vinculados a una contraseña reutilizada. Cambiar esas credenciales cierra tu brecha más vulnerable y proyectará tu score en **+12 puntos**.
            </p>
          </div>

          <div className="border border-line rounded-lg p-4 bg-bg-inset relative z-10">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">Puntaje optimizado si resuelves el plan hoy</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[12.5px] text-ok">
                <Icon name="trending-up" size={14} />
                Optimizador IA: +12
              </span>
            </div>
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              <span className="font-mono text-[30px] font-semibold text-med">{currentScoreValue}</span>
              <div className="flex-1 h-1.5 rounded-full bg-bg-2 overflow-hidden min-w-[120px]">
                <div className="h-full rounded-full bg-gradient-to-r from-teal to-cyan" style={{ width: `${projected}%` }} />
              </div>
              <span className="font-mono text-[30px] font-semibold text-teal">{projected}</span>
            </div>
            
            {/* Score Maximization Math Recommendation Touch (Premium AI) */}
            <div className="text-[11.2px] text-teal mt-3 leading-relaxed font-semibold flex items-center gap-1">
              <Icon name="sparkles" size={12} />
              <span>Maximización IA: Combinación matemática óptima de 2 tareas críticas para lograr +12 puntos de score.</span>
            </div>
            <div className="text-[11px] text-t-2 mt-2 leading-relaxed">
              * Ganancia máxima proyectada calculada dinámicamente mediante el motor de riskScoring local.
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
        >
          {/* Radial Hover Glow & Specular Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
                <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
                Siguiente mejor acción
              </span>
              <Confidence level="High" />
            </div>
            <h2 className="text-[16px] font-semibold text-t-0 mb-1.5 leading-tight">Cambiar la contraseña en ConnectHub &amp; DevForum</h2>
            <p className="text-t-1 text-[13px] leading-[1.5] mb-3.5">
              Es tu vector de riesgo principal. Ambas plataformas exponen la misma credencial y ConnectHub tiene una filtración de hash muy débil.
            </p>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-teal-line bg-teal-dim text-teal">Reducción: +12 score</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={12} style={{ marginRight: 3 }} />
                Esfuerzo: ~5 min
              </span>
            </div>
          </div>
          <button 
            className="relative z-10 w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-[15px] py-2.5 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
            onClick={() => { 
              onNav("breaches"); 
              onToast("Abriendo remediación de brechas"); 
            }}
          >
            <Icon name="key" size={15} />
            Iniciar remediación ahora
          </button>
        </div>
      </div>

      {/* Plan Board columns */}
      <div 
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium mb-4"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.03), transparent 80%)`
        }} />
        
        <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2.5 pb-3.5 border-b border-line relative z-10">
          <div className="flex items-center gap-2">
            <Icon name="kanban" size={16} style={{ color: "var(--teal)" }} />
            <h2 className="text-[15px] font-semibold text-t-0">Secuenciación IA: Hoy · Esta Semana · Más Tarde</h2>
          </div>
          <span className="text-t-2 text-[12px]">Priorizado dinámicamente por la relación impacto ÷ esfuerzo</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {(['Today', 'This Week', 'Later'] as const).map((bucket) => {
            const spanishMap: Record<string, string> = { Today: "Hoy mismo", 'This Week': "Esta semana", Later: "Más tarde" };
            const items = copilotData.plan[bucket] || [];
            return (
              <div key={bucket} className="border border-line rounded-lg p-3 bg-bg-1 min-h-[120px]">
                <div className="flex items-center gap-2 mb-3 px-1.5">
                  <span className="text-[13px] font-semibold text-t-0 leading-tight">{spanishMap[bucket]}</span>
                  <span className="ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full bg-bg-3 text-t-1">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {items.map((it: PlanItem) => {
                    const mappedPriority = it.priority === 'Critical' ? 'Critical' : it.priority === 'High' ? 'High' : it.priority === 'Medium' ? 'Medium' : 'Low';
                    return (
                      <div key={it.id} className="border border-line rounded-md p-3 bg-bg-2 shadow-sm hover:border-teal-line/50 transition-all duration-120">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-1.5">
                          <Badge level={mappedPriority} />
                          <span className="font-mono text-[11px] ml-auto text-teal font-semibold">
                            Reducción: {it.impact}
                          </span>
                        </div>
                        <div className="text-[13px] text-t-0 leading-[1.4] mb-2.5 font-medium">{it.text}</div>
                        <button 
                          className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                          onClick={() => { 
                            pushLog(`Iniciado: ${it.text}`, "Acción"); 
                            onToast("Agregado al flujo de tareas activas"); 
                          }}
                        >
                          <Icon name="arrow-right" size={13} />
                          Comenzar acción
                        </button>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="text-t-2 text-[12px] text-center py-6">Todas las acciones resueltas</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI generators & Sandbox */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col gap-4"
        >
          {/* Radial Hover Glow & Specular Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="file" size={16} style={{ color: "var(--teal)" }} />
              <h2 className="text-[15px] font-semibold text-t-0">Generadores de IA Integrados</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                className="border border-line rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-center bg-bg-inset hover:border-teal-line w-full transition-all duration-130" 
                onClick={() => setInnerModal(true)}
              >
                <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                  <Icon name="file" size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-t-0 leading-tight">Redactor de Solicitud de Supresión (ARCO / CCPA)</div>
                  <div className="text-t-2 text-[11.5px] truncate mt-0.5">Generar carta formal de exclusión legal por broker</div>
                </div>
                <Icon name="chevron-right" size={16} style={{ color: "var(--t-2)" }} />
              </button>
            </div>
          </div>

          {/* Alias Strategy Sandbox Widget */}
          <div className="border border-line rounded-lg p-4 bg-bg-inset flex flex-col gap-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                <Icon name="mask" size={15} />
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-t-0 leading-tight">Sandbox de Alias de Correo</div>
                <div className="text-t-2 text-[11.5px] mt-0.5">Prueba enmascarar tu identidad de forma dinámica</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Correo Base</label>
                <input 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-mono text-[12px] outline-none focus:border-teal-line transition-all" 
                  value={sandboxEmail} 
                  onChange={e => setSandboxEmail(e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Tag / Etiqueta</label>
                <input 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-mono text-[12px] outline-none focus:border-teal-line transition-all" 
                  value={sandboxTag} 
                  onChange={e => setSandboxTag(e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">Categoría</label>
                <select 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-sans text-[12px] outline-none focus:border-teal-line transition-all h-[31px]"
                  value={sandboxCategory}
                  onChange={e => setSandboxCategory(e.target.value as any)}
                >
                  <option value="shopping">Comercio (Compras)</option>
                  <option value="banking">Finanzas (Alta confianza)</option>
                  <option value="newsletters">Boletines (Desechable)</option>
                </select>
              </div>
            </div>

            <div className="border border-teal-line/30 bg-teal-dim/10 rounded-lg p-3 flex flex-col gap-1 flex-1">
              <span className="text-[10px] tracking-wide uppercase text-teal font-semibold block">Alias Protegido Generado:</span>
              <span className="font-mono text-[13.5px] text-t-0 select-all font-semibold truncate bg-bg-2 px-2.5 py-1 rounded border border-line break-all block w-full leading-relaxed">
                {generateSandboxAlias()}
              </span>
            </div>
            
            <div className="text-[11.2px] text-t-2 leading-relaxed leading-none flex gap-1 items-start mt-0.5">
              <Icon name="sparkles" size={11} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1.5 }} />
              <span>La compartimentación previene que una filtración comprometa tu buzón real.</span>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
        >
          {/* Radial Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="clock" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">Actividad del Copiloto</h2>
            </div>
            
            <div className="flex flex-col">
              {log.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                    <Icon name="sparkles" size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.8px] text-t-0 truncate">{l.t}</div>
                    <div className="text-t-2 text-[11px] mt-0.5">{l.tag}</div>
                  </div>
                  <span className="text-t-2 font-mono text-[11px] flex-shrink-0 ml-2">{l.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-1.5 mt-4 text-t-3 text-[11px] border-t border-line/45 pt-3.5">
            <Icon name="shield-check" size={13} />
            <span>Toda recomendación fue generada para tu revisión humana. Nada se transmite sin consentimiento.</span>
          </div>
        </div>
      </div>

      {/* Embedded Deletion Letter Modal */}
      {innerModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/72 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
          onClick={() => setInnerModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[720px] max-h-[88vh] overflow-hidden bg-bg-1 border border-line-2 rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-[22px] py-[18px] border-b border-line sticky top-0 bg-bg-1 z-10 flex-shrink-0">
              <div>
                <div className="text-[17px] font-semibold tracking-tight text-t-0">Supresión de Datos por IA</div>
                <div className="text-t-2 text-[12.5px] mt-0.5">Borrador compilado por el copiloto — revisa antes de enviar</div>
              </div>
              <button 
                className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 hover:text-t-0 text-t-1 flex items-center justify-center cursor-pointer transition-all duration-130"
                onClick={() => setInnerModal(false)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            
            <div className="p-[22px] overflow-y-auto flex-1">
              <div className="mb-4 bg-high/10 border border-high/30 rounded-lg p-3.5 flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-high/20 text-high flex-shrink-0">
                  <Icon name="alert" size={15} style={{ color: 'var(--high)' }} />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-t-0 leading-tight">Borrador de IA · Requiere revisión humana</div>
                  <div className="text-t-2 text-[11.5px] mt-0.5">Verifica los campos del titular antes de enviar. Ningún dato real sale de tu navegador en esta demo.</div>
                </div>
              </div>
              <AIInsightCard 
                tag="Redacción de IA" 
                lead 
                confidence="High"
                body="Generé una plantilla de solicitud de borrado adaptada al broker utilizando el marco legal seleccionado." 
              />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Broker objetivo</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {["DataFind", "InfoAggregate"].map(t => (
                    <button 
                      key={t} 
                      className={`px-3 py-1 rounded-md text-[12px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        target === t 
                          ? "bg-bg-3 text-t-0 shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setTarget(t as 'DataFind' | 'InfoAggregate')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Marco regulatorio &amp; leyes</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit flex-wrap">
                  {(['CCPA', 'GDPR', 'ARCO', 'Generic'] as const).map(law => (
                    <button 
                      key={law} 
                      className={`px-3.5 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        lawType === law 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setLawType(law)}
                    >
                      {law === 'Generic' ? 'Soporte Genérico' : law}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12px] font-semibold text-t-1">Solicitud oficial redactada</label>
                <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-t-1 bg-bg-inset border border-line rounded-lg p-4">
                  {letter}
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
                    navigator.clipboard?.writeText(letter); 
                    onToast("Borrador copiado al portapapeles"); 
                  }}
                >
                  <Icon name="file" size={15} />
                  Copiar texto
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    setSent(true); 
                    onToast("Encolado para revisión del titular"); 
                    setTimeout(() => setInnerModal(false), 700); 
                  }}
                >
                  <Icon name={sent ? "check" : "send"} size={15} />
                  {sent ? "Encolado" : "Encolar para revisión"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CopilotWorkspace;
