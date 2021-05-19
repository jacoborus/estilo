import { resolve } from "https://deno.land/std/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

export function installTemplates(projectPath: string, templateNames: string[]) {
  templateNames.forEach(async (name) => {
    const origin = resolve(__dirname, "../..", "templates/syntax", name);
    const destination = resolve(projectPath, "estilo/syntax", name);
    // TODO handle this error
    try {
      await Deno.copyFile(origin, destination);
    } catch (err) {
      console.error(err);
    }
  });
}
