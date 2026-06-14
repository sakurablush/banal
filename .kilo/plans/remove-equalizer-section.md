# Plan: Usunięcie sekcji THE EQUALIZER i reorganizacja UI

## Status: ✅ GOTOWY DO IMPLEMENTACJI

## Cel

Usunąć mylną sekcję "THE EQUALIZER" i przenieść użyteczne elementy (quick starty, chat) w bardziej logiczne miejsca. Dodać do DIRECTORY sekcję z modelami AI oferującymi darmowe API keys.

---

## Faza 1: Usunięcie sekcji THE EQUALIZER z index.html

### Zmiany w `index.html`:

1. **Usunąć całą sekcję THE EQUALIZER** (linie ~169-193)
   - Usunąć `<section id="experience">` z całą zawartością
   - Zachować ID `experience` dla przyszłego użycia w modalu

2. **Zaktualizować nawigację w headerze**
   - Usunąć link do `#experience` z desktop nav (linia ~45)
   - Usunąć link do `#experience` z mobile nav (linia ~77)

### Walidacja:

- [ ] Sekcja THE EQUALIZER usunięta
- [ ] Brak błędów w konsoli
- [ ] Nawigacja działa poprawnie

---

## Faza 2: Stworzenie nowej sekcji "Quick Start" między DIRECTORY a SUPERPOWERS

### Zmiany w `index.html`:

1. **Dodać nową sekcję po sekcji DIRECTORY** (po linii ~167)

   ```html
   <section id="quickstart" class="py-8 sm:py-12 border-t border-white/5">
     <div class="max-w-7xl mx-auto px-4 sm:px-6">
       <div class="text-center mb-10">
         <div class="eyebrow-void">QUICK START</div>
         <h2 class="text-3xl sm:text-5xl font-black tracking-tight mb-4">
           <span class="gradient-neon">Popular prompts.</span>
           <span class="text-white/80">Copy & use.</span>
         </h2>
         <p class="text-white/40 max-w-lg mx-auto text-sm sm:text-base">
           5 ready-to-use superpowers for common situations.
           <span class="text-white/50">No account needed.</span>
         </p>
       </div>
       <div id="quickstart-root">
         <div class="text-center py-12 text-white/20 text-sm">
           <div class="inline-block px-6 py-3 rounded-xl glass-card">Loading quick starts...</div>
         </div>
       </div>
     </div>
   </section>
   ```

2. **Dodać link do nawigacji**
   - Dodać `<a href="#quickstart">Quick Start</a>` do desktop i mobile nav

### Zmiany w `src/main.ts`:

1. **Importować nową funkcję**

   ```typescript
   import { renderQuickStart } from './quickstart';
   ```

2. **Wywołać renderowanie**
   ```typescript
   renderQuickStart();
   ```

### Nowy plik `src/quickstart.ts`:

1. **Stworzyć moduł quick start**
   - Renderować 5 popularnych superpowers jako karty
   - Użyć istniejącej logiki z `chat.ts` (funkcja `renderQuickStarts`)
   - Każda karta: tytuł, opis, przycisk "Copy Template"
   - Po kliknięciu: otworzyć modal z formularzem (jak w superpowers)

### Walidacja:

- [ ] Nowa sekcja widoczna między DIRECTORY a SUPERPOWERS
- [ ] 5 kart quick start renderuje się poprawnie
- [ ] Przyciski "Copy Template" działają
- [ ] Modal z formularzem otwiera się po kliknięciu

---

## Faza 3: Dodanie sekcji "Free AI Models" do DIRECTORY

### Zmiany w `index.html`:

1. **Dodać nową sekcję po sekcji DIRECTORY** (przed Quick Start)

   ```html
   <section
     id="free-models"
     class="py-8 sm:py-12 border-t border-white/5 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent"
   >
     <div class="max-w-7xl mx-auto px-4 sm:px-6">
       <div class="text-center mb-10">
         <div class="eyebrow-void">FREE AI MODELS</div>
         <h2 class="text-3xl sm:text-5xl font-black tracking-tight mb-4">
           <span class="gradient-neon">Real AI.</span>
           <span class="text-white/80">Zero cost.</span>
         </h2>
         <p class="text-white/40 max-w-lg mx-auto text-sm sm:text-base">
           These providers offer free API keys with generous limits.
           <span class="text-white/50">No credit card required.</span>
         </p>
       </div>
       <div id="free-models-root">
         <div class="text-center py-12 text-white/20 text-sm">
           <div class="inline-block px-6 py-3 rounded-xl glass-card">Loading free models...</div>
         </div>
       </div>
     </div>
   </section>
   ```

2. **Dodać link do nawigacji**
   - Dodać `<a href="#free-models">Free Models</a>` do desktop i mobile nav

### Nowy plik `src/free-models.ts`:

1. **Stworzyć moduł free models**
   - Renderować karty z dostawcami darmowych API
   - Każda karta zawiera:
     - Logo/nazwa dostawcy
     - Opis darmowego tieru
     - Linki do warunków i rejestracji
     - Przycisk "Get Free Key"
     - Przycisk "Test API" (opcjonalnie)

2. **Lista dostawców** (na podstawie researchu):

   **Tier 1: Bez klucza API (Anonymous)**
   - **OVHcloud AI Endpoints**
     - Model: Meta-Llama-3_3-70B-Instruct
     - Limit: 2 RPM per IP
     - Zalety: Brak rejestracji, EU-hosted
     - Link: https://oai.endpoints.kepler.ai.cloud.ovh.net
     - Status: ✅ PRZETESTOWANY - DZIAŁA

   **Tier 2: Darmowy klucz API (wymaga rejestracji)**
   - **Groq**
     - Modele: Llama 3.1 8B, Llama 3.3 70B, Llama 4 Scout
     - Limit: 30 RPM, 6K TPM, 14.4K RPD
     - Zalety: Bardzo szybki, brak karty kredytowej
     - Link: https://console.groq.com/keys
     - Warunki: https://console.groq.com/docs/rate-limits

   - **Google Gemini**
     - Modele: Gemini Flash, Gemini Pro
     - Limit: Rate-limited, hojny darmowy tier
     - Zalety: Najlepsza jakość, brak karty kredytowej
     - Link: https://aistudio.google.com/app/apikey
     - Warunki: https://ai.google.dev/gemini-api/docs/rate-limits

   - **Hugging Face**
     - Modele: <10B params (Llama 3.2 8B, Qwen 2.5 7B, Mistral 7B)
     - Limit: ~10-20 RPM per IP
     - Zalety: Duży wybór modeli open-source
     - Link: https://huggingface.co/settings/tokens
     - Warunki: https://huggingface.co/pricing

   - **Mistral AI**
     - Modele: Mistral Large, Codestral, Pixtral
     - Limit: 2 RPM, 500K TPM, 1B tokens/miesiąc
     - Zalety: Dobre modele, brak karty kredytowej
     - Link: https://console.mistral.ai/
     - Warunki: https://docs.mistral.ai/getting-started/pricing/

   - **DeepSeek**
     - Modele: DeepSeek V3, DeepSeek R1
     - Limit: 5M tokens na start (30 dni)
     - Zalety: Bardzo tanie po darmowym tierze
     - Link: https://platform.deepseek.com/
     - Warunki: https://api-docs.deepseek.com/

   **Tier 3: Trial credits (jednorazowe)**
   - **Together AI**
     - Credits: $5-25 na start
     - Zalety: Duży wybór modeli open-source
     - Link: https://api.together.xyz/

   - **Fireworks AI**
     - Credits: Trial credits na start
     - Zalety: Szybki inference
     - Link: https://fireworks.ai/

3. **Design kart**
   - Glassmorphism style (jak reszta strony)
   - Badge "NO KEY" dla anonymous
   - Badge "FREE KEY" dla wymagających rejestracji
   - Badge "TRIAL" dla jednorazowych credits
   - Kolorowe akcenty dla każdego dostawcy
   - Responsywny grid (1-2-3 kolumny)

### Walidacja:

- [ ] Nowa sekcja widoczna po DIRECTORY
- [ ] Wszystkie karty renderują się poprawnie
- [ ] Linki do warunków działają
- [ ] Przyciski "Get Free Key" otwierają poprawne strony
- [ ] Responsywność działa na mobile/tablet

---

## Faza 4: Chat jako modal

### Zmiany w `index.html`:

1. **Dodać przycisk "Chat" w headerze**

   ```html
   <button id="open-chat-modal" class="text-white/60 hover:text-white transition-colors">
     Chat
   </button>
   ```

2. **Dodać modal chat na końcu body**
   ```html
   <div id="chat-modal" class="hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm">
     <div
       class="absolute inset-4 sm:inset-8 lg:inset-16 bg-[#06060b] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
     >
       <div class="flex items-center justify-between p-4 border-b border-white/10">
         <h3 class="text-xl font-bold">Chat with AI</h3>
         <button id="close-chat-modal" class="text-white/60 hover:text-white text-2xl">×</button>
       </div>
       <div id="chat-modal-content" class="flex-1 overflow-hidden">
         <!-- Chat UI will be rendered here -->
       </div>
     </div>
   </div>
   ```

### Nowy plik `src/chat-modal.ts`:

1. **Stworzyć moduł chat modal**
   - Obsługiwać otwieranie/zamykanie modala
   - Renderować chat UI wewnątrz modala
   - Przenosić logikę z `chat.ts` do modala
   - Zachować wszystkie funkcje: quick starts, superpowers, export, keys modal

2. **Logika otwierania/zamykania**

   ```typescript
   export function initChatModal() {
     const openBtn = document.getElementById('open-chat-modal');
     const closeBtn = document.getElementById('close-chat-modal');
     const modal = document.getElementById('chat-modal');
     const content = document.getElementById('chat-modal-content');

     openBtn?.addEventListener('click', () => {
       modal?.classList.remove('hidden');
       renderChatUI(content!);
     });

     closeBtn?.addEventListener('click', () => {
       modal?.classList.add('hidden');
     });

     modal?.addEventListener('click', (e) => {
       if (e.target === modal) {
         modal.classList.add('hidden');
       }
     });
   }
   ```

### Zmiany w `src/chat.ts`:

1. **Refaktoryzować do funkcji renderującej**
   - Przenieść logikę z `initChat()` do `renderChatUI(container: HTMLElement)`
   - Zachować wszystkie istniejące funkcje
   - Dostosować do renderowania w modalu zamiast w sekcji

### Walidacja:

- [ ] Przycisk "Chat" w headerze działa
- [ ] Modal otwiera się poprawnie
- [ ] Chat UI renderuje się w modalu
- [ ] Wszystkie funkcje chat działają (quick starts, superpowers, export, keys)
- [ ] Modal zamyka się na kliknięcie X lub poza modal
- [ ] Responsywność działa na mobile/tablet

---

## Faza 5: Testowanie i walidacja providerów

### Testy do wykonania:

1. **OVHcloud AI Endpoints (Anonymous)**
   - [x] PRZETESTOWANY - DZIAŁA
   - Limit: 2 RPM per IP
   - Uwaga: Bardzo restrykcyjny rate limit

2. **Groq**
   - [ ] Przetestować z darmowym kluczem API
   - [ ] Zweryfikować rate limits
   - [ ] Sprawdzić jakość odpowiedzi

3. **Google Gemini**
   - [ ] Przetestować z darmowym kluczem API
   - [ ] Zweryfikować rate limits
   - [ ] Sprawdzić jakość odpowiedzi

4. **Hugging Face**
   - [ ] Przetestować z darmowym kluczem API
   - [ ] Zweryfikować rate limits
   - [ ] Sprawdzić jakość odpowiedzi dla modeli <10B

5. **Mistral AI**
   - [ ] Przetestować z darmowym kluczem API
   - [ ] Zweryfikować rate limits
   - [ ] Sprawdzić jakość odpowiedzi

6. **DeepSeek**
   - [ ] Przetestować z darmowym kluczem API
   - [ ] Zweryfikować 5M tokens limit
   - [ ] Sprawdzić jakość odpowiedzi

### Zmiany w `src/providers/index.ts`:

1. **Dodać nowych providerów**
   - Mistral AI
   - DeepSeek
   - Together AI (opcjonalnie)

2. **Zaktualizować `pickBestFreeProvider()`**
   - Dodać logikę wyboru między providerami
   - Priorytet: OVH (anonymous) → Groq → Gemini → HF → Mistral → DeepSeek

3. **Dodać funkcje pomocnicze**
   - `getFreeKeyUrl()` - linki do rejestracji
   - `getProviderLimits()` - informacje o limitach
   - `testProvider()` - testowanie czy provider działa

### Walidacja:

- [ ] Wszystkie providerzy przetestowani
- [ ] Rate limits zweryfikowane
- [ ] Jakość odpowiedzi sprawdzona
- [ ] Logika wyboru providerów działa poprawnie

---

## Faza 6: Aktualizacja nawigacji i linków

### Zmiany w `index.html`:

1. **Zaktualizować desktop nav**

   ```html
   <div class="hidden sm:flex gap-6 text-sm">
     <a href="#tools" class="text-white/60 hover:text-white transition-colors">Tools</a>
     <a href="#free-models" class="text-white/60 hover:text-white transition-colors">Free Models</a>
     <a href="#quickstart" class="text-white/60 hover:text-white transition-colors">Quick Start</a>
     <a href="#superpowers" class="text-white/60 hover:text-white transition-colors">Superpowers</a>
     <a href="#playground" class="text-white/60 hover:text-white transition-colors"
       >API Playground</a
     >
     <a href="#articles" class="text-white/60 hover:text-white transition-colors">Articles</a>
     <button id="open-chat-modal" class="text-white/60 hover:text-white transition-colors">
       Chat
     </button>
   </div>
   ```

2. **Zaktualizować mobile nav**
   ```html
   <div class="sm:hidden border-t border-white/5 px-4 py-2 flex gap-4 text-xs overflow-x-auto">
     <a href="#tools" class="text-white/60 hover:text-white whitespace-nowrap">Tools</a>
     <a href="#free-models" class="text-white/60 hover:text-white whitespace-nowrap">Free Models</a>
     <a href="#quickstart" class="text-white/60 hover:text-white whitespace-nowrap">Quick Start</a>
     <a href="#superpowers" class="text-white/60 hover:text-white whitespace-nowrap">Superpowers</a>
     <a href="#playground" class="text-white/60 hover:text-white whitespace-nowrap">APIs</a>
     <a href="#articles" class="text-white/60 hover:text-white whitespace-nowrap">Articles</a>
     <button id="open-chat-modal" class="text-white/60 hover:text-white whitespace-nowrap">
       Chat
     </button>
   </div>
   ```

### Walidacja:

- [ ] Wszystkie linki w nawigacji działają
- [ ] Smooth scroll do sekcji działa
- [ ] Mobile nav jest responsywna
- [ ] Przycisk Chat otwiera modal

---

## Faza 7: Testy jednostkowe

### Nowe testy do napisania:

1. **`tests/quickstart.test.ts`**
   - Test renderowania kart quick start
   - Test kopiowania template'ów
   - Test otwierania modala z formularzem

2. **`tests/free-models.test.ts`**
   - Test renderowania kart dostawców
   - Test linków do warunków
   - Test przycisków "Get Free Key"

3. **`tests/chat-modal.test.ts`**
   - Test otwierania/zamykania modala
   - Test renderowania chat UI w modalu
   - Test zamykania na kliknięcie poza modal

4. **Zaktualizować `tests/providers.test.ts`**
   - Dodać testy dla nowych providerów
   - Test logiki wyboru providerów
   - Test funkcji pomocniczych

### Walidacja:

- [ ] Wszystkie nowe testy przechodzą
- [ ] Istniejące testy nadal przechodzą
- [ ] Coverage >80% dla nowych modułów

---

## Faza 8: Build i finalna walidacja

### Kroki:

1. **Uruchomić build**

   ```bash
   npm run build
   ```

2. **Uruchomić testy**

   ```bash
   npm test
   ```

3. **Manualne testowanie**
   - [ ] Otworzyć stronę w przeglądarce
   - [ ] Sprawdzić wszystkie sekcje
   - [ ] Przetestować nawigację
   - [ ] Przetestować chat modal
   - [ ] Przetestować quick starts
   - [ ] Przetestować free models
   - [ ] Sprawdzić responsywność na mobile/tablet

4. **Sprawdzić konsolę**
   - [ ] Brak błędów JavaScript
   - [ ] Brak warningów
   - [ ] Brak 404

### Walidacja:

- [ ] Build przechodzi bez błędów
- [ ] Wszystkie testy przechodzą
- [ ] Strona działa poprawnie w przeglądarce
- [ ] Brak błędów w konsoli
- [ ] Responsywność działa na wszystkich urządzeniach

---

## Podsumowanie zmian

### Usunięte:

- Sekcja THE EQUALIZER z index.html
- Link do #experience z nawigacji

### Dodane:

- Nowa sekcja "Quick Start" z 5 popularnymi superpowers
- Nowa sekcja "Free AI Models" z listą dostawców darmowych API
- Chat jako modal dostępny z headera
- Nowe moduły: `quickstart.ts`, `free-models.ts`, `chat-modal.ts`
- Nowe testy jednostkowe

### Zmodyfikowane:

- Nawigacja w headerze (desktop i mobile)
- `src/main.ts` - dodane importy i wywołania nowych modułów
- `src/chat.ts` - refaktoryzacja do funkcji renderującej
- `src/providers/index.ts` - dodani nowi providerzy i funkcje pomocnicze

### Korzyści:

- ✅ Jasna struktura strony
- ✅ Brak mylącej sekcji THE EQUALIZER
- ✅ Quick starty w logicznym miejscu
- ✅ Przejrzysta lista darmowych modeli AI
- ✅ Chat dostępny z każdego miejsca przez modal
- ✅ Lepsze UX i użyteczność

---

## Notatki

### OVHcloud AI Endpoints

- **Status**: ✅ PRZETESTOWANY - DZIAŁA
- **Endpoint**: https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions
- **Model**: Meta-Llama-3_3-70B-Instruct
- **Limit**: 2 RPM per IP (bardzo restrykcyjny)
- **Zalety**: Brak rejestracji, brak klucza API, EU-hosted
- **Wady**: Bardzo niski rate limit

### Rekomendacje

1. **Dla użytkowników bez klucza API**: OVH (anonymous) jako fallback
2. **Dla użytkowników z kluczem API**: Groq (najszybszy) → Gemini (najlepsza jakość) → HF (największy wybór)
3. **Dla zaawansowanych**: Mistral, DeepSeek, Together AI

### Priorytet implementacji

1. **Wysoki**: Faza 1, 2, 3 (usunięcie THE EQUALIZER, quick starts, free models)
2. **Średni**: Faza 4, 5 (chat modal, testowanie providerów)
3. **Niski**: Faza 6, 7, 8 (nawigacja, testy, build)

---

**Autor**: Aether Planner  
**Data**: 2026-06-11  
**Status**: ✅ GOTOWY DO IMPLEMENTACJI
