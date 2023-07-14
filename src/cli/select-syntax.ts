import { resolve } from "path";
import { Checkbox, prompt } from "cliffy-prompt";

import assets from "../assets.ts";
import { installTemplates } from "./install-templates.ts";

// TODO: check if the folder contains a estilo project
export async function selectSyntax(projectPath: string, all = false) {
  const destFolder = resolve(projectPath, "estilos/syntax");

  const libFiles = Object.keys(assets.syntax);
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
    return {
      name: value + (disabled ? " (installed)" : ""),
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
