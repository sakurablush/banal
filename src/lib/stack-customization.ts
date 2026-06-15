/**
 * Stack Customization - Allow users to customize tool stacks
 * Users can add/remove tools from predefined stacks and save custom versions
 */

import type { ToolStack } from '../types/tool';
import { zeroKeyTools } from '../data/zero-key-tools';

const CUSTOM_STACKS_KEY = 'banal_custom_stacks';

export interface CustomStack extends ToolStack {
  baseStackId?: string; // ID of the original stack this was customized from
  customizedAt: string; // ISO date
}

/**
 * Get all custom stacks from localStorage
 */
export function getCustomStacks(): CustomStack[] {
  try {
    const data = localStorage.getItem(CUSTOM_STACKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Failed to get custom stacks:', error);
    return [];
  }
}

/**
 * Save a custom stack to localStorage
 */
export function saveCustomStack(stack: CustomStack): void {
  try {
    const stacks = getCustomStacks();
    const existingIndex = stacks.findIndex(s => s.id === stack.id);
    
    if (existingIndex >= 0) {
      stacks[existingIndex] = stack;
    } else {
      stacks.push(stack);
    }
    
    localStorage.setItem(CUSTOM_STACKS_KEY, JSON.stringify(stacks));
  } catch (error) {
    console.warn('Failed to save custom stack:', error);
  }
}

/**
 * Delete a custom stack from localStorage
 */
export function deleteCustomStack(id: string): void {
  try {
    const stacks = getCustomStacks().filter(s => s.id !== id);
    localStorage.setItem(CUSTOM_STACKS_KEY, JSON.stringify(stacks));
  } catch (error) {
    console.warn('Failed to delete custom stack:', error);
  }
}

/**
 * Create a custom version of a predefined stack
 */
export function customizeStack(baseStack: ToolStack): CustomStack {
  const customId = `custom-${baseStack.id}-${Date.now()}`;
  
  return {
    ...baseStack,
    id: customId,
    name: `${baseStack.name} (Custom)`,
    baseStackId: baseStack.id,
    customizedAt: new Date().toISOString(),
    createdBy: 'User',
  };
}

/**
 * Add a tool to a custom stack
 */
export function addToolToStack(stack: CustomStack, toolId: string, role: string): CustomStack {
  const toolExists = zeroKeyTools.find(t => t.id === toolId);
  if (!toolExists) {
    console.warn(`Tool ${toolId} not found`);
    return stack;
  }
  
  const toolAlreadyInStack = stack.tools.some(t => t.toolId === toolId);
  if (toolAlreadyInStack) {
    console.warn(`Tool ${toolId} already in stack`);
    return stack;
  }
  
  return {
    ...stack,
    tools: [
      ...stack.tools,
      {
        toolId,
        role,
        optional: true,
      },
    ],
    customizedAt: new Date().toISOString(),
  };
}

/**
 * Remove a tool from a custom stack
 */
export function removeToolFromStack(stack: CustomStack, toolId: string): CustomStack {
  return {
    ...stack,
    tools: stack.tools.filter(t => t.toolId !== toolId),
    customizedAt: new Date().toISOString(),
  };
}

/**
 * Update a tool's role in a custom stack
 */
export function updateToolRole(stack: CustomStack, toolId: string, newRole: string): CustomStack {
  return {
    ...stack,
    tools: stack.tools.map(t => 
      t.toolId === toolId ? { ...t, role: newRole } : t
    ),
    customizedAt: new Date().toISOString(),
  };
}

/**
 * Calculate total cost for a custom stack
 */
export function calculateStackCost(stack: CustomStack): {
  total: string;
  breakdown: Array<{ tool: string; cost: string; notes?: string }>;
} {
  const breakdown: Array<{ tool: string; cost: string; notes?: string }> = [];
  let totalMonthly = 0;
  
  for (const stackTool of stack.tools) {
    const tool = zeroKeyTools.find(t => t.id === stackTool.toolId);
    if (!tool) continue;
    
    let cost = '$0';
    let notes = '';
    
    // Simple cost estimation based on access type
    if (tool.access === 'free-tier' || tool.access === 'free-key') {
      cost = '$0';
      notes = 'Free tier';
    } else if (tool.access === 'no-login' || tool.access === 'public-api') {
      cost = '$0';
      notes = 'Free';
    } else if (tool.access === 'open-source' || tool.access === 'self-host') {
      cost = '$0';
      notes = 'Self-hosted';
    } else {
      cost = '$0';
      notes = 'Free';
    }
    
    breakdown.push({
      tool: tool.name,
      cost,
      notes,
    });
  }
  
  return {
    total: totalMonthly > 0 ? `$${totalMonthly}/month` : '$0/month',
    breakdown,
  };
}

/**
 * Export custom stacks as JSON
 */
export function exportCustomStacks(): string {
  const stacks = getCustomStacks();
  return JSON.stringify(stacks, null, 2);
}

/**
 * Import custom stacks from JSON
 */
export function importCustomStacks(json: string): boolean {
  try {
    const stacks = JSON.parse(json) as CustomStack[];
    if (!Array.isArray(stacks)) {
      throw new Error('Invalid format');
    }
    
    localStorage.setItem(CUSTOM_STACKS_KEY, JSON.stringify(stacks));
    return true;
  } catch (error) {
    console.warn('Failed to import custom stacks:', error);
    return false;
  }
}

/**
 * Clear all custom stacks
 */
export function clearCustomStacks(): void {
  try {
    localStorage.removeItem(CUSTOM_STACKS_KEY);
  } catch (error) {
    console.warn('Failed to clear custom stacks:', error);
  }
}
