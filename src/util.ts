import { YmlFile } from "./common.ts";
import { crash } from "./crash.ts";
import { resolve, yamlParse } from "../deps.ts";

export function isHexColor(color: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}

export function loadYml(folderPath: string, filename?: string): YmlFile {
  const filepath = resolve(folderPath, filename || "");
  const content = yamlParse(Deno.readTextFileSync(filepath));

  if (typeof content !== "object") {
    crash("Content of file is not an object", { filepath });
  }

  return { filepath, content };
}
