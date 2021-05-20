import { resolve, __dirname } from "../../deps.ts";

export function installTemplates(projectPath: string, templateNames: string[]) {
  templateNames.forEach(async (name) => {
    const origin = resolve(__dirname, "templates/syntax", name);
    const destination = resolve(projectPath, "estilo/syntax", name);
    // TODO handle this error
    try {
      await Deno.copyFile(origin, destination);
    } catch (err) {
      console.error(err);
    }
  });
  console.log(
    `Added ${templateNames.length} templates: ${templateNames.join(", ")}`
  );
}
