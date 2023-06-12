import { crash } from "./crash.ts";

export const version = "2.0.0-beta-7";

export function isHexColor(color: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}

export function assertIsObject(
  input: unknown,
  filepath: string,
): asserts input is Record<string, string> {
  if (typeof input !== "object" || input === null) {
    crash("Content of file is not a list of strings", { filepath });
  }
}

export function assertIsList(
  input: unknown,
  filepath: string,
): asserts input is Record<string, string> {
  assertIsObject(input, filepath);
  const content = input as Record<string, unknown>;
  for (const key of Object.keys(input)) {
    const value = content[key];
    if (typeof value !== "string") {
      crash("Content of file is not a list of strings", { filepath });
    }
  }
}

export function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
  } catch (e) {
    return !e;
  }
  return true;
}
