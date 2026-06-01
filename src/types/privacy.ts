export interface Profile {
  name: string;
  initials: string;
  location: string;
  emails: string[];
  usernames: string[];
  phone: string;
  memberSince: string;
}

export interface Band {
  label: string;
  min: number;
  max: number;
  color: string;
}

export interface ScoreFactor {
  label: string;
  impact: number;
  kind: string;
  detail: string;
  credit?: boolean;
}

export interface PrivacyScore {
  value: number;
  grade: string;
  trend: number;
  updated: string;
  bands: Band[];
  factors: ScoreFactor[];
}

export interface RiskTileData {
  label: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'ok';
  value: string;
  sub: string;
  trend: number;
}

export interface RiskSummary {
  breach: RiskTileData;
  footprint: RiskTileData;
  oldAccounts: RiskTileData;
  broker: RiskTileData;
}

export interface RemediationProgress {
  resolved: number;
  inProgress: number;
  total: number;
  percent: number;
}

export interface BreachFinding {
  id: string;
  service: string;
  category: string;
  logo: string;
  date: string;
  discovered: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: number;
  records: string;
  verified: boolean;
  status: 'Pending' | 'In Progress' | 'Sent' | 'Resolved' | 'Monitor';
  dataClasses: string[];
  affectedEmail: string;
  action: string;
  ai: string;
  riskReduced?: string;
}

export interface HighRiskDataClass {
  label: string;
  count: number;
  note: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface FootprintFinding {
  id: string;
  title: string;
  type: string;
  source: string;
  visibility: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  exposes: string[];
  action: string;
  ai: string;
  riskReduced?: string;
}

export interface OldAccount {
  id: string;
  service: string;
  lastSeen: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface DataBroker {
  id: string;
  name: string;
  exposes: string[];
  status: string;
  since: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Sent' | 'Resolved' | 'Monitor';
  bucket: 'Today' | 'This Week' | 'Later';
  module: string;
  ai: boolean;
  effort: string;
}

export interface NextBestAction {
  title: string;
  why: string;
  impact: string;
  effort: string;
}

export interface PlanItem {
  id: string;
  text: string;
  impact: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface CopilotPlan {
  Today: PlanItem[];
  'This Week': PlanItem[];
  Later: PlanItem[];
}

export interface CopilotData {
  summary: string;
  nextBest: NextBestAction;
  plan: CopilotPlan;
}

export interface LogEntry {
  t: string;
  tag: string;
  time: string;
}
