import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCustomStacks,
  saveCustomStack,
  deleteCustomStack,
  customizeStack,
  addToolToStack,
  removeToolFromStack,
  updateToolRole,
  calculateStackCost,
  exportCustomStacks,
  importCustomStacks,
  clearCustomStacks,
} from '../src/lib/stack-customization';
import { toolStacks } from '../src/data/tool-stacks';

describe('Stack Customization', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getCustomStacks', () => {
    it('should return empty array when no custom stacks', () => {
      const stacks = getCustomStacks();
      expect(stacks).toEqual([]);
    });

    it('should return saved custom stacks', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      saveCustomStack(customStack);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(1);
      expect(stacks[0].id).toBe(customStack.id);
    });
  });

  describe('saveCustomStack', () => {
    it('should save a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      saveCustomStack(customStack);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(1);
      expect(stacks[0].id).toBe(customStack.id);
    });

    it('should update existing custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      saveCustomStack(customStack);
      
      const updatedStack = { ...customStack, name: 'Updated Name' };
      saveCustomStack(updatedStack);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(1);
      expect(stacks[0].name).toBe('Updated Name');
    });

    it('should refuse more than 20 custom stacks', () => {
      const baseStack = toolStacks[0];
      for (let i = 0; i < 21; i++) {
        const stack = { ...customizeStack(baseStack), id: `custom-test-${i}` };
        const ok = saveCustomStack(stack);
        if (i < 20) expect(ok).toBe(true);
        else expect(ok).toBe(false);
      }
      expect(getCustomStacks()).toHaveLength(20);
    });
  });

  describe('deleteCustomStack', () => {
    it('should delete a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      saveCustomStack(customStack);
      deleteCustomStack(customStack.id);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(0);
    });

    it('should not affect other stacks', () => {
      const baseStack1 = toolStacks[0];
      const baseStack2 = toolStacks[1];
      const customStack1 = customizeStack(baseStack1);
      const customStack2 = customizeStack(baseStack2);
      
      saveCustomStack(customStack1);
      saveCustomStack(customStack2);
      deleteCustomStack(customStack1.id);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(1);
      expect(stacks[0].id).toBe(customStack2.id);
    });
  });

  describe('customizeStack', () => {
    it('should create a custom version of a stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);

      expect(customStack.id).toContain('custom-');
      expect(customStack.name).toContain('(Custom)');
      expect(customStack.baseStackId).toBe(baseStack.id);
      expect(customStack.customizedAt).toBeTruthy();
      expect(customStack.createdBy).toBe('User');
      expect(customStack.tools).toEqual(baseStack.tools);
    });
  });

  describe('addToolToStack', () => {
    it('should add a tool to a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      const updatedStack = addToolToStack(customStack, 'ollama', 'Local AI');

      expect(updatedStack.tools).toHaveLength(baseStack.tools.length + 1);
      expect(updatedStack.tools[updatedStack.tools.length - 1].toolId).toBe('ollama');
      expect(updatedStack.tools[updatedStack.tools.length - 1].role).toBe('Local AI');
      expect(updatedStack.tools[updatedStack.tools.length - 1].optional).toBe(true);
    });

    it('should not add duplicate tool', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const existingToolId = baseStack.tools[0].toolId;
      
      const updatedStack = addToolToStack(customStack, existingToolId, 'Duplicate');

      expect(updatedStack.tools).toHaveLength(baseStack.tools.length);
    });

    it('should not add non-existent tool', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      const updatedStack = addToolToStack(customStack, 'non-existent-tool', 'Test');

      expect(updatedStack.tools).toHaveLength(baseStack.tools.length);
    });
  });

  describe('removeToolFromStack', () => {
    it('should remove a tool from a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const toolId = baseStack.tools[0].toolId;
      
      const updatedStack = removeToolFromStack(customStack, toolId);

      expect(updatedStack.tools).toHaveLength(baseStack.tools.length - 1);
      expect(updatedStack.tools.find(t => t.toolId === toolId)).toBeUndefined();
    });

    it('should not affect other tools', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const toolId = baseStack.tools[0].toolId;
      
      const updatedStack = removeToolFromStack(customStack, toolId);

      expect(updatedStack.tools).toHaveLength(baseStack.tools.length - 1);
      baseStack.tools.slice(1).forEach(tool => {
        expect(updatedStack.tools.find(t => t.toolId === tool.toolId)).toBeTruthy();
      });
    });
  });

  describe('updateToolRole', () => {
    it('should update a tool role in a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const toolId = baseStack.tools[0].toolId;
      
      const updatedStack = updateToolRole(customStack, toolId, 'New Role');

      const updatedTool = updatedStack.tools.find(t => t.toolId === toolId);
      expect(updatedTool?.role).toBe('New Role');
    });

    it('should not affect other tools', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const toolId = baseStack.tools[0].toolId;
      
      const updatedStack = updateToolRole(customStack, toolId, 'New Role');

      baseStack.tools.slice(1).forEach(tool => {
        const updatedTool = updatedStack.tools.find(t => t.toolId === tool.toolId);
        expect(updatedTool?.role).toBe(tool.role);
      });
    });
  });

  describe('calculateStackCost', () => {
    it('should calculate cost for a custom stack', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      
      const cost = calculateStackCost(customStack);

      expect(cost.total).toBeTruthy();
      expect(cost.breakdown).toHaveLength(customStack.tools.length);
      cost.breakdown.forEach(item => {
        expect(item.tool).toBeTruthy();
        expect(item.cost).toBeTruthy();
      });
    });

    it('should return $0/month for free tools', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);

      const cost = calculateStackCost(customStack);

      // Most tools in predefined stacks are free
      expect(cost.total).toMatch(/\$0/);
    });

    it('returns Japanese cost notes when lang is ja', () => {
      const customStack = customizeStack(toolStacks[0], 'ja');
      const cost = calculateStackCost(customStack, 'ja');
      expect(cost.total).toBe('$0/月');
      for (const item of cost.breakdown) {
        expect(item.notes).toMatch(/無料|セルフホスト/);
      }
    });
  });

  describe('exportCustomStacks', () => {
    it('should export custom stacks as JSON', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      saveCustomStack(customStack);

      const json = exportCustomStacks();
      const parsed = JSON.parse(json);
      
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe(customStack.id);
    });

    it('should export empty array when no custom stacks', () => {
      const json = exportCustomStacks();
      const parsed = JSON.parse(json);
      expect(parsed).toEqual([]);
    });
  });

  describe('importCustomStacks', () => {
    it('should import custom stacks from JSON', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      const json = JSON.stringify([customStack]);

      const result = importCustomStacks(json);
      expect(result).toBe(true);

      const stacks = getCustomStacks();
      expect(stacks).toHaveLength(1);
      expect(stacks[0].id).toBe(customStack.id);
    });

    it('should return false for invalid JSON', () => {
      const result = importCustomStacks('invalid json');
      expect(result).toBe(false);
    });

    it('should return false for non-array JSON', () => {
      const result = importCustomStacks('{"not": "array"}');
      expect(result).toBe(false);
    });
  });

  describe('clearCustomStacks', () => {
    it('should clear all custom stacks', () => {
      const baseStack = toolStacks[0];
      const customStack = customizeStack(baseStack);
      saveCustomStack(customStack);

      clearCustomStacks();

      const stacks = getCustomStacks();
      expect(stacks).toEqual([]);
    });
  });
});
