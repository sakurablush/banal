# Security

This document describes Banal's actual security model, the data it does and
does not handle, and the threats that remain after the architectural
choices documented in [`docs/ARCHITECTURE.md`](ARCHITECTURE.md).

For a full adversarial review with threat modeling and concrete
recommendations, see [`PENTEST_REPORT.md`](../PENTEST_REPORT.md) in the
repository root.

---

## What Banal actually does

Banal is a static web app that renders a curated directory of 273 external
tools and 52 prompt templates. When you click a tool, your browser opens
that tool's own URL. Banal does not proxy, log, or process those requests
in any way.

The only network requests the Banal app itself makes on your behalf are:

- loading its own static assets (HTML, CSS, JS, fonts),
- the verifications run by the
  [`verify-tools` workflow](../.github/workflows/verify-tools.yml), which
  happen on CI infrastructure and never touch your browser.

There is no Banal-controlled server in the request path. There is no Banal
API. There is no analytics endpoint, no telemetry ping, no error reporter,
no "phone home" on load or on error.

---

## Data the browser stores locally

The app uses `localStorage` and `sessionStorage` only for things that
improve the experience of the same browser session. The full list:

| Key                              | Storage        | Purpose                                                  |
| -------------------------------- | -------------- | -------------------------------------------------------- |
| `banal-lang`                     | localStorage   | Persisted language choice (en / ja).                     |
| `banal-theme`                    | sessionStorage | Light/dark override for this tab.                        |
| `banal_saved_filters`            | localStorage   | Named filter presets per section (models, stacks, etc.). |
| `banal_custom_stacks`            | localStorage   | User-created tool stacks.                                |
| `banal_filter_analytics`         | localStorage   | Anonymous local filter-usage counts for suggestions.     |
| `banal-pt-<id>-<lang>`           | sessionStorage | Prompt-template form values (cleared when tab closes).   |
| `banal-privacy-banner-dismissed` | sessionStorage | Prompt-templates privacy banner dismissed for this tab.  |

Use **Stored data** in the site footer or header to open the Privacy panel: review what
stays in this tab vs on this device, and clear prompt drafts, saved filters,
custom stacks, or everything in one place.

`banal_filter_analytics` is the only entry that resembles "analytics". It
counts how often a filter combination is applied, locally, so the UI can
offer it as a one-click shortcut. The data never leaves the browser. It
is the same class of "I added a counter" feature you would find in a
client-side notebook; it is not telemetry.

### Tab close with prompt drafts

If you have typed in a prompt template form this tab, Banal registers a
best-effort `beforeunload` handler so the browser may show a generic
"leave site?" prompt. Browsers do not allow custom text for that dialog.
The primary UX is the Privacy panel and the dismissible banner above
Prompt Templates after your first keystroke.

You can inspect or delete any of these from the browser DevTools
(Application → Storage) at any time.

---

## Storage policy (portfolio summary)

**What we store**

| Tier          | Keys                                                                                 | Why                                                                        |
| ------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| This tab only | `banal-theme`, `banal-pt-*`, `banal-privacy-banner-dismissed`                        | Ephemeral UX: theme override, prompt drafts, banner dismiss                |
| This device   | `banal-lang`, `banal_saved_filters`, `banal_custom_stacks`, `banal_filter_analytics` | Language, named filter presets, custom stacks, anonymous suggestion counts |

**What we never store or send**

- API keys, chat history, accounts, or analytics to Banal servers (there is no backend).

**How to clear**

- Footer or header **Stored data** → Privacy panel → scoped or **Clear everything**.
- Private/incognito window for one-off use on a shared device.

The app does **not** store:

- API keys. There is no chat feature in the current release; nothing to
  key.
- Conversation history. The site does not maintain a chat log.
- Personal information. The app does not ask for a name, email, or
  account of any kind.
- Authentication tokens. There is nothing to authenticate against.

---

## What leaves your browser

When you click a tool in the directory, your browser performs a normal
navigation (or opens a new tab) to the tool's own `url` field in
`src/data/zero-key-tools.ts`. From that point on, you are subject to that
tool's own privacy policy, terms of service, and data practices. Banal
has no visibility into, and no control over, what happens there.

For each tool we link to, the
[`docs/verification/`](verification/) snapshots record the HTTP status,
the response time, and the date. The verification is a one-shot HEAD or
GET against the public URL; no body, no credentials, no follow-up.

---

## Threat model

### In scope

- **A user runs Banal on a shared or public device** (library, school,
  shelter, family computer) and leaves the browser open.
- **A user runs a fork that has been modified by an untrusted party.**
  The fork could embed additional scripts, change links, or exfiltrate
  whatever the user types into a search box.
- **A malicious browser extension** with broad site-data permissions
  reads the entries in the table above.
- **A compromised DNS or hosting provider** serves a modified copy of
  the static files to a user who expected the main repo.

### Out of scope

- Compromise of the upstream tool providers themselves. When you click
  through to a tool, you are subject to _their_ security posture, not
  ours.
- Physical access to the device with disk-level forensics capability.
  Anyone with that level of access can read anything in the browser
  profile regardless of what we do.
- The user themselves choosing to share their screen or hand their device
  to another person.

### Mitigations we apply

- **No analytics, no telemetry, no third-party scripts.** The
  `dist/` build has no remote calls in normal operation. You can verify
  this in the browser's Network tab.
- **Source maps disabled in production.** `vite.config.ts` ships with
  `sourcemap: false`, so a hosted instance does not also publish the
  full annotated TypeScript source.
- **Content Security Policy is not yet shipped.** The
  `index.html` template does not include a meta-tag CSP today; adding
  one is the highest-priority hardening item in
  [`PENTEST_REPORT.md`](../PENTEST_REPORT.md#h3-no-content-security-policy-in-the-static-shell).
  Until it lands, the other mitigations in this section carry the
  defensive load.
- **`escapeHtml` is used everywhere user-controlled text is interpolated
  into HTML** (`src/utils.ts` and the corresponding tests).
- **`npm audit --audit-level=moderate` is part of CI.** Vulnerabilities
  in dev dependencies are caught on every push.
- **Dependabot is enabled** to open weekly PRs for security updates.
- **The catalog is audited weekly** by
  `.github/workflows/verify-tools.yml`. Broken tools are surfaced in
  `docs/verification/YYYY-MM-DD.json` the next time the workflow runs.

### Residual risks we name explicitly

- **A hostile fork.** A motivated attacker can fork Banal, modify it to
  exfiltrate whatever the user types, and host it on a similar-looking
  domain. The only defenses here are: review the source of any fork you
  trust with your data, prefer running your own copy, and recommend
  forks to others only after you have read the code.
- **Shared devices.** Anything in the table at the top of this document
  is visible to the next person who opens the same browser profile.
  Use a private/incognito window, or clear site data when you are done.
- **Provider changes.** The 273 tools in the directory are third-party
  sites. Any of them can change their terms, start requiring an account,
  or disappear. The catalog is data in
  `src/data/zero-key-tools.ts`; if a tool misbehaves, file an issue or
  open a PR that removes it.

---

## Reporting a security issue

Please **do not** open a public GitHub issue for an unpatched
vulnerability. Use one of the following instead:

- GitHub's private vulnerability reporting: **Security** tab →
  **Report a vulnerability** on this repository.
- If the repo does not yet have that feature enabled, contact the
  maintainers via the issue tracker listed in the `bugs` field of
  `package.json` (a GitHub issues URL by default).

Please include:

- a description of the vulnerability and the impact you observe,
- the exact steps to reproduce,
- the affected version or commit hash,
- any suggested fix (optional, but appreciated).

We treat security reports with priority and aim to acknowledge within
three working days. We will not ask you to keep a critical issue
private forever; once a fix is shipped we will publish a postmortem in
the same channel you reported through.

---

## Security best practices for fork maintainers

If you maintain a fork that other people rely on:

- Keep the CI green. The `npm run ci` script catches dependency
  vulnerabilities and lint regressions.
- Do not add analytics, third-party scripts, or remote fonts without
  documenting the change prominently in your README and the
  verification snapshots.
- Do not weaken the `escapeHtml` usage in `src/utils.ts`. If a future
  change adds a Content Security Policy (the recommended hardening in
  [`PENTEST_REPORT.md`](../PENTEST_REPORT.md#h3-no-content-security-policy-in-the-static-shell)),
  do not remove it without discussion.
- If you must pin to an older dependency for compatibility, document
  why and when it will be revisited.

Forks are welcome to diverge in opinion. They are not welcome to silently
make the site less safe.
