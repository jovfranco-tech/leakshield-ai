export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  crit?: boolean;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  { group: "Monitoreo", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "identity", label: "Identidad Digital", icon: "fingerprint" },
  ]},
  { group: "Hallazgos", items: [
    { id: "breaches", label: "Brechas de Seguridad", icon: "breach", badge: "4", crit: true },
    { id: "footprint", label: "Footprint Público", icon: "globe", badge: "6" },
    { id: "brokers", label: "Data Brokers", icon: "building", badge: "2" },
  ]},
  { group: "Acciones", items: [
    { id: "copilot", label: "Copiloto de IA", icon: "sparkles" },
    { id: "tasks", label: "Tablero de Tareas", icon: "kanban", badge: "9" },
  ]},
  { group: "Configuración", items: [
    { id: "trust", label: "Centro de Confianza", icon: "shield-check" },
  ]},
];

export const TITLES: Record<string, string> = {
  dashboard: "Panel de Privacidad",
  identity: "Registro de Identidad Digital",
  breaches: "Inteligencia de Brechas",
  footprint: "Huella Digital Pública",
  brokers: "Exposición en Data Brokers",
  copilot: "Copiloto de Remediación",
  tasks: "Tablero de Tareas de Privacidad",
  trust: "Centro de Confianza y Seguridad",
};

export const ONBOARDING_VIEWS = ["landing", "consent", "intake"];
export type ViewType = 'landing' | 'consent' | 'intake' | 'dashboard' | 'identity' | 'breaches' | 'footprint' | 'brokers' | 'copilot' | 'tasks' | 'trust';
export type DashboardLayout = 'executive' | 'grid' | 'focus';
export type ScoreStyle = 'numeric' | 'ring' | 'bar';
export type CopilotPresentation = 'rail' | 'inline';
