import { StatusBrand } from "./common.ts";
import { resolve, ensureDirSync } from "../deps.ts";

const paths = {
  airline: "autoload/airline/themes",
  lightline: "autoload/lightline/colorscheme",
};

export function writeScheme(txt: string, name: string, projectPath: string) {
  const folderPath = resolve(projectPath, "colors");
  const filepath = resolve(folderPath, name + ".vim");
  ensureDirSync(folderPath);
  Deno.writeTextFileSync(filepath, txt);
}

export function writeStatus(
  kind: StatusBrand,
  txt: string,
  name: string,
  projectPath: string
) {
  const folderPath = resolve(projectPath, paths[kind]);
  const filepath = resolve(folderPath, name + ".vim");
  ensureDirSync(folderPath);
  Deno.writeTextFileSync(filepath, txt);
}
