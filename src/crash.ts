import { red } from "../deps.ts";
import { List } from "./common.ts";

type ErrorOpts = List;

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
