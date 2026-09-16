# Deploying your own copy of Banal

This is the short version. Banal is a static site, so deploying it is
deploying a folder of HTML, CSS, and JavaScript. Any host that can serve
files will work.

This guide covers two paths: GitHub Pages (recommended, free, integrates
with the existing CI) and Cloudflare Pages (also free, fast global edge).
A third path — drag-and-drop to Netlify Drop or copy to a USB — is at the
end for the no-terminal case.

---

## Prerequisites

- A free GitHub account (<https://github.com>).
- Node.js 18 or newer, locally. If you do not want to install Node, see
  [No-build deployment](#no-build-deployment) at the bottom.
- About 10 minutes the first time.

---

## Path A: GitHub Pages (recommended)

GitHub Pages is the simplest end-to-end story for a fork. The repo already
ships a workflow that builds on every push and publishes to Pages; you only
have to enable Pages once.

### 1. Fork the repository

1. Open the main Banal repository on GitHub: <https://github.com/sakurablush/banal>.
2. Click **Fork** (top right).
3. Accept the default name (`banal`) and click **Create fork**.

You now own `https://github.com/<your-username>/banal`.

### 2. Enable GitHub Pages

1. In your fork, go to **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Save.

That is the entire Pages setup. No branch selection, no custom domain
required.

### 3. Trigger the first build

1. Go to the **Actions** tab.
2. The workflow `Deploy Banal to GitHub Pages` should already have started
   from the push that enabled Pages. If not, click **Run workflow** to
   start it manually.
3. Wait 1–3 minutes. The job will:
   - check out your fork,
   - install with `npm ci`,
   - run the test suite,
   - build with `npm run build`,
   - publish the `dist/` folder to Pages.
4. When the job is green, refresh the **Pages** settings page. GitHub will
   show your live URL:

   ```
   https://<your-username>.github.io/banal/
   ```

### 4. (Optional) Use a custom domain

1. In **Settings** → **Pages**, enter your domain in **Custom domain**.
2. Add the DNS records GitHub shows you (usually a CNAME to
   `<your-username>.github.io`).
3. Tick **Enforce HTTPS** once the certificate is issued (a few minutes
   after DNS propagates).

### 5. Keeping your fork up to date

The main repo will keep improving. To pull new commits into your fork:

1. In your fork on GitHub, click **Sync fork** (button near the top of the
   code tab).
2. Click **Update branch**. If there are merge conflicts, GitHub will walk
   you through resolving them in the browser.

If you are comfortable with the terminal, the equivalent is:

```bash
git remote add upstream https://github.com/sakurablush/banal.git
git fetch upstream
git merge upstream/main
git push
```

---

## Path B: Cloudflare Pages

Use this if you want a faster global edge, a free `*.pages.dev` subdomain,
or a custom domain without GitHub's account association.

### 1. Fork the repository

Same as Path A. You need a GitHub repo that Cloudflare can read.

### 2. Connect to Cloudflare

1. Sign in to the Cloudflare dashboard: <https://dash.cloudflare.com/>.
2. Go to **Workers & Pages** → **Create application** → **Pages** tab →
   **Connect to Git**.
3. Authorize Cloudflare to read your GitHub repos.
4. Pick your `banal` fork and click **Begin setup**.

### 3. Configure the build

Use exactly these values:

| Setting                | Value                                                        |
| ---------------------- | ------------------------------------------------------------ |
| Project name           | anything you like (this becomes the `*.pages.dev` subdomain) |
| Production branch      | `main`                                                       |
| Build command          | `npm run build`                                              |
| Build output directory | `dist`                                                       |

Leave everything else at default. Cloudflare auto-detects the Node version.

### 4. Deploy

1. Click **Save and Deploy**.
2. Cloudflare will run `npm ci`, the test suite, the build, and publish.
3. When the deploy finishes, click the `*.pages.dev` link in the dashboard.
   That is your live site.

### 5. Custom domain (optional)

In the project settings, go to **Custom domains** and follow the wizard.
Cloudflare handles the certificate automatically.

---

## No-build deployment

If you do not want to install Node or run a CI pipeline, you can deploy the
prebuilt `dist/` folder directly.

### Netlify Drop

1. Get a fresh `dist/` folder: clone the repo, run `npm install` and
   `npm run build` once locally (or ask a friend to do it for you).
2. Open <https://app.netlify.com/drop>.
3. Drag the `dist/` folder onto the page. Netlify gives you a public URL in
   under a minute.

### Any static host

Any service that can serve files works: Surge, Vercel, an old web host
from your school or ISP, an S3 bucket, a Google Cloud Storage bucket with
public read, even GitHub Pages with the `dist/` branch. Upload the
contents of `dist/` and you are done.

### USB or local file

The whole site opens by double-clicking `dist/index.html` in any modern
browser. There is no server. This is the most portable form factor and
the one that works when the network does not.

---

## Verifying the deploy

After the site is live:

1. Open the URL.
2. Switch the language to Japanese and back to confirm the i18n wiring
   works.
3. Toggle the theme. Reload. The theme should remember your choice for the
   session.
4. Open the browser DevTools → Application → Local Storage. You should
   see only the keys documented in
   [`docs/SECURITY.md`](SECURITY.md#data-the-browser-stores-locally)
   (`banal-lang`, `banal_saved_filters`, `banal_custom_stacks`,
   `banal_filter_analytics`, plus `banal-pt-*` and `banal-theme` in
   sessionStorage). Anything else under this origin is unexpected.

If any of those fail, the most likely cause is a stale build or a custom
domain with caching that is serving the previous version. Force-refresh
(Cmd/Ctrl+Shift+R) and, if needed, purge the host's cache.

---

## Reporting a problem with your deploy

Open an issue in the main repo with:

- the host you are using (GitHub Pages, Cloudflare, Netlify, USB, ...),
- the URL of the failing site (or the exact error from the build log),
- what you expected to happen,
- what actually happened (screenshot or copy of the build log is fine).

Forks are welcome to maintain their own changelogs. If you make a change
that should come back into the main repo, see
[`docs/CONTRIBUTING.md`](CONTRIBUTING.md) for the PR process.
