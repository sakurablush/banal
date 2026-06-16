# Security Policy

## Threat model

Banal is a static web app. There is no backend, no database, and no
authentication. The browser renders the catalog and the prompt
templates; clicking a tool takes the user to that tool's own URL. The
threat model is the one that actually applies to a forkable static
site, not the one that applies to a SaaS product.

The full version is in [`docs/SECURITY.md`](docs/SECURITY.md). This
file is the short version that lives at the repository root because
GitHub renders it under the **Security** tab.

### Key threat vectors

| Vector                                            | Description                                                       | Mitigation                                                          |
|---------------------------------------------------|-------------------------------------------------------------------|---------------------------------------------------------------------|
| **Hostile fork** distributed by an untrusted party | A modified copy steals saved filters, custom stacks, or form data | Fork from a source you trust; review the code; host your own copy    |
| **Shared-device data exposure**                   | localStorage keys persist across browser sessions                 | Use a private window; clear site data when you are done             |
| **Compromised browser extension**                 | Reads `localStorage` or modifies the rendered DOM                 | Review extensions; prefer a minimal install                         |
| **Compromised hosting or DNS**                    | A modified `dist/` is served to users expecting the main repo    | Pin the deploy to a known-good commit; verify hashes if available   |
| **Catalog drift**                                 | A tool URL is taken over, parked, or shut down between audits    | Weekly `verify-tools` workflow writes a dated snapshot              |

---

## Shared-device usage

A meaningful share of the project's audience uses Banal on shared
devices. If that is you:

- Open the site in a private/incognito window if the browser supports
  it. Closing the window clears `localStorage` for the origin.
- After your session, clear the site's data from the browser's
  settings (Settings → Privacy → Clear browsing data → Cookies and
  other site data, scoped to the Banal origin).
- If you want a one-time use, the entire `dist/` folder can be opened
  by double-clicking `index.html` from a USB stick, with no network
  access required at all.

The app's data usage is documented in
[`docs/SECURITY.md`](docs/SECURITY.md#data-the-browser-stores-locally).
The short version: the only persistent state is the language choice,
saved filter combinations, custom tool stacks, theme override, and
prompt-template form values (the last two in `sessionStorage`). There
are no API keys, no chat history, and no personal information
collected.

---

## Fork verification

The whole point of the project is to be forkable. That implies a
shared responsibility: forks must be reviewable.

### If you are using a fork

- Read the source before you trust it with anything you would not
  print on a public wall. The whole project is small enough to read
  in one sitting.
- If you do not have time to read, host your own copy from a source
  you already trust (the main repo on GitHub, or a known contributor's
  fork).
- If a "Banal" link arrives through a side channel (chat, QR code,
  USB), the safest default is to ignore it and use a link you
  already had.

### If you are a fork maintainer

- Keep `npm run ci` green. It runs lint, typecheck, the test suite,
  and `npm audit --audit-level=moderate`.
- Do not add analytics, third-party scripts, remote fonts, or any
  network call that the original build does not make, without
  documenting the change prominently.
- Do not weaken the use of `escapeHtml` in `src/utils.ts` or remove
  the `meta` Content Security Policy (when one is added — see the
  current recommendations in
  [`PENTEST_REPORT.md`](PENTEST_REPORT.md)).
- If you must pin to an older dependency for compatibility, document
  the reason and the revisit date in your README.

---

## Data handling disclosure

The full disclosure is in
[`docs/SECURITY.md`](docs/SECURITY.md#what-leaves-your-browser). The
short version:

- The app does not call any LLM provider.
- The app does not store API keys.
- The app does not maintain a chat history.
- The app does not require an account, an email, or any personal
  information.
- The only outbound network requests in normal operation are the
  navigation to the tool URLs the user clicks on. Each click takes
  the user to the tool's own site; from that point on, that site's
  own privacy policy applies.
- The catalog is audited weekly by
  [`.github/workflows/verify-tools.yml`](.github/workflows/verify-tools.yml).
  Results are in [`docs/verification/`](docs/verification/).

---

## Reporting a security issue

Please **do not** open a public GitHub issue for an unpatched
vulnerability. Use one of these channels instead:

- GitHub's private vulnerability reporting: **Security** tab →
  **Report a vulnerability** on this repository.
- If the repo does not yet have that feature, contact the maintainers
  via the email or issue tracker linked from `package.json`.

Please include:

- a description of the vulnerability and the impact you observe,
- the exact steps to reproduce,
- the affected version or commit hash,
- a suggested fix (optional but appreciated).

We aim to acknowledge within three working days and to publish a
postmortem once a fix is shipped.

---

## Security best practices for everyone

- **Keep your browser up to date.** A current browser ships with the
  most recent XSS, CSRF, and same-origin protections.
- **Audit your extensions.** A browser extension with broad
  permissions can read anything Banal stores in `localStorage`.
- **Verify the URL.** Phishing sites that mimic the Banal look are
  cheap to host. Type the URL yourself or use a bookmark you made,
  not a link from a chat.
- **If something is wrong, refresh.** The most common "the site is
  broken" reports on forks are caused by a stale browser cache. A
  hard refresh (Cmd/Ctrl+Shift+R) fixes almost all of them.
