import { describe, it, expect } from 'vitest';
import {
  inferenceProviders,
  getProviderById,
  getNoCardProviders,
  getOpenAICompatibleProviders,
  getProvidersByGenerosity,
} from '../src/data/inference-providers';

describe('Inference Providers', () => {
  describe('Data Integrity', () => {
    it('should have 13+ providers', () => {
      expect(inferenceProviders.length).toBeGreaterThanOrEqual(13);
    });

    it('should have unique IDs', () => {
      const ids = inferenceProviders.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid URLs', () => {
      for (const provider of inferenceProviders) {
        expect(provider.url).toMatch(/^https?:\/\//);
      }
    });

    it('should have required fields', () => {
      for (const provider of inferenceProviders) {
        expect(provider.id).toBeTruthy();
        expect(provider.name).toBeTruthy();
        expect(provider.url).toBeTruthy();
        expect(provider.freeTier).toBeTruthy();
        expect(provider.apiFormat).toBeTruthy();
        expect(provider.quality).toBeTruthy();
        expect(provider.bestFor).toBeTruthy();
      }
    });

    it('should have valid free tier info', () => {
      for (const provider of inferenceProviders) {
        expect(typeof provider.freeTier.requiresCard).toBe('boolean');
        expect(typeof provider.freeTier.requiresSignup).toBe('boolean');
        expect(provider.freeTier.limits).toBeTruthy();
      }
    });

    it('should have valid quality info', () => {
      for (const provider of inferenceProviders) {
        expect(['ultra-fast', 'fast', 'normal', 'slow']).toContain(provider.quality.speed);
        expect(['high', 'medium', 'low']).toContain(provider.quality.reliability);
      }
    });

    it('should have valid API format', () => {
      for (const provider of inferenceProviders) {
        expect(['openai-compatible', 'custom', 'anthropic-compatible']).toContain(provider.apiFormat);
      }
    });

    it('should have top free models', () => {
      for (const provider of inferenceProviders) {
        expect(provider.topFreeModels.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getProviderById', () => {
    it('should return provider for valid ID', () => {
      const provider = getProviderById('groq');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Groq');
    });

    it('should return undefined for invalid ID', () => {
      const provider = getProviderById('nonexistent');
      expect(provider).toBeUndefined();
    });

    it('should return correct provider for each ID', () => {
      for (const p of inferenceProviders) {
        const found = getProviderById(p.id);
        expect(found).toBe(p);
      }
    });
  });

  describe('getNoCardProviders', () => {
    it('should return providers that do not require credit card', () => {
      const noCard = getNoCardProviders();
      
      expect(noCard.length).toBeGreaterThan(0);
      expect(noCard.every(p => !p.freeTier.requiresCard)).toBe(true);
    });

    it('should include most providers', () => {
      const noCard = getNoCardProviders();
      expect(noCard.length).toBeGreaterThan(10);
    });
  });

  describe('getOpenAICompatibleProviders', () => {
    it('should return providers with OpenAI-compatible API', () => {
      const compatible = getOpenAICompatibleProviders();
      
      expect(compatible.length).toBeGreaterThan(0);
      expect(compatible.every(p => p.apiFormat === 'openai-compatible')).toBe(true);
    });

    it('should include most providers', () => {
      const compatible = getOpenAICompatibleProviders();
      expect(compatible.length).toBeGreaterThan(8);
    });
  });

  describe('getProvidersByGenerosity', () => {
    it('should return all providers', () => {
      const sorted = getProvidersByGenerosity();
      expect(sorted.length).toBe(inferenceProviders.length);
    });

    it('should sort by generosity score', () => {
      const sorted = getProvidersByGenerosity();
      
      // First provider should have highest score
      const first = sorted[0];
      expect(first.freeTier.requiresCard).toBe(false);
    });

    it('should prioritize no-card providers', () => {
      const sorted = getProvidersByGenerosity();
      
      // Most no-card providers should be at the top
      const noCardCount = sorted.slice(0, 10).filter(p => !p.freeTier.requiresCard).length;
      expect(noCardCount).toBeGreaterThan(8);
    });
  });

  describe('Specific Providers', () => {
    it('should have Google AI Studio', () => {
      const provider = getProviderById('google-ai-studio');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Google');
      expect(provider?.freeTier.requiresCard).toBe(false);
    });

    it('should have Cerebras', () => {
      const provider = getProviderById('cerebras');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Cerebras');
      expect(provider?.quality.speed).toBe('ultra-fast');
    });

    it('should have Groq', () => {
      const provider = getProviderById('groq');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Groq');
      expect(provider?.quality.speed).toBe('ultra-fast');
    });

    it('should have OpenRouter', () => {
      const provider = getProviderById('openrouter');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('OpenRouter');
      expect(provider?.apiFormat).toBe('openai-compatible');
    });

    it('should have Kilo Gateway', () => {
      const provider = getProviderById('kilo-gateway');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Kilo');
      expect(provider?.freeTier.requiresSignup).toBe(false);
    });

    it('should have Novita AI', () => {
      const provider = getProviderById('novita');
      expect(provider).toBeTruthy();
      expect(provider?.name).toContain('Novita');
    });
  });
});
