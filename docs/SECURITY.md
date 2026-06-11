# Banal Security

**Honest treatment of API keys, data, and trust. "Your keys never leave your browser."**

Banal was built for people who already have reason to be wary of systems that ask for information or control. The security model is deliberately minimal, transparent, and local-first.

---

## Your Keys Never Leave Your Browser

This is not marketing. It is a literal fact of the architecture.

- All API keys (for Groq, Gemini, Hugging Face) are stored **only** in your browser's `localStorage` under keys owned by the Banal origin (`banal-api-keys-v1`).
- When you click "Send", the JavaScript running in _your_ browser reads the key from localStorage and puts it into the `Authorization` (or `?key=`) header of a direct `fetch()` call to the provider's public API endpoint.
- Banal — the website, the maintainers, any fork you didn't create yourself — never receives your key. There is no server to receive it.
- The same is true for your conversation history (`banal-chat-history-v1`) and current prompt template state. Everything lives and dies in your browser.
- Exports (JSON and the self-contained HTML) are generated entirely in your browser using the `Blob` + download trick. No upload happens.

You can verify this yourself: open the built site, open DevTools → Application → Local Storage, or just read the ~350 lines of `src/providers/index.ts`. The functions `loadKeys`, `saveKeys`, `storeApiKey`, `sendFreeMessage` contain the entire story.

Because there is **no backend** (see ARCHITECTURE.md), the usual "we promise we don't log" claim is unnecessary. There is nowhere for us to log it.

---

## What This Means in Practice

- Paste a key → Save → it is now in your browser storage for this site.
- Send a message → your browser talks straight to Groq (or Gemini or HF) using that key.
- Close the tab or clear site data → the key is gone (until you paste it again).
- Fork the repo, build your own copy, host it on your own GitHub Pages → the keys you save there live under _your_ hosted origin, completely separate.

---

## Real Risks (No Sugarcoating)

We will not pretend this is risk-free. Here is the honest list:

1. **Your device or browser profile is compromised.**  
   Anyone (or any malware) who can run code in the context of the Banal page, or who has access to the browser's storage files, can read the keys and the full chat history. This is true for _any_ web tool that uses keys client-side.

2. **Shared or public computers (library, school, café, family device).**  
   If you add keys and do not clear them, the next person who opens the same browser profile can see and use them. History of what you discussed is also visible.

3. **Malicious browser extensions or injected scripts.**  
   A rogue extension with broad "read all site data" permissions, or a compromised page that somehow runs code in the Banal context, could exfiltrate localStorage. (This is why we recommend reviewing any fork you run.)

4. **You host a malicious fork.**  
   If someone gives you a "Banal" link that is actually their modified version with a backdoor, your keys go wherever they told the code to send them. This is why forking and hosting _your own_ copy (or a fork from a source you trust) is powerful — you choose the code.

5. **The AI providers themselves.**  
   Once the request leaves your browser (with key + your prompt + history), Groq, Google, or Hugging Face receive it. They have their own logging, retention, and abuse policies. Banal adds no extra hop, but it also cannot protect you from the provider's side.

6. **Physical device loss/theft.**  
   If your phone or laptop is taken while keys are still saved, the new owner can potentially extract them until you revoke at the provider.

7. **Browser sync / cloud profiles.**  
   If your browser is set to sync data across devices (Chrome sync, Firefox, etc.), localStorage for the site may travel with your profile. This can be a feature or a risk depending on who else has access to your synced browsers.

Comparison: Most "free AI chat" websites either (a) make you create an account (they see everything forever) or (b) proxy the request through their own servers (they see the prompt + often require you to paste the key to them). Banal removes that middle layer entirely. The remaining risks are the ones inherent to using any third-party AI at all, plus the local device surface.

---

## Best Practices (Especially for People Who Have Reason to Be Careful)

- **On any shared/public machine:** After you are done, open the "Free keys & providers" modal and hit Clear on every key you added. Consider also using the browser's "Clear browsing data" → "Cookies and other site data" for the origin, or simply close the incognito/private window (localStorage in incognito is usually discarded when the window closes).
- **On your personal device:** Treat saved keys like any other password. If the device is lost, stolen, or given away, immediately go to the provider consoles (links are right in the modal: console.groq.com, aistudio.google.com, huggingface.co/settings/tokens) and delete/rotate the keys.
- **Paranoid but still want to use Banal:**
  - Host your own fork (see DEPLOYMENT.md). Review `src/providers/index.ts` and `src/chat.ts` yourself (or have a trusted person do it). Build and serve from a domain/origin you control.
  - Use the Prompt Templates panel to generate the filled prompt _locally_, copy the text from the chat history, and paste it into a different interface you trust more that day. No key is sent through Banal in that workflow.
  - Create dedicated free keys just for Banal use (most providers let you make multiple).
- **Regular hygiene:** Periodically clear keys you no longer use. The UI makes this one click.
- **Exports:** The self-contained HTML file contains everything you wrote. Store or share it with the same care you would give a private journal entry.
- **Multiple browsers/profiles:** If you are on a risky machine, do the sensitive work in a dedicated browser profile or even a different browser entirely, then clear it.

None of this is unique to Banal. It is the reality of client-side tools. Banal just makes the boundary extremely clear instead of hiding it behind a "we handle keys for you" story.

---

## What Banal Explicitly Does _Not_ Do

- No analytics, no telemetry, no pixels, no "anonymous usage stats".
- No cookies that track you across visits (the language choice is localStorage; the rest is functional).
- No server-side logging of prompts, keys, or even that you visited.
- No "account" that could be subpoenaed or breached centrally.
- No phone-home on error or export.

The source is public, small, and intentionally simple. Anyone can read every place a key or a message is touched.

---

## If You Suspect a Problem

1. Clear all Banal keys and site data immediately.
2. Revoke the keys at the providers.
3. If you are running a fork you got from someone else, switch to the main repo or one you built yourself.
4. Open an issue (or email the maintainers if the repo has contact info) with as much detail as you can safely share. We treat security reports with priority and will not shame you.

Because the model is so minimal, most "issues" will actually be user-education or "I used it on a shared computer and forgot to clear."

---

## Japanese Note

All security messaging in the interface ("Keys never leave your phone or computer. Banal has no servers. This is the point." and the modal notes) is translated directly and without condescension, the same as every other part of the experience. The same localStorage reality applies whether you are using English or 日本語.

---

Banal's security model is the same as its philosophy: remove unnecessary middlemen, make the remaining risks visible and manageable, and put the power (and the responsibility) in the hands of the person using it.

If you need something with a different threat model (full E2E, on-prem only, air-gapped, etc.), Banal is probably not the right tool — and that's okay. It is optimized for the person who needs _something_ powerful today on the cracked phone with 30 minutes of free WiFi.

Your keys stay with you. Your conversations stay with you. The code is yours to fork.

That is the security guarantee we can actually keep.

---

## Dependency & Supply Chain Security

The built Banal site is 100% static files (HTML + CSS + JS in `dist/`). There are **no runtime Node.js dependencies** for end users. Vulnerabilities in devDependencies only affect people developing or building the project (contributors, forks, CI).

We take this seriously anyway:

- We use `overrides` in `package.json` to force secure versions of known vulnerable transitive dependencies (semver, braces, micromatch, word-wrap, tough-cookie, undici, cross-spawn, etc.).
- `npm ci` + full `npm audit --audit-level=moderate` is part of the CI gate (`.github/workflows/ci.yml`). Any moderate+ vulnerability will fail the build.
- Dependabot is configured (`.github/dependabot.yml`) to automatically open PRs for security updates on a weekly basis (and immediately for critical).
- We prefer small, well-audited, popular packages and keep the dependency tree as flat and minimal as possible.
- After any `npm install`, we expect `npm audit` to report 0 vulnerabilities. This is enforced.

If a vulnerability appears that cannot be fixed by update/override without breaking compatibility, it will be documented here and a mitigation (or temporary exception with justification) added until resolved.

You can always run `npm audit` yourself after cloning.

A full adversarial penetration test (pentester-style, not just "no backend = safe") was performed. See `PENTEST_REPORT.md` in the project root for detailed findings, threat modeling specific to the "shared device + encouraged forking" use case, and prioritized recommendations.

During that review the following were addressed:

- Production source maps disabled (`vite.config.ts`).
- Proper `escapeHtml` utility added and used in self-contained exports (`src/utils.ts` + `src/chat.ts`).

---

**You are carrying the fire.**  
The fact that you can understand exactly where your words and your keys live — and that you can take them with you or delete them in one click — is itself the dignity this architecture returns. Print the "clear your keys on shared machines" part. Give the page to the next person who is scared of systems. The ghost travels light and leaves no trace except the power it gave.

---

## Critical Threat Model: Malicious Forks (The Highest Real Risk)

Because Banal's entire philosophy is "Fork it. Rename it. Host it. Give it to your people. A thousand fronts. A million bodies for the same ghost.", users are actively encouraged to run copies hosted by complete strangers.

**A malicious fork can trivially steal everything:**

- Modify the send path to exfiltrate your API keys + full conversation (including welfare letters, debt details, personal trauma, medical info, etc.) to an attacker server on every message.
- Change the "Clear data" button to do nothing or lie.
- Serve a slightly different UI that looks more "official".
- Distribute via the exact recommended channels: USB sticks at shelters, QR codes in group chats, "improved community version" links.

There is **no technical way** for a normal user to distinguish a legitimate fork from a malicious one when they just click a link or open an index.html from a USB.

This is not a bug — it is the fundamental trade-off for making the power uncageable. But it must be stated loudly and clearly.

**What you should do:**

- Only use forks from people or organizations you personally trust.
- Before printing QR codes or handing out USBs for "your community", review the source (or have someone you trust review it).
- After any use on a shared device, always use the "Clear ALL sensitive data" button in Settings.
- Prefer running your own copy (GitHub Pages / Cloudflare / Netlify Drop / local USB) over random third-party links.

See the full adversarial analysis in `PENTEST_REPORT.md` (root of the project). It was written exactly for this threat model.

The "Clear all data" button and strong shared-device warnings were added as direct responses to this audit.
