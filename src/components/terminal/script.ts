import { resolveCommand } from "./commands";
import { buildScript } from "./engine";
import type { ScriptedStep } from "./engine";

/**
 * The scroll-driven demo session. Responses come straight from
 * resolveCommand so the demo never drifts from what the interactive
 * terminal actually answers.
 */
const DEMO_COMMANDS = ["/stack", "/projects", "/status"];

const steps: ScriptedStep[] = DEMO_COMMANDS.map((command) => {
  const result = resolveCommand(command);
  if (!result) throw new Error(`demo script: unknown command ${command}`);
  return {
    command,
    response: result.response,
    isHTML: result.isHTML,
    mood: result.mood,
  };
});

export const DEMO_SCRIPT = buildScript(steps);
