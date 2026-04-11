import type { AgentMiddleware } from "@/agent/agent-middleware";
import { SettingsLoader, SettingsWriter } from "@/coding/settings";
import type { ToolUseContent } from "@/foundation";

import type { ApprovalDecision } from "./approval-types";

const settingsLoader = new SettingsLoader();
const settingsWriter = new SettingsWriter(settingsLoader);

export function createCodingApprovalMiddleware(options: {
  cwd: string;
  requiresApproval: string[];
  // eslint-disable-next-line no-unused-vars
  askUser: (toolUse: ToolUseContent) => Promise<ApprovalDecision>;
}): AgentMiddleware {
  return {
    beforeToolUse: async ({ toolUse }) => {
      if (!options.requiresApproval.includes(toolUse.name)) {
        return;
      }
      const allowed = await settingsLoader.loadAllowList(options.cwd);
      if (allowed.has(toolUse.name)) {
        return;
      }
      const decision = await options.askUser(toolUse);
      if (decision === "deny") {
        return {
          __skip: true,
          result: `User denied execution of tool: ${toolUse.name}. You must either find an alternative approach or ask the user for clarification.`,
        };
      }
      if (decision === "allow_always_project") {
        try {
          await settingsWriter.appendAllowedTool(options.cwd, toolUse.name);
        } catch (e) {
          console.warn(`[helixent] Could not persist allow for ${toolUse.name}:`, e);
        }
      }
    },
  };
}
