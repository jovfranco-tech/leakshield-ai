import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Logo } from '../../components/layout/NavRail';

interface ConsentScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onBack, onContinue }) => {
  const [checks, setChecks] = useState({ own: false, sim: false, review: false });
  const all = checks.own && checks.sim && checks.review;

  const items = [
    { 
      k: "own" as const, 
      t: "Estas son mis propias cuentas o estoy autorizado para revisarlas", 
      d: "Usa únicamente tus propias cuentas o datos para los que tengas consentimiento. Investigar a terceros sin su consentimiento explícito está estrictamente prohibido." 
    },
    { 
      k: "sim" as const, 
      t: "Entiendo que esta demostración utiliza datos simulados", 
      d: "No se consultan ni almacenan contraseñas reales, correos electrónicos ni bases de datos personales reales en este centro de control de demostración." 
    },
    { 
      k: "review" as const, 
      t: "Revisaré las sugerencias de la IA antes de actuar", 
      d: "Los análisis y plantillas de la IA son recomendaciones para revisión humana, no decisiones automatizadas directas. Las sugerencias no constituyen asesoría legal o de seguridad definitiva." 
    },
  ];

  return (
    <div className="page min-h-screen bg-bg-0 flex items-center justify-center p-6 bg-gradient-to-br from-bg-0 via-bg-0 to-bg-1 bg-[radial-gradient(800px_450px_at_right_top,rgba(34,211,238,0.06),transparent_50%)]">
      <div className="fade-in w-full max-w-[560px] flex flex-col gap-6">
        <div className="flex items-center gap-3 justify-center">
          <Logo />
          <div className="font-semibold text-[18px] text-t-0">LeakShield AI</div>
        </div>
        
        <div className="border border-line rounded-lg p-7 bg-bg-2 shadow-premium relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />
          
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-2">Paso 1 de 2 · Consentimiento</div>
          <h1 className="text-[22px] font-semibold tracking-tight text-t-0 leading-tight mb-2">Antes de escanear, tus límites</h1>
          <p className="text-t-1 text-[13.5px] mb-5.5 leading-relaxed">Privacidad ante todo significa consentimiento primero. Confirma los siguientes puntos para continuar.</p>
          
          <div className="flex flex-col gap-2.5">
            {items.map(it => (
              <button 
                key={it.k} 
                onClick={() => setChecks(c => ({ ...c, [it.k]: !c[it.k] }))}
                className={`border rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-start transition-all duration-130 ${
                  checks[it.k] 
                    ? "bg-teal-dim border-teal-line" 
                    : "bg-bg-2 border-line hover:border-line-2"
                }`}
              >
                <span className={`w-5.5 h-5.5 rounded-[7px] flex-shrink-0 mt-0.5 flex items-center justify-center border transition-all duration-130 ${
                  checks[it.k] 
                    ? "border-teal bg-teal text-[#04110F]" 
                    : "border-line-3 bg-transparent text-transparent"
                }`}>
                  {checks[it.k] && <Icon name="check" size={14} />}
                </span>
                <div>
                  <span className="text-[13.5px] font-semibold text-t-0 block leading-tight">{it.t}</span>
                  <span className="text-t-2 text-[12px] leading-relaxed mt-1 block">{it.d}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 my-4.5 text-t-2 text-[11.5px] leading-relaxed">
            <Icon name="lock" size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
            <span>Nunca pedimos contraseñas reales. Las claves de API quedan en el servidor. La remoción no está garantizada legalmente.</span>
          </div>

          <div className="flex gap-2.5 mt-2">
            <button 
              className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-[9px] border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
              onClick={onBack}
            >
              Atrás
            </button>
            <button 
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[13px] px-[15px] py-[9px] bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130"
              style={{ opacity: all ? 1 : 0.5, pointerEvents: all ? "auto" : "none" }}
              onClick={onContinue}
            >
              Continuar a configuración de identidad
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentScreen;
