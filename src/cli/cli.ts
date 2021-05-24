import {
  Command,
  existsSync,
  HelpCommand,
  resolve,
  version,
} from "../../deps.ts";
import { crash } from "../crash.ts";
import { createProject } from "./create.ts";
import { loadProject } from "../load-project.ts";
import { selectSyntax } from "./select-syntax.ts";
import { renderProject } from "../render-project.ts";
import { installStatus } from "./install-status.ts";

const estiloCommand = new Command();

const result = await estiloCommand
  .command("help", new HelpCommand().global())
  .reset()
  .name("estilo")
  .version(version)
  .description("Generate colorschemes for (neo)vim, airline and lightline")
  .command("create [folder]")
  .description("Initialize an estilo project in [folder] or current folder")
  .option("-y, --yes", "Skip questions")
  .action((options: Record<string, boolean>, folder = ".") => {
    createProject(resolve(folder), !!options.yes);
  })
  .reset()
  .command("render [folder]")
  .description("Render project")
  .action((_: unknown, folder = ".") => {
    const projectPath = resolve(folder);
    checkProject(projectPath);
    const projectData = loadProject(projectPath);
    renderProject(projectData);
  })
  .reset()
  .command("add-syntax")
  .description("Add syntax templates.")
  .option("-a, --all [all:boolean]", "Add add available syntax templates")
  .action((options: Record<string, []>) => {
    selectSyntax(".", !!options.all);
  })
  .reset()
  .command("add-lightline [styleName]")
  .description("Add new Lightline style")
  .action((_: unknown, styleName: string) => {
    installStatus(".", "lightline", styleName);
  })
  .reset()
  .command("add-airline [styleName]")
  .description("Add new Airline style")
  .action((_: unknown, styleName: string) => {
    installStatus(".", "airline", styleName);
  })
  .reset()
  .parse(Deno.args);

if (!Object.entries(result.options).length && result.cmd._name === "estilo") {
  estiloCommand.showHelp();
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
      crash(`Wrong project folder. Please upgrade your folder`);
    } else {
      crash(`Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
    }
  }
}
