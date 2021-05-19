import { Checkbox, prompt, resolve, __dirname } from "../../deps.ts";
import { installTemplates } from "./install-templates.ts";

// TODO: check if the folder contains a estilo project
export async function selectSyntax(
  projectPath: string,
  syntax = [] as string[]
) {
  if (syntax.length) {
    return console.log(syntax);
  }
  const syntaxFolder = resolve(__dirname, "templates/syntax");
  const syntaxDestFolder = resolve(projectPath, "estilo/syntax");
  const templateFiles = Array.from(Deno.readDirSync(syntaxFolder)).map(
    (file) => file.name
  );
  console.log("=========");
  console.log(syntaxDestFolder);
  console.log("^^^^^^^^^");
  const installedSyntax = Array.from(Deno.readDirSync(syntaxDestFolder)).map(
    (file) => file.name
  );

  const templateChoices = templateFiles.map((file) => {
    const isDisabled = installedSyntax.includes(file);
    let syntaxName = file.slice(0, -4);
    if (isDisabled) syntaxName += " (installed)";
    return {
      name: syntaxName,
      value: file,
      disabled: isDisabled,
    };
  });

  const answers = await prompt([
    {
      type: Checkbox,
      message: "Select some extra syntax templates",
      name: "templates",
      options: templateChoices,
    },
  ]);

  installTemplates(projectPath, answers.templates as string[]);
}
