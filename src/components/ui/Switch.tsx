import React from 'react';

interface SwitchProps {
  on: boolean;
  onClick: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ on, onClick }) => {
  return (
    <button 
      className={`w-[38px] h-[22px] rounded-full border relative transition-all duration-150 flex-shrink-0 cursor-pointer ${on ? 'bg-teal border-teal' : 'bg-bg-inset border-line-2'}`}
      onClick={onClick}
      role="checkbox"
      aria-checked={on}
    >
      <i 
        className={`absolute top-[2px] w-4 h-4 rounded-full transition-all duration-150 ${on ? 'left-[18px] bg-[#04110F]' : 'left-[2px] bg-white'}`}
      />
    </button>
  );
};
