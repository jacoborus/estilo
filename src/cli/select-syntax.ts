import { Checkbox, prompt, resolve } from "../../deps.ts";
import { buckets } from "../../buckets.ts";
import { installTemplates } from "./install-templates.ts";

// TODO: check if the folder contains a estilo project
export async function selectSyntax(projectPath: string, all = false) {
  const destFolder = resolve(projectPath, "estilo/syntax");

  const libFiles = Object.keys(buckets.syntax);
  const destFiles = getFileNamesFromFolder(destFolder);

  const templates = all
    ? getMissingTemplates(libFiles, destFiles)
    : (await askForTemplates(libFiles, destFiles)).templates;

  installTemplates(projectPath, templates as string[]);
}

function getFileNamesFromFolder(folder: string) {
  return Array.from(Deno.readDirSync(folder)).map((file) => file.name);
}

function getMissingTemplates(libFiles: string[], destFiles: string[]) {
  return libFiles.filter((template) => !destFiles.includes(template));
}

async function askForTemplates(libFiles: string[], destFiles: string[]) {
  const options = libFiles.map((value) => {
    const disabled = destFiles.includes(value);
    const name = value.slice(0, -4);
    return {
      name: name + (disabled ? " (installed)" : ""),
      value,
      disabled,
    };
  });

  return await prompt([
    {
      type: Checkbox,
      message: "Select some extra syntax templates",
      name: "templates",
      options,
    },
  ]);
}
