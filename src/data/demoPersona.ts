import { Profile, PrivacyScore } from '../types/privacy';

export const demoProfile: Profile = {
  name: "Alex Rivera",
  initials: "AR",
  location: "Mexico City, MX",
  emails: ["alex.rivera@example.com", "work.alias@example.com"],
  usernames: ["alexrivera", "arivera_tech"],
  phone: "+52 ••• ••• ••12",
  memberSince: "May 2026",
};

export const initialScore: PrivacyScore = {
  value: 72, // The prompt requested initial score: 72/100
  grade: "Fair",
  trend: 7,
  updated: "2 hours ago",
  bands: [
    { label: "Critical", min: 0,  max: 39, color: "var(--crit)" },
    { label: "At risk",  min: 40, max: 59, color: "var(--high)" },
    { label: "Fair",     min: 60, max: 74, color: "var(--med)"  },
    { label: "Good",     min: 75, max: 89, color: "var(--teal)" },
    { label: "Strong",   min: 90, max: 100, color: "var(--ok)"  },
  ],
  factors: [
    { label: "Active critical breach", impact: -14, kind: "breach", detail: "ConnectHub credentials exposed and not yet rotated." },
    { label: "Reused password detected", impact: -10, kind: "password", detail: "Same password appears across 2 breached services." },
    { label: "Home address publicly listed", impact: -6, kind: "footprint", detail: "Address found in 1 people-directory listing." },
    { label: "Data-broker listings", impact: -3, kind: "broker", detail: "2 brokers list your profile." },
    { label: "Inactive accounts", impact: -3, kind: "oldaccount", detail: "3 dormant accounts widen your attack surface." },
    { label: "2FA on primary email", impact: 8, kind: "credit", detail: "Already enabled — keeps this from dropping further.", credit: true },
  ],
};
