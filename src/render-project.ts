import { ensureDirSync, green, resolve } from "../deps.ts";
import { Project, StatusBrand } from "./common.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";

export async function renderProject(project: Project): Promise<void> {
  const { config: projectConfig } = project;
  for (const config of projectConfig.colorschemes) {
    const rendered = await renderColorscheme(config, project);
    writeScheme(rendered, config.name, project.projectUrl);
  }

  if (projectConfig.airline) {
    for (const config of projectConfig.airline) {
      const rendered = await renderStatus(config, project, "airline");
      writeStatus("airline", rendered, config.name, project.projectUrl);
    }
  }

  if (projectConfig.lightline) {
    for (const config of projectConfig.lightline) {
      const rendered = await renderStatus(config, project, "lightline");
      writeStatus("lightline", rendered, config.name, project.projectUrl);
    }
  }

  console.log(green("✓  Done, your theme is ready\n"));
}

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
  projectPath: string,
) {
  const folderPath = resolve(projectPath, paths[kind]);
  const filepath = resolve(folderPath, name + ".vim");
  ensureDirSync(folderPath);
  Deno.writeTextFileSync(filepath, txt);
}
