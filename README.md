# LeakShield AI — Modern Privacy Command Center

**Detect leaks. Prioritize risk. Clean your digital footprint.**

LeakShield AI is a premium, AI-native, and privacy-first web application designed to act as a **modern privacy command center** rather than an alarmist hacking dashboard. It helps users discover compromised credentials, public footprint exposure, dormant accounts, and active data broker listings, providing a dynamically prioritized remediation plan.

---

## 🎯 Product Objective

The goal of LeakShield AI is to empower individuals to take full control of their personal digital footprint. Rather than presenting static, scary security warnings, the platform analyzes exposure risk, prioritizes remedies based on credential reuse patterns, and translates digital threats into structured, actionable, and human-reviewed recovery tasks.

---

## 🧩 Main Modules

1. **Intake & Consent Checklist:** Mandatory consent panels enforcing authorized personal scans and explicit simulated demo warnings.
2. **Executive Privacy Dashboard:** Consolidated dashboard rendering the dynamic Privacy Exposure Score, explanatory factors, trend deltas, active progress dials, and a prominent *Top 3 Urgent Actions* panel.
3. **Breach Intelligence Master-Detail:** Visual breach registry highlighting compromised databases (e.g., ConnectHub, DevForum), severity categories, exposed classes, and recommended action steps.
4. **Public Footprint Scanner:** Interactive grid tracking social media exposures, corporate biographies, and exposed contacts in public code repository commits.
5. **AI Remediation Copilot:** Right-hand workspace sequencing a Today / This Week / Later roadmap and an automated **CCPA/GDPR/ARCO Deletion Letter Drafter**.
6. **Privacy Task Board:** Click-to-advance Kanban board (`Pending` ➔ `In Progress` ➔ `Sent` ➔ `Resolved`) that reactively updates the application score.
7. **Trust Center:** Security toggles and complete technical boundary declarations.

---

## 🤖 AI-Native Experience

Unlike generic security dashboards, LeakShield AI features deep AI integration across all UI components:
* **Exposure Analyst & Prioritizer:** Detail cards display context-aware AI analyses detailing *Why this matters* (e.g., SIM-swapping risks) and *Suggested actions* (e.g., password rotations).
* **Risk Reduced Chipsets:** Dedicated chips display exact score impacts (`trending-up` style) to show the value of completing each task.
* **Human-in-the-loop letters:** The CCPA/ARCO draft letters are pre-filled by the copilot and presented for manual human review and verification, never sent automatically.

---

## 🏗️ Architecture & Layout

The project follows clean, modular React TypeScript architecture:

```text
src/
  ├── app/                  # App shell, navigation routing, and state definitions
  ├── components/           # Reusable component primitives (layout, ui)
  ├── data/                 # Separated mock data layers (demo persona, breaches, tasks)
  ├── features/             # Context-isolated domain feature components
  ├── lib/                  # Localized engines, risk scoring rules, and generators
  ├── services/             # Simulated data fetching layer (API-ready wrappers)
  └── styles/               # CSS and tailwind variable layers
```

---

## ⚙️ Tech Stack & Packages

* **Frontend Framework:** React 18.3 (Component-driven UI hooks)
* **Build System:** Vite 5.2 (Fast compilation & HMR)
* **Programming Language:** TypeScript 5.2 (Strict compiler typings)
* **Styling Engine:** Tailwind CSS 3.4 & PostCSS (Harmonious custom charcoal/teal themes)
* **Scalable Icons:** Lucide-React SVG path wrappers

---

## 🚀 Installation Guide

Setting up LeakShield AI locally takes under a minute:

1. Clone the repository to your local directory.
2. Open your terminal inside the project root directory.
3. Execute the installation command:
   ```bash
   npm install
   ```

---

## 🛠️ Available Scripts

Once dependencies are installed, you can execute these commands:

* **Run Local Development Server:**
  ```bash
  npm run dev
  ```
  Launches the Vite dev server locally.
* **Verify TypeScript Typings:**
  ```bash
  npx tsc --noEmit
  ```
  Runs strict, compile-level type checking.
* **Compile Production Bundle:**
  ```bash
  npm run build
  ```
  Compiles and bundles optimized assets into `/dist` in under a second.
* **Preview Production Build:**
  ```bash
  npm run preview
  ```
  Runs a local preview of the production-compiled dist folder.

---

## 📊 Version Status (`v0.1.0-ai-native-demo`)

This release represents a stable, audited frontend demonstration prototype. It is fully responsive, contains zero hardcoded keys, passes all type-safety standards, and operates with a fully dynamic local state scoring engine.

---

## 🛑 Demo Limits

* **Simulated Data Only:** Every data compromise, broker listing, and profile in this version is completely fictional (featuring demo persona Alex Rivera from Mexico City).
* **Zero Persistent Cookies:** Monitored identifiers and Kanban progress live ephemerally in React state memory. A manual browser refresh resets all states.
* **No Real-World Submissions:** Opt-out deletion request letters are drafted as Blueprints. The "Queue for review" action is a simulated callback.

---

## 🔒 Privacy & Security Policies

* **Zero Plaintext Passwords:** LeakShield AI never asks for, captures, stores, or transmits user passwords.
* **Scrubbed Form Inputs:** Intake fields are defensively protected against XSS injection attempts by stripping out HTML tag symbols (`<`, `>`) and clamping inputs to `80` characters maximum.
* **Server-Side API Key Safety:** Google Search Custom Search, Vertex AI Gemini, and Have I Been Pwned API keys reside strictly server-side, never exposed to client-side bundles.

---

## 🔮 Future Serverless Integrations

When connecting LeakShield AI to live backend databases (Firebase/Supabase) and real-world security APIs:

1. **k-Anonymity password checks:** To check password exposure securely, implement SHA-1 password hashing locally, send *ONLY* the first 5 characters to the backend `/api/pass-check` serverless function, and perform suffix matching locally.
2. **Server-Side AI SDK Invocations:** Secure the Deletion letter drafting by executing Vertex AI prompt assemblies inside rate-limited backend endpoints, streaming responses via Server-Sent Events (SSE).

---

## 🚫 Ethical & Abuse Prevention Disclaimer

LeakShield AI is strictly designed to assist individuals in authorized personal privacy hygiene scans. **Under no circumstances** may this application be used to stalk, harass, dox, or investigate third parties without their explicit, authenticated consent. The AI outputs serve as supportive recommendations and do not constitute definitive legal, security, or compliance counsel.
