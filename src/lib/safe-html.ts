/**
 * Safe HTML insertion for static i18n strings (a, br, span only).
 * Used instead of raw innerHTML when translations include markup.
 */

const ALLOWED_ATTRS: Record<string, readonly string[]> = {
  a: ['href', 'target', 'rel', 'class'],
  span: ['class'],
};

function safeHttpHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // invalid URL
  }
  return null;
}

function applySafeAttributes(el: HTMLElement, tag: 'a' | 'span', attrString: string): void {
  const allowed = ALLOWED_ATTRS[tag] ?? [];
  const re = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();

  while ((m = re.exec(attrString)) !== null) {
    const name = m[1].toLowerCase();
    if (seen.has(name) || !allowed.includes(name)) continue;
    seen.add(name);

    const value = m[2] ?? m[3] ?? '';
    if (name === 'href') {
      const href = safeHttpHref(value);
      if (href) el.setAttribute('href', href);
      continue;
    }
    if (name === 'target' && value !== '_blank') continue;
    if (name === 'rel' && !/\bnoopener\b/.test(value)) continue;

    el.setAttribute(name, value);
  }
}

function consumeSafeNodes(parent: Node, input: string, closeTag?: 'a' | 'span'): string {
  let rest = input;

  while (rest.length > 0) {
    if (closeTag === 'a') {
      const close = /^<\/a\s*>/i.exec(rest);
      if (close) return rest.slice(close[0].length);
    } else if (closeTag === 'span') {
      const close = /^<\/span\s*>/i.exec(rest);
      if (close) return rest.slice(close[0].length);
    }

    const lt = rest.indexOf('<');
    if (lt === -1) {
      parent.appendChild(document.createTextNode(rest));
      return '';
    }

    if (lt > 0) {
      parent.appendChild(document.createTextNode(rest.slice(0, lt)));
      rest = rest.slice(lt);
    }

    const br = /^<br\s*\/?>/i.exec(rest);
    if (br) {
      parent.appendChild(document.createElement('br'));
      rest = rest.slice(br[0].length);
      continue;
    }

    const openA = /^<a(\s[^>]*)?>/i.exec(rest);
    if (openA) {
      const el = document.createElement('a');
      applySafeAttributes(el, 'a', openA[1] ?? '');
      rest = rest.slice(openA[0].length);
      rest = consumeSafeNodes(el, rest, 'a');
      parent.appendChild(el);
      continue;
    }

    const openSpan = /^<span(\s[^>]*)?>/i.exec(rest);
    if (openSpan) {
      const el = document.createElement('span');
      applySafeAttributes(el, 'span', openSpan[1] ?? '');
      rest = rest.slice(openSpan[0].length);
      rest = consumeSafeNodes(el, rest, 'span');
      parent.appendChild(el);
      continue;
    }

    const unknownOpen = /^<([a-z][a-z0-9]*)\b[^>]*>/i.exec(rest);
    if (unknownOpen) {
      const tagName = unknownOpen[1].toLowerCase();
      rest = rest.slice(unknownOpen[0].length);
      const closeRe = new RegExp(`</${tagName}\\s*>`, 'i');
      const closeMatch = closeRe.exec(rest);
      if (closeMatch) {
        const inner = rest.slice(0, closeMatch.index);
        if (inner) parent.appendChild(document.createTextNode(inner));
        rest = rest.slice(closeMatch.index + closeMatch[0].length);
      }
      continue;
    }

    const unknownSelfClose = /^<[^>]+>/i.exec(rest);
    if (unknownSelfClose) {
      rest = rest.slice(unknownSelfClose[0].length);
      continue;
    }

    parent.appendChild(document.createTextNode('<'));
    rest = rest.slice(1);
  }

  return '';
}

/** Parse translation HTML into a fragment with only safe nodes. */
export function parseSafeTranslationHtml(html: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  consumeSafeNodes(frag, html);
  return frag;
}

/** Set element text or safely parsed translation HTML — never raw innerHTML. */
export function applyTranslationContent(el: HTMLElement, content: string): void {
  if (!content.includes('<')) {
    el.textContent = content;
    return;
  }

  const frag = parseSafeTranslationHtml(content);
  el.replaceChildren(...frag.childNodes);
}
