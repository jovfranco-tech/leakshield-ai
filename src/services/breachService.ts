import { BreachFinding, HighRiskDataClass } from '../types/privacy';
import { auth } from '../lib/firebase';

export const breachService = {
  /**
   * Fetch all real-time breaches matching a monitored email identifier
   */
  async getBreaches(email: string): Promise<BreachFinding[]> {
    if (!email || !email.trim()) return [];

    const cleanEmail = email.trim();
    let rawBreaches: any[] = [];

    // Fetch active Firebase Auth Session ID Token securely (v0.2.0)
    const user = auth.currentUser;
    let token = "";
    if (user) {
      try {
        token = await user.getIdToken();
      } catch (err) {
        console.error("[breachService] Failed to obtain Firebase ID Token:", err);
      }
    }

    // Hybrid flow: Check if we are running in local DEV environment and VITE_HIBP_API_KEY is available
    const localApiKey = (import.meta as any).env.VITE_HIBP_API_KEY;
    const isDev = (import.meta as any).env.DEV;

    if (isDev && localApiKey && localApiKey !== "FakeKeyPlaceholder") {
      console.log("[breachService] DEV Mode: Querying HaveIBeenPwned API directly from the client...");
      try {
        const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(cleanEmail)}?truncateResponse=false`;
        const res = await fetch(url, {
          headers: {
            'hibp-api-key': localApiKey,
            'user-agent': 'LeakShield-AI-SaaS'
          }
        });
        
        if (res.status === 404) {
          // 404 means clean account, no breaches
          rawBreaches = [];
        } else if (res.ok) {
          rawBreaches = await res.json();
        } else {
          console.error(`[breachService] Direct client query failed with status ${res.status}`);
        }
      } catch (err) {
        console.error("[breachService] Direct client query exception:", err);
      }
    } else {
      console.log("[breachService] Production Mode: Querying secure serverless proxy endpoint...");
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`/api/breach?email=${encodeURIComponent(cleanEmail)}`, {
          headers
        });
        if (res.status === 404) {
          rawBreaches = [];
        } else if (res.ok) {
          rawBreaches = await res.json();
        } else {
          console.error(`[breachService] Serverless proxy query failed with status ${res.status}`);
        }
      } catch (err) {
        console.error("[breachService] Serverless proxy query exception:", err);
      }
    }

    // Map raw HIBP breaches dynamically to BreachFinding[]
    return rawBreaches.map((b: any, idx: number) => {
      const dClasses = b.DataClasses || [];
      const hasPlainPassword = dClasses.some((d: string) => /password/i.test(d) && !/hash/i.test(d));
      const hasPasswordHash = dClasses.some((d: string) => /hash/i.test(d) || /password/i.test(d));
      const hasFinancial = dClasses.some((d: string) => /financial|credit/i.test(d));

      const severity: BreachFinding['severity'] = hasPlainPassword || hasFinancial
        ? 'Critical'
        : hasPasswordHash
        ? 'High'
        : dClasses.length > 3
        ? 'Medium'
        : 'Low';

      const priority = severity === 'Critical' ? 1 : severity === 'High' ? 2 : severity === 'Medium' ? 3 : 4;

      const title = b.Title || b.Name || 'Filtración de Datos';
      const cleanDesc = (b.Description || '')
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .slice(0, 160) + '...';

      return {
        id: `b_${b.Name.toLowerCase()}_${idx}`,
        service: title,
        category: b.Domain || 'Servicio Web',
        logo: title.charAt(0).toUpperCase() || '🛡️',
        date: b.BreachDate ? new Date(b.BreachDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Fecha desconocida',
        discovered: b.AddedDate ? `detectado el ${new Date(b.AddedDate).toLocaleDateString('es-ES')}` : 'hace poco',
        severity,
        priority,
        records: b.PwnCount ? `${(b.PwnCount / 1000000).toFixed(1)}M cuentas` : 'Cantidad desconocida',
        verified: !!b.IsVerified,
        status: 'Pending' as const,
        dataClasses: dClasses,
        affectedEmail: cleanEmail,
        action: severity === 'Critical'
          ? `Rotar la contraseña de ${title} de inmediato y activar autenticación de doble factor (2FA) para proteger tu cuenta.`
          : severity === 'High'
          ? `Cambiar tu contraseña en ${title} a la brevedad y verificar que no haya sido reutilizada en otros servicios.`
          : `Activar filtros de spam y monitorear intentos sospechosos de phishing en tu bandeja de entrada.`,
        ai: cleanDesc,
        riskReduced: severity === 'Critical' ? '+14 pts' : severity === 'High' ? '+10 pts' : severity === 'Medium' ? '+6 pts' : '+3 pts'
      };
    });
  },

  /**
   * Fetch compromised data classes dynamically compiled from active breaches
   */
  getHighRiskData(breaches: BreachFinding[]): HighRiskDataClass[] {
    const counts: Record<string, number> = {};
    breaches.forEach(b => {
      b.dataClasses.forEach(d => {
        let label = d;
        if (/password/i.test(d)) label = "Contraseñas";
        else if (/email/i.test(d)) label = "Correos electrónicos";
        else if (/username/i.test(d)) label = "Nombres de usuario";
        else if (/phone/i.test(d)) label = "Números de teléfono";
        else if (/name/i.test(d)) label = "Nombres completos";
        else if (/address/i.test(d)) label = "Direcciones físicas";
        else if (/financial/i.test(d) || /bank/i.test(d)) label = "Datos financieros";
        
        counts[label] = (counts[label] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([label, count]) => {
        const level: HighRiskDataClass['level'] = label === "Contraseñas" || label === "Datos financieros"
          ? 'Critical'
          : label === "Números de teléfono" || label === "Direcciones físicas"
          ? 'High'
          : 'Medium';

        return {
          label,
          count,
          note: `Expuesto en ${count} filtración${count > 1 ? 'es' : ''} activa${count > 1 ? 's' : ''}.`,
          level
        };
      })
      .sort((a, b) => b.count - a.count);
  },

  /**
   * Simulate a password rotation trigger
   */
  async rotatePassword(breachId: string): Promise<boolean> {
    console.log(`[breachService] Triggered password rotation sequence for breach: ${breachId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
};
export default breachService;
