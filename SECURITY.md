# Security & Privacy Policy — LeakShield AI (v0.2.0-beta)

At LeakShield AI, we treat security and user privacy not as a policy disclaimer, but as a core architectural constraint. In version **v0.2.0-private-beta-security-hardening**, the application has been engineered to secure both serverless endpoints and client-side storage compartments against standard OWASP and GDPR/CCPA vulnerabilities.

---

## 🔒 Security Architecture Controls

To ensure absolute client safety during public-facing pilots, the application implements the following strict boundaries:

### 1. Cryptographically Authenticated Endpoints
Every serverless function in `api/` requiring remote service coordination is protected against unauthorized invocation:
* Direct anonymous calls to `/api/breach` and `/api/ai` are rejected with a `401 Unauthorized` status.
* The frontend extracts an active session token using `auth.currentUser.getIdToken()` and attaches it via the `Authorization: Bearer <token>` header.
* The serverless gateway verifies the signature, origin, and expiration of the token using the `firebase-admin` SDK.

### 2. IP & UID Rate Limiting (DoS Defense)
To prevent API budget abuse and denial of service attacks:
* Endpoint queries are rate-limited at the gateway layer (15 requests/min for breaches, 10 requests/min for AI queries).
* Violations return a `429 Too Many Requests` status, accompanied by a clean warning message.

### 3. Hardened CORS Whitelisting
To prevent cross-site request forgery and unauthorized API usage:
* The serverless gateway enforces origin restriction based on a dynamic whitelist loaded via the `ALLOWED_ORIGINS` environment variable.
* Preflight requests return exact headers, blocking cross-origin malicious scripts from reading server outputs.

### 4. PII Telemetry Obfuscation & Log Masking
To prevent the leakage of Personally Identifiable Information (PII) to cloud provider consoles (Vercel):
* Real email addresses are enmascarados (e.g., `jo***co@techflow.io`) inside all serverless function execution logs.
* No internal exceptions, stack traces, or raw API secrets are printed or returned to the client during Gemini or Have I Been Pwned query failures.

### 5. Strict Firestore Access Control Rules
Client transactions are isolated directly at the database engine level via `firestore.rules`:
* Read and write accesses to `/users/{userId}` are permitted only if `request.auth.uid == userId`.
* Subcollection entries (such as tasks) inherit this constraint under `/users/{userId}/tasks/{taskId}`.
* Deep type checks and string size limits prevent schema abuse and resource exhaustion.

### 6. Transparent Local Obfuscation
* Plain-text master password storage is prohibited.
* Ephemeral local caches utilize `sessionStorage` by default. Write-through to `localStorage` is only triggered if the user explicitly enables persistent storage settings.
* Data stored in local storage uses local obfuscation (masking sensitive indices) rather than claiming dynamic encryption capabilities.

---

## 🔑 k-Anonymity Credential Verification Protocol

For Have I Been Pwned queries, LeakShield AI guarantees that full passwords or full hashes never leave the client browser. Under the k-anonymity protocol:

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

By querying the REST service using only the **first 5 hexadecimal characters** of the SHA-1 password hash, we guarantee that:
* Neither our backend proxy nor the provider ever discovers the user's password or full hash.
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

1. **Vulnerability Isolation:** Please do not open public GitHub issues for security bugs.
2. **Response Time:** We aim to review and acknowledge vulnerability reports within **48 hours** and provide a patch timeline.
