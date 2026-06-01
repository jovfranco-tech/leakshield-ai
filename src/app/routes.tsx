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
  { group: "Monitor", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "identity", label: "Identity Intake", icon: "fingerprint" },
  ]},
  { group: "Findings", items: [
    { id: "breaches", label: "Breach Intelligence", icon: "breach", badge: "4", crit: true },
    { id: "footprint", label: "Public Footprint", icon: "globe", badge: "6" },
    { id: "brokers", label: "Data Brokers", icon: "building", badge: "2" },
  ]},
  { group: "Act", items: [
    { id: "copilot", label: "AI Copilot", icon: "sparkles" },
    { id: "tasks", label: "Task Board", icon: "kanban", badge: "9" },
  ]},
  { group: "Settings", items: [
    { id: "trust", label: "Trust Center", icon: "shield-check" },
  ]},
];

export const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  identity: "Identity Intake",
  breaches: "Breach Intelligence",
  footprint: "Public Footprint",
  brokers: "Data Brokers",
  copilot: "AI Copilot",
  tasks: "Task Board",
  trust: "Trust Center",
};

export const ONBOARDING_VIEWS = ["landing", "consent", "intake"];
export type ViewType = 'landing' | 'consent' | 'intake' | 'dashboard' | 'identity' | 'breaches' | 'footprint' | 'brokers' | 'copilot' | 'tasks' | 'trust';
export type DashboardLayout = 'executive' | 'grid' | 'focus';
export type ScoreStyle = 'numeric' | 'ring' | 'bar';
export type CopilotPresentation = 'rail' | 'inline';
