import React, { useState, useEffect } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { AIInsightCard, Confidence } from '../../components/ui/AIInsightCard';
import { generateDeletionRequest } from '../../lib/aiOrchestration';
import { CopilotData, LogEntry, Profile, PlanItem } from '../../types/privacy';

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

  // Perspective 3D Tilt
  const w = rect.width;
  const h = rect.height;
  const mouseX = x - w / 2;
  const mouseY = y - h / 2;
  const rX = (mouseY / (h / 2)) * -4; // Subtle 4deg max tilt on High DPI
  const rY = (mouseX / (w / 2)) * 4;
  e.currentTarget.style.setProperty('--tilt-rx', `${rX}deg`);
  e.currentTarget.style.setProperty('--tilt-ry', `${rY}deg`);
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  e.currentTarget.style.setProperty('--tilt-rx', '0deg');
  e.currentTarget.style.setProperty('--tilt-ry', '0deg');
};

// Bilingual dictionary
const texts = {
  es: {
    title: "Tu plan de remediación",
    subtitle: "Copiloto de Remediación de IA",
    recommendations: "Recomendaciones Inteligentes",
    analysis: "Análisis del Copiloto",
    currentScore: "Puntaje optimizado si resuelves el plan hoy",
    scoreMaximizer: "Optimizador IA: +12",
    scoreInfo: "Ganancia máxima proyectada calculada dinámicamente mediante el motor de riskScoring local.",
    nextAction: "Siguiente mejor acción",
    actionTitle: "Cambiar la contraseña en ConnectHub & DevForum",
    actionDesc: "Es tu vector de riesgo principal. Ambas plataformas exponen la misma credencial y ConnectHub tiene una filtración de hash muy débil.",
    actionReduction: "Reducción: +12 score",
    actionEffort: "Esfuerzo: ~5 min",
    actionButton: "Iniciar remediación ahora",
    sequencing: "Secuenciación IA: Hoy · Esta Semana · Más Tarde",
    sequencingTip: "Priorizado dinámicamente por la relación impacto ÷ esfuerzo",
    today: "Hoy mismo",
    week: "Esta semana",
    later: "Más tarde",
    allDone: "Todas las acciones resueltas",
    beginAction: "Comenzar acción",
    aiGenerators: "Generadores de IA Integrados",
    remediationSub: "Redactor de Solicitud de Supresión (ARCO / CCPA)",
    remediationDesc: "Generar carta formal de exclusión legal por broker",
    emailSandbox: "Sandbox de Alias de Correo",
    emailSandboxSub: "Prueba enmascarar tu identidad de forma dinámica",
    baseEmail: "Correo Base",
    tagLabel: "Tag / Etiqueta",
    categoryLabel: "Categoría",
    catShopping: "Comercio (Compras)",
    catBanking: "Finanzas (Alta confianza)",
    catNewsletters: "Boletines (Desechable)",
    aliasGenerated: "Alias Protegido Generado:",
    verifyAlias: "Verificar Alias en Vivo",
    verifying: "Verificando ruta...",
    activeAlias: "Alias Activo en Vivo",
    activeRouting: "Enrutamiento Seguro Activo",
    terminalTitle: "Terminal de Verificación SMTP/MX",
    aliasTip: "La compartimentación previene que una filtración comprometa tu buzón real.",
    activityTitle: "Actividad del Copiloto",
    activityTip: "Toda recomendación fue generada para tu revisión humana. Nada se transmite sin consentimiento.",
    // Modal
    modalTitle: "Supresión de Datos por IA",
    modalSub: "Borrador compilado por el copiloto — revisa antes de enviar",
    modalAlert: "Borrador de IA · Requiere revisión humana",
    modalAlertDesc: "Verifica los campos del titular antes de enviar. Ningún dato real sale de tu navegador en esta demo.",
    modalBroker: "Broker objetivo",
    modalReg: "Marco regulatorio & leyes",
    modalTone: "Tono de Redacción IA",
    modalInstructions: "Instrucciones de Personalización IA (Sandbox Prompts)",
    modalStatsSpeed: "Velocidad:",
    modalStatsConfidence: "Confianza IA:",
    modalStatsInference: "Inferencia:",
    modalStatsFidelity: "Fidelidad:",
    modalLetter: "Solicitud oficial redactada",
    modalTip: "Esta demo no realiza envíos directos. En producción real, la cola de tareas derivará las solicitudes al backend.",
    modalBtnCopy: "Copiar texto",
    modalBtnDownloadMd: "Descargar MD",
    modalBtnDownloadHtml: "HTML / Imprimir",
    modalBtnDownloadTxt: "Descargar TXT Legal",
    modalBtnEnqueue: "Encolar para revisión",
    modalBtnEnqueued: "Encolado",
    // Sliders
    tempLabel: "Temperatura del Modelo",
    topPLabel: "Top-P (Núcleo de muestreo)",
    // Classifier
    classifierTitle: "Clasificador de Respuestas de Broker (Drag & Drop)",
    classifierSub: "Suelta capturas o correos reales de brokers y la IA los clasificará automáticamente",
    classifierDropZone: "Suelta la respuesta del broker aquí o haz clic para cargar una simulación",
    classifierConfTitle: "Desglose de Confianza de IA",
    classifierFragments: "Fragmentos Clave Detectados",
    classifierRebuttal: "Réplica Legal Producida por la IA",
  },
  en: {
    title: "Your Remediation Plan",
    subtitle: "AI Remediation Copilot",
    recommendations: "Smart Recommendations",
    analysis: "Copilot Analysis",
    currentScore: "Optimized score if you resolve the plan today",
    scoreMaximizer: "AI Optimizer: +12",
    scoreInfo: "Maximum projected gain dynamically calculated by the local riskScoring engine.",
    nextAction: "Next Best Action",
    actionTitle: "Change password on ConnectHub & DevForum",
    actionDesc: "This is your main risk vector. Both platforms expose the same credential and ConnectHub has a very weak hash leak.",
    actionReduction: "Reduction: +12 score",
    actionEffort: "Effort: ~5 mins",
    actionButton: "Start remediation now",
    sequencing: "AI Sequencing: Today · This Week · Later",
    sequencingTip: "Dynamically prioritized by impact ÷ effort ratio",
    today: "Today",
    week: "This week",
    later: "Later",
    allDone: "All actions resolved",
    beginAction: "Begin action",
    aiGenerators: "Integrated AI Generators",
    remediationSub: "Deletion Request Writer (ARCO / CCPA)",
    remediationDesc: "Generate formal legal exclusion letter per broker",
    emailSandbox: "Email Alias Sandbox",
    emailSandboxSub: "Test masking your identity dynamically",
    baseEmail: "Base Email",
    tagLabel: "Tag / Label",
    categoryLabel: "Category",
    catShopping: "Commerce (Shopping)",
    catBanking: "Finance (High Trust)",
    catNewsletters: "Newsletters (Disposable)",
    aliasGenerated: "Generated Protected Alias:",
    verifyAlias: "Verify Alias Live",
    verifying: "Verifying route...",
    activeAlias: "Live Active Alias",
    activeRouting: "Secure Routing Active",
    terminalTitle: "SMTP/MX Verification Terminal",
    aliasTip: "Compartmentalization prevents a leak from compromising your real inbox.",
    activityTitle: "Copilot Activity",
    activityTip: "All recommendations were generated for human review. Nothing is transmitted without consent.",
    // Modal
    modalTitle: "AI Data Suppression",
    modalSub: "Draft compiled by the copilot — review before sending",
    modalAlert: "AI Draft · Requires human review",
    modalAlertDesc: "Verify the owner's fields before sending. No real data leaves your browser in this demo.",
    modalBroker: "Target Broker",
    modalReg: "Regulatory framework & laws",
    modalTone: "AI Writing Tone",
    modalInstructions: "AI Customization Instructions (Prompt Sandbox)",
    modalStatsSpeed: "Speed:",
    modalStatsConfidence: "AI Confidence:",
    modalStatsInference: "Inference:",
    modalStatsFidelity: "Fidelity:",
    modalLetter: "Drafted official request",
    modalTip: "This demo does not perform direct mailings. In real production, the task queue will forward requests to the backend.",
    modalBtnCopy: "Copy text",
    modalBtnDownloadMd: "Download MD",
    modalBtnDownloadHtml: "HTML / Print",
    modalBtnDownloadTxt: "Download Legal TXT",
    modalBtnEnqueue: "Enqueue for review",
    modalBtnEnqueued: "Enqueued",
    // Sliders
    tempLabel: "Model Temperature",
    topPLabel: "Top-P (Nucleus Sampling)",
    // Classifier
    classifierTitle: "Broker Response Classifier (Drag & Drop)",
    classifierSub: "Drop captures or real emails from brokers and the AI will automatically classify them",
    classifierDropZone: "Drop broker response here or click to load a simulation",
    classifierConfTitle: "AI Confidence Breakdown",
    classifierFragments: "Detected Key Snippets",
    classifierRebuttal: "AI-Generated Legal Rebuttal",
  }
};

interface CopilotWorkspaceProps {
  profile: Profile;
  copilotData: CopilotData;
  onToast: (msg: string) => void;
  onNav: (view: string) => void;
  currentScoreValue: number;
  language?: 'es' | 'en';
}

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({
  profile,
  copilotData,
  onToast,
  onNav,
  currentScoreValue,
  language = 'es'
}) => {
  const t = texts[language] || texts.es;

  const projected = Math.min(100, currentScoreValue + 12);
  const [log, setLog] = useState<LogEntry[]>([
    { t: language === 'en' ? "Draft deletion request compiled for InfoAggregate" : "Borrador de solicitud de supresión generado para InfoAggregate", tag: "Generación", time: "hace 2h" },
    { t: language === 'en' ? "Gaps re-prioritized after ConnectHub scan" : "Brechas re-priorizadas después de la detección de ConnectHub", tag: "Análisis", time: "hace 3h" },
  ]);

  const [target, setTarget] = useState<'DataFind' | 'InfoAggregate'>('DataFind');
  const [lawType, setLawType] = useState<'CCPA' | 'GDPR' | 'ARCO' | 'Generic'>('ARCO');
  const [tone, setTone] = useState<'strict' | 'cordial' | 'concise'>('strict');
  const [sent, setSent] = useState(false);
  const [innerModal, setInnerModal] = useState(false);

  // Alias Sandbox States
  const [sandboxEmail, setSandboxEmail] = useState(profile.emails[0].split('@')[0]);
  const [sandboxTag, setSandboxTag] = useState("compras");
  const [verifyingAlias, setVerifyingAlias] = useState(false);
  const [aliasVerified, setAliasVerified] = useState(false);
  const [sandboxCategory, setSandboxCategory] = useState<'banking' | 'shopping' | 'newsletters'>('shopping');
  const [customInstructions, setCustomInstructions] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Advanced model configurations
  const [temperature, setTemperature] = useState(0.4);
  const [topP, setTopP] = useState(0.85);

  // Persistent prompt history loaded/saved securely via XOR
  const [promptHistory, setPromptHistory] = useState<string[]>([
    language === 'en' 
      ? "I demand the immediate deletion of my inactive accounts on InfoAggregate." 
      : "Exijo borrar mis cuentas inactivas anteriores en InfoAggregate.",
    language === 'en'
      ? "Exclude my historical cell phone number from your marketing database."
      : "Excluye mi número celular histórico de tu base de datos de marketing."
  ]);

  // Quantum XOR session cipher methods
  const secureSaveHistory = (data: string[]) => {
    try {
      const json = JSON.stringify(data);
      let result = "";
      const secretKey = "leakshield_v0.5.0_quantum_key";
      for (let i = 0; i < json.length; i++) {
        const charCode = json.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(charCode);
      }
      const encoded = btoa(unescape(encodeURIComponent(result)));
      localStorage.setItem("leakshield_secure_prompt_history", encoded);
    } catch (e) {
      console.error("Failed to save prompt history:", e);
    }
  };

  const secureLoadHistory = () => {
    try {
      const encoded = localStorage.getItem("leakshield_secure_prompt_history");
      if (!encoded) return null;
      const decoded = decodeURIComponent(escape(atob(encoded)));
      let result = "";
      const secretKey = "leakshield_v0.5.0_quantum_key";
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(charCode);
      }
      return JSON.parse(result);
    } catch (e) {
      console.warn("Prompt history loading recovered from corrupted state:", e);
      return null;
    }
  };

  useEffect(() => {
    const saved = secureLoadHistory();
    if (saved && Array.isArray(saved)) {
      setPromptHistory(saved);
    }
  }, []);

  const addPromptToHistory = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !promptHistory.includes(trimmed)) {
      const updated = [trimmed, ...promptHistory].slice(0, 5); // Keep last 5 entries
      setPromptHistory(updated);
      secureSaveHistory(updated);
    }
  };

  // PII Warning Semaphore checker
  const checkPII = (text: string) => {
    if (!text.trim()) return { level: "green", message: language === 'en' ? "Prompt is secure. No PII detected." : "Prompt seguro. No se detecta PII." };
    const pwdRegex = /(contrase[ñn]a|password|clave|nip|pin)/i;
    const phoneRegex = /\+?\d{10,13}/;
    const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/;
    
    if (pwdRegex.test(text)) {
      return { level: "red", message: language === 'en' ? "Critical! Do not include passwords in prompts to avoid leakage." : "¡Crítico! No incluyas contraseñas en los prompts para evitar fugas." };
    }
    if (cardRegex.test(text)) {
      return { level: "red", message: language === 'en' ? "Danger! Credit card number detected. LeakShield has blocked this input." : "¡Peligro! Tarjeta de crédito detectada. LeakShield ha bloqueado esta entrada." };
    }
    if (phoneRegex.test(text)) {
      return { level: "orange", message: language === 'en' ? "Warning: Phone number detected. We recommend using a contact alias." : "Advertencia: Teléfono detectado. Se recomienda usar un alias de contacto." };
    }
    return { level: "green", message: language === 'en' ? "Prompt is secure. No sensitive PII detected." : "Prompt seguro. No se detectan datos PII sensibles." };
  };
  
  const piiWarning = checkPII(customInstructions);

  const getPIIColorClass = (lvl: string) => {
    if (lvl === 'red') return 'bg-crit-dim border-crit-line text-crit shadow-[0_0_8px_rgba(251,110,114,0.3)]';
    if (lvl === 'orange') return 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_8px_rgba(244,161,74,0.25)]';
    return 'bg-ok-dim border-ok-line text-ok shadow-[0_0_8px_rgba(52,211,153,0.25)]';
  };

  // SMTP Live Verification triggers
  const handleVerifyAlias = () => {
    if (!sandboxEmail.trim()) {
      onToast(language === 'en' ? "Type an alias to verify" : "Escribe un alias para verificar");
      return;
    }
    setVerifyingAlias(true);
    setAliasVerified(false);
    setTerminalLogs([]);

    const email = generateSandboxAlias();
    const hops = language === 'en' ? [
      `[PING] Initiating DNS verification check for ${email}...`,
      `[DNS] Fetching MX records for shield.leakshield.net...`,
      `[DNS Check OK] Found MX record: 10 mail.leakshield.net [TTL 3600]`,
      `[ROUTING] Establishing encrypted SMTP tunnel (TLS 1.3)...`,
      `[SPF Validated] SPF Record active. Sender authorized.`,
      `[DKIM Verified] Cryptographic signature aligned with domain.`,
      `[MX Record Routing Active] Routing confirmed to protected secure inbox.`
    ] : [
      `[PING] Iniciando chequeo DNS para ${email}...`,
      `[DNS] Buscando registros MX para shield.leakshield.net...`,
      `[DNS Check OK] Encontrado MX: 10 mail.leakshield.net [TTL 3600]`,
      `[ROUTING] Estableciendo túnel SMTP seguro (TLS 1.3)...`,
      `[SPF Validated] SPF Record activo. Remitente autorizado.`,
      `[DKIM Verified] Firma criptográfica alineada con el dominio.`,
      `[MX Record Routing Active] Enrutamiento confirmado hacia bandeja protegida.`
    ];

    hops.forEach((hop, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString('es-ES', { hour12: false })}] ${hop}`]);
        if (idx === hops.length - 1) {
          setVerifyingAlias(false);
          setAliasVerified(true);
          onToast(language === 'en' ? "Alias verified! Secure MX records routing confirmed." : "¡Alias verificado! MX records válidos y enrutamiento seguro confirmado.");
        }
      }, (idx + 1) * 320);
    });
  };

  const getCustomToneDescription = () => {
    if (tone === 'strict') {
      return language === 'en'
        ? "I demand the immediate and formal exclusion of my records from your database under legal penalties."
        : "Exijo de forma inmediata y enérgica la exclusión legal de mis registros de su base de datos bajo apercibimiento de sanción.";
    }
    if (tone === 'cordial') {
      return language === 'en'
        ? "I am writing to politely request the removal of my personal profile and data files from your active indexes."
        : "Por medio de la presente, solicito de la manera más atenta la remoción de mi perfil comercial y la eliminación de toda mi información personal de su índice de datos.";
    }
    return language === 'en'
      ? "Direct, definitive, and immediate suppression of my records from all your active storage platforms."
      : "Remoción formal, definitiva y directa de mis registros de sus sistemas y bases de datos.";
  };

  const letter = `${generateDeletionRequest(target, lawType, profile.name, profile.location)}\n\n[Cláusula de Tono IA - ${
    tone === 'strict' ? 'ESTRICTO LEGAL' : tone === 'cordial' ? 'CORDIAL' : 'DIRECTO'
  }]: ${getCustomToneDescription()}${
    customInstructions.trim() ? `\n\n[Instrucciones Adicionales del Usuario]: ${customInstructions.trim()}` : ""
  }`;

  // Dynamic cost calculations based on letter length & model temperature variables
  const inputTokens = Math.ceil((letter.length + customInstructions.length) / 4);
  const outputTokens = Math.ceil(letter.length / 3.8);
  const rawCost = (inputTokens * 0.0000015) + (outputTokens * 0.000002) * (1 + (temperature - 0.5) * 0.08);
  const simulatedCost = rawCost.toFixed(6);

  const pushLog = (tMsg: string, tag: string) => {
    setLog(l => [{ t: tMsg, tag, time: language === 'en' ? "just now" : "ahora" }, ...l]);
  };

  // Dynamic Alias Generator Sandbox Logic
  const generateSandboxAlias = () => {
    const domain = "shield.leakshield.net";
    const cleanedEmail = sandboxEmail.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const cleanedTag = sandboxTag.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    
    if (sandboxCategory === 'shopping') {
      return `${cleanedEmail}+${cleanedTag || 'compras'}@example.com`;
    } else if (sandboxCategory === 'banking') {
      return `${cleanedEmail}.vault.${cleanedTag || 'finanzas'}@secure-bank.com`;
    } else {
      const hash = Math.floor(100 + Math.random() * 900).toString(16);
      return `shield.temp-${cleanedTag || 'boletin'}-${hash}@${domain}`;
    }
  };

  // Broker Response Classifier States & Logic (Drag & Drop)
  const [classifierDragOver, setClassifierDragOver] = useState(false);
  const [classifierResult, setClassifierResult] = useState<{
    classification: string;
    confidence: number;
    snippets: string[];
    rebuttal: string;
  } | null>(null);
  const [classifierLoading, setClassifierLoading] = useState(false);
  const [customTextToClassify, setCustomTextToClassify] = useState("");

  const mockBrokerReplies = [
    {
      label: language === 'en' ? "Successful Suppression" : "Supresión Exitosa",
      broker: "InfoAggregate",
      text: language === 'en' 
        ? "Dear customer, we have successfully processed your deletion request. Your email and associated metadata have been purged from our databases according to GDPR/CCPA guidelines. You will receive no further communications."
        : "Estimado cliente, hemos procesado exitosamente su solicitud de eliminación. Su correo electrónico y metadatos asociados han sido purgados de nuestras bases de datos conforme a las directrices de RGPD/CCPA.",
      classification: language === 'en' ? "Successful Suppression" : "Supresión Exitosa",
      confidence: 98,
      snippets: language === 'en'
        ? ["successfully processed", "purged from our databases", "GDPR/CCPA guidelines"]
        : ["procesado exitosamente", "purgados de nuestras bases", "directrices de RGPD/CCPA"],
      rebuttal: ""
    },
    {
      label: language === 'en' ? "Legal Evasion (Pushback)" : "Evasiva Legal",
      broker: "DataFind",
      text: language === 'en'
        ? "We received your email. However, to process this removal, we require a notarized signature, a color copy of your driver's license, and a utility bill from the last 30 days confirming your state residency. Send them via certified mail."
        : "Hemos recibido su correo. Sin embargo, para procesar la baja de sus datos, requerimos que nos envíe una firma notariada, copia a color de su licencia de conducir y una factura de servicios públicos que demuestre residencia.",
      classification: language === 'en' ? "Legal Evasion / Obstacle" : "Evasiva Legal / Obstáculo",
      confidence: 94,
      snippets: language === 'en'
        ? ["require a notarized signature", "copy of your driver's license", "confirming your state residency"]
        : ["requerimos que nos envíe", "firma notariada", "demuestre residencia"],
      rebuttal: language === 'en'
        ? "Pursuant to CCPA Section 1798.130 / GDPR Article 17, demanding excessive documentation or certified mail for a simple email opt-out is disproportionate. I demand immediate deletion using this email verification channel, or I will report you to the Attorney General."
        : "De conformidad con la CCPA Sección 1798.130 y el Artículo 17 del RGPD, la exigencia de firmas notarizadas y licencias físicas para dar de baja un email es desproporcionada. Exijo el borrado inmediato o denunciaré esta práctica ilegal."
    },
    {
      label: language === 'en' ? "Jurisdictional Rejection" : "Rechazo Jurisdiccional",
      broker: "DataFind",
      text: language === 'en'
        ? "We regret to inform you that since you did not select or verify a residence within California or the EU, we are not legally obligated to honor your deletion request. Your record will remain active in our directories."
        : "Lamentamos informarle que debido a que no reside dentro de California o la Unión Europea, no nos encontramos obligados por ley a dar cumplimiento a su solicitud de borrado. Su registro permanecerá activo.",
      classification: language === 'en' ? "Jurisdictional Rejection" : "Rechazo por Jurisdicción",
      confidence: 91,
      snippets: language === 'en'
        ? ["not legally obligated", "remain active in our directories", "did not select or verify a residence"]
        : ["no nos encontramos obligados", "permanecerá activo", "no reside dentro de"],
      rebuttal: language === 'en'
        ? "Although I may currently reside elsewhere, you actively process, cache, and monetize my personal data globally. This triggers international privacy obligations. I demand the deletion of my profile under global privacy goodwill, or I will escalate to your hosting provider."
        : "Si bien mi domicilio actual puede diferir, ustedes procesan, almacenan y monetizan mis datos personales a nivel global. Exijo el borrado de mi perfil bajo principios de buena fe internacional y privacidad global."
    }
  ];

  const handleClassifyText = (text: string) => {
    if (!text.trim()) {
      onToast(language === 'en' ? "Please select or drop a broker reply first" : "Por favor, selecciona o suelta una respuesta de broker primero");
      return;
    }
    setClassifierLoading(true);
    setClassifierResult(null);
    
    // Simulate smart AI analysis
    setTimeout(() => {
      // Find matching mock if any, otherwise default to a custom evasion
      const match = mockBrokerReplies.find(m => text.toLowerCase().includes(m.text.slice(0, 15).toLowerCase()) || text.toLowerCase().includes(m.snippets[0]?.toLowerCase()));
      if (match) {
        setClassifierResult({
          classification: match.classification,
          confidence: match.confidence,
          snippets: match.snippets,
          rebuttal: match.rebuttal
        });
      } else {
        // Fallback custom text classification
        const hasId = /(documento|id|licencia|factura|utility|driver|notar)/i.test(text);
        const hasReject = /(no obligad|no podemos|rechaz|reject|not obligat|denied)/i.test(text);
        
        if (hasId) {
          setClassifierResult({
            classification: language === 'en' ? "Legal Evasion (Identity verification block)" : "Evasiva Legal (Exigencia de verificación excesiva)",
            confidence: 88,
            snippets: [language === 'en' ? "Detected identity documents demand" : "Se detecta demanda de documentos físicos"],
            rebuttal: language === 'en' 
              ? "Pursuant to CCPA / GDPR guidelines, requiring physical identity files for a simple opt-out request is an illegal barrier. Please delete my data immediately without demanding excessive documentation."
              : "Bajo las directrices de RGPD/CCPA, requerir documentos físicos de identidad para un opt-out digital es ilegal. Exijo el borrado inmediato de mis registros sin dilaciones excesivas."
          });
        } else if (hasReject) {
          setClassifierResult({
            classification: language === 'en' ? "Jurisdictional Rejection" : "Rechazo Jurisdiccional",
            confidence: 85,
            snippets: [language === 'en' ? "Detected obligation rejection" : "Se detecta rechazo de obligación de borrado"],
            rebuttal: language === 'en'
              ? "Your international data harvesting activities demand global accountability. I demand removal of my records immediately under good faith principles."
              : "Sus actividades de recolección transfronteriza exigen responsabilidad internacional. Exijo el borrado inmediato de mis registros bajo principios de buena fe y privacidad global."
          });
        } else {
          setClassifierResult({
            classification: language === 'en' ? "Successful Suppression" : "Supresión Exitosa",
            confidence: 90,
            snippets: [language === 'en' ? "Opt-out or confirmation wording detected" : "Se detecta confirmación de baja o remoción"],
            rebuttal: ""
          });
        }
      }
      setClassifierLoading(false);
      onToast(language === 'en' ? "Broker response successfully classified by AI!" : "¡Respuesta de broker clasificada con éxito por la IA!");
    }, 1200);
  };

  const handleClassifierDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setClassifierDragOver(false);
    
    // Extract dropped files
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setCustomTextToClassify(text);
          handleClassifyText(text);
        }
      };
      reader.readAsText(files[0]);
    } else {
      const text = e.dataTransfer.getData("text");
      if (text) {
        setCustomTextToClassify(text);
        handleClassifyText(text);
      }
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto fade-in px-5 md:px-8">
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold mb-1">{t.subtitle}</div>
          <h1 className="text-[26px] font-semibold tracking-tight text-t-0 leading-tight">{t.title}</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-teal-dim border border-teal-line text-teal">
          <span className="demo-blip" />
          {t.recommendations}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
        {/* Summary & Projection / Score Optimizer */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative overflow-hidden border border-teal-line rounded-lg p-5 bg-gradient-to-br from-teal/6 to-bg-2 shadow-premium flex flex-col justify-between glossy-sweep noise-grain transition-all duration-150"
          style={{
            transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
          }}
        >
          {/* Radial Hover Glow & Specular Glass Reflection */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.07), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.008] to-white/[0.03] pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-teal to-cyan" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal mb-3">
              <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
              {t.analysis}
            </span>
            <p className="text-[15.5px] leading-[1.55] text-t-0 mb-4.5 font-medium">
              {language === 'en' 
                ? "You have 2 critical elements linked to a reused password. Changing those credentials closes your most vulnerable gap and will boost your score by +12 points."
                : "Tienes 2 elementos críticos vinculados a una contraseña reutilizada. Cambiar esas credenciales cierra tu brecha más vulnerable y proyectará tu score en +12 puntos."
              }
            </p>
          </div>

          <div className="border border-line rounded-lg p-4 bg-bg-inset relative z-10">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] tracking-[0.14em] uppercase text-t-2 font-semibold">{t.currentScore}</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[12.5px] text-ok">
                <Icon name="trending-up" size={14} />
                {t.scoreMaximizer}
              </span>
            </div>
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              <span className="font-mono text-[30px] font-semibold text-med">{currentScoreValue}</span>
              <div className="flex-1 h-1.5 rounded-full bg-bg-2 overflow-hidden min-w-[120px]">
                <div className="h-full rounded-full bg-gradient-to-r from-teal to-cyan" style={{ width: `${projected}%` }} />
              </div>
              <span className="font-mono text-[30px] font-semibold text-teal">{projected}</span>
            </div>
            
            {/* Score Maximization Math Recommendation Touch (Premium AI) */}
            <div className="text-[11.2px] text-teal mt-3 leading-relaxed font-semibold flex items-center gap-1">
              <Icon name="sparkles" size={12} />
              <span>
                {language === 'en'
                  ? "AI Maximization: Optimal mathematical combination of 2 critical tasks to achieve +12 score points."
                  : "Maximización IA: Combinación matemática óptima de 2 tareas críticas para lograr +12 puntos de score."
                }
              </span>
            </div>
            <div className="text-[11px] text-t-2 mt-2 leading-relaxed">
              * {t.scoreInfo}
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between glossy-sweep noise-grain transition-all duration-150"
          style={{
            transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
          }}
        >
          {/* Radial Hover Glow & Specular Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase text-teal">
                <Icon name="sparkles" size={14} style={{ marginRight: 4 }} />
                {t.nextAction}
              </span>
              <Confidence level="High" />
            </div>
            <h2 className="text-[16px] font-semibold text-t-0 mb-1.5 leading-tight">{t.actionTitle}</h2>
            <p className="text-t-1 text-[13px] leading-[1.5] mb-3.5">{t.actionDesc}</p>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-teal-line bg-teal-dim text-teal">{t.actionReduction}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-3 border border-line text-t-1">
                <Icon name="clock" size={12} style={{ marginRight: 3 }} />
                {t.actionEffort}
              </span>
            </div>
          </div>
          <button 
            className="relative z-10 w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-[15px] py-2.5 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium"
            onClick={() => { 
              onNav("breaches"); 
              onToast(language === 'en' ? "Opening breaches remediation" : "Abriendo remediación de brechas"); 
            }}
          >
            <Icon name="key" size={15} />
            {t.actionButton}
          </button>
        </div>
      </div>

      {/* Plan Board columns */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium mb-4 transition-all duration-150"
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.03), transparent 80%)`
        }} />
        
        <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2.5 pb-3.5 border-b border-line relative z-10">
          <div className="flex items-center gap-2">
            <Icon name="kanban" size={16} style={{ color: "var(--teal)" }} />
            <h2 className="text-[15px] font-semibold text-t-0">{t.sequencing}</h2>
          </div>
          <span className="text-t-2 text-[12px]">{t.sequencingTip}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {(['Today', 'This Week', 'Later'] as const).map((bucket) => {
            const spanishMap: Record<string, string> = { Today: t.today, 'This Week': t.week, Later: t.later };
            const items = copilotData.plan[bucket] || [];
            return (
              <div key={bucket} className="border border-line rounded-lg p-3 bg-bg-1 min-h-[120px]">
                <div className="flex items-center gap-2 mb-3 px-1.5">
                  <span className="text-[13px] font-semibold text-t-0 leading-tight">{spanishMap[bucket]}</span>
                  <span className="ml-auto text-[11px] font-semibold px-2 py-0.2 rounded-full bg-bg-3 text-t-1">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  {items.map((it: PlanItem) => {
                    const mappedPriority = it.priority === 'Critical' ? 'Critical' : it.priority === 'High' ? 'High' : it.priority === 'Medium' ? 'Medium' : 'Low';
                    return (
                      <div key={it.id} className="border border-line rounded-md p-3 bg-bg-2 shadow-sm hover:border-teal-line/50 transition-all duration-120">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-1.5">
                          <Badge level={mappedPriority} />
                          <span className="font-mono text-[11px] ml-auto text-teal font-semibold">
                            {language === 'en' ? 'Reduction' : 'Reducción'}: {it.impact}
                          </span>
                        </div>
                        <div className="text-[13px] text-t-0 leading-[1.4] mb-2.5 font-medium">{it.text}</div>
                        <button 
                          className="w-full flex items-center justify-center gap-1.5 rounded-[9px] font-semibold text-[12px] px-3 py-1.5 border border-line-2 bg-bg-3 hover:bg-bg-2 hover:border-line-3 text-t-0 cursor-pointer transition-all duration-130"
                          onClick={() => { 
                            pushLog(language === 'en' ? `Initiated: ${it.text}` : `Iniciado: ${it.text}`, "Acción"); 
                            onToast(language === 'en' ? "Added to active tasks flow" : "Agregado al flujo de tareas activas"); 
                          }}
                        >
                          <Icon name="arrow-right" size={13} />
                          {t.beginAction}
                        </button>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="text-t-2 text-[12px] text-center py-6">{t.allDone}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* AI generators & Sandbox */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col gap-4 transition-all duration-150 glossy-sweep noise-grain"
          style={{
            transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
          }}
        >
          {/* Radial Hover Glow & Specular Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="file" size={16} style={{ color: "var(--teal)" }} />
              <h2 className="text-[15px] font-semibold text-t-0">{t.aiGenerators}</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                className="border border-line rounded-lg p-3.5 text-left cursor-pointer flex gap-3.5 items-center bg-bg-inset hover:border-teal-line w-full transition-all duration-130" 
                onClick={() => setInnerModal(true)}
              >
                <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                  <Icon name="file" size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-t-0 leading-tight">{t.remediationSub}</div>
                  <div className="text-t-2 text-[11.5px] truncate mt-0.5">{t.remediationDesc}</div>
                </div>
                <Icon name="chevron-right" size={16} style={{ color: "var(--t-2)" }} />
              </button>
            </div>
          </div>

          {/* Alias Strategy Sandbox Widget */}
          <div className="border border-line rounded-lg p-4 bg-bg-inset flex flex-col gap-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                <Icon name="mask" size={15} />
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-t-0 leading-tight">{t.emailSandbox}</div>
                <div className="text-t-2 text-[11.5px] mt-0.5">{t.emailSandboxSub}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{t.baseEmail}</label>
                <input 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-mono text-[12px] outline-none focus:border-teal-line transition-all" 
                  value={sandboxEmail} 
                  onChange={e => setSandboxEmail(e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{t.tagLabel}</label>
                <input 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-mono text-[12px] outline-none focus:border-teal-line transition-all" 
                  value={sandboxTag} 
                  onChange={e => setSandboxTag(e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wide uppercase text-t-2 font-semibold">{t.categoryLabel}</label>
                <select 
                  className="bg-bg-2 border border-line-2 rounded-lg px-2.5 py-1.5 text-t-0 font-sans text-[12px] outline-none focus:border-teal-line transition-all h-[31px]"
                  value={sandboxCategory}
                  onChange={e => setSandboxCategory(e.target.value as any)}
                >
                  <option value="shopping">{t.catShopping}</option>
                  <option value="banking">{t.catBanking}</option>
                  <option value="newsletters">{t.catNewsletters}</option>
                </select>
              </div>
            </div>

            <div className="border border-teal-line/30 bg-teal-dim/10 rounded-lg p-3 flex flex-col gap-2.5 flex-1">
              <div>
                <span className="text-[10px] tracking-wide uppercase text-teal font-semibold block">{t.aliasGenerated}</span>
                <span className="font-mono text-[13.5px] text-t-0 select-all font-semibold truncate bg-bg-2 px-2.5 py-1 rounded border border-line break-all block w-full leading-relaxed">
                  {generateSandboxAlias()}
                </span>
              </div>

              {/* Recommendation 30: SMTP Alias Confirmation Flow SVG */}
              <div className="relative mt-2.5 mb-2 rounded-lg border border-line bg-bg-inset p-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.015] pointer-events-none" />
                <div className="text-[10px] uppercase font-bold tracking-wide text-t-2 mb-2 flex justify-between">
                  <span>{language === 'en' ? "SMTP Routing Tunnel" : "Túnel de Enrutamiento SMTP"}</span>
                  <span className={aliasVerified ? "text-ok font-bold" : verifyingAlias ? "text-teal font-bold" : "text-t-3 font-semibold animate-pulse"}>
                    {aliasVerified ? "● ACTIVE" : verifyingAlias ? "● CONNECTING..." : "● STANDBY"}
                  </span>
                </div>
                
                <svg className="w-full h-14 bg-bg-inset overflow-hidden" viewBox="0 0 400 60">
                  <style>{`
                    @keyframes dashAnim {
                      to {
                        stroke-dashoffset: -40;
                      }
                    }
                    .flow-dash {
                      stroke-dasharray: 8, 12;
                      animation: dashAnim 1.2s linear infinite;
                    }
                    .verify-pulse {
                      animation: pulseGlow 2s infinite ease-in-out;
                    }
                    @keyframes pulseGlow {
                      0%, 100% { opacity: 0.3; }
                      50% { opacity: 0.9; }
                    }
                  `}</style>
                  
                  {/* Connections */}
                  <path d="M 40 30 L 360 30" stroke="var(--line)" strokeWidth="1.5" />
                  
                  {verifyingAlias && (
                    <path d="M 40 30 L 360 30" stroke="var(--teal)" strokeWidth="2.5" className="flow-dash" />
                  )}
                  {aliasVerified && (
                    <path d="M 40 30 L 360 30" stroke="var(--ok)" strokeWidth="2.5" />
                  )}
                  
                  {/* Nodes */}
                  {/* User Profile base node */}
                  <g transform="translate(40, 30)">
                    <circle r="15" fill="var(--bg-3)" stroke={verifyingAlias || aliasVerified ? "var(--teal)" : "var(--line)"} strokeWidth="1.5" />
                    <text y="4" textAnchor="middle" fontSize="11" fill="var(--t-0)">👤</text>
                  </g>
                  
                  {/* SMTP Middle Relay Gateway */}
                  <g transform="translate(200, 30)">
                    <rect x="-16" y="-16" width="32" height="32" rx="6" fill="var(--bg-2)" 
                          stroke={aliasVerified ? "var(--ok)" : verifyingAlias ? "var(--teal)" : "var(--line)"} 
                          strokeWidth="1.5" className={verifyingAlias ? "verify-pulse" : ""} />
                    {aliasVerified ? (
                      <path d="M -6 0 L -2 4 L 6 -4" stroke="var(--ok)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    ) : verifyingAlias ? (
                      <circle r="6" stroke="var(--teal)" strokeWidth="1.5" fill="none" strokeDasharray="6, 3" className="spin" style={{ animationDuration: "1s" }} />
                    ) : (
                      <text y="4" textAnchor="middle" fontSize="10" fill="var(--t-3)">⚙️</text>
                    )}
                  </g>
                  
                  {/* Generated email alias node */}
                  <g transform="translate(360, 30)">
                    <circle r="15" fill="var(--bg-3)" stroke={aliasVerified ? "var(--ok)" : "var(--line)"} strokeWidth="1.5" />
                    <text y="4" textAnchor="middle" fontSize="11" fill="var(--t-0)">🛡️</text>
                  </g>
                </svg>
              </div>
              
              <div className="flex gap-2 items-center flex-wrap">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[11.5px] px-3 py-1.5 bg-bg-3 hover:bg-bg-2 border border-line-2 text-t-0 cursor-pointer transition-all duration-120"
                  onClick={handleVerifyAlias}
                  disabled={verifyingAlias}
                >
                  {verifyingAlias ? (
                    <>
                      <Icon name="refresh" size={13} className="spin" />
                      {t.verifying}
                    </>
                  ) : aliasVerified ? (
                    <>
                      <Icon name="check-circle" size={13} style={{ color: 'var(--ok)' }} />
                      {t.activeAlias}
                    </>
                  ) : (
                    <>
                      <Icon name="shield-check" size={13} />
                      {t.verifyAlias}
                    </>
                  )}
                </button>
                {aliasVerified && (
                  <span className="text-[11px] text-ok font-semibold animate-fadeIn flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-ok" />
                    {t.activeRouting}
                  </span>
                )}
              </div>

              {/* Terminal logs block */}
              {(verifyingAlias || terminalLogs.length > 0) && (
                <div className="mt-1 bg-bg-inset border border-line rounded-lg p-3 font-mono text-[10.5px] leading-relaxed text-teal select-text max-h-[140px] overflow-y-auto shadow-inner animate-fadeIn flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 border-b border-line/45 pb-1.5 mb-1.5 text-t-2 font-sans font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal shadow-[0_0_6px_var(--teal)] animate-pulse" />
                    {t.terminalTitle}
                  </div>
                  {terminalLogs.map((logStr, i) => (
                    <div key={i} className="whitespace-pre-wrap truncate">
                      {logStr}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-[11.2px] text-t-2 leading-relaxed leading-none flex gap-1 items-start mt-0.5">
              <Icon name="sparkles" size={11} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1.5 }} />
              <span>{t.aliasTip}</span>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative overflow-hidden border border-line rounded-lg p-5 bg-bg-2 shadow-premium flex flex-col justify-between transition-all duration-150 glossy-sweep noise-grain"
          style={{
            transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
          }}
        >
          {/* Radial Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3.5 border-b border-line pb-3">
              <Icon name="clock" size={16} />
              <h2 className="text-[15px] font-semibold text-t-0">{t.activityTitle}</h2>
            </div>
            
            <div className="flex flex-col">
              {log.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-teal-dim border border-teal-line text-teal flex-shrink-0">
                    <Icon name="sparkles" size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.8px] text-t-0 truncate">{l.t}</div>
                    <div className="text-t-2 text-[11px] mt-0.5">{l.tag}</div>
                  </div>
                  <span className="text-t-2 font-mono text-[11px] flex-shrink-0 ml-2">{l.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-1.5 mt-4 text-t-3 text-[11px] border-t border-line/45 pt-3.5">
            <Icon name="shield-check" size={13} />
            <span>{t.activityTip}</span>
          </div>
        </div>
      </div>

      {/* Recommendation 28: Broker Response Classifier Card (Drag & Drop) */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative overflow-hidden border rounded-lg p-5 bg-bg-2 shadow-premium mb-4 transition-all duration-150 glossy-sweep noise-grain ${
          classifierDragOver ? "border-teal shadow-[0_0_12px_var(--teal-line)] bg-bg-inset" : "border-line"
        }`}
        onDragOver={(e) => { e.preventDefault(); setClassifierDragOver(true); }}
        onDragLeave={() => setClassifierDragOver(false)}
        onDrop={handleClassifierDrop}
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))',
        }}
      >
        {/* Radial Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.04), transparent 80%)`
        }} />
        
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-line relative z-10">
          <Icon name="refresh" size={16} style={{ color: "var(--teal)" }} />
          <div>
            <h2 className="text-[15px] font-semibold text-t-0">{t.classifierTitle}</h2>
            <p className="text-t-2 text-[11.5px] mt-0.5">{t.classifierSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 relative z-10">
          {/* Left panel: Dropzone / input and simulation selection */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              {mockBrokerReplies.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomTextToClassify(m.text);
                    handleClassifyText(m.text);
                  }}
                  className="px-2.5 py-1 rounded bg-bg-3 border border-line hover:border-teal-line text-[11.5px] text-t-1 hover:text-teal font-semibold cursor-pointer transition-all duration-120"
                >
                  ⚡ Mock: {m.label}
                </button>
              ))}
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-5 text-center flex flex-col items-center justify-center min-h-[140px] cursor-pointer transition-all duration-150 ${
                classifierDragOver ? "border-teal bg-teal-dim/10" : "border-line-2 hover:border-line-3 bg-bg-inset"
              }`}
              onClick={() => {
                const el = document.getElementById("hidden-classifier-file");
                if (el) el.click();
              }}
            >
              <input 
                id="hidden-classifier-file"
                type="file"
                accept=".txt,.eml,.csv,.json"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target?.result as string;
                      if (text) {
                        setCustomTextToClassify(text);
                        handleClassifyText(text);
                      }
                    };
                    reader.readAsText(files[0]);
                  }
                }}
              />
              <div className="w-9 h-9 rounded-full bg-bg-3 border border-line flex items-center justify-center text-t-2 mb-2">
                <Icon name="arrow-right" size={16} className="rotate-90 text-t-1" />
              </div>
              <span className="text-[12.8px] text-t-0 font-medium">{t.classifierDropZone}</span>
              <span className="text-t-3 text-[11px] mt-1">{language === 'en' ? "Supports dragging raw text or files (.txt, .eml)" : "Soporta arrastrar texto plano o archivos (.txt, .eml)"}</span>
            </div>

            <textarea
              className="w-full h-18 text-[12.5px] bg-bg-inset border border-line rounded-lg p-2.5 focus:outline-none focus:border-teal/50 transition-colors placeholder:text-t-3 font-mono resize-none"
              placeholder={language === 'en' ? "Or paste a broker response email here to analyze..." : "O pega un correo de respuesta de broker aquí para clasificar..."}
              value={customTextToClassify}
              onChange={(e) => setCustomTextToClassify(e.target.value)}
            />
            
            <button
              onClick={() => handleClassifyText(customTextToClassify)}
              disabled={classifierLoading}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12.5px] px-3 py-2 bg-bg-3 hover:bg-bg-2 border border-line-2 text-t-0 cursor-pointer transition-all duration-120"
            >
              {classifierLoading ? (
                <>
                  <Icon name="refresh" size={13} className="spin" />
                  {language === 'en' ? "AI Auditing..." : "IA Auditando..."}
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={13} style={{ color: "var(--teal)" }} />
                  {language === 'en' ? "Classify with LeakShield AI" : "Clasificar con LeakShield IA"}
                </>
              )}
            </button>
          </div>

          {/* Right panel: AI Classification results */}
          <div className="border border-line rounded-lg p-4 bg-bg-inset min-h-[220px] flex flex-col justify-between">
            {classifierLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 animate-pulse">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-dim text-teal border border-teal-line spin mb-3">
                  <Icon name="refresh" size={20} />
                </div>
                <span className="text-[13px] font-semibold text-teal font-mono">{language === 'en' ? "Analyzing broker legal stance..." : "Analizando postura legal del broker..."}</span>
              </div>
            ) : classifierResult ? (
              <div className="flex flex-col gap-3.5 fade-in">
                <div className="flex justify-between items-start flex-wrap gap-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-t-2 block">{language === 'en' ? "AI CLASSIFICATION" : "CLASIFICACIÓN DE IA"}</span>
                    <span className="text-[14.5px] font-bold text-t-0">{classifierResult.classification}</span>
                  </div>
                  <Badge level={classifierResult.classification.includes("Supresión") || classifierResult.classification.includes("Suppression") ? "ok" : "High"} />
                </div>

                {/* Symmetrical columns: SVG Chart Left, Snippets Right */}
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center border-t border-b border-line/45 py-3">
                  {/* Dynamic circular SVG bar chart */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9.5px] uppercase font-bold text-t-2 mb-1.5">{t.classifierConfTitle}</span>
                    <div className="relative w-20 h-20">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="var(--line-2)" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="var(--teal)" strokeWidth="6" fill="none"
                          strokeDasharray="201" strokeDashoffset={201 * (1 - classifierResult.confidence / 100)}
                          strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset 1s" }} />
                        <text x="40" y="45" textAnchor="middle" fill="var(--t-0)" fontSize="14" fontWeight="bold" fontFamily="var(--mono)">
                          {classifierResult.confidence}%
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Detected key snippets breakdown */}
                  <div className="flex flex-col">
                    <span className="text-[9.5px] uppercase font-bold text-t-2 mb-1.5">{t.classifierFragments}</span>
                    <div className="flex flex-col gap-1.5">
                      {classifierResult.snippets.map((snip, sidx) => (
                        <div key={sidx} className="flex items-start gap-1.5 text-[11.5px] text-t-1 bg-bg-2 p-1.5 rounded border border-line font-mono select-all">
                          <Icon name="check-circle" size={12} style={{ color: "var(--teal)", flexShrink: 0, marginTop: 2 }} />
                          <span>"{snip}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Broker Rebuttals Generator (Recommendation 27: English/Spanish adaptation) */}
                {classifierResult.rebuttal ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-teal block">{t.classifierRebuttal}</span>
                    <pre className="m-0 whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-teal bg-teal-dim/5 border border-teal-line/30 rounded-lg p-3 max-h-[140px] overflow-y-auto shadow-inner select-text">
                      {classifierResult.rebuttal}
                    </pre>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(classifierResult.rebuttal);
                          onToast(language === 'en' ? "AI Rebuttal copied to clipboard!" : "¡Réplica de IA copiada al portapapeles!");
                          pushLog(language === 'en' ? "Rebuttal copied for broker pushback" : "Réplica legal copiada para contrarrestar broker", "Réplica");
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded bg-teal text-[#04110F] hover:brightness-[1.07] font-semibold text-[11.5px] py-1.5 cursor-pointer transition-all duration-120"
                      >
                        <Icon name="file" size={12} />
                        {language === 'en' ? "Copy Rebuttal Text" : "Copiar Texto de Réplica"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-ok text-[12.2px] font-semibold bg-ok-dim/10 border border-ok-line p-3 rounded-lg flex items-center gap-2">
                    <Icon name="shield-check" size={15} style={{ color: "var(--ok)", flexShrink: 0 }} />
                    <span>
                      {language === 'en'
                        ? "Suppression verified! The broker complied with our request. No rebuttal actions required."
                        : "¡Supresión validada! El broker cumplió formalmente con el borrado. No se requieren acciones de réplica."
                      }
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-t-3">
                <Icon name="mask" size={32} className="mb-2" />
                <span className="text-[13px] font-medium">{language === 'en' ? "Load a mock reply or drop a file to start" : "Carga una réplica mock o arrastra un archivo para iniciar"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Deletion Letter Modal */}
      {innerModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/72 backdrop-blur-[6px] grid place-items-center p-6 cursor-pointer"
          onClick={() => setInnerModal(false)}
        >
          <div 
            className="fade-in cursor-default flex flex-col w-full max-w-[720px] max-h-[88vh] overflow-hidden bg-bg-1 border border-line-2 rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-[22px] py-[18px] border-b border-line sticky top-0 bg-bg-1 z-10 flex-shrink-0">
              <div>
                <div className="text-[17px] font-semibold tracking-tight text-t-0">{t.modalTitle}</div>
                <div className="text-t-2 text-[12.5px] mt-0.5">{t.modalSub}</div>
              </div>
              <button 
                className="w-9 h-9 rounded-lg border border-line bg-bg-2 hover:bg-bg-3 hover:text-t-0 text-t-1 flex items-center justify-center cursor-pointer transition-all duration-130"
                onClick={() => setInnerModal(false)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            
            <div className="p-[22px] overflow-y-auto flex-1 text-[13px]">
              <div className="mb-4 bg-high/10 border border-high/30 rounded-lg p-3.5 flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-high/20 text-high flex-shrink-0">
                  <Icon name="alert" size={15} style={{ color: 'var(--high)' }} />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-t-0 leading-tight">{t.modalAlert}</div>
                  <div className="text-t-2 text-[11.5px] mt-0.5">{t.modalAlertDesc}</div>
                </div>
              </div>
              <AIInsightCard 
                tag="Redacción de IA" 
                lead 
                confidence="High"
                body={language === 'en'
                  ? "Generated a formal deletion request template adapted to the target broker using the selected legal framework."
                  : "Generé una plantilla de solicitud de borrado adaptada al broker utilizando el marco legal seleccionado."
                } 
              />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12.5px] font-semibold text-t-1">{t.modalBroker}</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {["DataFind", "InfoAggregate"].map(tItem => (
                    <button 
                      key={tItem} 
                      className={`px-3 py-1 rounded-md text-[12px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        target === tItem 
                          ? "bg-bg-3 text-t-0 shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setTarget(tItem as 'DataFind' | 'InfoAggregate')}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12.5px] font-semibold text-t-1">{t.modalReg}</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit flex-wrap">
                  {(['CCPA', 'GDPR', 'ARCO', 'Generic'] as const).map(law => (
                    <button 
                      key={law} 
                      className={`px-3.5 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        lawType === law 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setLawType(law)}
                    >
                      {law === 'Generic' ? (language === 'en' ? 'Generic Support' : 'Soporte Genérico') : law}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[12.5px] font-semibold text-t-1">{t.modalTone}</label>
                <div className="flex gap-1 bg-bg-inset p-1 rounded-lg border border-line w-fit">
                  {[
                    ["strict", language === 'en' ? "Legal Strict" : "Estricto Legal"],
                    ["cordial", language === 'en' ? "Cordial" : "Cordial"],
                    ["concise", language === 'en' ? "Concise / Direct" : "Directo / Conciso"]
                  ].map(([k, lbl]) => (
                    <button 
                      key={k} 
                      className={`px-3 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 transition-all duration-120 ${
                        tone === k 
                          ? "bg-bg-3 text-teal shadow-premium" 
                          : "text-t-1 hover:text-t-0 bg-transparent"
                      }`} 
                      onClick={() => setTone(k as any)}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation 24: Advanced LLM Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t border-line/45 pt-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11.8px] font-semibold text-t-1">{t.tempLabel}</label>
                    <span className="text-[11px] font-mono text-teal font-bold">{temperature.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-t-3 font-semibold">{language === 'en' ? "Strict (0.0)" : "Estricto (0.0)"}</span>
                    <input 
                      type="range" 
                      min="0.0" 
                      max="1.0" 
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="flex-1 accent-teal h-1 bg-bg-inset rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-t-3 font-semibold">{language === 'en' ? "Creative (1.0)" : "Creativo (1.0)"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11.8px] font-semibold text-t-1">{t.topPLabel}</label>
                    <span className="text-[11px] font-mono text-teal font-bold">{topP.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-t-3 font-semibold">{language === 'en' ? "Nucleus" : "Núcleo"}</span>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="flex-1 accent-teal h-1 bg-bg-inset rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-t-3 font-semibold">{language === 'en' ? "Wide" : "Amplio"}</span>
                  </div>
                </div>
              </div>

              {/* Presets and Custom Prompt text area with Tricolor PII Semaphore */}
              <div className="flex flex-col gap-1.5 mt-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <label className="text-[12.5px] font-semibold text-t-1">{t.modalInstructions}</label>
                  
                  {/* Recommendation 25: Tricolor PII Semaphore glowing badge */}
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all duration-300 ${getPIIColorClass(piiWarning.level)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      piiWarning.level === 'red' ? 'bg-crit animate-pulse' : piiWarning.level === 'orange' ? 'bg-orange-400 animate-pulse' : 'bg-ok'
                    }`} />
                    {piiWarning.level === 'red' ? (language === 'en' ? 'Critical (High Risk)' : 'Crítico (Alto Riesgo)') : 
                     piiWarning.level === 'orange' ? (language === 'en' ? 'Warning (Medium Risk)' : 'Advertencia (Riesgo Medio)') : 
                     (language === 'en' ? 'Secure (Clean)' : 'Seguro (Limpio)')}
                  </span>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {[
                    ["Familia", language === 'en' ? "Mention my family membership and demand exclusion of my dependants." : "Menciona que tengo una membresía familiar y exijo la exclusión de todos mis dependientes."],
                    ["Direcciones", language === 'en' ? "Demand deletion of my historic residential addresses linked to this email." : "Exijo que se borren mis direcciones residenciales anteriores asociadas a este correo."],
                    ["Teléfonos", language === 'en' ? "Explicitly exclude any historic mobile number from your data caches." : "Excluye explícitamente cualquier número telefónico histórico en sus índices."]
                  ].map(([lbl, val]) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setCustomInstructions(val)}
                      className="px-2 py-0.5 rounded bg-bg-3 border border-line hover:border-teal/40 text-[10.5px] text-t-2 hover:text-teal cursor-pointer transition-all"
                    >
                      +{lbl}
                    </button>
                  ))}
                  {customInstructions && (
                    <button
                      type="button"
                      onClick={() => setCustomInstructions("")}
                      className="px-2 py-0.5 rounded bg-bg-3 border border-line text-[10.5px] text-crit cursor-pointer transition-all ml-1.5"
                    >
                      {language === 'en' ? 'Clear' : 'Limpiar'}
                    </button>
                  )}
                </div>

                <textarea 
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder={language === 'en' ? "E.g. 'Exclude my phone number and prior postal addresses'..." : "Ej: 'Menciona que tengo una membresía familiar de 3 personas y que exijo el borrado de sus registros también'..."}
                  className={`w-full h-18 text-[12.5px] leading-relaxed text-t-0 bg-bg-inset border rounded-lg p-2.5 focus:outline-none transition-all placeholder:text-t-3 font-sans resize-none ${
                    piiWarning.level === 'red' ? 'border-crit/50 focus:border-crit' : piiWarning.level === 'orange' ? 'border-orange-500/50 focus:border-orange-500' : 'border-line focus:border-teal/50'
                  }`}
                />
                
                {piiWarning.level !== 'green' && (
                  <div className={`mt-1.5 p-2 rounded border text-[11px] font-semibold animate-pulse flex items-center gap-1.5 ${
                    piiWarning.level === 'red' ? 'bg-crit-dim/10 border-crit text-crit' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  }`}>
                    <Icon name="alert" size={13} style={{ color: piiWarning.level === 'red' ? "var(--crit)" : "rgb(251 146 60)", flexShrink: 0 }} />
                    <span>{piiWarning.message}</span>
                  </div>
                )}

                {/* Recommendation 26: Clickable Prompt history bank */}
                {promptHistory.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[10px] uppercase tracking-wider text-t-2 font-bold">
                      {language === 'en' ? 'Prompt History (Click to restore)' : 'Historial de Prompts (Clic para restaurar)'}
                    </span>
                    <div className="flex gap-1.5 flex-wrap max-h-16 overflow-y-auto pr-1">
                      {promptHistory.map((histPrompt, hIdx) => (
                        <button
                          key={hIdx}
                          type="button"
                          onClick={() => setCustomInstructions(histPrompt)}
                          className="px-2.5 py-1 rounded bg-bg-inset hover:bg-bg-3 border border-line hover:border-teal-line text-[11px] text-t-2 hover:text-t-0 text-left truncate max-w-[200px] cursor-pointer transition-all duration-120"
                          title={histPrompt}
                        >
                          🕒 {histPrompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic stats bar containing simulated dynamic cost calculator */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 items-center justify-between mt-4.5 mb-1 p-3 rounded-lg bg-bg-inset border border-line font-mono text-[11px] text-t-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-ping" />
                  {t.modalStatsSpeed} <strong className="text-teal font-semibold">142 tok/s</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  {t.modalStatsConfidence} <strong className="text-teal font-semibold">99.8%</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  {t.modalStatsInference} <strong className="text-t-1 font-semibold">0.18s</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  {t.modalStatsFidelity} <strong className="text-ok font-semibold">ARCO</strong>
                </span>
                
                {/* Recommendation 29: Dynamic simulated AI Cost display */}
                <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1 bg-teal-dim/20 border border-teal-line/30 px-1.5 py-0.5 rounded text-[10.5px] shadow-[0_0_6px_rgba(45,212,191,0.1)]">
                  💰 {language === 'en' ? "Cost:" : "Coste:"} <strong className="text-teal font-bold">${simulatedCost}</strong>
                </span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[12.5px] font-semibold text-t-1">{t.modalLetter}</label>
                <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-t-1 bg-bg-inset border border-line rounded-lg p-4 select-text">
                  {letter}
                </pre>
              </div>

              <div className="flex items-center gap-1.5 my-3.5 text-t-2 text-[11.5px]">
                <Icon name="shield-check" size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
                <span>{t.modalTip}</span>
              </div>

              <div className="flex justify-end gap-2.5 flex-wrap">
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    navigator.clipboard?.writeText(letter); 
                    addPromptToHistory(customInstructions);
                    onToast(language === 'en' ? "Draft copied to clipboard" : "Borrador copiado al portapapeles"); 
                  }}
                >
                  <Icon name="file" size={15} />
                  {t.modalBtnCopy}
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    addPromptToHistory(customInstructions);
                    const mdContent = `# SOLICITUD FORMAL DE EXCLUSIÓN LEGAL Y DERECHOS ARCO
**LeakShield AI Command Center - v0.5.0 Premium Release**

- **Fecha de Generación:** ${new Date().toLocaleDateString('es-ES')}
- **Titular de Datos:** ${profile.name}
- **Ubicación Declarada:** ${profile.location}
- **Broker Destino:** ${target}
- **Marco Legal:** ${lawType}

---

### Contenido de la Solicitud Generada por IA:

\`\`\`text
${letter}
\`\`\`

---
*Esta es una simulación interactiva premium de LeakShield AI. Documento exportado para los órganos garantes de privacidad.*`;
                    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `leakshield_solicitud_${target.toLowerCase()}.md`;
                    link.click();
                    URL.revokeObjectURL(url);
                    onToast(language === 'en' ? "Markdown (.md) document downloaded!" : "¡Documento en formato Markdown (.md) descargado!"); 
                  }}
                >
                  <Icon name="file" size={15} style={{ color: "var(--teal)" }} />
                  {t.modalBtnDownloadMd}
                </button>

                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    addPromptToHistory(customInstructions);
                    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de Exclusión Legal - LeakShield AI</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #e2e8f0;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
    }
    .header {
      border-bottom: 2px solid #14b8a6;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .subtitle {
      font-size: 13px;
      color: #14b8a6;
      margin-top: 4px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
      font-size: 13px;
      background: #0f172a;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #1e293b;
    }
    .meta-item strong {
      color: #94a3b8;
    }
    .meta-item span {
      color: #f1f5f9;
    }
    .content-box {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 20px;
      font-family: monospace;
      font-size: 12.5px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: #2dd4bf;
      margin-bottom: 24px;
    }
    .footer {
      font-size: 11px;
      color: #64748b;
      text-align: center;
      border-top: 1px solid #1f2937;
      padding-top: 16px;
    }
    .btn-print {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #14b8a6;
      color: #04110f;
      font-weight: 600;
      font-size: 13px;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 20px;
      transition: background 0.15s;
    }
    .btn-print:hover {
      background: #0d9488;
    }
    @media print {
      body {
        background: #ffffff;
        color: #000000;
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        background: #ffffff;
        padding: 0;
      }
      .meta-grid {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
      }
      .content-box {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        color: #000000;
      }
      .btn-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
    <div class="header">
      <h1 class="title">SOLICITUD FORMAL DE EXCLUSIÓN LEGAL Y DERECHOS ARCO</h1>
      <div class="subtitle">LEAKSHIELD AI COMMAND CENTER - PREMIUM EXPORTER</div>
    </div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Fecha de Emisión:</strong> <span>${new Date().toLocaleDateString('es-ES')}</span></div>
      <div class="meta-item"><strong>Titular de Datos:</strong> <span>${profile.name}</span></div>
      <div class="meta-item"><strong>Ubicación Declarada:</strong> <span>${profile.location}</span></div>
      <div class="meta-item"><strong>Broker Destino:</strong> <span>${target}</span></div>
      <div class="meta-item"><strong>Marco Regulatorio:</strong> <span>${lawType}</span></div>
    </div>
    <div class="content-box">${letter}</div>
    <div class="footer">
      Documento generado de forma segura e interactiva a través de la consola premium de LeakShield AI.<br>
      © ${new Date().getFullYear()} LeakShield AI. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>`;
                    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `leakshield_solicitud_${target.toLowerCase()}.html`;
                    link.click();
                    URL.revokeObjectURL(url);
                    onToast(language === 'en' ? "HTML print-ready document exported!" : "¡Documento HTML/PDF interactivo listo para imprimir!"); 
                  }}
                >
                  <Icon name="external" size={15} style={{ color: "var(--cyan)" }} />
                  {t.modalBtnDownloadHtml}
                </button>

                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-2 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-1 hover:text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    addPromptToHistory(customInstructions);
                    const fileContent = `========================================================
SOLICITUD FORMAL DE EXCLUSIÓN LEGAL Y DERECHOS ARCO
LeakShield AI Command Center - v0.5.0 Premium Release
========================================================

Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}
Titular de Datos: ${profile.name}
Ubicación declarada: ${profile.location}

--------------------------------------------------------
CONTENIDO DE LA SOLICITUD GENERADA POR IA:
--------------------------------------------------------
${letter}

--------------------------------------------------------
Esta es una simulación premium interactiva de LeakShield AI.
La descarga de este borrador legal simula la exportación de
los formatos exigidos por los reguladores de privacidad.
========================================================`;
                    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `leakshield_solicitud_supresion_${target.toLowerCase()}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                    onToast(language === 'en' ? "TXT legal document downloaded!" : "¡Documento legal exportado y descargado!"); 
                  }}
                >
                  <Icon name="refresh" size={15} />
                  {t.modalBtnDownloadTxt}
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3 py-2 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] cursor-pointer transition-all duration-130 shadow-premium"
                  onClick={() => { 
                    addPromptToHistory(customInstructions);
                    setSent(true); 
                    onToast(language === 'en' ? "Queued for owner review!" : "Encolado para revisión del titular"); 
                    setTimeout(() => setInnerModal(false), 700); 
                  }}
                >
                  <Icon name={sent ? "check" : "send"} size={15} />
                  {sent ? t.modalBtnEnqueued : t.modalBtnEnqueue}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopilotWorkspace;
