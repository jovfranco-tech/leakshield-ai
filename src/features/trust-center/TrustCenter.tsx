import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Switch } from '../../components/ui/Switch';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

interface ToggleProps {
  label: string;
  defaultOn: boolean;
  onToast: (msg: string) => void;
}

const ToggleRow: React.FC<ToggleProps> = ({ label, defaultOn, onToast }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-line last:border-b-0">
      <span className="text-[13px] text-t-1 font-medium">{label}</span>
      <Switch 
        on={on} 
        onClick={() => { 
          setOn(!on); 
          onToast(`${label}: ${!on ? "habilitado" : "deshabilitado"}`); 
        }} 
      />
    </div>
  );
};

interface TrustCenterProps {
  onToast: (msg: string) => void;
  onResetTasks?: () => void;
}

export const TrustCenter: React.FC<TrustCenterProps> = ({ onToast, onResetTasks }) => {
  const principles = [
    { ic: "user", t: "Solo tus propias cuentas", d: "Escanea únicamente identificadores que poseas o estés autorizado a monitorear. Respaldamos las auditorías autorizadas de privacidad con telemetría estrictamente autenticada." },
    { ic: "lock", t: "Sin contraseñas guardadas", d: "Cero contraseñas almacenadas. Las validaciones de credenciales se realizan usando k-anonymity, transmitiendo solo los primeros 5 caracteres del hash SHA-1 a la API Have I Been Pwned. Tus credenciales reales nunca salen del cliente." },
    { ic: "scan", t: "Datos demo simulados", d: "Todos los listados de data brokers, filtraciones y huellas públicas que se muestran en el sistema son simulaciones y vectores de prueba ficticios creados con propósitos educativos." },
    { ic: "key", t: "Claves de API en el servidor", d: "Ninguna API Key del frontend queda expuesta. Integraciones como Vertex AI, HIBP o motores de búsqueda se enrutan mediante proxies serverless con límites de velocidad estrictos." },
    { ic: "sparkles", t: "IA con revisión humana", d: "El copiloto ayuda a clasificar riesgos y priorizar tareas, pero opera bajo un esquema asistido de revisión manual. Ninguna solicitud o exclusión legal es enviada sin tu consentimiento." },
    { ic: "shield", t: "Expectativas honestas", d: "Ofrecemos reducción de riesgos y herramientas de higiene digital. No garantizamos una remoción absoluta del 100% en todo internet, estableciendo expectativas reales y éticas." },
  ];

  return (
    <div className="max-w-[1180px] mx-auto fade-in">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Centro de Confianza · Límites de Seguridad</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Cómo te protege LeakShield</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Prototipo
        </span>
      </div>

      <div className="border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/6 to-bg-2 shadow-premium mb-4 flex gap-3.5 items-center flex-wrap sm:flex-nowrap relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
        <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
          <Icon name="shield-check" size={22} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-t-0 mb-1 leading-tight">Privacidad ante todo por diseño</h2>
          <p className="text-t-1 text-[13.5px] leading-[1.55] max-w-[720px]">
            LeakShield AI está construido para que la opción más segura sea la predeterminada. Estos límites son restricciones técnicas del producto, no solo políticas — definen lo que la aplicación puede y no puede hacer técnicamente.
          </p>
        </div>
      </div>

      {/* Principles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {principles.map((p, i) => (
          <div 
            key={i} 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
          >
            {/* Radial Hover Glow & Specular Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
            }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-[30px] h-[30px] rounded-lg bg-teal-dim border border-teal-line text-teal flex items-center justify-center flex-shrink-0 mb-3">
                <Icon name={p.ic} size={16} />
              </div>
              <div className="flex justify-between items-center mb-1.5 gap-2">
                <h3 className="text-[14px] font-semibold text-t-0 truncate">{p.t}</h3>
                <Icon name="check-circle" size={15} style={{ color: "var(--ok)", flexShrink: 0 }} />
              </div>
              <p className="text-t-2 text-[12.5px] leading-[1.55]">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle Controls */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="settings" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">Controles de datos</h2>
            </div>
            <div className="flex flex-col">
              <ToggleRow label="Monitorear mis identificadores" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Guardar hallazgos solo para esta sesión" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Permitir que el copiloto redacte (nunca auto-enviar)" defaultOn={true} onToast={onToast} />
              <ToggleRow label="Compartir estadísticas anónimas" defaultOn={false} onToast={onToast} />
            </div>
          </div>
        </div>

        {/* Data Wiping Actions */}
        <div 
          onMouseMove={handleMouseMove}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="file" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">Tus datos, tu decisión</h2>
            </div>
            <p className="text-t-2 text-[12.8px] leading-[1.55] mb-4.5">
              Exporta toda la información almacenada en el navegador o bórrala al instante. En esta demo ningún dato sale de tu dispositivo.
            </p>
            <div className="flex gap-2.5">
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                onClick={() => onToast("Exportación de datos simulada preparada")}
              >
                <Icon name="file" size={15} />
                Exportar mis datos
              </button>
              <button 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 bg-transparent hover:bg-bg-inset border border-transparent hover:border-line text-crit cursor-pointer transition-all duration-130"
                onClick={() => {
                  if (onResetTasks) {
                    onResetTasks();
                  }
                  onToast("Datos restablecidos de forma segura");
                }}
              >
                <Icon name="trash" size={15} />
                Eliminar todo
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-t-3 text-[11px] border-t border-line pt-3.5 relative z-10">
            <Icon name="shield-check" size={13} />
            <span>Diseñado para conectarse a un backend serverless proxy — sin secretos expuestos en el cliente.</span>
          </div>
        </div>
      </div>

      {/* Advanced Cybersecurity & Privacy Boundaries Panel */}
      <div 
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden border border-line rounded-lg p-6 bg-bg-2 shadow-premium mt-6"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.03), transparent 80%)`
        }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 border-b border-line pb-3 relative z-10">
          <Icon name="shield-check" size={18} style={{ color: "var(--teal)" }} />
          <h2 className="text-[16px] font-semibold text-t-0">Arquitectura de Privacidad y Mecánicas de Verificación</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12.8px] leading-relaxed text-t-1 relative z-10">
          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="key" size={15} style={{ color: "var(--cyan)" }} />
              Verificación de Credenciales mediante k-Anonymity
            </h3>
            <p className="m-0 text-t-2 leading-relaxed">
              Al verificar si una contraseña fue expuesta en filtraciones públicas, LeakShield evita estrictamente transmitir los valores en texto plano o el hash completo. En su lugar, aplicamos SHA-1, extraemos los primeros 5 caracteres hexadecimales del hash (ej. <code className="bg-bg-inset border border-line px-1 rounded font-mono text-[11.5px]">21BD1</code>), y enviamos únicamente este prefijo a la API Have I Been Pwned.
            </p>
            <p className="mt-2.5 m-0 text-t-2 leading-relaxed">
              La API nos devuelve una lista de todos los sufijos coincidentes y sus frecuencias de exposición. LeakShield realiza la comparación localmente en la memoria del navegador. Esto garantiza que ni Have I Been Pwned ni LeakShield conozcan el hash completo o tus credenciales reales.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
              Proxy Serverless y Aislamiento de Seguridad de IA
            </h3>
            <p className="m-0 text-t-2 leading-relaxed">
              Todas las recomendaciones de IA, búsquedas de filtraciones y bajas con data brokers están estructuradas para ejecutarse a través de funciones serverless seguras (ej. Firebase App Hosting, Vercel Serverless o Cloud Functions).
            </p>
            <ul className="m-0 mt-2.5 pl-4 flex flex-col gap-1 text-t-2 list-disc">
              <li><strong>Cero Secretos Expuestos:</strong> Las claves de API para Vertex AI, Google Search y Have I Been Pwned residen de forma segura en variables de entorno del servidor, nunca en el bundle del cliente.</li>
              <li><strong>Registros Libres de PII:</strong> Los registros de acceso del sistema no guardan información personal identificable y están protegidos contra abusos con rate-limiting estricto.</li>
              <li><strong>Revisión Humana (Human-in-the-loop):</strong> Cada borrador de carta formal redactado por la IA se presenta localmente para que el usuario lo revise, edite o confirme antes de ser encolado.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrustCenter;
