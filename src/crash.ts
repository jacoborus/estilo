import { red } from "../deps.ts";

type ErrorOpts = Record<string, string>;

export function crash(message: string, data?: ErrorOpts): never {
  console.log(red("Error: " + message));
  if (data) console.log(red(dataToText(data)));
  Deno.exit(1);
}

function dataToText(data: ErrorOpts): string {
  return Object.keys(data)
    .map((key) => `- ${key}: ${data[key]}`)
    .join("\n");
}
