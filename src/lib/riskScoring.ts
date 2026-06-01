import { PrivacyScore, ScoreFactor, Task } from '../types/privacy';

export function calculateScore(tasks: Task[]): PrivacyScore {
  let value = 100;
  const factors: ScoreFactor[] = [];

  // 1. ConnectHub breach task (t1)
  const t1 = tasks.find(t => t.id === 't1');
  const isConnectHubPending = t1 ? t1.status !== 'Resolved' : true;
  if (isConnectHubPending) {
    value -= 14;
    factors.push({
      label: "Active critical breach",
      impact: -14,
      kind: "breach",
      detail: "ConnectHub credentials exposed and not yet rotated."
    });
  } else {
    factors.push({
      label: "ConnectHub breach resolved",
      impact: 0,
      kind: "breach",
      detail: "Credentials rotated successfully.",
      credit: true
    });
  }

  // 2. Reused password task (t2)
  const t2 = tasks.find(t => t.id === 't2');
  const isPasswordReused = t2 ? t2.status !== 'Resolved' : true;
  if (isPasswordReused) {
    value -= 10;
    factors.push({
      label: "Reused password detected",
      impact: -10,
      kind: "password",
      detail: "Same password appears across 2 breached services."
    });
  } else {
    factors.push({
      label: "Reused password resolved",
      impact: 0,
      kind: "password",
      detail: "Credentials compartmentalized.",
      credit: true
    });
  }

  // 3. Address in ShopMart breach task (t5) or PeopleLookup directory (t6)
  const t5 = tasks.find(t => t.id === 't5');
  const isAddressExposed = t5 ? t5.status !== 'Resolved' : true;
  if (isAddressExposed) {
    value -= 6;
    factors.push({
      label: "Home address publicly listed",
      impact: -6,
      kind: "footprint",
      detail: "Address found in 1 people-directory listing."
    });
  }

  // 4. Data-broker listings (t4 and t7)
  const t4 = tasks.find(t => t.id === 't4');
  const t7 = tasks.find(t => t.id === 't7');
  const brokersPendingCount = 
    (t4 && t4.status !== 'Resolved' ? 1 : 0) + 
    (t7 && t7.status !== 'Resolved' ? 1 : 0);
  
  if (brokersPendingCount > 0) {
    const impact = -3 * brokersPendingCount;
    value += impact;
    factors.push({
      label: "Data-broker listings",
      impact,
      kind: "broker",
      detail: `${brokersPendingCount} broker${brokersPendingCount > 1 ? 's list' : ' lists'} your profile.`
    });
  }

  // 5. Inactive accounts (t6 or t8)
  const isOldAccountPending = tasks.some(t => t.module === 'Footprint' && t.status !== 'Resolved');
  if (isOldAccountPending) {
    value -= 3;
    factors.push({
      label: "Inactive accounts",
      impact: -3,
      kind: "oldaccount",
      detail: "3 dormant accounts widen your attack surface."
    });
  }

  // 6. 2FA Credit (always active)
  factors.push({
    label: "2FA on primary email",
    impact: 8,
    kind: "credit",
    detail: "Enabled — keeps your score from dropping further.",
    credit: true
  });
  value += 8;

  // Clamp score
  value = Math.max(0, Math.min(100, value));

  // Determine grade
  let grade = "Critical";
  if (value >= 90) grade = "Strong";
  else if (value >= 75) grade = "Good";
  else if (value >= 60) grade = "Fair";
  else if (value >= 40) grade = "At risk";

  return {
    value,
    grade,
    trend: 7,
    updated: "Just now",
    bands: [
      { label: "Critical", min: 0,  max: 39, color: "var(--crit)" },
      { label: "At risk",  min: 40, max: 59, color: "var(--high)" },
      { label: "Fair",     min: 60, max: 74, color: "var(--med)"  },
      { label: "Good",     min: 75, max: 89, color: "var(--teal)" },
      { label: "Strong",   min: 90, max: 100, color: "var(--ok)"  },
    ],
    factors,
  };
}
