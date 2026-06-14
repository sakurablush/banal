# Security Policy

## Threat Model

Banal AI is a frontend-only Single Page Application (SPA) designed for users on shared/library computers, old phones, and constrained environments. The application intentionally has **zero backend infrastructure** to eliminate attack surfaces and ensure forkability.

### Key Threat Vectors

| Vector                                         | Description                                                       | Mitigation                                             |
| ---------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| **H1** - Shared device data leakage            | `localStorage` persists API keys and chat history across sessions | Clear-all button, ephemeral mode recommended, warnings |
| **H3** - Malicious fork distribution           | Anyone can fork and host modified versions                        | Verify integrity, use trusted sources only             |
| **M2** - API key visibility in browser history | Gemini API key visible in URL query params                        | Prefer header-auth providers, documented warnings      |
| **M3** - XSS via innerHTML                     | Dynamic content injection could be exploited in forks             | CSP, escapeHtml everywhere, input sanitization         |

---

## Shared Device Usage

**This is critical for the target audience.** Many users access Banal from:

- Library/public computers
- Shared family devices
- Cracked/feature phones
- Constricted environments

### How to Use Safely on Shared Devices

1. **Always clear your data** after each session using the "Clear All Keys & History" button in Settings
2. **Incognito/private browsing mode** if available (data clears when tab closes)
3. **Never save passwords** in browser on shared devices
4. **Sign out of any AI provider accounts** after getting your free API key (the key itself is sufficient)

### Ephemeral Mode (Recommended)

When using Banal on shared devices, consider enabling ephemeral mode:

- Theme preference uses `sessionStorage` (auto-cleans on tab close)
- API keys use `localStorage` but should be cleared after use
- Chat history persists until manually cleared via "Clear All"

---

## Fork Verification Guide

Since Banal is MIT licensed and forkable by design, **only download from trusted sources**.

### Verifying Integrity

**Option 1: Official Releases**

- Download only from the official GitHub repository: `github.com/sakurablush/banal`
- Verify GPG signatures if available
- Check release checksums

**Option 2: Hash Verification**

```bash
# Compare file hashes against known-good values
sha256sum dist/assets/index-*.js
sha256sum dist/assets/style-*.css
```

**Option 3: Source Comparison**

- Review all changes in a fork before use
- Check for modifications to:
  - `src/providers/` (API key handling)
  - `src/chat.ts` (localStorage usage)
  - `src/utils.ts` (escapeHtml function)
  - Any additions of external resources

### Red Flags to Avoid

- Forks that auto-submit data to external servers
- Modified storage keys or exfiltration code
- Removed "Clear All" functionality
- Added analytics or tracking scripts
- Modified CSP or removed security measures

---

## Data Handling Disclosure

### What We Store Locally

| Data                | Storage Location | Purpose                    | Auto-Clear         |
| ------------------- | ---------------- | -------------------------- | ------------------ |
| API keys            | `localStorage`   | Enable chat with providers | No (use Clear All) |
| Chat history        | `localStorage`   | Continue conversations     | No (use Clear All) |
| Theme preference    | `sessionStorage` | Light/dark mode preference | Yes (on tab close) |
| Language preference | `localStorage`   | EN/JA language             | No                 |

### What We NEVER Do

- **Never** send your data to a Banal server (there is none)
- **Never** log your conversations
- **Never** track your usage
- **Never** require accounts or personal information

### What Providers See

When you use chat features, your prompts are sent directly to:

- Groq (`api.groq.com`)
- Google Gemini (`generativelanguage.googleapis.com`)
- Hugging Face (`router.huggingface.co`)
- OVHcloud (`oai.endpoints.kepler.ai.cloud.ovh.net`)

**Review each provider's terms** for their data handling policies.

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue (for active vulnerabilities)
2. Email security concerns to the maintainer or open a private discussion
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## Security Best Practices for Forks

If you maintain a fork:

1. **Keep CSP intact** - Do not remove or weaken Content Security Policy
2. **Preserve escapeHtml** - Ensure all user content is properly escaped
3. **Maintain Clear All** - The shared device hygiene feature must remain
4. **Review dependencies** - Audit any added packages for security issues
5. **Document changes** - Clearly state any modifications to security behavior

---

_This security policy reflects the audit findings and the project's commitment to serving vulnerable users with dignity and protection._
