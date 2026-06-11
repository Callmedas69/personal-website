import type { LogEntry, MoodState } from "./types";

/**
 * Pure, seekable scripted-session engine. A session is flattened into
 * "units" (one typed character of a command, or one streamed unit of a
 * response — HTML tags count as a single atomic unit, mirroring the
 * interactive streamText logic). Rendering is a pure function of progress,
 * so ScrollTrigger can scrub forward and backward deterministically with
 * zero timers.
 */

export interface ScriptedStep {
  command: string;
  response: string;
  isHTML: boolean;
  mood: MoodState;
}

interface FlatStep extends ScriptedStep {
  /** string end-index per streamed unit (HTML tags atomic) */
  respBounds: number[];
  /** cumulative unit offset where this step's command typing begins */
  startUnit: number;
}

export interface FlatScript {
  steps: FlatStep[];
  totalUnits: number;
}

/** idle beat after each response so the scrub has breathing room */
const PAUSE_UNITS = 16;

export function buildScript(steps: ScriptedStep[]): FlatScript {
  let cursor = 0;
  const flat: FlatStep[] = steps.map((step) => {
    const respBounds: number[] = [];
    let i = 0;
    while (i < step.response.length) {
      if (step.isHTML && step.response[i] === "<") {
        const close = step.response.indexOf(">", i);
        if (close !== -1) {
          i = close + 1;
          respBounds.push(i);
          continue;
        }
      }
      i += 1;
      respBounds.push(i);
    }
    const f: FlatStep = { ...step, respBounds, startUnit: cursor };
    cursor += step.command.length + respBounds.length + PAUSE_UNITS;
    return f;
  });
  return { steps: flat, totalUnits: cursor };
}

export interface ScriptSlice {
  /** fully completed command/response entries */
  logs: LogEntry[];
  /** command currently being typed at the prompt (no response yet) */
  typingCommand: string | null;
  /** response currently streaming out */
  streaming: { command: string; partial: string; isHTML: boolean; mood: MoodState } | null;
  /** current mood for the mascot */
  mood: MoodState;
  done: boolean;
}

export function sliceAt(script: FlatScript, progress: number): ScriptSlice {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const unit = Math.floor(clamped * script.totalUnits);

  const logs: LogEntry[] = [];
  let typingCommand: string | null = null;
  let streaming: ScriptSlice["streaming"] = null;
  let mood: MoodState = "thinking";

  for (const step of script.steps) {
    const local = unit - step.startUnit;
    if (local <= 0) break;

    const cmdLen = step.command.length;
    if (local < cmdLen) {
      typingCommand = step.command.slice(0, local);
      break;
    }

    const respLocal = local - cmdLen;
    if (respLocal < step.respBounds.length) {
      streaming = {
        command: step.command,
        partial: respLocal === 0 ? "" : step.response.slice(0, step.respBounds[respLocal - 1]),
        isHTML: step.isHTML,
        mood: step.mood,
      };
      mood = step.mood;
      break;
    }

    // step complete (response finished; possibly in its pause beat)
    logs.push({ command: step.command, response: step.response, isHTML: step.isHTML, mood: step.mood });
    mood = step.mood;
    if (local < cmdLen + step.respBounds.length + PAUSE_UNITS) break;
  }

  return { logs, typingCommand, streaming, mood, done: unit >= script.totalUnits };
}
