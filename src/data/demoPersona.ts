import { Profile, PrivacyScore } from '../types/privacy';

export const demoProfile: Profile = {
  name: "Alex Rivera",
  initials: "AR",
  location: "Ciudad de México, MX",
  emails: ["alex.rivera@example.com", "work.alias@example.com"],
  usernames: ["alexrivera", "arivera_tech"],
  phone: "+52 ••• ••• ••12",
  memberSince: "Mayo 2026",
};

export const initialScore: PrivacyScore = {
  value: 72,
  grade: "Regular",
  trend: 7,
  updated: "hace 2 horas",
  bands: [
    { label: "Crítico", min: 0,  max: 39, color: "var(--crit)" },
    { label: "En riesgo",  min: 40, max: 59, color: "var(--high)" },
    { label: "Regular",     min: 60, max: 74, color: "var(--med)"  },
    { label: "Bueno",     min: 75, max: 89, color: "var(--teal)" },
    { label: "Excelente",   min: 90, max: 100, color: "var(--ok)"  },
  ],
  factors: [
    { label: "Brecha crítica activa", impact: -14, kind: "breach", detail: "Credenciales expuestas en ConnectHub y no rotadas." },
    { label: "Contraseña reutilizada", impact: -10, kind: "password", detail: "La misma clave aparece en 2 servicios vulnerados." },
    { label: "Dirección física expuesta", impact: -6, kind: "footprint", detail: "Dirección de domicilio listada en 1 directorio público." },
    { label: "Listados en Data Brokers", impact: -3, kind: "broker", detail: "2 brokers están distribuyendo tu perfil comercial." },
    { label: "Cuentas inactivas", impact: -3, kind: "oldaccount", detail: "3 cuentas inactivas amplían tu superficie de ataque." },
    { label: "2FA en correo principal", impact: 8, kind: "credit", detail: "Activado — evita que tu puntaje caiga a rangos críticos.", credit: true },
  ],
};
