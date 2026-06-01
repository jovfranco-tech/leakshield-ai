export function generateDeletionRequest(
  target: string, 
  type: 'ARCO' | 'GDPR' | 'CCPA' | 'Generic' = 'CCPA',
  userName: string = 'Alex Rivera',
  location: string = 'Mexico City, MX'
): string {
  const introMap = {
    CCPA: "I am writing to submit a request under the California Consumer Privacy Act (CCPA) to delete and suppress my personal data.",
    GDPR: "I am writing to exercise my Right to Erasure (Article 17 of the GDPR) and request the immediate deletion of my personal data.",
    ARCO: "I am writing to exercise my ARCO Rights (specifically the Right to Cancellation and Opposition) regarding my personal data.",
    Generic: "I am writing to request the permanent deletion and suppression of my personal information from your records."
  };

  const legalRefMap = {
    CCPA: "Under CCPA, I am requesting that you delete all personal information collected from or about me, and instruct any service providers to do the same.",
    GDPR: "Pursuant to GDPR Article 17, please delete all records concerning me. If you have shared this data with third parties, you must take reasonable steps to inform them of this erasure request.",
    ARCO: "Pursuant to Ley Federal de Protección de Datos Personales, please cancel all my records from your public registries and files.",
    Generic: "Please suppress my profile from all search utilities, resale databases, and public directory listings."
  };

  return `To the Privacy / Data Protection Team at ${target},

${introMap[type] || introMap.Generic}

Identifiers (provided for verification and matching purposes only):
  • Name: ${userName}
  • Region/Location: ${location}

Requested Actions:
  1. ${legalRefMap[type] || legalRefMap.Generic}
  2. Suppress my identifier vectors from all public search indexes and third-party data broker exports.
  3. Send a written confirmation of completion within the statutory timeline.

This request is made directly by the data subject regarding their own personal data.

Regards,
${userName}

---
AI-generated draft. Human review required.`;
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
        type: "Real Email with 2FA",
        recommendation: "alex.rivera@example.com (high-trust)",
        rationale: "Use only your primary secure email with robust hardware 2FA for legal, banking, and high-trust government accounts where identity verification is required."
      };
    case 'shopping':
    case 'social':
    case 'apps':
      return {
        type: "Permanent Alias by Service",
        recommendation: "work.alias+shopping@example.com",
        rationale: "Use custom aliases for services that are prone to leaks. This isolates breaches to a single mailbox and lets you track who sold your data."
      };
    case 'newsletters':
    case 'promotions':
      return {
        type: "Masked / Disposable Email",
        recommendation: "shield.temp-1982a@leakshield.net",
        rationale: "Use temporary or dynamically generated masked emails for newsletters, content blocks, or one-off coupon signups. Burn the alias if it starts receiving spam."
      };
    default:
      return {
        type: "Dedicated Separate Mailbox",
        recommendation: "arivera.tech@external-vault.net",
        rationale: "Establish a completely separate sandbox email for developer forums, legacy discussion boards, or test accounts."
      };
  }
}
