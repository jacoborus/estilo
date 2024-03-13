import { ensureDirSync } from "jsr:@std/fs@0.219.1";
import { basename, resolve } from "jsr:@std/path@0.219.1";
import { render } from "npm:eta@1.14.2";

import { List } from "./types.ts";
import assets from "./assets.ts";

interface ProjectOptions {
  name: string;
  author: string;
  version: string;
  url: string;
  license: string;
  description: string;
}

const decoder = new TextDecoder();
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

async function ask(question: string, defaultAnswer = "") {
  console.log(
    `%c${question}%c${defaultAnswer ? " (" + defaultAnswer + ")" : ""}`,
    "font-weight: bold",
    "font-weight: normal",
  );
  const buffer = new Uint8Array(1024);
  await Deno.stdin.read(buffer);
  const answer = decoder.decode(buffer);
  return answer.split("\n")[0].trim() || defaultAnswer;
}

async function askConfig(projectPath: string) {
  const folderName = basename(projectPath);
  const defConfig = {
    name: folderName,
    author: "",
    version: "1.0.0",
    url: "",
    license: "MIT",
    description: "A (neo)vim colorscheme",
  };

  const config = {
    name: await ask("Project name:", defConfig.name as string),
    description: await ask("Description:"),
    version: await ask("Version:", defConfig.version),
    license: await ask("License:", defConfig.license),
    author: await ask("Author:"),
    url: await ask("URL:"),
  };
  return config;
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
    assets.syntax.terminal,
  );
  Deno.writeTextFileSync(
    resolve(palettesFolder, options.name + ".yml"),
    defaultPalette,
  );
  Deno.writeTextFileSync(
    resolve(syntaxFolder, "base.yml"),
    assets.syntax.base,
  );

  console.log("%c✓  Your project is ready\n", "color: green");
}

async function renderConfigFile(options: ProjectOptions): Promise<string> {
  return (await render(
    assets.mustaches["project"] as string,
    options as unknown as List,
  )) as string;
}
