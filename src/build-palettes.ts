import { basename, hexterm } from "../deps.ts";
import { isHexColor } from "./util.ts";
import { ColorObj, List, Palette, Palettes, YmlFile } from "./common.ts";
import { crash } from "./crash.ts";

export function buildPalettes(
  paletteFiles: YmlFile[],
  common = {} as List,
): Palettes {
  const commonPalette = buildMainPalette(common);
  return Object.fromEntries(
    paletteFiles.map((paletteFile) => {
      const palette = buildPalette(paletteFile, commonPalette);
      return [palette.name, palette];
    }),
  );
}

function buildMainPalette(
  content: List,
): Record<string, ColorObj> {
  const colors = Object.keys(content).map((name) => {
    const hexcolor = content[name].trim();
    if (!isHexColor(hexcolor)) {
      crash("Wrong color in common palette", { name });
    }
    return [name, getColorObj(hexcolor)];
  });
  return Object.fromEntries(colors);
}

function getColorObj(hexcolor: string): ColorObj {
  return {
    hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
    xterm: hexterm(hexcolor).toString(),
  };
}

export function buildPalette(
  paletteFile: YmlFile,
  common: Record<string, ColorObj>,
): Palette {
  const { filepath, content } = paletteFile;
  const palette = {
    filepath,
    name: basename(filepath, ".yml"),
    colors: {},
  } as Palette;

  Object.entries(content as List).forEach(([name, value]) => {
    const hexcolor = value.trim();
    if (hexcolor.startsWith("@")) {
      const propName = hexcolor.slice(1);
      const color = common[propName];
      if (!color) crash("Missing common color", { color });
      palette.colors[name] = color;
      return;
    }
    if (!isHexColor(hexcolor)) crash("Wrong color", { filepath, name });
    palette.colors[name] = {
      hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
      xterm: hexterm(hexcolor).toString(),
    };
  });
  palette.colors = Object.assign(common, palette.colors);
  return palette;
}
