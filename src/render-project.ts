import { green } from "../deps.ts";
import { Project } from "./common.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";
import { writeScheme, writeStatus } from "./writers.ts";

export async function renderProject(project: Project): Promise<void> {
  const { config: projectConfig } = project;
  for (const config of projectConfig.colorschemes) {
    const rendered = await renderColorscheme(config, project);
    writeScheme(rendered, config.name, project.folderPath);
  }

  if (projectConfig.airline) {
    for (const config of projectConfig.airline) {
      const rendered = await renderStatus(config, project, "airline");
      writeStatus("airline", rendered, config.name, project.folderPath);
    }
  }

  if (projectConfig.lightline) {
    for (const config of projectConfig.lightline) {
      const rendered = await renderStatus(config, project, "lightline");
      writeStatus("lightline", rendered, config.name, project.folderPath);
    }
  }

  console.log(green("✓  Done, your theme is ready\n"));
}
