import { YmlFile } from "./common.ts";
import { crash } from "./crash.ts";
import { existsSync, resolve, yamlParse } from "../deps.ts";

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

// returns a list of all the `.yml` filepaths contained inside folderpath
function ymlsInFolder(folderPath: string, folder2?: string): string[] {
  const finalPath = resolve(folderPath, folder2 || "");
  if (!existsSync(finalPath)) return [];
  return Array.from(Deno.readDirSync(finalPath))
    .filter((file) => file.name.endsWith(".yml"))
    .map((file) => resolve(finalPath, file.name));
}

export function loadYmlsInFolder(projectUrl: string, folder: string) {
  const folderUrl = resolve(projectUrl, "estilos", folder);
  const filepaths = ymlsInFolder(folderUrl);
  return Object.fromEntries(
    filepaths.map((filepath) => [
      filepath,
      loadYml(filepath) as Record<string, string>,
    ])
  );
}
