import { PrivacyScore, ScoreFactor, Task } from '../types/privacy';

export function calculateScore(tasks: Task[]): PrivacyScore {
  let value = 100;
  const factors: ScoreFactor[] = [];

  // Check if we have any active breach tasks (both static demo tasks and dynamic real tasks)
  const t1 = tasks.find(t => t.id === 't1');
  if (t1) {
    const isConnectHubPending = t1.status !== 'Resolved';
    if (isConnectHubPending) {
      value -= 14;
      factors.push({
        label: "Filtración crítica activa",
        impact: -14,
        kind: "breach",
        detail: "Credenciales de ConnectHub expuestas y no rotadas."
      });
    } else {
      factors.push({
        label: "Filtración de ConnectHub resuelta",
        impact: 0,
        kind: "breach",
        detail: "Credenciales rotadas con éxito.",
        credit: true
      });
    }
  }

  // 2. Reused password task (t2)
  const t2 = tasks.find(t => t.id === 't2');
  if (t2) {
    const isPasswordReused = t2.status !== 'Resolved';
    if (isPasswordReused) {
      value -= 10;
      factors.push({
        label: "Contraseña reutilizada",
        impact: -10,
        kind: "password",
        detail: "La misma clave aparece en 2 servicios vulnerados."
      });
    } else {
      factors.push({
        label: "Contraseñas compartimentadas",
        impact: 0,
        kind: "password",
        detail: "Seguridad de clave resuelta.",
        credit: true
      });
    }
  }

  // 3. Address in ShopMart breach task (t5)
  const t5 = tasks.find(t => t.id === 't5');
  if (t5) {
    const isAddressExposed = t5.status !== 'Resolved';
    if (isAddressExposed) {
      value -= 6;
      factors.push({
        label: "Dirección física expuesta",
        impact: -6,
        kind: "footprint",
        detail: "Domicilio listado en 1 base de datos vulnerable."
      });
    }
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
      label: "Listado en Data Brokers",
      impact,
      kind: "broker",
      detail: `${brokersPendingCount} broker${brokersPendingCount > 1 ? 's distribuyen' : ' distribuye'} tu perfil comercial.`
    });
  }

  // 5. Inactive accounts (t6 or t8)
  const isOldAccountPending = tasks.some(t => t.module === 'Footprint' && t.status !== 'Resolved');
  if (isOldAccountPending) {
    value -= 3;
    factors.push({
      label: "Cuentas inactivas",
      impact: -3,
      kind: "oldaccount",
      detail: "Cuentas inactivas amplían tu superficie de ataque."
    });
  }

  // 6. Dynamic Real-Time Breach Tasks (v1.2.0)
  const dynamicBreachTasks = tasks.filter(t => t.id.startsWith('t_'));
  dynamicBreachTasks.forEach(t => {
    const isPending = t.status !== 'Resolved';
    if (isPending) {
      const impact = t.priority === 'Critical' ? -14 : t.priority === 'High' ? -10 : -6;
      value += impact;
      factors.push({
        label: t.title,
        impact,
        kind: "breach",
        detail: `Filtración activa con nivel de riesgo ${t.priority}.`
      });
    } else {
      factors.push({
        label: `${t.title} (Rotada)`,
        impact: 0,
        kind: "breach",
        detail: "Credencial cambiada de forma segura.",
        credit: true
      });
    }
  });

  // 7. 2FA Credit (always active if there are monitored identifiers)
  const hasMonitored = tasks.length > 0;
  if (hasMonitored) {
    factors.push({
      label: "Doble factor (2FA) en correo",
      impact: 8,
      kind: "credit",
      detail: "Activado — previene secuestros de consola activa.",
      credit: true
    });
    value += 8;
  }

  // Clamp score
  value = Math.max(0, Math.min(100, value));

  // Determine grade in Spanish
  let grade = "Crítico";
  if (value >= 90) grade = "Excelente";
  else if (value >= 75) grade = "Bueno";
  else if (value >= 60) grade = "Regular";
  else if (value >= 40) grade = "En riesgo";

  return {
    value,
    grade,
    trend: 7,
    updated: "Hace un momento",
    bands: [
      { label: "Crítico", min: 0,  max: 39, color: "var(--crit)" },
      { label: "En riesgo",  min: 40, max: 59, color: "var(--high)" },
      { label: "Regular",     min: 60, max: 74, color: "var(--med)"  },
      { label: "Bueno",     min: 75, max: 89, color: "var(--teal)" },
      { label: "Excelente",   min: 90, max: 100, color: "var(--ok)"  },
    ],
    factors,
  };
}
export default calculateScore;
