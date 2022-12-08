import { crash } from "./crash.ts";
import { existsSync, resolve, yamlParse } from "../deps.ts";
import { List, Project, ProjectConfig, YmlFile } from "./common.ts";
import { buildPalettes } from "./build-palettes.ts";
import {
  formatStatusStyles,
  formatSyntax,
  formatTerminal,
} from "./format-project.ts";

export function loadProjectFiles(projectUrl: string): Project {
  const config = loadYml(projectUrl, "estilo.yml").content as ProjectConfig;
  const airlineFiles = loadYmlsInFolder(projectUrl, "airline");
  const lightlineFiles = loadYmlsInFolder(projectUrl, "lightline");
  const syntaxFiles = loadYmlsInFolder(projectUrl, "syntax");
  const paletteFiles = loadYmlsInFolder(projectUrl, "palettes");
  const terminalFile = loadYml(projectUrl, "estilos/terminal.yml");

  return {
    projectUrl,
    config,
    palettes: buildPalettes(paletteFiles, config.commonPalette),
    syntax: formatSyntax(syntaxFiles),
    terminalSyntax: formatTerminal(terminalFile.content as List),
    airlineStyles: formatStatusStyles(airlineFiles, "airline"),
    lightlineStyles: formatStatusStyles(lightlineFiles, "lightline"),
  };
}

function loadYmlsInFolder(projectUrl: string, folder: string) {
  const folderUrl = resolve(projectUrl, "estilos", folder);
  return ymlsInFolder(folderUrl).map((filepath) => loadYml(filepath));
}

// returns a list of all the `.yml` filepaths contained inside folderpath
function ymlsInFolder(folderPath: string, folder2?: string): string[] {
  const finalPath = resolve(folderPath, folder2 || "");
  if (!existsSync(finalPath)) return [];
  return Array.from(Deno.readDirSync(finalPath))
    .filter((file) => file.name.endsWith(".yml"))
    .map((file) => resolve(finalPath, file.name));
}

export function loadYml(folderPath: string, filename?: string): YmlFile {
  const filepath = resolve(folderPath, filename || "");
  const content = yamlParse(Deno.readTextFileSync(filepath));
  if (typeof content !== "object") {
    crash("Content of file is not an object", { filepath });
  }
  return { filepath, content };
}
