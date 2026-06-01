# LeakShield AI — Modern Privacy Command Center (v0.2.0-beta)

**Detect leaks. Prioritize risk. Clean your digital footprint.**

LeakShield AI is a premium, AI-native, and privacy-first web application designed to act as a **modern privacy command center** rather than an alarmist hacking dashboard. It helps users discover compromised credentials, public footprint exposure, dormant accounts, and active data broker listings, providing a dynamically prioritized remediation plan.

---

## 🎯 Product Objective

The goal of LeakShield AI is to empower individuals to take full control of their personal digital footprint. Rather than presenting static, scary security warnings, the platform analyzes exposure risk, prioritizes remedies based on credential reuse patterns, and translates digital threats into structured, actionable, and human-reviewed recovery tasks.

---

## 🧩 Main Modules

1. **Intake & Consent Checklist:** Mandatory consent panels enforcing authorized personal scans and explicit simulated demo warnings.
2. **Executive Privacy Dashboard:** Consolidated dashboard rendering the dynamic Privacy Exposure Score, explanatory factors, trend deltas, active progress dials, and a prominent *Top 3 Urgent Actions* panel.
3. **Breach Intelligence Monitor:** Authenticated breach registry cross-referencing compromised databases (e.g., Have I Been Pwned API) with secure local state.
4. **Public Footprint Scanner:** Interactive grid tracking social media exposures, corporate biographies, and exposed contacts in public code repository commits.
5. **AI Remediation Copilot:** Right-hand workspace sequencing a Today / This Week / Later roadmap and an automated **CCPA/GDPR/ARCO Deletion Letter Drafter** backed by Gemini.
6. **Privacy Task Board:** Click-to-advance Kanban board (`Pending` ➔ `In Progress` ➔ `Sent` ➔ `Resolved`) that reactively updates the application score and stores tasks in Firestore.
7. **Trust Center:** Dynamic operational status indicator (**"Modo Real Protegido"** vs **"Modo Demo Local"**), security toggles, local obfuscation sandbox, and technical boundary declarations.

---

## 🤖 AI-Native Experience

Unlike generic security dashboards, LeakShield AI features deep AI integration across all UI components:
* **Exposure Analyst & Prioritizer:** Detail cards display context-aware AI analyses detailing *Why this matters* (e.g., SIM-swapping risks) and *Suggested actions* (e.g., password rotations).
* **Risk Reduced Chipsets:** Dedicated chips display exact score impacts (`trending-up` style) to show the value of completing each task.
* **Human-in-the-loop letters:** The CCPA/ARCO draft letters are pre-filled by the copilot and presented for manual human review and verification, never sent automatically.

---

## 🛡️ Security Hardening (v0.2.0)

In the **v0.2.0-private-beta-security-hardening** release, the system has undergone strict cibersecurity hardening aligned with OWASP Top 10 API Security guidelines:
* **Serverless Token Verification:** Direct serverless endpoint calls to `/api/breach` and `/api/ai` are rejected unless authorized by a cryptographically signed active Firebase ID token sent via `Authorization: Bearer <token>`.
* **Dynamic CORS Whitelisting:** Strict CORS controls restrict serverless endpoint access exclusively to domains specified in the `ALLOWED_ORIGINS` whitelist.
* **IP/UID Rate Limiting:** A custom, ephemeral rate limiting engine protects server endpoints from brute-force queries and budget-abuse (15 queries/min for breaches, 10 queries/min for AI).
* **PII Log Masking:** All telemetry and server logs sanitize user emails (e.g., `jo***co@techflow.io`) to prevent logs leakage.
* **Strict Firestore Isolation:** Access controls via `firestore.rules` isolate client transactions so authenticated users can strictly read/write their own profiles and tasks.
* **Sovereign Local Obfuscation:** Exaggerated encryption claims (like "Quantum XOR") have been replaced with transparent local obfuscation processes that prevent local data leakage.

---

## 🏗️ Architecture & Layout

The project follows a clean, modular React TypeScript architecture:

```text
src/
  ├── app/                  # App shell, navigation routing, and state definitions
  ├── components/           # Reusable component primitives (layout, ui)
  ├── data/                 # Separated mock data layers (demo persona, breaches, tasks)
  ├── features/             # Context-isolated domain feature components
  ├── lib/                  # Localized engines, risk scoring rules, and generators
  ├── services/             # Dynamic backend services with token extraction
  └── styles/               # CSS and custom glassmorphism styles
api/                        # Vercel Serverless Endpoints
  ├── _lib/                 # Server-side auth, rate limiting, and log masking helpers
  ├── breach.ts             # Hardened breach proxy endpoint
  └── ai.ts                 # Hardened Gemini AI proxy endpoint
```

---

## ⚙️ Tech Stack & Packages

* **Frontend Framework:** React 18.3
* **Build System:** Vite 5.2
* **Programming Language:** TypeScript 5.2
* **Styling Engine:** Tailwind CSS 3.4 & PostCSS
* **Backend Platform:** Vercel Serverless Functions
* **Backend Verification:** Firebase Admin SDK (`firebase-admin`)
* **Database & Auth:** Firebase Auth & Cloud Firestore

---

## 🚀 Installation & Local Running

1. Clone the repository locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Firebase configuration keys, HIBP API Key, and Gemini API Key.
4. Run the local development server:
   ```bash
   npm run dev
   ```

---

## 🛑 Private Beta Constraints

* **Demonstration Scope:** No real data broker APIs are contacted (as data brokers do not provide public APIs for automated purges). Opt-out request letters are generated locally for human dispatch.
* **Modo Demo Local vs Modo Real Protegido:** If a user is not signed in via Firebase, the system automatically degrades to a safe offline local-first fallback mode utilizing pre-compiled demo assets.

---

## 🚫 Ethical & Abuse Prevention Disclaimer

LeakShield AI is strictly designed to assist individuals in authorized personal privacy hygiene scans. **Under no circumstances** may this application be used to stalk, harass, dox, or investigate third parties without their explicit, authenticated consent. The AI outputs serve as supportive recommendations and do not constitute definitive legal, security, or compliance counsel.
