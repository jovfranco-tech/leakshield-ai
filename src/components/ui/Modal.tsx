import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  title: string;
  sub?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ title, sub, onClose, children, wide }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/72 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="fade-in cursor-default flex flex-col w-full max-h-[88vh] overflow-hidden bg-bg-1 border border-line-2 rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
        style={{ maxWidth: wide ? 720 : 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-[22px] py-[18px] border-b border-line sticky top-0 bg-bg-1 z-10 flex-shrink-0">
          <div>
            <div className="text-[17px] font-semibold tracking-tight text-t-0">{title}</div>
            {sub && <div className="text-t-2 text-[12.5px] mt-0.5">{sub}</div>}
          </div>
          <button 
            className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 hover:text-t-0 text-t-1 flex items-center justify-center cursor-pointer transition-all duration-130"
            onClick={onClose}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="p-[22px] overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
