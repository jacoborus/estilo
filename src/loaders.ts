import { basename, existsSync, hexterm, resolve, yellow } from "../deps.ts";
import {
  ColorCode,
  Palette,
  StatusBrand,
  StatusStyle,
  SyntaxRule,
  TerminalSyntax,
} from "./common.ts";
import { isHexColor, loadYml } from "./util.ts";
import { crash } from "./crash.ts";

export function loadPalette(
  filepath: string,
  common: Record<string, ColorCode>,
): Palette {
  const parsed = loadYml(filepath);
  const content = parsed.content as Record<string, string>;

  const palette = {
    filepath,
    name: basename(filepath, ".yml"),
    colors: {},
  } as Palette;

  Object.keys(content).forEach((name) => {
    const hexcolor = content[name].trim();
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
  return Object.assign({}, common, palette);
}

export function loadSyntax(filepath: string): SyntaxRule[] {
  const parsed = loadYml(filepath);
  const content = parsed.content as Record<string, string>;
  return Object.keys(content)
    .map((name) => ({
      filepath,
      name,
      rule: content[name].trim(),
    }))
    .filter((rule) => rule.rule);
}

export function loadTerminal(projectPath: string): TerminalSyntax {
  const filepath = getTerminalTemplatePath(projectPath);
  const parsed = loadYml(filepath);
  const content = parsed.content as Record<string, string>;
  const terminalSyntax = {} as TerminalSyntax;
  Object.keys(content).forEach((prop) => {
    const colorname = content[prop].trim();
    if (!colorname) return;
    terminalSyntax[prop] = colorname;
  });
  return terminalSyntax;
}

function getTerminalTemplatePath(projectPath: string) {
  const oldPath = resolve(projectPath, "estilos/addons/nvim-term.yml");
  const newPath = resolve(projectPath, "estilos/terminal.yml");
  if (existsSync(oldPath) && !existsSync(newPath)) {
    console.log(yellow("⚠  Warning: Legacy terminal config path"));
    console.log(yellow(`Please rename ${oldPath} to ${newPath}\n`));
    return oldPath;
  } else {
    return newPath;
  }
}

const statusParts = {
  airline: [
    "normal1",
    "normal2",
    "normal3",
    "insert1",
    "insert2",
    "insert3",
    "replace1",
    "replace2",
    "replace3",
    "visual1",
    "visual2",
    "visual3",
    "inactive1",
    "inactive2",
    "inactive3",
  ],
  lightline: [
    "normal1",
    "normal2",
    "normal3",
    "normal4",
    "normal5",
    "normalError",
    "normalWarning",
    "inactive1",
    "inactive2",
    "inactive3",
    "inactive4",
    "inactive5",
    "insert1",
    "insert2",
    "insert3",
    "insert4",
    "insert5",
    "replace1",
    "replace2",
    "replace3",
    "replace4",
    "replace5",
    "visual1",
    "visual2",
    "visual3",
    "visual4",
    "visual5",
    "tablineLeft",
    "tablineSelected",
    "tablineMiddle",
    "tablineRight",
  ],
}; // , ctrlp

export function loadStatus(filepath: string, brand: StatusBrand): StatusStyle {
  const parsed = loadYml(filepath);
  const content = parsed.content as Record<string, string>;

  const statusStyle = {
    name: basename(filepath, ".yml"),
    filepath: filepath,
    syntax: {},
  } as StatusStyle;

  Object.keys(content).forEach((name) => {
    const txt = content[name].trim();
    statusStyle.syntax[name] = txt.split(/\s+/) as [string, string];
  });

  statusParts[brand].forEach((part) => {
    const block = statusStyle.syntax[part];
    if (!block) crash("Missing block in status", { filepath, block: part });
    if (!block[0]) {
      crash("Missing foreground in status block", { filepath, block: part });
    }
    if (!block[1]) {
      crash("Missing background in status block", { filepath, block: part });
    }
  });
  return statusStyle;
}
