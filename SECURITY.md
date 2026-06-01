# Security Policy — LeakShield AI

LeakShield AI is built as a **privacy-first, client-ephemeral demonstration command center**. We treat security not as a policy disclaimer, but as a core architectural constraint.

---

## 🔒 Security Architecture Boundaries

To ensure absolute client safety during public-facing demonstrations, the application implements the following strict boundaries:

1. **Zero Hardcoded Secrets:** No API keys (for Google Gemini, Vertex AI, Have I Been Pwned, or search scrapers) reside in the client-side bundles or source scripts.
2. **Abstract Service Layers:** Third-party integrations in `src/services/` are decoupled using interface mockups, designed to connect exclusively via secure serverless proxies.
3. **No Password Ingestion:** LeakShield AI never asks for or stores plaintext passwords. The intake module only monitors public identifiers (email, username, country).
4. **Zero Persistent Storage:** Monitored profiles and remediation states reside ephemerally in React state and browser memory, completely avoiding local storage tracking.

---

## 🔑 k-Anonymity Credential Verification Protocol

For future integrations with the **Have I Been Pwned** API, LeakShield AI is structurally prepared to implement the **k-anonymity protocol**:

```text
  [User Password Input] ──► SHA-1 Hash ──► Extract Prefix (First 5 Hex Chars)
                                                     │
                                            Query HIBP API via Proxy
                                                     │
  [Browser Local Memory] ◄── Receive Suffixes ◄──────┘
            │
  Perform local exact match.
  Full password or full hash never leaves the browser.
```

By querying the Have I Been Pwned REST service using only the **first 5 hexadecimal characters** of the SHA-1 password hash, we guarantee that:
* Neither our backend proxy nor HIBP ever discovers the user's password or full hash.
* All matching of the remaining hash suffix happens locally in the browser memory.

---

## 🚫 Abuse Prevention & Prohibited Actions

LeakShield AI is designed strictly for **authorized personal privacy reviews and exposure hygiene**. 

* **Authorized Data Only:** Users must only check accounts, emails, or usernames that they own or have explicit authorization to monitor.
* **Prohibited Use Cases:** Utilizing LeakShield AI for stalking, doxxing, investigating third parties without consent, or gathering intelligence on public figures is strictly prohibited.
* **No Law Automation:** Generated deletion requests (ARCO, CCPA, GDPR) are drafted as helpful blueprints. Real-world legal requests must undergo human review before dispatch.

---

## 🐛 Reporting a Vulnerability

If you discover a potential security vulnerability in this repository, please report it immediately:

1. **Email:** Please do not open public GitHub issues for security bugs. Email the repository maintainer directly.
2. **Response Time:** We aim to review and acknowledge vulnerability reports within **48 hours** and provide a patch timeline.
