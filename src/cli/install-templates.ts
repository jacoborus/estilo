import { resolve, __dirname, green } from "../../deps.ts";

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
  const nameList = templates.map((name) => `- ${name}\n`).join("");
  console.log(green(`✓ Added ${templates.length} templates:`));
  console.log(nameList);
}
