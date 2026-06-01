# Changelog

All notable changes to the **LeakShield AI** project will be documented in this file.

---

## [v0.1.0-ai-native-demo] - 2026-06-01

This represents the initial stable release of the **LeakShield AI** personal digital footprint command center as a premium, AI-native demonstration prototype.

### 🚀 Added Features
* **Modular React + TypeScript Architecture:** Refactored the single-file prototype into an enterprise-grade folder layout (`src/app`, `src/features`, `src/components`, `src/services`, `src/lib`).
* **Executive Privacy Dashboard:** Features dynamic exposure scoring, scoring explanation factors, remediation progress metrics, high-risk data tracking, and a prominent *Top 3 Urgent Actions* panel.
* **Breach Intelligence Master-Detail:** Visual master-detail breach list with severity badges, verified compromise classes, and dynamic risk reduction summaries.
* **Public Footprint Scanner:** Tracks social media visibility, exposed public repository commits, and active broker listings.
* **AI Remediation Copilot:** Integrated context-aware rail with dynamic Today / This Week / Later Plan sequencing and an **AI Deletion Request Drafter** supporting CCPA, GDPR, ARCO, and Generic scopes.
* **Trust Center & Data Controls:** Added user-controlled toggles (monitoring controls, session limits) and detailed cybersecurity boundary disclosures (k-anonymity checks, serverless proxy definitions).
* **Kanban Task Board:** Fully reactive, click-to-advance Kanban board (`Pending` ➔ `In Progress` ➔ `Sent` ➔ `Resolved`) that dynamically updates the global Privacy Exposure Score.

### 🛡️ Security, OWASP-lite & AI Safeguards
* **Defensive Input Sanitization:** Integrated regex-based HTML bracket stripping (`/[<>]/g`) and strict `maxLength={80}` constraints in `IntakeScreen.tsx` inputs to prevent script injections.
* **Unified AI Indicators:** Injected consistent **Recommended by AI**, **Why this matters**, **Risk reduced if completed**, and **Human review required** banners across dashboard cards, breach details, and copilot letter drafts.
* **Ethics & Abuse Prevention:** Hard-hardened onboarding checkpoints to explicitly restrict telemetry inputs to authorized, own identifiers, fully prohibiting third-party doxxing or stalking use cases.
* **Secrets Sanity Audit:** Verified zero hardcoded Vertex AI/Gemini or HIBP credentials exist in comments or client scripts.
* **Obsolete File Clean-up:** Permanently deleted all legacy Babel/CDN `.jsx` script files from `src/`.

### ⚡ Technical Quality
* Verified compilation safety: **0 compilation errors or type warnings** in TypeScript (`tsc --noEmit`).
* Highly optimized Vite production compile, code-splitting bundles to run cleanly under **280 kB**.
