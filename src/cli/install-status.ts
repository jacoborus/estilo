import { resolve } from "path";
import { ensureDirSync } from "fs";
import { Input, prompt, ValidateResult } from "cliffy-prompt";

import { StatusBrand } from "../types.ts";
import assets from "../assets.ts";

export async function installStatus(
  projectPath: string,
  brand: StatusBrand,
  styleName?: string,
) {
  const statusFolderPath = resolve(projectPath, "estilos", brand);
  ensureDirSync(statusFolderPath);

  if (styleName) {
    return addStatus(projectPath, brand, styleName);
  }

  const installedStyles = Array.from(Deno.readDirSync(statusFolderPath)).map(
    (n) => n.name.slice(0, -4),
  );

  const answers = await prompt([
    {
      type: Input,
      message: `Enter ${brand} style name:`,
      name: "stylename",
      validate: (input: string): ValidateResult => {
        const stylename = input.trim();
        if (!stylename) return "That's not a name";
        return installedStyles.includes(stylename)
          ? "That style already exists"
          : true;
      },
    },
  ]);

  addStatus(projectPath, brand, answers.stylename as string);
}

function addStatus(projectPath: string, brand: StatusBrand, styleName: string) {
  const folderPath = resolve(projectPath, "estilos", brand);
  ensureDirSync(folderPath);
  const filepath = resolve(folderPath, styleName + ".yml");
  Deno.writeTextFileSync(filepath, assets.addons[brand + ".yml"] as string);
  console.log(`%cNew ${brand} style: ${styleName}`, "color: green");
  console.log(`==> ${filepath}`);
}
