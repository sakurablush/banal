# Tools Database Audit - Free Model Access & Deduplication

**Date:** 2026-06-14  
**Status:** ✅ COMPLETE

---

## Issues Identified

1. **Duplicates:** Same tools under different IDs and names
2. **Rebranded tools:** Riffusion → Flow Music (Google)
3. **Missing distinction:** Tools with free model access vs free UI access
4. **Mis-categorized tools:** Claude Code and Gemini CLI in wrong categories

---

## Duplicates Removed

| Original Tool | Duplicate Tool | Action |
|---------------|----------------|--------|
| `riffusion` | flow-music (rebrand) | ✅ Renamed |
| `continue-dev` | `continue` | ✅ Removed duplicate |
| `suno` | `suno-ai` | ✅ Removed duplicate |
| `pika-free` | `pika-labs` | ✅ Removed duplicate |
| `midjourney-free` | `midjourney-web` | ✅ Removed duplicate |
| `gamma` | `gamma-app` | ✅ Removed duplicate |

**Total duplicates removed: 5 entries**  
**Tools count: 272 → 267**

---

## Category Corrections

| Tool | Changed From | Changed To |
|------|--------------|----------|
| `claude-code` | ai-agents | ai-coding |
| `gemini-cli` | ai-agents | ai-coding |

---

## true-free-models Badge

Added to tools providing genuine free AI model access (local CLI, free API tiers):

- `kilo-gateway` - Auto Free routes
- `openrouter-free` - Free model catalog
- `groq-api` - Ultra-fast open models
- `huggingface-inference-api` - Open model hosting
- `cerebras-inference` - 1M tokens/day
- `google-gemini-api` - 250K TPM free tier
- `continue-dev` - BYOK + free routes
- `kilo-code` - Auto Free built-in
- `multi-dev` - Zero config free providers
- `freehive` - OAuth token access
- `codeium` - Free individual tier
- `ollama` - Local open models
- `open-webui` - Self-hosted free models
- `jan-ai` - Local-first
- `gpt4all` - Downloadable models
- `koboldcpp` - Local inference
- `lm-studio` - Free tier local models
- `text-generation-webui` - Open source local models

---

## Documentation Updates

- README.md rewritten: clean structure, tools expanded by default, no duplicates
- All translations verified (English + Japanese, hand-crafted)