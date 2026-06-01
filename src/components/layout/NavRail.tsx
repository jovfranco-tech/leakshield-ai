import React from 'react';
import { Icon } from '../ui/Icon';
import { Profile } from '../../types/privacy';

export const Logo: React.FC<{ size?: number }> = ({ size = 34 }) => {
  return (
    <div 
      className="rounded-lg flex items-center justify-center bg-gradient-to-br from-teal to-cyan text-[#04110F] shadow-[0_6px_18px_-6px_rgba(45,212,191,0.6)]"
      style={{ width: size, height: size }}
    >
      <Icon name="shield-check" size={size * .56} />
    </div>
  );
};





import { getNavGroups } from '../../app/routes';

interface NavRailProps {
  view: string;
  onNav: (view: string) => void;
  profile: Profile;
  language?: 'es' | 'en';
}

export const NavRail: React.FC<NavRailProps> = ({ view, onNav, profile, language = 'es' }) => {
  const groups = getNavGroups(language);
  return (
    <nav className="nav-rail flex flex-col h-full overflow-hidden select-none">
      <div className="flex items-center gap-3 px-[18px] py-5">
        <Logo />
        <div>
          <div className="font-semibold text-[15px] tracking-tight text-t-0 leading-tight">LeakShield AI</div>
          <div className="font-medium text-[10.5px] text-t-2 tracking-widest uppercase mt-0.5">Centro de Control de Privacidad</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {groups.map(g => (
          <div key={g.group} className="mb-4">
            <div className="text-[10px] tracking-[0.16em] uppercase text-t-3 font-semibold px-3 py-2.5">
              {g.group}
            </div>
            <div className="flex flex-col gap-1">
              {g.items.map(it => {
                const active = view === it.id;
                return (
                  <button 
                    key={it.id} 
                    className={`flex items-center gap-[11px] px-3 py-[9px] rounded-lg text-[13.5px] font-medium border cursor-pointer transition-all duration-130 w-full text-left bg-transparent ${
                      active 
                        ? "text-t-0 bg-teal-dim border-teal-line" 
                        : "text-t-1 border-transparent hover:bg-bg-2 hover:text-t-0"
                    }`} 
                    onClick={() => onNav(it.id)}
                  >
                    <span className={`flex items-center justify-center ${active ? "text-teal" : "text-t-2"}`}>
                      <Icon name={it.icon} size={17} />
                    </span>
                    <span>{it.label}</span>
                    {it.badge && (
                      <span className={`ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full ${
                        it.crit 
                          ? "bg-crit-dim text-crit" 
                          : "bg-bg-3 text-t-1"
                      }`}>
                        {it.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line p-3 flex items-center gap-2.5 bg-bg-1 z-10 flex-shrink-0">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-bg-3 border border-line-2 flex items-center justify-center font-semibold text-[12.5px] text-teal">
          {profile.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[13px] text-t-0 truncate leading-tight">{profile.name}</div>
          <div className="text-t-2 text-[11px] truncate mt-0.5">{profile.location}</div>
        </div>
        <button 
          className="w-8 h-8 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 text-t-1 hover:text-t-0 flex items-center justify-center cursor-pointer transition-all duration-130" 
          onClick={() => onNav("logout")} 
          title="Cerrar sesión"
        >
          <Icon name="logout" size={15} />
        </button>
      </div>
    </nav>
  );
};
