import { green } from "../deps.ts";
import { Project } from "./common.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";
import { writeScheme, writeStatus } from "./writers.ts";

export function renderProject(project: Project): void {
  const { config } = project;
  config.colorschemes.forEach(async (config) => {
    const rendered = await renderColorscheme(config, project);
    writeScheme(rendered, config.name, project.folderPath);
  });

  if (config.airline) {
    config.airline.forEach(async (config) => {
      const rendered = await renderStatus(config, project, "airline");
      writeStatus("airline", rendered, config.name, project.folderPath);
    });
  }

  if (config.lightline) {
    config.lightline.forEach(async (config) => {
      const rendered = await renderStatus(config, project, "lightline");
      writeStatus("lightline", rendered, config.name, project.folderPath);
    });
  }
  console.log(green("✓  Done, your theme is ready\n"));
}
