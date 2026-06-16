/**
 * Tool stack content localization — name, description, roles, workflow, cost notes, resources.
 * English is source of truth in tool-stacks.ts; Japanese lives in tool-stacks-ja.ts.
 */

import type { Lang } from '../i18n';
import { t } from '../i18n';
import { toolStacks } from '../data/tool-stacks';
import { toolStacksJa } from '../data/tool-stacks-ja';
import type { CustomStack } from './stack-customization';
import type { ToolStack } from '../types/tool';

const CUSTOM_SUFFIX_EN = / \(Custom\)(\s+\d+)?$/;
const CUSTOM_SUFFIX_JA = / （カスタム）(\s+\d+)?$/;

function resolveBaseStackId(stack: CustomStack): string | undefined {
  if (stack.baseStackId) return stack.baseStackId;
  const match = stack.id.match(/^custom-(.+)-\d+$/);
  return match?.[1];
}

function workflowsEqual(a: ToolStack['workflow'], b: ToolStack['workflow']): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (step, i) =>
      step.title === b[i]?.title &&
      step.description === b[i]?.description &&
      step.step === b[i]?.step
  );
}

function costBreakdownEqual(
  a: ToolStack['cost']['breakdown'],
  b: ToolStack['cost']['breakdown']
): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, i) => item.tool === b[i]?.tool && item.cost === b[i]?.cost && item.notes === b[i]?.notes
  );
}

function resourcesEqual(a: ToolStack['resources'], b: ToolStack['resources']): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, i) => item.title === b[i]?.title && item.url === b[i]?.url && item.type === b[i]?.type
  );
}

function extractCustomNumberSuffix(name: string): string {
  const en = name.match(CUSTOM_SUFFIX_EN);
  if (en) return en[1] ?? '';
  const ja = name.match(CUSTOM_SUFFIX_JA);
  if (ja) return ja[1] ?? '';
  return '';
}

function isAutoCustomName(name: string, baseEn: ToolStack): boolean {
  const baseJa = toolStacksJa[baseEn.id]?.name ?? baseEn.name;
  const suffix = extractCustomNumberSuffix(name);
  const candidates = [`${baseEn.name} (Custom)${suffix}`, `${baseJa} （カスタム）${suffix}`];
  return candidates.includes(name.trim());
}

function localizedCustomName(baseEn: ToolStack, custom: CustomStack, lang: Lang): string {
  const localized = getLocalizedStack(baseEn, lang);
  const suffix = t(lang, 'stacks.customNameSuffix');
  const numberSuffix = extractCustomNumberSuffix(custom.name);
  return `${localized.name} ${suffix}${numberSuffix}`;
}

function mergeCustomStack(baseEn: ToolStack, custom: CustomStack, lang: Lang): ToolStack {
  const localized = getLocalizedStack(baseEn, lang);
  const enRoleById = new Map(baseEn.tools.map((tool) => [tool.toolId, tool.role]));

  const tools = custom.tools.map((tool) => {
    const enRole = enRoleById.get(tool.toolId);
    const localizedTool = localized.tools.find((entry) => entry.toolId === tool.toolId);
    if (enRole && tool.role === enRole && localizedTool) {
      return { ...tool, role: localizedTool.role };
    }
    return tool;
  });

  const workflow = workflowsEqual(custom.workflow, baseEn.workflow)
    ? localized.workflow
    : custom.workflow.map((step, index) => {
        const enStep = baseEn.workflow[index];
        const jaStep = localized.workflow[index];
        if (
          enStep &&
          jaStep &&
          step.title === enStep.title &&
          step.description === enStep.description
        ) {
          return { ...step, title: jaStep.title, description: jaStep.description };
        }
        return step;
      });

  const costUnchanged =
    custom.cost.total === baseEn.cost.total &&
    costBreakdownEqual(custom.cost.breakdown, baseEn.cost.breakdown);

  const cost = costUnchanged
    ? localized.cost
    : {
        ...custom.cost,
        total: localized.cost.total,
        breakdown: custom.cost.breakdown.map((item, index) => {
          const enItem = baseEn.cost.breakdown[index];
          const jaItem = localized.cost.breakdown[index];
          if (
            enItem &&
            jaItem &&
            item.tool === enItem.tool &&
            item.cost === enItem.cost &&
            item.notes === enItem.notes
          ) {
            return { ...item, notes: jaItem.notes };
          }
          return item;
        }),
      };

  const resources = resourcesEqual(custom.resources, baseEn.resources)
    ? localized.resources
    : custom.resources.map((resource, index) => {
        const enResource = baseEn.resources[index];
        const jaResource = localized.resources[index];
        if (
          enResource &&
          jaResource &&
          resource.title === enResource.title &&
          resource.url === enResource.url &&
          resource.type === enResource.type
        ) {
          return { ...resource, title: jaResource.title };
        }
        return resource;
      });

  return {
    ...custom,
    name: isAutoCustomName(custom.name, baseEn)
      ? localizedCustomName(baseEn, custom, lang)
      : custom.name,
    description:
      custom.description === baseEn.description ? localized.description : custom.description,
    useCase: custom.useCase === baseEn.useCase ? localized.useCase : custom.useCase,
    tools,
    workflow,
    cost,
    resources,
  };
}

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
      total: ja.cost.total ?? stack.cost.total,
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

/** Localize curated stacks and re-localize custom stacks from their EN base. */
export function getDisplayStack(stack: ToolStack, lang: Lang): ToolStack {
  if (lang !== 'ja') return stack;

  const custom = stack as CustomStack;
  const baseId = resolveBaseStackId(custom);
  if (baseId) {
    const baseEn = toolStacks.find((entry) => entry.id === baseId);
    if (baseEn) {
      return mergeCustomStack(baseEn, custom, lang);
    }
  }
  return getLocalizedStack(stack, lang);
}
