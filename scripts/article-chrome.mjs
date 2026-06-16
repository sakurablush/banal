/** Shared article page chrome — keep in sync with index.html header/footer patterns. */

export const LANG_TOGGLE_HTML = `            <button
              type="button"
              id="lang-toggle"
              class="btn-header"
              data-i18n-title="lang.toggleTitle"
              data-i18n-aria-label="lang.toggle"
            >
              <span class="btn-header-icon">
                <svg
                  class="lang-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <clipPath id="lang-uk-half">
                      <rect x="3" y="4" width="9" height="16" rx="2.5" />
                    </clipPath>
                    <clipPath id="lang-jp-half">
                      <rect x="12" y="4" width="9" height="16" rx="2.5" />
                    </clipPath>
                    <linearGradient id="lang-fusion" x1="11" y1="4" x2="13" y2="20" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.15" />
                      <stop offset="50%" stop-color="#d946ef" stop-opacity="0.95" />
                      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.15" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="3.5"
                    stroke="currentColor"
                    stroke-width="1.15"
                    stroke-opacity="0.42"
                  />
                  <g clip-path="url(#lang-uk-half)">
                    <rect x="3" y="4" width="9.5" height="16" fill="#012169" />
                    <path fill="#fff" d="M3 11.2h9.5M7.75 4v16" />
                    <path fill="#C8102E" d="M3 10h9.5v2.4H3zM6.55 4v16h2.4V4z" />
                    <path fill="#fff" d="M3 4.2 12.2 19.8M12.2 4.2 3 19.8" opacity="0.92" />
                    <path
                      fill="none"
                      stroke="#C8102E"
                      stroke-width="0.85"
                      d="M3 4.9 11.5 19.1M11.5 4.9 3 19.1"
                    />
                  </g>
                  <g clip-path="url(#lang-jp-half)">
                    <rect x="12" y="4" width="9.5" height="16" fill="#f9f9f9" />
                    <circle cx="16.5" cy="12" r="3.15" fill="#BC002D" />
                  </g>
                  <path
                    d="M11.7 5.4c1.35 2.1 1.35 11.1 0 13.2"
                    stroke="url(#lang-fusion)"
                    stroke-width="1.05"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="12" r="0.75" fill="#e879f9" />
                </svg>
              </span>
            </button>`;

export const FOOTER_HTML = `    <footer
      class="relative mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-pink-500/[0.05] py-12"
      aria-labelledby="site-footer-title"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid gap-10 md:grid-cols-3 items-start">
          <div>
            <h2
              id="site-footer-title"
              class="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent"
            >
              sakurablush<span class="text-pink-400">.banal</span>
            </h2>
            <p
              class="mt-3 text-sm text-white/60 leading-relaxed max-w-xs"
              data-i18n="footer.tagline"
            >
              Banal — tool reference. {total} listings. Limits labeled.
            </p>
            <p class="mt-4 text-xs text-pink-200/60 italic" data-i18n="footer.dedication">
              Built with love by sakurablush.
            </p>
          </div>

          <nav
            class="flex flex-col gap-2 text-sm"
            aria-label="Footer"
            data-i18n-aria-label="footer.ariaLabel"
          >
            <a
              href="https://github.com/sakurablush/banal"
              target="_blank"
              rel="noopener"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.github"
              >GitHub</a
            >
            <a
              href="https://github.com/sakurablush/banal/issues"
              target="_blank"
              rel="noopener"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.report"
              >Report Issue</a
            >
            <a
              href="https://github.com/sakurablush/banal/discussions"
              target="_blank"
              rel="noopener"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.discuss"
              >Discussions</a
            >
            <a
              href="https://github.com/sakurablush/banal/blob/main/LICENSE"
              target="_blank"
              rel="noopener"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.license"
              >MIT License</a
            >
            <a
              href="../../"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.storedData"
              >Stored data</a
            >
            <a
              href="#top"
              class="text-white/70 hover:text-pink-200 transition-colors"
              data-i18n="footer.backToTop"
              >Back to top</a
            >
          </nav>

          <div class="text-sm text-white/60 md:text-right">
            <p class="font-mono text-pink-200/80" data-i18n="footer.love">
              made with love, for the ghost in every fork
            </p>
            <p class="mt-2 text-xs text-white/40">
              © <span id="footer-year">2026</span> sakurablush · MIT
            </p>
          </div>
        </div>
      </div>
    </footer>`;
