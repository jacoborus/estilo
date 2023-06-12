import { resolve } from "path";

import assets from "../assets.ts";

export function installTemplates(projectPath: string, templates: string[]) {
  templates.forEach((name) => {
    const destination = resolve(projectPath, "estilos/syntax", name);
    try {
      Deno.writeTextFileSync(destination, assets.syntax[name] as string);
    } catch (err) {
      console.error(err);
    }
  });

  console.log(`%cAdded ${templates.length} templates:`, "color: green");
  templates
    .map((name) => `%c✓ %c${name.slice(0, -4)}`)
    .forEach((line) => console.log(line, "color: green", "color: default"));
}
