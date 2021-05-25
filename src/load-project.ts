import { hexterm, resolve, version } from "../deps.ts";
import { isHexColor, loadYml, ymlsInFolder } from "./util.ts";
import { crash } from "./crash.ts";
import { ColorCode } from "./common.ts";

import {
  loadPalette,
  loadStatus,
  loadSyntax,
  loadTerminal,
} from "./loaders.ts";

import {
  Palettes,
  Project,
  ProjectConfig,
  StatusBrand,
  StatusStyles,
} from "./common.ts";

export function loadProject(folderPath: string): Project {
  const config = loadYml(folderPath, "estilo.yml").content as ProjectConfig;
  return {
    folderPath,
    estiloVersion: version,
    config,
    palettes: loadPalettes(folderPath, config),
    syntax: ymlsInFolder(folderPath, "estilos/syntax").flatMap(loadSyntax),
    terminalSyntax: loadTerminal(folderPath),
    airlineStyles: loadAllStatus(folderPath, "airline"),
    lightlineStyles: loadAllStatus(folderPath, "lightline"),
  };
}

function loadPalettes(folderPath: string, config: ProjectConfig): Palettes {
  const mainPalette = config.common ? parseMainPalette(config.common) : {};
  const filepaths = ymlsInFolder(folderPath, "estilos/palettes");
  return Object.fromEntries(
    filepaths.map((file) => {
      const palette = loadPalette(file, mainPalette);
      return [palette.name, palette];
    })
  );
}

function parseMainPalette(
  content: Record<string, string>
): Record<string, ColorCode> {
  const colors = {} as Record<string, ColorCode>;
  Object.keys(content).forEach((name) => {
    const hexcolor = content[name].trim();
    if (!isHexColor(hexcolor)) crash("Wrong color in common palette", { name });
    colors[name] = {
      hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
      xterm: hexterm(hexcolor).toString(),
    };
  });
  return colors;
}

function loadAllStatus(folderPath: string, brand: StatusBrand): StatusStyles {
  const brandpath = resolve(folderPath, "estilos");
  const filepaths = ymlsInFolder(brandpath, brand);
  return Object.fromEntries(
    filepaths.map((filepath) => {
      const style = loadStatus(filepath, brand);
      return [style.name, style];
    })
  );
}
