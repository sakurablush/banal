/**
 * Tool stack content localization — name, description, roles, workflow, cost notes, resources.
 * English is source of truth in tool-stacks.ts; Japanese lives in tool-stacks-ja.ts.
 */

import type { Lang } from '../i18n';
import type { ToolStack } from '../types/tool';
import { toolStacksJa } from '../data/tool-stacks-ja';

export function getLocalizedStack(stack: ToolStack, lang: Lang): ToolStack {
  if (lang !== 'ja') return stack;

  const ja = toolStacksJa[stack.id];
  if (!ja) return stack;

  return {
    ...stack,
    name: ja.name,
    description: ja.description,
    useCase: ja.useCase,
    tools: stack.tools.map((tool, i) => ({
      ...tool,
      role: ja.tools[i]?.role ?? tool.role,
    })),
    workflow: stack.workflow.map((step, i) => ({
      ...step,
      title: ja.workflow[i]?.title ?? step.title,
      description: ja.workflow[i]?.description ?? step.description,
    })),
    cost: {
      ...stack.cost,
      breakdown: stack.cost.breakdown.map((item, i) => ({
        ...item,
        notes: ja.cost.breakdown[i]?.notes ?? item.notes,
      })),
    },
    resources: stack.resources.map((resource, i) => ({
      ...resource,
      title: ja.resources[i]?.title ?? resource.title,
    })),
  };
}
