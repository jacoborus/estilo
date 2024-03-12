import {
  basename,
  ensureDirSync,
  Input,
  prompt,
  render,
  resolve,
} from "../deps.ts";
import { List } from "../types.ts";
import assets from "../assets.ts";

interface ProjectOptions {
  name: string;
  author: string;
  version: string;
  url: string;
  license: string;
  description: string;
}

const defaultPalette = "myblue: '#99ccff'";

export async function createProject(projectPath: string, noQuestions: boolean) {
  const options = noQuestions
    ? getDefaultConfig(projectPath)
    : await askConfig(projectPath);
  await createBoilerplate(projectPath, options as ProjectOptions);
}

function getDefaultConfig(projectPath: string): ProjectOptions {
  return {
    name: basename(projectPath),
    author: "",
    version: "1.0.0",
    url: "",
    license: "MIT",
    description: "A (neo)vim colorscheme",
  };
}

async function askConfig(projectPath: string) {
  const folderName = basename(projectPath);
  return await prompt([
    {
      type: Input,
      name: "name",
      message: "Project name:",
      default: folderName,
    },
    {
      type: Input,
      name: "version",
      message: "Version:",
      default: "1.0.0",
    },
    {
      type: Input,
      name: "license",
      message: "License:",
      default: "MIT",
    },
    {
      type: Input,
      name: "author",
      message: "Author:",
    },
    {
      type: Input,
      name: "url",
      message: "Project url:",
    },
    {
      type: Input,
      name: "description",
      message: "Description:",
    },
  ]);
}

async function createBoilerplate(projectPath: string, options: ProjectOptions) {
  const estiloStr = await renderConfigFile(options);

  const estilosFolder = resolve(projectPath, "estilos");
  const syntaxFolder = resolve(estilosFolder, "syntax");
  const palettesFolder = resolve(estilosFolder, "palettes");

  ensureDirSync(estilosFolder);
  ensureDirSync(syntaxFolder);
  ensureDirSync(palettesFolder);

  Deno.writeTextFileSync(resolve(projectPath, "estilo.yml"), estiloStr);
  Deno.writeTextFileSync(
    resolve(estilosFolder, "terminal.yml"),
    assets.addons.terminal,
  );
  Deno.writeTextFileSync(
    resolve(palettesFolder, options.name + ".yml"),
    defaultPalette,
  );
  Deno.writeTextFileSync(
    resolve(syntaxFolder, "base.yml"),
    assets.syntax.base,
  );
  Deno.writeTextFileSync(
    resolve(syntaxFolder, "treesitter.yml"),
    assets.syntax.treesitter,
  );

  console.log("%c✓  Your project is ready\n", "color: green");
}

async function renderConfigFile(options: ProjectOptions): Promise<string> {
  return (await render(
    assets.mustaches["project"] as string,
    options as unknown as List,
  )) as string;
}
