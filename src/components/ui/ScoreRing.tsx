import React, { useState, useEffect } from 'react';

export const CountUp: React.FC<{ value: number; dur?: number }> = ({ value, dur = 900 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number, start: number;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, dur]);
  return <>{n}</>;
};

interface ScoreRingProps {
  value: number;
  size?: number;
  stroke?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ value, size = 168, stroke = 12 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [dash, setDash] = useState(c);

  useEffect(() => {
    const id = setTimeout(() => setDash(c * (1 - value / 100)), 120);
    return () => clearTimeout(id);
  }, [value, c]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-a)" />
            <stop offset="100%" stopColor="var(--accent-b)" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-inset)" strokeWidth={stroke} />
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={r} 
          fill="none" 
          stroke="url(#scoreGrad)" 
          strokeWidth={stroke}
          strokeLinecap="round" 
          strokeDasharray={c} 
          strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)" }} 
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-mono font-semibold tracking-tighter leading-[0.9]" style={{ fontSize: size * .34 }}>
            <CountUp value={value} />
          </div>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-t-2 mt-0.5">/ 100</div>
        </div>
      </div>
    </div>
  );
};
