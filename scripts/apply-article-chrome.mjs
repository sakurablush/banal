import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOOTER_HTML, LANG_TOGGLE_HTML } from './article-chrome.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'articles');
const slugs = ['free-ai-coding-setup-2026', 'honest-truth-ai-coding-agents-2026'];

const MAIN_OPEN_RE = /    <main[^>]*>\r?\n      <article class="article-content">\r?\n/;

const MAIN_OPEN_REPLACEMENT = `    <main id="app" class="article-page-main page-shell" role="main">
      <article class="article-content">
`;

const LANG_TOGGLE_RE =
  /            <button[^>]*id="(?:article-lang-toggle|lang-toggle)"[^>]*>[\s\S]*?<\/button>/;

function applyChrome(slug) {
  const file = path.join(root, slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('id="top"')) {
    html = html.replace('<html lang="en"', '<html lang="en" id="top"');
  }

  html = html.replace(MAIN_OPEN_RE, MAIN_OPEN_REPLACEMENT);
  html = html.replace(LANG_TOGGLE_RE, LANG_TOGGLE_HTML);
  html = html.replace(/    <footer[\s\S]*<\/footer>/, FOOTER_HTML);

  fs.writeFileSync(file, html);
  console.log('chrome applied:', slug);
}

for (const slug of slugs) {
  applyChrome(slug);
}
