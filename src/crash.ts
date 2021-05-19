import kleur from "kleur";

type ErrorOpts = Record<string, string>;

export function crash(message: string, data?: ErrorOpts): never {
  console.log(kleur.red("Error: " + message));
  if (data) console.log(kleur.red(dataToText(data)));
  process.exit(1);
}

function dataToText(data: ErrorOpts): string {
  return Object.keys(data)
    .map((key) => `- ${key}: ${data[key]}`)
    .join("\n");
}
