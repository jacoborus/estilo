import {
  basename,
  ensureDirSync,
  green,
  handlebars,
  Input,
  prompt,
  resolve,
} from "../../deps.ts";

import { installTemplates } from "./install-templates.ts";
import { buckets } from "../../buckets.ts";

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
  createBoilerplate(projectPath, options as ProjectOptions);
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

function createBoilerplate(projectPath: string, options: ProjectOptions) {
  const estiloStr = renderConfigFile(options);

  const estilosFolder = resolve(projectPath, "estilos");
  const syntaxFolder = resolve(estilosFolder, "syntax");
  const palettesFolder = resolve(estilosFolder, "palettes");

  ensureDirSync(estilosFolder);
  ensureDirSync(syntaxFolder);
  ensureDirSync(palettesFolder);

  Deno.writeTextFileSync(resolve(projectPath, "estilo.yml"), estiloStr);
  Deno.writeTextFileSync(
    resolve(estilosFolder, "terminal.yml"),
    buckets.addons["terminal.yml"] as string,
  );
  Deno.writeTextFileSync(
    resolve(palettesFolder, options.name + ".yml"),
    defaultPalette,
  );
  installTemplates(projectPath, ["base.yml"]);

  console.log(green("✓  Your project is ready\n"));
}

function renderConfigFile(options: ProjectOptions) {
  const render = handlebars.compile(buckets.mustaches["project.hbs"] as string);
  return render((options as unknown) as Record<string, string>);
}
