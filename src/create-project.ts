import { ensureDirSync } from "@std/fs";
import { basename, resolve } from "@std/path";
import { render } from "npm:eta@1.14.2";

import type { List } from "./types.ts";
import assets from "./assets.ts";

interface ProjectOptions {
  name: string;
  author: string;
  version: string;
  url: string;
  license: string;
}

const decoder = new TextDecoder();
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
  };
}

async function ask(question: string, defaultAnswer = "") {
  console.log(
    `%c${question}%c${defaultAnswer ? " (" + defaultAnswer + ")" : ""}`,
    "font-weight: bold; color: green;",
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
  };

  const config = {
    name: await ask("Project name:", defConfig.name as string),
    version: await ask("Version:", defConfig.version),
    license: await ask("License:", defConfig.license),
    author: await ask("Author:"),
    url: await ask("URL:"),
  };
  return config;
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
    assets.syntax.terminal,
  );
  Deno.writeTextFileSync(
    resolve(palettesFolder, options.name + ".yml"),
    defaultPalette,
  );
  Deno.writeTextFileSync(resolve(syntaxFolder, "base.yml"), assets.syntax.base);

  console.log("%c✓  Your project is ready\n", "color: green");
}

function renderConfigFile(options: ProjectOptions): string {
  return render(
    assets.mustaches["project"] as string,
    options as unknown as List,
  ) as string;
}
