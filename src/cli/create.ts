import {
  green,
  Input,
  prompt,
  resolve,
  basename,
  ensureDirSync,
  handlebars,
  Leaf,
  __dirname,
} from "../../deps.ts";

import { installTemplates } from "./install-templates.ts";

interface ProjectOptions {
  name: string;
  author: string;
  version: string;
  url: string;
  license: string;
  airline: boolean;
  lightline: boolean;
  description: string;
}

const blankTermOrigin = resolve(__dirname, "templates/terminal.yml");
const defaultPalette = "myblue: '#99ccff'";

export async function createProject(
  projectPath: string,
  noQuestions: boolean,
  all: boolean
) {
  const folderName = basename(projectPath);
  if (noQuestions) {
    return createBoilerplate(projectPath, {
      name: folderName,
      author: "",
      version: "1.0.0",
      url: "",
      license: "MIT",
      airline: true,
      lightline: true,
      description: "A (neo)vim colorscheme",
    });
  }

  const answers = await prompt([
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
      message: "Short description:",
    },
  ]);

  createBoilerplate(projectPath, answers as ProjectOptions);
}

async function createBoilerplate(projectPath: string, options: ProjectOptions) {
  const addonsFolder = resolve(projectPath, "estilo");
  const termPath = resolve(addonsFolder, "terminal.yml");
  const estiloStr = renderConfigFile(options);
  const dir = resolve(projectPath, "estilo.yml");
  ensureDirSync(resolve(projectPath));
  Deno.writeTextFileSync(dir, estiloStr);
  const palettesPath = resolve(projectPath, "estilo", "palettes");
  ensureDirSync(resolve(projectPath, "estilo"));
  ensureDirSync(resolve(projectPath, "estilo", "syntax"));
  ensureDirSync(palettesPath);
  ensureDirSync(addonsFolder);
  Deno.writeTextFileSync(
    resolve(palettesPath, options.name + ".yml"),
    defaultPalette
  );
  await Deno.copyFile(blankTermOrigin, termPath);
  installTemplates(projectPath, ["base.yml"]);
  console.log(green("✓  Your project is ready\n"));
}

function renderConfigFile(options: ProjectOptions) {
  const mustachePath = resolve(__dirname, `mustaches/project.hbs`);
  const mustacheString = Leaf.readTextFileSync(mustachePath);
  const render = handlebars.compile(mustacheString);
  return render((options as unknown) as Record<string, string>);
}
