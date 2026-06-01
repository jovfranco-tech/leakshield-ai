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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <style>{`
        @keyframes score-ring-orbit-elliptic-cw {
          0% { transform: rotate(0deg) scaleX(1.12) scaleY(0.92); }
          100% { transform: rotate(360deg) scaleX(1.12) scaleY(0.92); }
        }
        @keyframes score-ring-orbit-elliptic-ccw {
          0% { transform: rotate(360deg) scaleX(0.92) scaleY(1.12); }
          100% { transform: rotate(0deg) scaleX(0.92) scaleY(1.12); }
        }
        @keyframes score-ring-orbit-wobbly {
          0% { transform: rotate(120deg) scale(0.96) rotate(0deg); }
          100% { transform: rotate(480deg) scale(0.96) rotate(-360deg); }
        }
        @keyframes particle-pulse-trail {
          0%, 100% { transform: scale(0.65); opacity: 0.25; filter: blur(0.6px); }
          50% { transform: scale(1.35); opacity: 0.95; filter: blur(0px); }
        }
      `}</style>

      {/* Orbit Container 1 (Teal Particle - Elliptic) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: "score-ring-orbit-elliptic-cw 14s linear infinite",
        }}
      >
        <div 
          className="absolute rounded-full bg-teal shadow-[0_0_10px_var(--teal),0_0_20px_var(--teal)]"
          style={{
            width: stroke * 0.52,
            height: stroke * 0.52,
            left: `calc(50% - ${stroke * 0.26}px)`,
            top: `calc(50% - ${r}px - ${stroke * 0.26}px)`,
            animation: "particle-pulse-trail 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Orbit Container 2 (Cyan Particle - Elliptic CCW) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: "score-ring-orbit-elliptic-ccw 18s linear infinite",
        }}
      >
        <div 
          className="absolute rounded-full bg-cyan shadow-[0_0_8px_var(--cyan),0_0_16px_var(--cyan)]"
          style={{
            width: stroke * 0.42,
            height: stroke * 0.42,
            left: `calc(50% - ${stroke * 0.21}px)`,
            top: `calc(50% + ${r}px - ${stroke * 0.21}px)`,
            animation: "particle-pulse-trail 2.6s ease-in-out infinite",
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Orbit Container 3 (Secondary Amber/Glow Particle - Wobbly) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: "score-ring-orbit-wobbly 24s linear infinite",
        }}
      >
        <div 
          className="absolute rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]"
          style={{
            width: stroke * 0.3,
            height: stroke * 0.3,
            left: `calc(50% - ${r}px - ${stroke * 0.15}px)`,
            top: `calc(50% - ${stroke * 0.15}px)`,
            animation: "particle-pulse-trail 2s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
      </div>

      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} className="relative z-10">
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
      <div className="absolute inset-0 grid place-items-center text-center z-20">
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
export default ScoreRing;
