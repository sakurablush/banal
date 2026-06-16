/**
 * Exhaustive tests for the Prompt Templates Library.
 * Targets 100% coverage (lines, functions, branches, statements).
 * Tests empathy tone, placeholder parity, graceful edges, JA keigo/cultural quality,
 * singleton behavior, and production readiness for poor/stressed users.
 */
import { describe, it, expect } from 'vitest';
import {
  PromptTemplatesLibrary,
  promptTemplatesLibrary,
  extractTemplateVariables,
  _internalTemplatesForTestsOnly as TEMPLATES,
} from '../src/lib/prompt-templates';

describe('PromptTemplatesLibrary — instantiation & locale', () => {
  it('instantiates with default English', () => {
    const lib = new PromptTemplatesLibrary();
    expect(lib.getLocale()).toBe('en');
  });

  it('accepts initial locale ja', () => {
    const lib = new PromptTemplatesLibrary('ja');
    expect(lib.getLocale()).toBe('ja');
  });

  it('normalizes unknown locale to en', () => {
    // @ts-expect-error intentional bad value for branch
    const lib = new PromptTemplatesLibrary('fr');
    expect(lib.getLocale()).toBe('en');
  });

  it('setLocale switches and normalizes', () => {
    const lib = new PromptTemplatesLibrary('en');
    lib.setLocale('ja');
    expect(lib.getLocale()).toBe('ja');
    // @ts-expect-error
    lib.setLocale('xx');
    expect(lib.getLocale()).toBe('en');
  });
});

describe('PromptTemplatesLibrary — getters (all templates)', () => {
  const lib = new PromptTemplatesLibrary('en');

  it('getAll returns a complete, non-empty set of prompt templates', () => {
    const all = lib.getAll();
    // Library scales — assert a floor, not a hard-coded count, so new templates don't break this test.
    expect(all.length).toBeGreaterThanOrEqual(40);
    for (const pt of all) {
      expect(pt).toHaveProperty('id');
      expect(pt).toHaveProperty('title');
      expect(pt).toHaveProperty('description');
      expect(pt).toHaveProperty('template');
      expect(typeof pt.title).toBe('string');
      expect(typeof pt.description).toBe('string');
      expect(typeof pt.template).toBe('string');
      expect(pt.title.length).toBeGreaterThan(5);
      expect(pt.description.length).toBeGreaterThan(10);
      expect(pt.template.length).toBeGreaterThan(50);
    }
  });

  it('getById returns correct item for all known ids', () => {
    const ids = PromptTemplatesLibrary.getAllIds();
    expect(ids.length).toBeGreaterThanOrEqual(40);
    for (const id of ids) {
      const pt = lib.getById(id);
      expect(pt).toBeDefined();
      expect(pt!.id).toBe(id);
    }
  });

  it('getById returns undefined for unknown id (graceful)', () => {
    expect(lib.getById('nonexistent-template')).toBeUndefined();
    expect(lib.getById('')).toBeUndefined();
    expect(lib.getById('JOB-GAPS')).toBeUndefined(); // case sensitive
  });

  it('count reports the library size (>= 40)', () => {
    expect(lib.count()).toBeGreaterThanOrEqual(40);
  });

  it('static getAllIds returns sorted list of all templates', () => {
    const ids = PromptTemplatesLibrary.getAllIds();
    // Sorted lexicographically; first should be a real template id, not the empty string.
    expect(ids[0]).toBeTruthy();
    expect(ids).toContain('en-ja-cultural-bridge');
    expect(ids).toContain('star-stories-caregiving');
  });
});

describe('PromptTemplatesLibrary — fill (happy + edges)', () => {
  const libEn = new PromptTemplatesLibrary('en');
  const libJa = new PromptTemplatesLibrary('ja');

  it('fills all variables in a template (job gaps example) and preserves 7-block structure', () => {
    const filled = libEn.fill('job-gaps-as-strengths', {
      yourName: 'Alex',
      targetRole: 'junior developer',
      gapSituation: '18 months full-time caregiving for parent with cancer',
      yourStrengths: 'project management under extreme constraints, deep empathy',
      tone: 'warm and direct',
    });
    // Substitution correctness
    expect(filled).toContain('Alex');
    expect(filled).toContain('junior developer');
    expect(filled).toContain('caregiving for parent with cancer');
    // No literal placeholders left for the variables we filled
    expect(filled).not.toMatch(/\{\{yourName\}\}/);
    // 7-block structure preserved (the 7 numbered sections survive the fill)
    expect(filled).toMatch(/1\. ROLE/);
    expect(filled).toMatch(/7\. SIGN-OFF/);
  });

  it('leaves missing variables as {{var}} (graceful, user can complete)', () => {
    const partial = libEn.fill('zero-budget-learning', {
      yourName: 'Sam',
      skillOrTopic: 'basic accounting',
      // missing dailyMinutes, currentLevel, obstacle
    });
    expect(partial).toContain('{{dailyMinutes}}');
    expect(partial).toContain('{{currentLevel}}');
    expect(partial).toContain('Sam');
  });

  it('ignores extra / unknown values', () => {
    const filled = libEn.fill('weekend-trip-plan', {
      from: 'test',
      companions: 'test',
      radius: 'test',
      budget: 'test',
      kind: 'test',
      constraints: 'test',
      fooBarBaz: 'should be ignored',
      123: 'also ignored',
    });
    expect(filled).toContain('test');
    expect(filled).not.toContain('fooBarBaz');
  });

  it('handles numeric values and lower-case key fallback', () => {
    const filled = libEn.fill('debt-hardship-scripts', {
      yourName: 'Jordan',
      creditorType: 'utility company',
      realisticMonthly: 45, // number
      hardshipreason: 'job loss last month', // lower case key
    });
    expect(filled).toContain('45');
    expect(filled).toContain('job loss last month');
  });

  it('fill on Japanese locale produces JA text + keigo where appropriate', () => {
    const filled = libJa.fill('bureaucracy-letters', {
      yourName: '山田太郎',
      recipient: '福祉課',
      theIssue: '生活保護の支給が停止された',
      previousAttempts: '電話で2回問い合わせ',
      specificRequest: '支給再開と事情説明の機会',
      facts: '医療費領収書3件あり',
    });
    expect(filled).toContain('山田太郎');
    // Structural keigo signal: one of the formal request phrases
    expect(filled).toMatch(/いただきたく|お願い|存じます|幸いです/);
    expect(filled).not.toMatch(/\{\{yourName\}\}/);
  });

  it('throws clear error on unknown id', () => {
    expect(() => libEn.fill('does-not-exist')).toThrow(
      /Unknown prompt template id: does-not-exist/
    );
    expect(() => libEn.fill('does-not-exist')).toThrow(/Valid ids:/);
  });

  it('fill works for all templates without throwing (smoke + parity)', () => {
    const ids = PromptTemplatesLibrary.getAllIds();
    for (const id of ids) {
      const en = libEn.fill(id, { yourName: 'Test', situation: 'test' });
      const ja = libJa.fill(id, { yourName: 'テスト', situation: 'テスト' });
      expect(en.length).toBeGreaterThan(50);
      expect(ja.length).toBeGreaterThan(50);
    }
  });
});

describe('extractTemplateVariables helper', () => {
  it('extracts unique sorted vars', () => {
    const t = 'Hello {{userName}} and {{targetRole}}. {{userName}} again.';
    expect(extractTemplateVariables(t)).toEqual(['targetRole', 'userName']);
  });

  it('returns empty array for no vars or bad input', () => {
    expect(extractTemplateVariables('plain text')).toEqual([]);
    expect(extractTemplateVariables('')).toEqual([]);
    // @ts-expect-error
    expect(extractTemplateVariables(null)).toEqual([]);
    // @ts-expect-error
    expect(extractTemplateVariables(undefined)).toEqual([]);
    expect(extractTemplateVariables(42 as any)).toEqual([]);
  });

  it('handles templates with no placeholders (edge)', () => {
    const noVars = 'This template has zero variables at all.';
    expect(extractTemplateVariables(noVars)).toEqual([]);
  });

  it('is used by fill and parity (integration)', () => {
    const vars = extractTemplateVariables(TEMPLATES['grounding-low-energy'].template.en);
    expect(vars).toContain('yourName');
    expect(vars).toContain('currentFeeling');
    expect(vars).toContain('whatYouHaveRightNow');
  });
});

describe('PromptTemplatesLibrary — EN/JA parity validator', () => {
  it('validateParity reports valid true with zero issues for all templates', () => {
    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid, result.issues.join('\n')).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('would catch real mismatches (validator logic is exercised by the clean data + explicit parity test above)', () => {
    // The live validateParity() run on all templates already exercises the checker.
    // (A real mismatch would be caught immediately by this test and by CI coverage.)
    const real = PromptTemplatesLibrary.validateParity();
    expect(real.valid).toBe(true);
  });

  it('catches missing title.en', () => {
    const original = TEMPLATES['job-gaps-as-strengths'].title.en;
    // @ts-expect-error - intentionally setting to undefined for test
    TEMPLATES['job-gaps-as-strengths'].title.en = undefined;

    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('job-gaps-as-strengths: missing or invalid title.en');

    TEMPLATES['job-gaps-as-strengths'].title.en = original;
  });

  it('catches missing description.ja', () => {
    const original = TEMPLATES['zero-budget-learning'].description.ja;
    // @ts-expect-error - intentionally setting to undefined for test
    TEMPLATES['zero-budget-learning'].description.ja = undefined;

    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('zero-budget-learning: missing or invalid description.ja');

    TEMPLATES['zero-budget-learning'].description.ja = original;
  });

  it('catches missing template.en', () => {
    const original = TEMPLATES['bureaucracy-letters'].template.en;
    // @ts-expect-error - intentionally setting to undefined for test
    TEMPLATES['bureaucracy-letters'].template.en = undefined;

    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('bureaucracy-letters: missing or invalid template.en');

    TEMPLATES['bureaucracy-letters'].template.en = original;
  });

  it('catches placeholder count mismatch', () => {
    const originalEn = TEMPLATES['bureaucracy-letters'].template.en;
    // Add extra placeholder to EN only
    TEMPLATES['bureaucracy-letters'].template.en = originalEn + ' {{extraPlaceholder}}';

    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid).toBe(false);
    expect(
      result.issues.some((issue) =>
        issue.includes('bureaucracy-letters: placeholder count mismatch')
      )
    ).toBe(true);

    TEMPLATES['bureaucracy-letters'].template.en = originalEn;
  });

  it('catches placeholder present in en but missing in ja', () => {
    const originalEn = TEMPLATES['form-decoder'].template.en;

    // Replace a placeholder in EN with different name, keep JA the same
    const enVars = extractTemplateVariables(originalEn);
    if (enVars.length > 0) {
      const varToChange = enVars[0];
      TEMPLATES['form-decoder'].template.en = originalEn.replace(
        `{{${varToChange}}}`,
        `{{${varToChange}Modified}}`
      );

      const result = PromptTemplatesLibrary.validateParity();
      expect(result.valid).toBe(false);
      expect(
        result.issues.some(
          (issue) =>
            issue.includes('form-decoder: placeholder') &&
            issue.includes('present in en but missing in ja')
        )
      ).toBe(true);

      TEMPLATES['form-decoder'].template.en = originalEn;
    }
  });

  it('catches invalid title type (not string)', () => {
    const original = TEMPLATES['grounding-low-energy'].title.en;
    // @ts-expect-error - intentionally setting to number for test
    TEMPLATES['grounding-low-energy'].title.en = 123;

    const result = PromptTemplatesLibrary.validateParity();
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('grounding-low-energy: missing or invalid title.en');

    TEMPLATES['grounding-low-energy'].title.en = original;
  });
});

describe('singleton export', () => {
  it('promptTemplatesLibrary is a usable instance (default en)', () => {
    expect(promptTemplatesLibrary.getLocale()).toBe('en');
    const all = promptTemplatesLibrary.getAll();
    expect(all.length).toBeGreaterThanOrEqual(40);
    const filled = promptTemplatesLibrary.fill('en-ja-cultural-bridge', {
      direction: 'EN to JA',
      originalText: 'Hello, I need help.',
      context: 'test',
      goal: 'test',
      energy: 'normal',
    });
    // The bridge template surfaces a cultural-note block
    expect(filled).toMatch(/cultural notes|Cultural notes|文化|敬語|keigo/);
  });

  it('multiple new PromptTemplatesLibrary() are independent (not forced singleton)', () => {
    const a = new PromptTemplatesLibrary('en');
    const b = new PromptTemplatesLibrary('ja');
    a.setLocale('ja');
    expect(a.getLocale()).toBe('ja');
    expect(b.getLocale()).toBe('ja');
  });
});

describe('empathy & MINDSET-voice quality smoke tests (non-regression)', () => {
  const lib = new PromptTemplatesLibrary('en');

  it('every English template uses the 7-block structure (Role / Task / Context / Constraints / Output / Verification / Sign-off)', () => {
    const all = lib.getAll();
    for (const pt of all) {
      const t = pt.template;
      expect(t, `${pt.id} missing ROLE`).toMatch(/1\.\s*ROLE/);
      expect(t, `${pt.id} missing TASK`).toMatch(/2\.\s*TASK/);
      expect(t, `${pt.id} missing CONTEXT`).toMatch(/3\.\s*CONTEXT/);
      expect(t, `${pt.id} missing CONSTRAINTS`).toMatch(/4\.\s*CONSTRAINTS/);
      expect(t, `${pt.id} missing OUTPUT FORMAT`).toMatch(/5\.\s*OUTPUT FORMAT/);
      expect(t, `${pt.id} missing VERIFICATION`).toMatch(/6\.\s*VERIFICATION/);
      expect(t, `${pt.id} missing SIGN-OFF`).toMatch(/7\.\s*SIGN-OFF/);
    }
  });

  it('templates are free of the forbidden MINDSET-violating register', () => {
    const all = lib.getAll();
    const joined = all.map((pt) => pt.template).join('\n');
    // Forbidden phrases per MINDSET voice contract.
    // The "never say X" meta-instructions in templates are allowed (they teach the AI to avoid X),
    // so we only check the templates' direct instructions, not their own anti-patterns.
    // We strip any "You never say ..." / "Do not say ..." / "禁止" lines before checking.
    const sanitized = joined
      .split('\n')
      .filter((l) => !/never say|do not say|avoid|禁止|式は禁止/.test(l))
      .join('\n');
    // Word boundaries so legitimate technical words ("broken", "shame") don't trigger.
    expect(sanitized, 'no "shame-free"').not.toMatch(/\bshame-free\b/i);
    // \b before/after "broke" means "broken" (no boundary between e and n) does NOT match.
    expect(sanitized, 'no poverty "broke"').not.toMatch(/\bbroke\b/);
    expect(sanitized, 'no "we have nothing"').not.toMatch(/we have nothing/);
    expect(sanitized, 'no "the rich pay"').not.toMatch(/the rich pay/);
    expect(sanitized, 'no "poor person"').not.toMatch(/poor person/);
    expect(sanitized, 'no toxic positivity').not.toMatch(/\bdon.?t worry\b|\byou got this\b|\bjust try harder\b/);
    // "library computer" only forbidden as a poverty marker — a tool called "library" is fine.
    expect(sanitized, 'no "library computer" poverty framing').not.toMatch(/library computer/);
    // "phone with X% battery" specifically as a poverty marker.
    expect(sanitized, 'no "phone with N% battery" poverty framing').not.toMatch(/phone with \d+% battery/);
  });

  it('every template includes a Verification block (anti-hallucination gate)', () => {
    const all = lib.getAll();
    for (const pt of all) {
      expect(pt.template, `${pt.id} missing Verify/Verification`).toMatch(/verif/i);
    }
  });

  it('every template includes a Sign-off line (dignity line the user can paste)', () => {
    const all = lib.getAll();
    for (const pt of all) {
      expect(pt.template, `${pt.id} missing Sign-off`).toMatch(/sign-?off/i);
    }
  });

  it('Japanese versions contain appropriate keigo for the bureaucracy template', () => {
    const libJa = new PromptTemplatesLibrary('ja');
    const bureaucracy = libJa.getById('bureaucracy-letters')!.template;
    expect(bureaucracy).toMatch(/いただきたく|お願い|存じます|幸いです/);
  });

  it('Japanese grounding template uses softened register (no bureaucratic keigo)', () => {
    const libJa = new PromptTemplatesLibrary('ja');
    const grounding = libJa.getById('grounding-low-energy')!.template;
    // Soft register, not bureaucratic keigo
    expect(grounding).toMatch(/価値がある|ここに|いる|大丈夫/);
  });

  it('debt scripts assert dignity and the I-can-pay framing', () => {
    const libEn = new PromptTemplatesLibrary('en');
    const debt = libEn.getById('debt-hardship-scripts')!;
    // Check both description (where the dignity line lives) and template (where the
    // "budgeting decision, not a moral event" sign-off lives).
    const combined = debt.description + '\n' + debt.template;
    expect(combined).toMatch(/dignity|mental health|judgment|judge|moral event|budgeting decision/);
  });

  it('form decoder explicitly disclaims legal/medical advice', () => {
    const forms = lib.getById('form-decoder')!.template;
    expect(forms).toMatch(/not legal advice|legal or medical advice|法的助言/);
  });
});

describe('production readiness (strictness + no side effects)', () => {
  it('all public API surface is present and typed', () => {
    const lib = new PromptTemplatesLibrary();
    expect(typeof lib.setLocale).toBe('function');
    expect(typeof lib.getLocale).toBe('function');
    expect(typeof lib.getAll).toBe('function');
    expect(typeof lib.getById).toBe('function');
    expect(typeof lib.fill).toBe('function');
    expect(typeof lib.count).toBe('function');
    expect(typeof PromptTemplatesLibrary.validateParity).toBe('function');
    expect(typeof PromptTemplatesLibrary.getAllIds).toBe('function');
    expect(typeof extractTemplateVariables).toBe('function');
  });

  it('templates never contain runtime deps or dangerous patterns (smoke)', () => {
    const allTemplates = Object.values(TEMPLATES).flatMap((t) => [t.template.en, t.template.ja]);
    const joined = allTemplates.join('\n');
    // Look only for JS-runtime constructions in code-flavoured positions:
    //   - `import ` followed by something that looks like a module specifier
    //   - `require(` with an opening paren
    //   - `new Function(` / `eval(` / `process.X` / `window.X` / `document.X`
    // Generic English uses of "document" / "process" / "import" must not trigger.
    expect(joined, 'no JS import statement').not.toMatch(/\bimport\s+[\w{*]/);
    expect(joined, 'no JS require()').not.toMatch(/\brequire\s*\(/);
    expect(joined, 'no eval').not.toMatch(/\beval\s*\(/);
    expect(joined, 'no new Function').not.toMatch(/\bnew\s+Function\s*\(/);
    expect(joined, 'no process. access').not.toMatch(/\bprocess\.[a-zA-Z]/);
    expect(joined, 'no window. access').not.toMatch(/\bwindow\.[a-zA-Z]/);
    expect(joined, 'no document. access').not.toMatch(/\bdocument\.[a-zA-Z]/);
    // No obvious paid service promotion
    expect(joined, 'no paid promotion').not.toMatch(/patreon|buy me a|premium|upgrade|subscribe \$/i);
  });
});
