import { red } from "../deps.ts";

export function crash(message: string, data?: Record<string, string>): never {
  console.log(red("Error: " + message));
  if (data) {
    console.log(red(
      Object.keys(data)
        .map((key) => `- ${key}: ${data[key]}`)
        .join("\n"),
    ));
  }
  Deno.exit(1);
}
