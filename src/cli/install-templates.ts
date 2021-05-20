import { resolve, __dirname, green } from "../../deps.ts";

const tick = green("✓");

export function installTemplates(projectPath: string, templates: string[]) {
  templates.forEach(async (name) => {
    const origin = resolve(__dirname, "templates/syntax", name);
    const destination = resolve(projectPath, "estilo/syntax", name);
    // TODO handle this error
    try {
      await Deno.copyFile(origin, destination);
    } catch (err) {
      console.error(err);
    }
  });

  console.log(green(`Added ${templates.length} templates:`));
  console.log(
    templates
      .map((name) => name.slice(0, -4))
      .map((name) => `${tick} ${name}\n`)
      .join("")
  );
}
