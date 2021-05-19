import { green } from "../deps.ts";
import { Project } from "./common.ts";
import { writeScheme, writeStatus } from "./writers.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";

export function renderProject(project: Project): void {
  const { config } = project;
  config.colorschemes.forEach((config) => {
    const rendered = renderColorscheme(config, project);
    writeScheme(rendered, config.name, project.folderPath);
  });

  if (config.airline) {
    config.airline.forEach((config) => {
      const rendered = renderStatus(config, project, "airline");
      writeStatus("airline", rendered, config.name, project.folderPath);
    });
  }

  if (config.lightline) {
    config.lightline.forEach((config) => {
      const rendered = renderStatus(config, project, "lightline");
      writeStatus("lightline", rendered, config.name, project.folderPath);
    });
  }
  console.log(green("✓  Done, your theme is ready\n"));
}
