import { green } from "../deps.ts";
import { Project } from "./common.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";
import { writeScheme, writeStatus } from "./writers.ts";

export function renderProject(project: Project): void {
  const { config: projectConfig } = project;
  for (const config of projectConfig.colorschemes) {
    const rendered = renderColorscheme(config, project);
    writeScheme(rendered, config.name, project.projectUrl);
  }

  if (projectConfig.airline) {
    for (const config of projectConfig.airline) {
      const rendered = renderStatus(config, project, "airline");
      writeStatus("airline", rendered, config.name, project.projectUrl);
    }
  }

  if (projectConfig.lightline) {
    for (const config of projectConfig.lightline) {
      const rendered = renderStatus(config, project, "lightline");
      writeStatus("lightline", rendered, config.name, project.projectUrl);
    }
  }

  console.log(green("✓  Done, your theme is ready\n"));
}
