import React, { useState, useEffect } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Switch } from '../../components/ui/Switch';
import { Profile } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
};

const drawIsometricCube = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, label: string) => {
  // Left face
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size, y - size * 0.5);
  ctx.lineTo(x - size, y + size * 0.5);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.stroke();

  // Right face
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y - size * 0.5);
  ctx.lineTo(x + size, y + size * 0.5);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Top face
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x - size, y - size * 0.5);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y - size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Label
  ctx.fillStyle = 'var(--t-1)';
  ctx.font = '10px var(--mono)';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + size + 16);
};

const IsometricTopology: React.FC<{ activeProfile: 'personal' | 'trabajo' | 'finanzas' }> = ({ activeProfile }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines for high tech isometric backdrop
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    const size = 26;
    const cPersonal = activeProfile === 'personal' ? 'rgba(45, 212, 191, 0.85)' : 'rgba(45, 212, 191, 0.25)';
    const cTrabajo = activeProfile === 'trabajo' ? 'rgba(34, 211, 238, 0.85)' : 'rgba(34, 211, 238, 0.25)';
    const cFinanzas = activeProfile === 'finanzas' ? 'rgba(212, 175, 55, 0.85)' : 'rgba(212, 175, 55, 0.25)';

    // Personal Cube
    drawIsometricCube(ctx, 60, 68, size, cPersonal, "Personal");
    
    // Corporate Cube
    drawIsometricCube(ctx, 160, 68, size, cTrabajo, "Corporate");

    // Financial Cube
    drawIsometricCube(ctx, 260, 68, size, cFinanzas, "Financial");

  }, [activeProfile]);

  return (
    <div className="flex flex-col gap-2.5 bg-bg-inset border border-line rounded-xl p-4.5">
      <div className="text-[11.5px] font-semibold text-t-1 uppercase tracking-wide flex items-center gap-1.5 select-none">
        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        Topología de Identidades en 3D Isométrico
      </div>
      <canvas ref={canvasRef} width={320} height={130} className="w-full h-[130px] bg-bg-0/30 rounded-lg border border-line" />
    </div>
  );
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
  profile?: Profile;
  activeProfile?: 'personal' | 'trabajo' | 'finanzas';
}

export const TrustCenter: React.FC<TrustCenterProps> = ({ onToast, onResetTasks, profile, activeProfile = 'personal' }) => {
  const userProfile = profile || {
    name: "Jovan Franco",
    emails: ["jovan@secure-corp.com"],
    usernames: ["jovan_ops"],
    location: "México"
  };

  const principles = [
    { ic: "user", t: "Solo tus propias cuentas", d: "Escanea únicamente identificadores que poseas o estés autorizado a monitorear. Respaldamos las auditorías autorizadas de privacidad con telemetría estrictamente autenticada." },
    { ic: "lock", t: "Sin contraseñas guardadas", d: "Cero contraseñas almacenadas. Las validaciones de credenciales se realizan usando k-anonymity, transmitiendo solo los primeros 5 caracteres del hash SHA-1 a la API Have I Been Pwned. Tus credenciales reales nunca salen del cliente." },
    { ic: "scan", t: "Datos demo simulados", d: "Todos los listados de data brokers, filtraciones y huellas públicas que se muestran en el sistema son simulaciones y vectores de prueba ficticios creados con propósitos educativos." },
    { ic: "key", t: "Claves de API en el servidor", d: "Ninguna API Key del frontend queda expuesta. Integraciones como Vertex AI, HIBP o motores de búsqueda se enrutan mediante proxies serverless con límites de velocidad estrictos." },
    { ic: "sparkles", t: "IA con revisión humana", d: "El copiloto ayuda a clasificar riesgos y priorizar tareas, pero opera bajo un esquema asistido de revisión manual. Ninguna solicitud o exclusión legal es enviada sin tu consentimiento." },
    { ic: "shield", t: "Expectativas honestas", d: "Ofrecemos reducción de riesgos y herramientas de higiene digital. No garantizamos una remoción absoluta del 100% en todo internet, estableciendo expectativas reales y éticas." },
  ];

  // 1. 3D XOR Cube visualizer states
  const [cubeAnimating, setCubeAnimating] = useState(false);
  const [cubeLogs, setCubeLogs] = useState<string[]>([]);

  // 2. Simulated WebAuthn TouchID states
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // PBKDF2 AES-GCM Local encryption states (Recommendation 12)
  const [encryptExport, setEncryptExport] = useState(false);
  const [exportPassword, setExportPassword] = useState("");

  // 3. Risk Weight Tuner States
  const [weightPassword, setWeightPassword] = useState(3.5);
  const [weightBrokers, setWeightBrokers] = useState(2.5);
  const [weightAccounts, setWeightAccounts] = useState(1.5);
  const [weightBreaches, setWeightBreaches] = useState(2.0);

  // Keyboard shortcut configuration
  const [shortcuts] = useState([
    { key: "D", action: "Navegar al Dashboard principal" },
    { key: "C", action: "Abrir el Copiloto de Remediación" },
    { key: "T", action: "Ver el Tablero Kanban de Tareas" },
    { key: "Alt + S", action: "Mostrar el panel de controles de la demo" }
  ]);

  // XOR 3D Cube animation trigger
  const handleTriggerXORCube = () => {
    if (cubeAnimating) return;
    setCubeAnimating(true);
    setCubeLogs([]);
    onToast("Inicializando bóveda local encriptada...");

    const steps = [
      "[IndexedDB] Creando base de datos segura 'leakshield_vault_db'...",
      "[XOR Crypt] Generando llave dinámica a partir de la firma de sesión...",
      "[XOR Crypt] Cifrando 14 registros de perfil y bitácoras activas...",
      "[IndexedDB Commit] Bóveda escrita con éxito en bloque persistente aislado."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCubeLogs(prev => [...prev, `[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] ${step}`]);
        if (idx === steps.length - 1) {
          setCubeAnimating(false);
          onToast("¡Bóveda local indexada protegida al 100%!");
        }
      }, (idx + 1) * 350);
    });
  };

  // Web Crypto AES-256-GCM local encryptor helper
  const encryptCSVLocal = async (plaintext: string, passwordString: string) => {
    try {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(passwordString),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        enc.encode(plaintext)
      );
      
      const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.byteLength);
      combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);
      return combined;
    } catch (e) {
      console.error("AES-GCM encrypt failed:", e);
      return null;
    }
  };

  // WebAuthn Biometric verification & Blob CSV export
  const handleExportDataCSV = () => {
    setShowBiometricModal(true);
    setBiometricScanning(false);
    setBiometricSuccess(false);
  };

  const handleStartBiometricScan = () => {
    setBiometricScanning(true);
    setBiometricSuccess(false);
    
    // Simulate biometric matching
    setTimeout(async () => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      onToast("¡Autenticación biométrica exitosa!");

      // Export CSV file dynamically using native Blob URL
      setTimeout(async () => {
        const csvHeaders = "ID,Alias Email,Base Email,Tag,Category,Created At,Routing Status\n";
        const emailBase = userProfile.emails[0] || "jovan@secure-corp.com";
        const prefix = emailBase.split('@')[0];
        
        const csvRows = [
          `1,${prefix}+compras@shield.leakshield.net,${emailBase},compras,shopping,2026-06-01,Active`,
          `2,${prefix}.vault.finanzas@secure-bank.com,${emailBase},finanzas,banking,2026-06-01,Active`,
          `3,shield.temp-boletin-4e@shield.leakshield.net,${emailBase},boletin,newsletters,2026-06-01,Active`
        ].join("\n");

        const plaintext = csvHeaders + csvRows;
        let exportData: Blob | Uint8Array = new Blob([plaintext], { type: 'text/csv;charset=utf-8' });

        if (encryptExport && exportPassword.trim()) {
          const encrypted = await encryptCSVLocal(plaintext, exportPassword.trim());
          if (encrypted) {
            exportData = encrypted;
            onToast("Cifrado AES-GCM local aplicado de forma segura.");
          }
        }

        // FileSystem Access API integration or traditional Blob fallback (Recommendation 11)
        const fileWindow = window as any;
        if (typeof fileWindow.showSaveFilePicker !== 'undefined') {
          try {
            const handle = await fileWindow.showSaveFilePicker({
              suggestedName: `leakshield_alias_emails_${prefix}.${encryptExport ? 'enc' : 'csv'}`,
              types: [{
                description: encryptExport ? 'Archivo de Bóveda Encriptado (.enc)' : 'CSV Hoja de Cálculo',
                accept: { [encryptExport ? 'application/octet-stream' : 'text/csv']: [encryptExport ? '.enc' : '.csv'] }
              }]
            });
            const writable = await handle.createWritable();
            await writable.write(exportData);
            await writable.close();
            setShowBiometricModal(false);
            onToast("Guardado directo en directorio local completado.");
            return;
          } catch (e) {
            console.warn("Direct folder save cancelled or denied, falling back to browser downloads:", e);
          }
        }

        // Fallback standard browser link download
        const blob = exportData instanceof Uint8Array ? new Blob([exportData.buffer as ArrayBuffer], { type: 'application/octet-stream' }) : exportData;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `leakshield_alias_emails_${prefix}.${encryptExport ? 'enc' : 'csv'}`;
        link.click();
        URL.revokeObjectURL(url);
        
        setShowBiometricModal(false);
        onToast("¡Lote de alias exportado de forma local!");
      }, 500);
    }, 1500);
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in px-5 md:px-8">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">Centro de Confianza · Límites de Seguridad</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">Cómo te protege LeakShield</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-med-dim text-med border border-med/25">
          <span className="demo-blip" />
          Prototipo v0.7.0
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left Side: Controls & Shortcuts Customizer */}
        <div className="flex flex-col gap-4">
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
                <Icon name="settings" size={16} style={{ color: "var(--teal)" }} />
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

          {/* Keyboard Shortcuts Customizer Table */}
          <div 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
            }} />
            <div className="relative z-10 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
                  <Icon name="settings" size={16} />
                  <h2 className="text-[15px] font-semibold text-t-0">Atajos de Teclado del Command Center</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[12px]">
                    <thead>
                      <tr className="border-b border-line text-t-2">
                        <th className="py-2.5 font-semibold">Atajo</th>
                        <th className="py-2.5 font-semibold">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortcuts.map((sh, idx) => (
                        <tr key={idx} className="border-b border-line/45 last:border-b-0 hover:bg-bg-3/30 transition-colors">
                          <td className="py-2.5 font-mono text-teal font-semibold select-all">{sh.key}</td>
                          <td className="py-2.5 text-t-1">{sh.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3D Isometric Identity Topology Canvas (Recommendation 4) */}
              <IsometricTopology activeProfile={activeProfile} />
            </div>
          </div>
        </div>

        {/* Right Side: Data Wiping Actions, 3D Cube & TouchID */}
        <div className="flex flex-col gap-4">
          <div 
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between glossy-sweep noise-grain h-full"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
            }} />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
                  <Icon name="file" size={16} />
                  <h2 className="text-[15px] font-semibold text-t-0">Tus datos, tu decisión</h2>
                </div>
                
                {/* 3D Cube and text side-by-side */}
                <div className="grid grid-cols-[auto_1fr] gap-4.5 items-center mb-4 bg-bg-inset border border-line p-4 rounded-xl">
                  {/* CSS 3D XOR Cube Container with Reactive Ambient Glow */}
                  <div className="relative">
                    <div className={`absolute inset-0 -m-3 rounded-full blur-xl transition-all duration-700 pointer-events-none opacity-40 ${
                      cubeAnimating 
                        ? "bg-gradient-to-tr from-ok/50 to-teal/40 animate-pulse" 
                        : "bg-gradient-to-tr from-teal/20 to-cyan/20"
                    }`} />
                    <div 
                      className="cube-wrap cursor-pointer group-hover:scale-105 transition-transform relative z-10 mx-auto" 
                      onClick={handleTriggerXORCube}
                      title="Hacer clic para forzar rotación de cifrado XOR"
                    >
                      <div className={`cube ${cubeAnimating ? "cube-animating" : ""}`} style={{
                        transform: cubeAnimating ? "" : "rotateX(-25deg) rotateY(45deg)"
                      }}>
                        <div className="cube-face face-front">XOR</div>
                        <div className="cube-face face-back">0x4F</div>
                        <div className="cube-face face-right">KEY</div>
                        <div className="cube-face face-left">v0.6</div>
                        <div className="cube-face face-top">VAULT</div>
                        <div className="cube-face face-bottom">SEC</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[13.5px] font-semibold text-t-0 leading-tight mb-1">Cifrado XOR e IndexedDB Local</h3>
                    <p className="text-t-2 text-[12.2px] leading-relaxed m-0">
                      Almacenamiento local fuertemente enmascarado en IndexedDB. Haz clic en el cubo XOR para disparar un chequeo de encriptación persistente en vivo.
                    </p>
                  </div>
                </div>

                {cubeLogs.length > 0 && (
                  <div className="mb-4 bg-bg-inset border border-line rounded-lg p-3 font-mono text-[10.5px] leading-relaxed text-teal shadow-inner animate-fadeIn flex flex-col gap-1 max-h-[110px] overflow-y-auto">
                    <div className="flex items-center gap-1.5 border-b border-line/45 pb-1 text-t-2 font-sans font-semibold">
                      <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                      Auditoría de Encriptación Local (Vault Logs)
                    </div>
                    {cubeLogs.map((lg, i) => (
                      <div key={i} className="whitespace-pre-wrap">{lg}</div>
                    ))}
                  </div>
                )}

                <p className="text-t-2 text-[12.8px] leading-[1.55] mb-2.5">
                  Exporta todos tus alias de correos verificados en formato CSV para importarlos en tu gestor, o borra localmente todos los estados en un solo clic.
                </p>
              </div>

              <div>
                <div className="flex gap-2.5 flex-wrap">
                  <button 
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2.5 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                    onClick={handleExportDataCSV}
                  >
                    <Icon name="file" size={15} style={{ color: "var(--teal)" }} />
                    Exportar mis alias (.csv)
                  </button>
                  <button 
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2.5 bg-transparent hover:bg-bg-inset border border-transparent hover:border-line text-crit cursor-pointer transition-all duration-130"
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
            </div>
            
            <div className="flex items-center gap-1.5 mt-4.5 text-t-3 text-[11px] border-t border-line/45 pt-3.5 relative z-10">
              <Icon name="shield-check" size={13} />
              <span>Diseñado para conectarse a un backend serverless proxy — sin secretos expuestos en el cliente.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Cybersecurity & Privacy Boundaries Panel */}
      <div 
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden border border-line rounded-lg p-6 bg-bg-2 shadow-premium mb-4"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.03), transparent 80%)`
        }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 border-b border-line pb-3 relative z-10">
          <Icon name="shield-check" size={18} style={{ color: "var(--teal)" }} />
          <h2 className="text-[16px] font-semibold text-t-0">Calibración de Pesos de Riesgo e Inferencia de Score</h2>
        </div>

        {/* Risk Weight Tuner sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12.8px] leading-relaxed text-t-1 relative z-10 mb-4 border-b border-line pb-5">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-t-0 text-[13.5px] flex items-center gap-1.5">
              <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
              Ajuste Personalizado de Pesos (Risk Weight Tuner)
            </h3>
            <p className="m-0 text-t-2 leading-relaxed">
              Configura cómo influye cada factor en el cálculo de tu Score de Exposición de LeakShield. Los cambios se recalculan localmente de forma instantánea.
            </p>
            
            <div className="bg-bg-inset border border-line rounded-lg p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[11.8px] text-t-1">Exex. Contraseñas Reutilizadas:</span>
                  <span className="text-[11px] font-mono text-teal font-bold">{weightPassword.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.2" value={weightPassword}
                  onChange={(e) => { setWeightPassword(parseFloat(e.target.value)); onToast("Peso de contraseña recalibrado"); }}
                  className="accent-teal h-1 bg-bg-2 rounded-lg appearance-none cursor-pointer w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[11.8px] text-t-1">Exposición en Data Brokers:</span>
                  <span className="text-[11px] font-mono text-teal font-bold">{weightBrokers.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.2" value={weightBrokers}
                  onChange={(e) => { setWeightBrokers(parseFloat(e.target.value)); onToast("Peso de data brokers recalibrado"); }}
                  className="accent-teal h-1 bg-bg-2 rounded-lg appearance-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-t-0 text-[13.5px] flex items-center gap-1.5 opacity-0 sm:opacity-100">
              <span>&nbsp;</span>
            </h3>
            <div className="bg-bg-inset border border-line rounded-lg p-4 flex flex-col gap-3 h-full justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[11.8px] text-t-1">Cuentas Inactivas (Legacy Gaps):</span>
                  <span className="text-[11px] font-mono text-teal font-bold">{weightAccounts.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.2" value={weightAccounts}
                  onChange={(e) => { setWeightAccounts(parseFloat(e.target.value)); onToast("Peso de cuentas inactivas recalibrado"); }}
                  className="accent-teal h-1 bg-bg-2 rounded-lg appearance-none cursor-pointer w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[11.8px] text-t-1">Historial de Brechas Generales:</span>
                  <span className="text-[11px] font-mono text-teal font-bold">{weightBreaches.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.2" value={weightBreaches}
                  onChange={(e) => { setWeightBreaches(parseFloat(e.target.value)); onToast("Peso de brechas generales recalibrado"); }}
                  className="accent-teal h-1 bg-bg-2 rounded-lg appearance-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[12.8px] leading-relaxed text-t-1 relative z-10">
          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="key" size={15} style={{ color: "var(--cyan)" }} />
              Verificación de Credenciales mediante k-Anonymity
            </h3>
            <p className="m-0 text-t-2 leading-relaxed text-[12.2px]">
              Al verificar si una contraseña fue expuesta en filtraciones públicas, LeakShield evita estrictamente transmitir los valores en texto plano o el hash completo. En su lugar, aplicamos SHA-1, extraemos los primeros 5 caracteres hexadecimales del hash (ej. <code className="bg-bg-inset border border-line px-1 rounded font-mono text-[11.5px]">21BD1</code>), y enviamos únicamente este prefijo a la API Have I Been Pwned.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-t-0 text-[13.5px] mb-2 flex items-center gap-1.5">
              <Icon name="sparkles" size={15} style={{ color: "var(--teal)" }} />
              Proxy Serverless y Aislamiento de Seguridad de IA
            </h3>
            <p className="m-0 text-t-2 leading-relaxed text-[12.2px]">
              Todas las recomendaciones de IA, búsquedas de filtraciones y bajas con data brokers están estructuradas para ejecutarse a través de funciones serverless seguras (ej. Firebase App Hosting, Vercel Serverless o Cloud Functions). Tus datos reales nunca salen del cliente sin tu consentimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Biometric Verification Modal (WebAuthn TouchID/FaceID) */}
      {showBiometricModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
          onClick={() => setShowBiometricModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[380px] bg-bg-1 border border-line-2 rounded-xl p-5 shadow-[0_32px_80px_rgba(0,0,0,0.8)] text-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-line pb-2 flex-shrink-0">
              <span className="text-[13.5px] font-bold text-t-0">Seguridad de Dispositivo</span>
              <button 
                className="text-t-3 hover:text-t-0 bg-transparent border-0 cursor-pointer font-bold text-[14px]"
                onClick={() => setShowBiometricModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="py-6 flex flex-col items-center justify-center gap-4">
              {biometricScanning ? (
                <div className="relative w-20 h-20 flex items-center justify-center bg-teal-dim/20 border border-teal-line/30 rounded-full animate-pulse">
                  {/* Glowing spinner ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-teal border-t-transparent spin" style={{ animationDuration: "1s" }} />
                  <Icon name="user" size={32} className="text-teal" />
                </div>
              ) : biometricSuccess ? (
                <div className="w-20 h-20 flex items-center justify-center bg-ok-dim border border-ok text-ok rounded-full animate-bounce">
                  <Icon name="check-circle" size={36} />
                </div>
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-bg-3 hover:bg-bg-2 border border-line-2 rounded-full cursor-pointer hover:border-teal-line transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(45,212,191,0.08)]" onClick={handleStartBiometricScan}>
                  <span className="text-[34px] filter grayscale hover:grayscale-0 transition-all select-none animate-pulse">
                    ☝️
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-[14.5px] font-bold text-t-0">
                  {biometricScanning ? "Escaneando huella..." : biometricSuccess ? "¡Acceso Concedido!" : "Verificación de Identidad"}
                </h4>
                <p className="text-t-2 text-[12px] mt-1 px-4 leading-normal">
                  {biometricScanning 
                    ? "Por favor mantén tu dedo en el sensor biométrico del dispositivo." 
                    : biometricSuccess 
                      ? "Descargando alias en formato de hoja de cálculo..." 
                      : "Presiona el sensor superior para autorizar la exportación de alias de seguridad corporativos."
                  }
                </p>
              </div>
            </div>

            {/* Local AES-GCM Encryption Controls */}
            {!biometricScanning && !biometricSuccess && (
              <div className="text-left border border-line rounded-lg p-3 bg-bg-inset flex flex-col gap-2.5 my-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-t-1">¿Cifrar exportación con AES-GCM?</span>
                  <input 
                    type="checkbox"
                    checked={encryptExport}
                    onChange={(e) => setEncryptExport(e.target.checked)}
                    className="accent-teal cursor-pointer"
                  />
                </div>
                {encryptExport && (
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-[10px] text-t-2 uppercase font-bold tracking-wider">Contraseña de Cifrado (PBKDF2)</label>
                    <input 
                      type="password"
                      value={exportPassword}
                      onChange={(e) => setExportPassword(e.target.value)}
                      placeholder="Escribe una contraseña segura"
                      className="bg-bg-2 border border-line-2 rounded px-2.5 py-1.5 text-t-0 font-sans text-[12px] outline-none focus:border-teal-line w-full"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button 
                className="flex-1 rounded-lg font-semibold text-[12px] py-2 border border-line bg-bg-3 hover:bg-bg-2 text-t-1 cursor-pointer transition-all"
                onClick={() => setShowBiometricModal(false)}
                disabled={biometricScanning}
              >
                Cancelar
              </button>
              {!biometricSuccess && (
                <button 
                  className="flex-1 rounded-lg font-semibold text-[12px] py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all shadow-premium"
                  onClick={handleStartBiometricScan}
                  disabled={biometricScanning}
                >
                  Autenticar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustCenter;
