import React from 'react';
import { Icon } from './Icon';

interface TutorialStep {
  title: string;
  desc: string;
  icon: string;
  targetView: string;
}

interface OnboardingTutorialOverlayProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  language?: 'es' | 'en';
}

export const OnboardingTutorialOverlay: React.FC<OnboardingTutorialOverlayProps> = ({
  currentStep,
  onNext,
  onPrev,
  onSkip,
  language = 'es'
}) => {
  const steps: TutorialStep[] = language === 'en' ? [
    {
      title: "Sovereign Privacy Command Center",
      desc: "Welcome! LeakShield AI is a fully localized cyber-defense tool. All your credentials, files, and queries are parsed, verified, and encrypted in your browser. No data ever leaves your device.",
      icon: "shield-check",
      targetView: "dashboard"
    },
    {
      title: "Live Privacy Score & Threat Vectors",
      desc: "The Privacy Score measures your exposure in real time. Dynamic factors deduct points for active leaks, reused passwords, and directories listing your physical home address.",
      icon: "dashboard",
      targetView: "dashboard"
    },
    {
      title: "Digital Identity Ingestion",
      desc: "Process and ingest CSV files containing your accounts at 60 FPS. An asynchronous local worker thread sanitizes columns and runs secure XOR mapping completely offline.",
      icon: "fingerprint",
      targetView: "identity"
    },
    {
      title: "Breach Intelligence Monitor",
      desc: "Here, we cross-reference active data dumps. If two compromised platforms share the same reused password, our local AI signals a critical hazard and prompts safe key rotations.",
      icon: "breach",
      targetView: "breaches"
    },
    {
      title: "Public Footprint & Data Brokers Deletion",
      desc: "Review your public exposure footprint. Our local AI will pre-compile official regulatory opt-out letters (CCPA, GDPR, ARCO Mexico) to force directories and brokers to purge your records.",
      icon: "globe",
      targetView: "footprint"
    },
    {
      title: "AES-GCM Bóveda & Cryptographic Auditing",
      desc: "Encrypt your session compartments with local AES-GCM. You can generate RSA-2048 keypairs to sign git backups with certified PGP signatures, and inspect logs in the WASM SQLite terminal.",
      icon: "shield-check",
      targetView: "trust"
    }
  ] : [
    {
      title: "Command Center de Privacidad Soberana",
      desc: "¡Bienvenido! LeakShield AI es una consola de ciberdefensa 100% local. Todos tus registros, archivos y consultas de IA son analizados, validados y cifrados dentro de tu propio navegador. Ningún dato toca servidores externos.",
      icon: "shield-check",
      targetView: "dashboard"
    },
    {
      title: "Score de Privacidad y Vectores de Exposición",
      desc: "El score calcula tu nivel de exposición en tiempo real. Los factores de riesgo restan puntos por contraseñas vulneradas, credenciales reutilizadas o datos comerciales de brokers.",
      icon: "dashboard",
      targetView: "dashboard"
    },
    {
      title: "Ingesta de Identidad Digital",
      desc: "Ingesta y procesa archivos CSV con tus cuentas en lote a 60 FPS. Hilos Web Workers locales sanitizan las columnas e inyectan credenciales cifradas con enmascaramiento XOR.",
      icon: "fingerprint",
      targetView: "identity"
    },
    {
      title: "Auditor de Brechas de Seguridad",
      desc: "Aquí vigilamos filtraciones masivas de contraseñas. Si ConnectHub y DevForum comparten la misma contraseña comprometida, nuestro copiloto te alerta para realizar una rotación inmediata.",
      icon: "breach",
      targetView: "breaches"
    },
    {
      title: "Huella Digital Pública y Remoción en Brokers",
      desc: "Inspecciona tu exposición en directorios web. La IA redactará solicitudes legales de supresión de datos (ARCO en México, CCPA/GDPR internacional) para obligar a brokers a depurar tus datos.",
      icon: "globe",
      targetView: "footprint"
    },
    {
      title: "Criptografía AES-GCM y Firmas PGP Locales",
      desc: "Cifra tus compartimentos con AES-GCM mediante TouchID. Genera pares de llaves RSA-2048 para firmar backups con bitácoras PGP criptográficas y audita la base de datos local en SQLite WASM.",
      icon: "shield-check",
      targetView: "trust"
    }
  ];

  const current = steps[currentStep] || steps[0];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[4px] flex items-center justify-center p-6 select-none animate-fadeIn no-print">
      <div className="w-full max-w-[500px] bg-bg-1/95 border border-line-2 rounded-2xl p-7.5 shadow-[0_32px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden stagger-fade-in">
        
        {/* Glow behind the overlay */}
        <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] bg-teal/10 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={onSkip}
          className="absolute top-4 right-4 text-t-3 hover:text-t-1 bg-transparent border-0 cursor-pointer text-[14px] font-bold z-10"
          title={language === 'en' ? "Skip tutorial" : "Omitir tutorial"}
        >
          ✕
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Pulsing Icon Container */}
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-teal/15 to-cyan/5 border border-teal-line/35 text-teal flex items-center justify-center shadow-[0_4px_16px_rgba(45,212,191,0.15)] mb-4 animate-bounce">
            <Icon name={current.icon} size={25} />
          </div>

          <h2 className="text-[18px] md:text-[20px] font-semibold text-t-0 tracking-tight leading-tight mb-2.5">
            {current.title}
          </h2>

          <p className="text-t-1 text-[13.2px] leading-relaxed m-0 min-h-[76px] max-w-[420px]">
            {current.desc}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-7.5 pt-4.5 border-t border-line relative z-10">
          
          {/* Step dots */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <span 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStep ? 'w-5 bg-teal' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {currentStep > 0 ? (
              <button
                onClick={onPrev}
                className="px-3.5 py-1.8 rounded-lg border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 text-[12px] font-semibold cursor-pointer transition-all duration-120 shadow-premium"
              >
                {language === 'en' ? "Back" : "Atrás"}
              </button>
            ) : (
              <button
                onClick={onSkip}
                className="px-3.5 py-1.8 rounded-lg border border-line bg-transparent hover:bg-bg-3 text-t-3 hover:text-t-2 text-[12px] font-semibold cursor-pointer transition-all duration-120"
              >
                {language === 'en' ? "Skip" : "Omitir"}
              </button>
            )}

            <button
              onClick={onNext}
              className="px-4.5 py-1.8 rounded-lg bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] text-[12px] font-semibold cursor-pointer transition-all duration-100 shadow-premium border-0"
            >
              {currentStep === steps.length - 1 
                ? (language === 'en' ? "Get Started" : "Entendido") 
                : (language === 'en' ? "Next" : "Siguiente")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingTutorialOverlay;
