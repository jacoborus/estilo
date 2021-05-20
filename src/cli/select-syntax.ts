import { Checkbox, prompt, resolve, __dirname } from "../../deps.ts";
import { installTemplates } from "./install-templates.ts";

// TODO: check if the folder contains a estilo project
export async function selectSyntax(projectPath: string, all = false) {
  const libFolder = resolve(__dirname, "templates/syntax");
  const destFolder = resolve(projectPath, "estilo/syntax");

  const libFiles = getFileNamesFromFolder(libFolder);
  const destFiles = getFileNamesFromFolder(destFolder);

  if (all) addMissingTemplates(projectPath, libFiles, destFiles);
  else await askAndAddTemplates(projectPath, libFiles, destFiles);
}

function getFileNamesFromFolder(folder: string) {
  return Array.from(Deno.readDirSync(folder)).map((file) => file.name);
}

function addMissingTemplates(
  projectPath: string,
  libFiles: string[],
  destFiles: string[]
) {
  const missing = libFiles.filter((template) => !destFiles.includes(template));
  installTemplates(projectPath, missing);
}

async function askAndAddTemplates(
  projectPath: string,
  libFiles: string[],
  destFiles: string[]
) {
  const options = libFiles.map((value) => {
    const disabled = destFiles.includes(value);
    const name = value.slice(0, -4);
    return {
      name: name + (disabled ? " (installed)" : ""),
      value,
      disabled,
    };
  });

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
