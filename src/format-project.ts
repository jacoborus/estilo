import { basename } from "jsr:@std/path@0.219.1";

import {
  List,
  StatusBrand,
  StatusStyle,
  SyntaxRule,
  YmlFile,
} from "./types.ts";
import { assertIsList, crash } from "./util.ts";

function formatSyntaxFile(file: YmlFile): SyntaxRule[] {
  const filepath = file.filepath;
  const content = file.content;
  assertIsList(content, filepath);

  return Object.entries(content)
    .map(([name, value]) => ({
      filepath,
      name,
      rule: value.trim(),
    }))
    .filter((rule) => rule.rule);
}

export function formatSyntax(syntaxFiles: YmlFile[]): SyntaxRule[] {
  return syntaxFiles.map((syntaxFile) => formatSyntaxFile(syntaxFile)).flat();
}

export function formatTerminal(data: List): List {
  const formattedData: List = {};
  Object.keys(data).forEach((prop) => {
    const colorname = data[prop].trim();
    if (colorname) formattedData[prop] = colorname;
  });
  return formattedData;
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

export function formatStatusStyles(
  statusFiles: YmlFile[],
  brand: StatusBrand,
): Record<string, StatusStyle> {
  const statusMap: Record<string, StatusStyle> = {};
  statusFiles.forEach(({ filepath, content }) => {
    assertIsList(content, filepath);
    const style = formatStatusStyle(content, brand, filepath);
    statusMap[style.name] = style;
  });
  return statusMap;
}

function formatStatusStyle(
  content: List,
  brand: StatusBrand,
  filepath: string,
): StatusStyle {
  const statusStyle = {
    name: basename(filepath, ".yml"),
    filepath,
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
