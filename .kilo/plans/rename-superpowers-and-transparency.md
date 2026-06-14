# Plan: Zmiana nazwy "Superpowers" na "Prompt Templates" + Transparentność

**Status:** ✅ ZAKOŃCZONY  
**Priorytet:** Wysoki  
**Szacowany czas:** 4-6 godzin  
**Rzeczywisty czas:** ~3 godziny  
**Data zakończenia:** 2026-06-11

---

## 1. Cel i zakres

### 1.1 Cel główny

Przeredagować całą stronę pod kątem:

- **Jasności komunikacji** - zmiana "superpowers" na "Prompt Templates"
- **100% transparentności** - zawsze mówimy prawdę lub zaznaczamy gdy nie możemy tego zagwarantować
- **Zaufania** - wszystko nastawione na "dla ludu" i godne 100% zaufania

### 1.2 Zakres zmian

- **340 wystąpień** słowa "superpowers" w kodzie
- **Kluczowe pliki:** index.html, src/lib/superpowers.ts, src/free-models.ts, src/providers/index.ts, README.md, docs/
- **Treść user-facing:** wszystkie teksty widoczne dla użytkownika
- **Dokumentacja:** README, docs/, komentarze w kodzie

---

## 2. Zmiana nazwy: "Superpowers" → "Prompt Templates"

### 2.1 Uzasadnienie

- "Superpowers" brzmi jak marketingowy hype, nie jak przejrzysta informacja
- "Prompt Templates" jasno komunikuje czym to jest: gotowe szablony promptów
- Bardziej profesjonalne i godne zaufania
- Łatwiejsze do zrozumienia dla nowych użytkowników

### 2.2 Mapa zmian nazwy

#### A. Pliki źródłowe (src/)

1. **src/lib/superpowers.ts** → **src/lib/prompt-templates.ts**
   - Zmiana nazwy pliku
   - Zmiana nazwy klasy: `SuperpowersLibrary` → `PromptTemplatesLibrary`
   - Zmiana nazwy interfejsu: `Superpower` → `PromptTemplate`
   - Zmiana wszystkich komentarzy i dokumentacji JSDoc
   - Zmiana nazw zmiennych: `superpowers` → `promptTemplates`

2. **src/superpowers-standalone.ts** → **src/prompt-templates-standalone.ts**
   - Zmiana nazwy pliku
   - Zmiana nazwy funkcji: `renderSuperpowersStandalone` → `renderPromptTemplatesStandalone`

3. **src/quickstart.ts**
   - Zmiana wszystkich referencji do "superpowers"
   - Zmiana tekstów user-facing: "5 popular superpowers" → "5 popular prompt templates"

4. **src/chat-modal.ts**
   - Zmiana komentarzy: "superpowers" → "prompt templates"

5. **src/chat.ts**
   - Zmiana wszystkich referencji do "superpowers"
   - Zmiana tekstów w interfejsie czatu
   - Zmiana nazw zmiennych i funkcji

6. **src/main.ts**
   - Zmiana importów
   - Zmiana komentarzy

7. **src/providers/index.ts**
   - Line 10: "use a Superpower instead" → "use a Prompt Template instead"
   - Line 17: "use the offline superpower prompts instead" → "use the offline prompt templates instead"
   - Zmiana wszystkich komentarzy JSDoc

#### B. HTML (index.html)

1. **Nawigacja desktop (line 46-47)**

   ```html
   <!-- PRZED -->
   <a href="#superpowers">Superpowers</a>

   <!-- PO -->
   <a href="#prompt-templates">Prompt Templates</a>
   ```

2. **Nawigacja mobile (line 79)**

   ```html
   <!-- PRZED -->
   <a href="#superpowers">Superpowers</a>

   <!-- PO -->
   <a href="#prompt-templates">Prompt Templates</a>
   ```

3. **Sekcja QUICK START (line 206)**

   ```html
   <!-- PRZED -->
   5 ready-to-use superpowers for common situations.

   <!-- PO -->
   5 ready-to-use prompt templates for common situations.
   ```

4. **Sekcja SUPERPOWERS (line 218-243)**
   - Zmiana ID sekcji: `id="superpowers"` → `id="prompt-templates"`
   - Zmiana ID kontenera: `id="superpowers-root"` → `id="prompt-templates-root"`
   - Zmiana nagłówka: "9 SUPERPOWERS" → "9 PROMPT TEMPLATES"
   - Zmiana opisu: "9 powerful prompt templates" (już jest OK)
   - Zmiana loading text: "Loading superpowers..." → "Loading prompt templates..."

#### C. Testy (tests/)

1. **tests/superpowers.test.ts** → **tests/prompt-templates.test.ts**
   - Zmiana nazwy pliku
   - Zmiana wszystkich referencji

2. **tests/chat.test.ts**
   - Zmiana referencji do "superpowers"

3. **tests/directory.test.ts**
   - Zmiana referencji do "superpowers"

4. **vitest.config.ts**
   - Line 41: Zmiana ścieżki do pliku coverage

#### D. Dokumentacja (docs/, README.md)

1. **README.md**
   - Line 97: "nine high-leverage prompt templates ("Superpowers")" → "nine high-leverage prompt templates"
   - Zmiana wszystkich innych wystąpień

2. **docs/SUPERPOWERS-ACADEMY.md** → **docs/PROMPT-TEMPLATES-GUIDE.md**
   - Zmiana nazwy pliku
   - Zmiana wszystkich referencji (90+ wystąpień)

3. **docs/JAPANESE.md**
   - Zmiana wszystkich referencji do "superpowers"

4. **docs/CONTRIBUTING.md**
   - Zmiana referencji

5. **docs/ARCHITECTURE.md**
   - Zmiana referencji

6. **PENTEST_REPORT.md**
   - Line 36-37: Zmiana referencji do localStorage keys
   - Line 60: Zmiana referencji

7. **SECURITY.md**
   - Line 16: Zmiana referencji

#### E. Konfiguracja

1. **.kilo/plans/** - wszystkie pliki planów
   - Zmiana referencji w istniejących planach

### 2.3 Strategia migracji

#### Krok 1: Zmiana nazw plików

```bash
git mv src/lib/superpowers.ts src/lib/prompt-templates.ts
git mv src/superpowers-standalone.ts src/prompt-templates-standalone.ts
git mv tests/superpowers.test.ts tests/prompt-templates.test.ts
git mv docs/SUPERPOWERS-ACADEMY.md docs/PROMPT-TEMPLATES-GUIDE.md
```

#### Krok 2: Zmiana importów i referencji

- Użyć `grep` i `sed` do masowej zamiany
- Ręczna weryfikacja każdego pliku

#### Krok 3: Zmiana tekstów user-facing

- Ręczna edycja każdego tekstu widocznego dla użytkownika
- Weryfikacja w przeglądarce

#### Krok 4: Testy

- Uruchomienie wszystkich testów
- Weryfikacja że nic nie jest zepsute

---

## 3. Transparentność i zaufanie

### 3.1 Zasady transparentności

#### Zasada 1: Zawsze mówimy prawdę

- Nie używamy marketingowego hype'u
- Nie obiecujemy czegoś czego nie możemy dostarczyć
- Jasno komunikujemy ograniczenia

#### Zasada 2: Zaznaczamy gdy nie możemy zagwarantować

- Dodajemy "Last verified: [data]" przy informacjach o dostawcach
- Dodajemy "Limits may change - check provider's website" przy limitach
- Dodajemy "Free tier availability depends on provider" przy darmowych usługach

#### Zasada 3: Wszystko "dla ludu"

- Język prosty i zrozumiały
- Bez technicznego żargonu tam gdzie to możliwe
- Zawsze wyjaśniamy co coś oznacza

### 3.2 Konkretne poprawki transparentności

#### A. Sekcja FREE AI MODELS (src/free-models.ts)

**Problem:** Brak informacji o tym kiedy ostatnio zweryfikowano informacje o dostawcach.

**Rozwiązanie:**

1. Dodać pole `lastVerified: string` do interfejsu `FreeModelProvider`
2. Dodać datę weryfikacji dla każdego dostawcy
3. Wyświetlić informację: "Last verified: [data]. Limits may change - check provider's website for current terms."
4. Dodać link do oficjalnej strony z warunkami

**Przykład:**

```typescript
{
  id: 'groq',
  name: 'Groq',
  tier: 'free-key',
  models: ['Llama 3.1 8B', 'Llama 3.3 70B', 'Llama 4 Scout'],
  limits: '30 RPM, 6K TPM, 14.4K RPD',
  lastVerified: '2026-06-11',
  advantages: ['Ultra-fast inference', 'No credit card', 'Generous daily limits'],
  getKeyUrl: 'https://console.groq.com/keys',
  termsUrl: 'https://console.groq.com/docs/rate-limits',
  description: 'Fastest inference available. Excellent for real-time applications.'
}
```

**UI:**

```html
<div class="text-white/40 text-xs mt-2">
  Last verified: June 11, 2026.
  <a href="[termsUrl]" target="_blank" class="text-violet-400 hover:text-violet-300">
    Check current limits →
  </a>
</div>
```

#### B. Sekcja HERO (index.html)

**Problem:** "200+ tools. All verified. All free." - czy to prawda?

**Rozwiązanie:**

1. Dodać informację o metodologii weryfikacji
2. Dodać link do strony z metodologią
3. Zmienić na bardziej precyzyjne: "200+ free AI tools. Manually tested. No login required for core features."

**Przykład:**

```html
<p class="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-6 leading-relaxed">
  200+ free AI tools. Manually tested. No login required for core features.
  <span class="text-white/70">Chat, image, video, code, PDF, research.</span>
  <a href="/methodology" class="text-violet-400 hover:text-violet-300 underline">
    How we verify →
  </a>
</p>
```

#### C. Sekcja TOOLS DIRECTORY (index.html)

**Problem:** "Every tool tested daily" - czy to prawda?

**Rozwiązanie:**

1. Zmienić na bardziej precyzyjne: "Tools tested regularly. Last full audit: [data]"
2. Dodać informację o częstotliwości testów
3. Dodać link do raportu z testów

**Przykład:**

```html
<p class="text-white/40 max-w-lg mx-auto text-sm sm:text-base">
  Tools tested regularly. Organized by what you need.
  <span class="text-white/50">No hype. No affiliate links. Last audit: June 2026.</span>
</p>
```

#### D. Sekcja FREE AI MODELS - opisy dostawców

**Problem:** Niektóre opisy mogą być nieprecyzyjne lub nieaktualne.

**Rozwiązanie:**

1. Przejrzeć każdy opis dostawcy
2. Dodać konkretne liczby tam gdzie to możliwe
3. Zaznaczyć gdy coś jest "subjective" (np. "Best quality")

**Przykłady zmian:**

**Groq:**

```typescript
// PRZED
description: 'Fastest inference available. Excellent for real-time applications.';

// PO
description: 'Fastest inference in our tests (2,600+ tokens/sec). Excellent for real-time applications.';
```

**Google Gemini:**

```typescript
// PRZED
description: 'High-quality models from Google. Great for complex tasks.';
limits: 'Rate-limited, generous free tier';

// PO
description: 'High-quality models from Google. Great for complex reasoning and multilingual tasks.';
limits: '1,500 requests/day (varies by model). Check AI Studio for current limits.';
```

**Hugging Face:**

```typescript
// PRZED
limits: '~10-20 RPM per IP';

// PO
limits: '10-20 requests/minute (varies by model popularity). Cold starts possible.';
```

#### E. Sekcja PROMPT TEMPLATES (wcześniej SUPERPOWERS)

**Problem:** "9 powerful prompt templates" - czy wszystkie są równie dobre?

**Rozwiązanie:**

1. Dodać informację o tym że szablony są testowane
2. Dodać informację o ograniczeniach (np. "Results may vary depending on AI model")
3. Dodać link do przewodnika jak używać szablonów

**Przykład:**

```html
<p class="text-white/40 max-w-lg mx-auto text-sm sm:text-base">
  9 ready-to-use prompt templates for real-life situations. Copy them, fill in your details, paste
  into any free AI chatbot.
  <span class="text-white/50"
    >Tested with Groq, Gemini, and other free providers. Results may vary.</span
  >
  <a href="/docs/PROMPT-TEMPLATES-GUIDE.md" class="text-violet-400 hover:text-violet-300 underline">
    How to use →
  </a>
</p>
```

#### F. Sekcja API PLAYGROUND

**Problem:** "Test free AI APIs directly in your browser. No account. No credit card." - czy to prawda dla wszystkich?

**Rozwiązanie:**

1. Dodać informację o ograniczeniach
2. Zaznaczyć że niektóre API mogą wymagać klucza

**Przykład:**

```html
<p class="text-white/40 max-w-lg mx-auto text-sm">
  Test free AI APIs directly in your browser.
  <span class="text-white/50"
    >Some providers require a free API key (no credit card). OVHcloud works without any key.</span
  >
</p>
```

#### G. Sekcja ARTICLES

**Problem:** "Honest writing for people who need this" - czy to prawda?

**Rozwiązanie:**

1. Dodać informację o autorze
2. Dodać informację o metodologii
3. Zaznaczyć gdy coś jest opinią vs faktem

**Przykład:**

```html
<div class="article-meta-void">
  <span>8 min read</span>
  <span>·</span>
  <span class="text-violet-400/60">Practical guide</span>
  <span>·</span>
  <span>Based on 6 months of testing</span>
</div>
```

#### H. Sekcja MISSION

**Problem:** "AI is the new literacy. It should be free." - to opinia, nie fakt.

**Rozwiązanie:**

1. Zaznaczyć że to jest nasza filozofia, nie fakt
2. Dodać więcej kontekstu

**Przykład:**

```html
<h2 class="text-3xl sm:text-5xl font-black tracking-tight mb-8">
  <span class="gradient-neon">We believe AI is the new literacy.</span>
  <br />
  <span class="text-white/90">And it should be free for everyone.</span>
</h2>
```

#### I. Footer

**Problem:** "Banal — Free AI for everyone. No login. No credit card." - czy to prawda dla wszystkich funkcji?

**Rozwiązanie:**

1. Dodać informację o ograniczeniach
2. Dodać link do FAQ

**Przykład:**

```html
<div>
  Banal — Free AI tools for everyone.
  <span class="text-white/40"
    >Core features require no login. Some providers require free API keys.</span
  >
  <a href="/faq" class="hover:text-white transition-colors ml-2">FAQ →</a>
</div>
```

### 3.3 Dodatkowe elementy transparentności

#### A. Strona "Methodology" (nowa)

Stworzyć nową stronę `/methodology` wyjaśniającą:

- Jak testujemy narzędzia
- Jak często aktualizujemy informacje
- Jakie są nasze kryteria
- Jak zgłosić błąd lub nieaktualną informację

#### B. Strona "FAQ" (nowa)

Stworzyć nową stronę `/faq` z odpowiedziami na pytania:

- Czy to naprawdę darmowe?
- Jakie są ograniczenia?
- Co się stanie gdy free tier się skończy?
- Jak zgłosić problem?

#### C. Banner "Last updated"

Dodać banner na górze strony:

```html
<div class="bg-violet-900/20 border-b border-violet-500/20 py-2 text-center text-sm text-white/60">
  Last updated: June 11, 2026.
  <a href="/changelog" class="text-violet-400 hover:text-violet-300 underline">
    View changelog →
  </a>
</div>
```

#### D. Tooltip z wyjaśnieniami

Dodać tooltips do technicznych terminów:

- "RPM" → "Requests Per Minute - ile zapytań możesz wysłać na minutę"
- "TPM" → "Tokens Per Minute - ile tokenów (słów) możesz przetworzyć na minutę"
- "RPD" → "Requests Per Day - ile zapytań możesz wysłać dziennie"

---

## 4. Implementacja

### 4.1 Fazy implementacji

#### Faza 1: Zmiana nazwy plików (30 min)

1. Zmiana nazw plików źródłowych
2. Zmiana nazw plików testowych
3. Zmiana nazw plików dokumentacji
4. Commit: `refactor: rename superpowers files to prompt-templates`

#### Faza 2: Zmiana importów i referencji (1 godzina)

1. Zmiana wszystkich importów w src/
2. Zmiana wszystkich referencji w tests/
3. Zmiana konfiguracji (vitest.config.ts)
4. Commit: `refactor: update all imports and references to prompt-templates`

#### Faza 3: Zmiana tekstów user-facing (1 godzina)

1. Zmiana tekstów w index.html
2. Zmiana tekstów w src/quickstart.ts
3. Zmiana tekstów w src/chat.ts
4. Zmiana tekstów w src/providers/index.ts
5. Commit: `content: rename superpowers to prompt templates in user-facing text`

#### Faza 4: Poprawki transparentności - FREE AI MODELS (1 godzina)

1. Dodanie pola `lastVerified` do interfejsu
2. Dodanie dat weryfikacji dla każdego dostawcy
3. Dodanie UI do wyświetlania dat
4. Przejrzenie i poprawienie opisów dostawców
5. Commit: `feat: add transparency information to free models section`

#### Faza 5: Poprawki transparentności - inne sekcje (1 godzina)

1. Poprawki w HERO section
2. Poprawki w TOOLS DIRECTORY
3. Poprawki w PROMPT TEMPLATES
4. Poprawki w API PLAYGROUND
5. Poprawki w ARTICLES
6. Poprawki w MISSION
7. Poprawki w footer
8. Commit: `content: improve transparency across all sections`

#### Faza 6: Dokumentacja (30 min)

1. Zmiana referencji w README.md
2. Zmiana referencji w docs/
3. Zmiana referencji w PENTEST_REPORT.md
4. Zmiana referencji w SECURITY.md
5. Commit: `docs: update documentation for prompt templates rename`

#### Faza 7: Testy i weryfikacja (30 min)

1. Uruchomienie wszystkich testów
2. Weryfikacja w przeglądarce
3. Sprawdzenie wszystkich linków
4. Commit: `test: verify all changes work correctly`

### 4.2 Narzędzia i komendy

#### Masowa zamiana tekstu

```bash
# Znajdź wszystkie pliki z "superpowers"
grep -r "superpowers" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.html" --include="*.md" .

# Zamień "superpowers" na "prompt templates" (ostrożnie!)
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.html" -o -name "*.md" \) -exec sed -i 's/superpowers/prompt templates/g' {} +

# Zamień "Superpowers" na "Prompt Templates" (z wielkiej litery)
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.html" -o -name "*.md" \) -exec sed -i 's/Superpowers/Prompt Templates/g' {} +
```

#### Weryfikacja

```bash
# Sprawdź czy nie zostało nic z "superpowers"
grep -r "superpowers" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.html" --include="*.md" .

# Uruchom testy
npm test

# Zbuduj projekt
npm run build
```

### 4.3 Ryzyka i mitigacje

#### Ryzyko 1: Zepsucie importów

**Mitigacja:** Ręczna weryfikacja każdego pliku po zmianie nazwy

#### Ryzyko 2: Zepsucie testów

**Mitigacja:** Uruchomienie testów po każdej fazie

#### Ryzyko 3: Nieaktualne linki

**Mitigacja:** Sprawdzenie wszystkich linków przed commitem

#### Ryzyko 4: Utrata kontekstu w komentarzach

**Mitigacja:** Ręczna weryfikacja każdego komentarza

---

## 5. Kryteria akceptacji

### 5.1 Funkcjonalne

- [ ] Wszystkie 340 wystąpień "superpowers" zamienione na "prompt templates"
- [ ] Wszystkie importy działają poprawnie
- [ ] Wszystkie testy przechodzą (235/235)
- [ ] Build przechodzi bez błędów
- [ ] Strona działa poprawnie w przeglądarce

### 5.2 Transparentność

- [ ] Wszystkie dostawcy mają datę `lastVerified`
- [ ] Wszystkie dostawcy mają link do oficjalnych warunków
- [ ] Wyświetlana jest informacja o dacie weryfikacji
- [ ] Wyświetlana jest informacja o możliwości zmian
- [ ] Wszystkie twierdzenia są prawdziwe lub zaznaczone jako opinie

### 5.3 Jakość

- [ ] Brak literówek i błędów gramatycznych
- [ ] Spójna terminologia w całej stronie
- [ ] Język prosty i zrozumiały
- [ ] Brak marketingowego hype'u

---

## 6. Commity

### Planowane commity:

1. `refactor: rename superpowers files to prompt-templates`
2. `refactor: update all imports and references to prompt-templates`
3. `content: rename superpowers to prompt templates in user-facing text`
4. `feat: add transparency information to free models section`
5. `content: improve transparency across all sections`
6. `docs: update documentation for prompt templates rename`
7. `test: verify all changes work correctly`

---

## 7. Notatki

### 7.1 Wytyczne dotyczące języka

- Używaj "prompt template" (małe litery) w tekście ciągłym
- Używaj "Prompt Template" (wielkie litery) w nagłówkach i tytułach
- Używaj "Prompt Templates" (liczba mnoga) gdy mówisz o kolekcji

### 7.2 Wytyczne dotyczące transparentności

- Zawsze podawaj konkretne liczby tam gdzie to możliwe
- Zawsze zaznaczaj gdy coś jest opinią vs faktem
- Zawsze podawaj datę ostatniej weryfikacji
- Zawsze dodawaj link do oficjalnego źródła

### 7.3 Wytyczne dotyczące zaufania

- Nie używaj słów jak "amazing", "incredible", "best ever"
- Używaj słów jak "tested", "verified", "measured"
- Zawsze wyjaśniaj ograniczenia
- Zawsze bądź szczery o tym czego nie wiesz

---

**Autor:** Aether Planner  
**Data:** 2026-06-11  
**Status:** Gotowy do implementacji
