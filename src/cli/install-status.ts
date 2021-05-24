import {
  buckets,
  ensureDirSync,
  green,
  Input,
  prompt,
  resolve,
} from "../../deps.ts";
import { StatusBrand } from "../common.ts";
import { ValidateResult } from "https://deno.land/x/cliffy/prompt/mod.ts";

export async function installStatus(
  projectPath: string,
  brand: StatusBrand,
  styleName?: string,
) {
  const statusFolderPath = resolve(projectPath, "estilo", brand);
  ensureDirSync(statusFolderPath);

  if (styleName) {
    return addStatus(projectPath, brand, styleName);
  }

  const installedStyles = Array.from(
    Deno.readDirSync(statusFolderPath),
  ).map((n) => n.name.slice(0, -4));

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
  Deno.writeTextFileSync(filepath, buckets.addons[brand + ".yml"]);
  console.log(green(`New ${brand} style: ${styleName}`));
  console.log(`==> ${filepath}`);
}
