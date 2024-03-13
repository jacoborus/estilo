import { resolve } from "jsr:@std/path@0.219.1";

import { existsSync } from "../common.ts";
import { crash } from "../crash.ts";
import { createProject } from "./create.ts";
import { loadProjectFiles } from "../load-project.ts";
import { renderProject } from "../render-project.ts";

const helpText = `
  Estilo: 2.0.0-beta-7

    Generate colorschemes for (neo)vim, airline and lightline

  Usage:

    estilo create [folder]      - Initialize an estilo project in [folder] or current directory
    estilo create [folder] -y   - Initialize with no questions
    estilo render [folder]      - Render project in [folder] or current directory
    estilo help                 - Show instructions 
`;

const command = Deno.args[0];
const target = Deno.args[1];

if (command === "help" || command === undefined) {
  console.log(helpText);
  Deno.exit();
}

if (command !== "render" && command !== "create") {
  console.log("%cInvalid command", "color: red");
  console.log(helpText);
}

if (command === "render") {
  const projectPath = resolve(target ?? ".");
  checkProject(projectPath);
  const project = loadProjectFiles(projectPath);
  await renderProject(project);
  Deno.exit();
}

let projectPath = "";

let auto = false;
if (target === undefined || target === "-y") {
  projectPath = resolve(".");
} else {
  projectPath = resolve(target);
}
if (target === "-y") {
  auto = true;
}

if (command === "create") {
  createProject(projectPath, auto);
}

function checkProject(projectPath: string) {
  const paths = [
    "estilo.yml",
    "estilos/syntax",
    "estilos/palettes",
    "estilos/terminal.yml",
  ];
  const notOk = paths
    .map((path) => resolve(projectPath, path))
    .filter((path) => !existsSync(path));
  if (notOk.length) {
    if (existsSync(resolve(projectPath, "estilo"))) {
      crash(
        `⚠ Wrong project folder. Please, follow upgrade instructions in docs`,
      );
    } else {
      crash(`⚠ Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
    }
  }
}
