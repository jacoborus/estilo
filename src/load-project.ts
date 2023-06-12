import { resolve } from "path";
import { parse as yamlParse } from "yaml";
import { List, Project, ProjectConfig, YmlFile } from "./types.ts";
import { buildPalettes } from "./build-palettes.ts";
import { assertIsObject, existsSync } from "./util.ts";
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
  if (!existsSync(folderUrl)) return [];
  return Array.from(Deno.readDirSync(folderUrl))
    .filter((file) => file.name.endsWith(".yml"))
    .map((file) => resolve(folderUrl, file.name))
    .map((filepath) => loadYml(filepath));
}

function loadYml(folderPath: string, filename?: string): YmlFile {
  const filepath = resolve(folderPath, filename || "");
  const content = yamlParse(Deno.readTextFileSync(filepath));
  assertIsObject(content, filepath);
  return { filepath, content };
}
