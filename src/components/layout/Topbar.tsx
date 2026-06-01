import React from 'react';
import { Icon } from '../ui/Icon';

interface TopbarProps {
  view: string;
  title: string;
  onToast: (msg: string) => void;
  copilotMode: 'rail' | 'inline';
  onNav: (view: string) => void;
  railEnabled: boolean;
  railOpen: boolean;
  drawerOpen: boolean;
  toggleRail: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  view,
  title,
  onToast,
  copilotMode,
  onNav,
  railEnabled,
  railOpen,
  drawerOpen,
  toggleRail
}) => {
  const isLandingOrOnboarding = ["landing", "consent", "intake"].includes(view);

  return (
    <header className="flex items-center gap-3.5 px-6.5 py-3.5 border-b border-line bg-[#080B0F]/70 backdrop-blur-xl sticky top-0 z-30 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">LeakShield AI</div>
        <h2 className="text-[16px] font-semibold tracking-tight text-t-0 leading-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar - hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 bg-bg-2 border border-line rounded-lg px-3 py-2 text-t-2 w-[280px] cursor-text">
          <Icon name="search" size={15} />
          <input 
            className="bg-transparent border-0 outline-none text-t-0 font-sans text-[13px] w-full placeholder-t-2"
            placeholder="Buscar brechas, hallazgos, tareas…" 
            onKeyDown={e => {
              if (e.key === "Enter") {
                onToast("Búsqueda local completada. Mostrando coincidencias indexadas.");
              }
            }} 
          />
        </div>

        {/* Inline Copilot CTA if Copilot is in inline mode */}
        {copilotMode === "inline" && !isLandingOrOnboarding && (
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-[12.5px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
            onClick={() => onNav("copilot")}
          >
            <Icon name="sparkles" size={14} style={{ color: "var(--teal)" }} />
            Copiloto
          </button>
        )}

        {/* Sparkles button to trigger right rail */}
        {railEnabled && (
          <button 
            className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 text-t-1 hover:text-t-0 flex items-center justify-center cursor-pointer transition-all duration-130"
            onClick={toggleRail} 
            title="Activar copiloto"
          >
            <Icon 
              name="sparkles" 
              size={16} 
              style={{ color: (railOpen || drawerOpen) ? "var(--teal)" : "var(--t-1)" }} 
            />
          </button>
        )}

        {/* Notification Bell */}
        {!isLandingOrOnboarding && (
          <button 
            className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 text-t-1 hover:text-t-0 flex items-center justify-center cursor-pointer transition-all duration-130 relative"
            onClick={() => onToast("3 nuevas alertas de seguridad prioritarias detectadas.")}
            title="Notificaciones"
          >
            <Icon name="bell" size={16} />
            <span className="absolute top-[8px] right-[9px] w-[7px] h-[7px] rounded-full bg-crit border-2 border-bg-2" />
          </button>
        )}
      </div>
    </header>
  );
};
