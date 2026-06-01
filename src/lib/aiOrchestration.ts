export function generateDeletionRequest(
  target: string, 
  type: 'ARCO' | 'GDPR' | 'CCPA' | 'Generic' = 'CCPA',
  userName: string = 'Alex Rivera',
  location: string = 'Ciudad de México, MX'
): string {
  const introMap = {
    CCPA: "Le escribo para presentar una solicitud formal bajo la Ley de Privacidad del Consumidor de California (CCPA) para la eliminación y supresión de mis datos personales.",
    GDPR: "Le escribo para ejercer mi Derecho de Supresión (Artículo 17 del RGPD) y solicitar la eliminación inmediata de mis datos personales de sus sistemas.",
    ARCO: "Le escribo para ejercer mis Derechos ARCO (específicamente los Derechos de Cancelación y Oposición) sobre mis datos personales y registros.",
    Generic: "Le escribo para solicitar la eliminación permanente y la supresión de mi información personal de todos sus registros y bases de datos."
  };

  const legalRefMap = {
    CCPA: "Bajo la CCPA, solicito que elimine toda la información personal recopilada sobre mí y que instruya a sus proveedores de servicios a hacer lo mismo.",
    GDPR: "De conformidad con el Artículo 17 del RGPD, elimine todos los registros que me conciernan. Si ha compartido estos datos con terceros, tome medidas razonables para informarles de esta solicitud de supresión.",
    ARCO: "De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, cancele todos mis registros de sus archivos y registros públicos.",
    Generic: "Por favor, suprima mi perfil de todos los buscadores, bases de datos comerciales y listados de directorios públicos."
  };

  return `Para el Equipo de Privacidad / Protección de Datos de ${target},

${introMap[type] || introMap.Generic}

Identificadores (provistos únicamente con fines de verificación y emparejamiento):
  • Nombre: ${userName}
  • Región/Ubicación: ${location}

Acciones Solicitadas:
  1. ${legalRefMap[type] || legalRefMap.Generic}
  2. Suprimir mis vectores de identificación de todos los índices de búsqueda pública y exportaciones de data brokers externos.
  3. Enviar una confirmación de finalización por escrito dentro del plazo establecido por la ley.

Esta solicitud se realiza de forma directa por el titular en relación con sus propios datos personales.

Atentamente,
${userName}

---
Borrador generado por IA. Requiere revisión humana antes de ser enviado.`;
}

export interface AliasRecommendation {
  type: string;
  recommendation: string;
  rationale: string;
}

export function getAliasStrategy(category: string): AliasRecommendation {
  switch (category.toLowerCase()) {
    case 'banking':
    case 'government':
    case 'finance':
      return {
        type: "Correo real con 2FA",
        recommendation: "alex.rivera@example.com (alta confianza)",
        rationale: "Utiliza tu correo electrónico principal y seguro equipado con token 2FA físico para bancos, trámites gubernamentales y cuentas que requieran estricta verificación de identidad."
      };
    case 'shopping':
    case 'social':
    case 'apps':
      return {
        type: "Alias permanente por servicio",
        recommendation: "work.alias+shopping@example.com",
        rationale: "Utiliza alias personalizados para portales comerciales propensos a fugas. Esto aísla cualquier brecha a un solo buzón y te ayuda a rastrear si vendieron tus datos."
      };
    case 'newsletters':
    case 'promotions':
      return {
        type: "Correo enmascarado / desechable",
        recommendation: "shield.temp-1982a@leakshield.net",
        rationale: "Utiliza correos temporales o enmascarados generados dinámicamente para boletines, cupones o registros de una sola vez. Desecha el alias si empieza a recibir spam."
      };
    default:
      return {
        type: "Buzón sandbox dedicado",
        recommendation: "arivera.tech@external-vault.net",
        rationale: "Establece un buzón completamente separado para foros de desarrolladores, tableros de discusión antiguos o registros de prueba."
      };
  }
}
