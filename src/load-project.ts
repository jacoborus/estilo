import { parse as yamlParse } from "jsr:@std/yaml@0.219.1";
import { basename, resolve } from "jsr:@std/path@0.219.1";
import { hexterm } from "jsr:@jacoborus/hexterm@2.1.0";

import {
  ColorObj,
  List,
  Palette,
  Project,
  ProjectConfig,
  YmlFile,
} from "./types.ts";

import {
  formatStatusStyles,
  formatSyntax,
  formatTerminal,
} from "./format-project.ts";

import {
  assertIsList,
  assertIsObject,
  crash,
  existsSync,
  isHexColor,
} from "./util.ts";

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

function buildPalettes(
  paletteFiles: YmlFile[],
  common = {} as List,
): Record<string, Palette> {
  const commonPalette = buildMainPalette(common);

  const palettes: Record<string, Palette> = {};

  paletteFiles.forEach((paletteFile) => {
    const palette = buildPalette(paletteFile, commonPalette);
    palettes[palette.name] = palette;
  });

  return palettes;
}

function buildMainPalette(content: List): Record<string, ColorObj> {
  const colors: Record<string, ColorObj> = {};

  for (const name of Object.keys(content)) {
    const hexcolor = content[name].trim();

    if (!isHexColor(hexcolor)) {
      crash("Wrong color in common palette", { name });
    }

    colors[name] = {
      hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
      xterm: hexterm(hexcolor).toString(),
    };
  }

  return colors;
}

export function buildPalette(
  paletteFile: YmlFile,
  common: Record<string, ColorObj>,
): Palette {
  const { filepath, content } = paletteFile;

  assertIsList(content, filepath);

  const palette: Palette = {
    filepath,
    name: basename(filepath, ".yml"),
    colors: structuredClone(common),
  };

  Object.entries(content).forEach(([name, value]) => {
    const hexcolor = value.trim();

    if (hexcolor.startsWith("@")) {
      const propName = hexcolor.slice(1);
      const color = common[propName];
      if (!color) crash("Missing common color", { color: propName });
      palette.colors[name] = color;
      return;
    }

    if (!isHexColor(hexcolor)) {
      crash("Wrong color", { filepath, name, hexcolor });
    }

    palette.colors[name] = {
      hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
      xterm: hexterm(hexcolor).toString(),
    };
  });

  return palette;
}
