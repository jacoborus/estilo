import { buckets, green, resolve } from "../../deps.ts";

const tick = green("✓");

export function installTemplates(projectPath: string, templates: string[]) {
  templates.forEach((name) => {
    const destination = resolve(projectPath, "estilos/syntax", name);
    // TODO handle this error
    try {
      Deno.writeTextFileSync(destination, buckets.syntax[name] as string);
    } catch (err) {
      console.error(err);
    }
  });

  console.log(green(`Added ${templates.length} templates:`));
  console.log(
    templates
      .map((name) => name.slice(0, -4))
      .map((name) => `${tick} ${name}\n`)
      .join(""),
  );
}
