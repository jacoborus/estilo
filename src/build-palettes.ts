import { basename, hexterm } from "../deps.ts";
import { assertIsList, isHexColor } from "./util.ts";
import { ColorObj, List, Palette, YmlFile } from "./common.ts";
import { crash } from "./crash.ts";

export function buildPalettes(
  paletteFiles: YmlFile[],
  common = {} as List,
): Record<string, Palette> {
  const commonPalette = buildMainPalette(common);

  const paleteEntries = paletteFiles.map((paletteFile) => {
    const palette = buildPalette(paletteFile, commonPalette);
    return [palette.name, palette];
  });

  return Object.fromEntries(paleteEntries);
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
