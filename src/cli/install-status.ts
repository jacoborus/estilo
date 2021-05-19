import {
  resolve,
  ensureDirSync,
  Input,
  prompt,
  green,
  __dirname,
} from "../../deps.ts";
import { StatusBrand } from "../common.ts";
import { ValidateResult } from "https://deno.land/x/cliffy/prompt/mod.ts";

const originPaths = {
  airline: "templates/status/airline.yml",
  lightline: "templates/status/lightline.yml",
};

export async function installStatus(projectPath: string, brand: StatusBrand) {
  const statusFolderPath = resolve(projectPath, "estilo", brand);
  ensureDirSync(statusFolderPath);
  const installedStyles = Array.from(
    Deno.readDirSync(statusFolderPath)
  ).map((n) => n.name.slice(0, -4));

  const answers = await prompt([
    {
      type: Input,
      message: "Enter style name:",
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

  const templatePath = resolve(__dirname, "../..", originPaths[brand]);
  const filepath = resolve(statusFolderPath, answers.stylename + ".yml");
  // TODO handle this error
  try {
    await Deno.copyFile(templatePath, filepath);
  } catch (err) {
    console.error(err);
  }
  const stylename = (answers.stylename as string).trim();
  console.log(green(`New ${brand} style: ${stylename}`));
  console.log(`==> ${filepath}`);
}
