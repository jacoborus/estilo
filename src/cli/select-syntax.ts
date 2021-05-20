import { Checkbox, prompt, resolve, __dirname } from "../../deps.ts";
import { installTemplates } from "./install-templates.ts";

// TODO: check if the folder contains a estilo project
export async function selectSyntax(projectPath: string, all = false) {
  const libFolder = resolve(__dirname, "templates/syntax");
  const destFolder = resolve(projectPath, "estilo/syntax");

  const templateFiles = Array.from(Deno.readDirSync(libFolder)).map(
    (file) => file.name
  );
  const installedSyntax = Array.from(Deno.readDirSync(destFolder)).map(
    (file) => file.name
  );

  if (all) {
    const templates = getMissingTemplates(templateFiles, installedSyntax);
    return installTemplates(projectPath, templates as string[]);
  }

  const options = getOptions(templateFiles, installedSyntax);
  const answers = await prompt([
    {
      type: Checkbox,
      message: "Select some extra syntax templates",
      name: "templates",
      options,
    },
  ]);

  installTemplates(projectPath, answers.templates as string[]);
}

function getOptions(templates: string[], installed: string[]) {
  return templates.map((value) => {
    const disabled = installed.includes(value);
    const name = value.slice(0, -4);
    return {
      name: name + (disabled ? " (installed)" : ""),
      value,
      disabled,
    };
  });
}

function getMissingTemplates(origin: string[], destination: string[]) {
  return origin.filter((template) => !destination.includes(template));
}
