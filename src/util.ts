import { resolve } from "@std/path";

export function crash(message: string, data?: Record<string, string>): never {
  console.log("%cError: " + message, "color: red");

  if (data) {
    console.log(
      "%c" +
        Object.keys(data)
          .map((key) => `- ${key}: ${data[key]}`)
          .join("\n"),
      "color: red",
    );
  }
  Deno.exit(1);
}

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

export async function ensureDir(dir: string) {
  try {
    const stat = await Deno.stat(dir);
    if (!stat.isDirectory) {
      throw new Error(`Path exists but is not a directory: ${dir}`);
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      const parent = resolve(dir, "..");
      if (parent !== dir) {
        await ensureDir(parent);
      }
      try {
        await Deno.mkdir(dir);
      } catch (err) {
        if (!(err instanceof Deno.errors.AlreadyExists)) {
          throw err;
        }
      }
    } else {
      throw error;
    }
  }
}
