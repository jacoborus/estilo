import { ensureDir } from "./util.ts";
import { resolve } from "@std/path";
import type { Project } from "./types.ts";
import { renderColorscheme } from "./render-colorscheme.ts";
import { renderStatus } from "./render-status.ts";

const paths = {
  airline: "autoload/airline/themes",
  lightline: "autoload/lightline/colorscheme",
};

export async function renderProject(project: Project): Promise<void> {
  const { config: projectConfig } = project;

  for (const config of projectConfig.colorschemes) {
    const rendered = renderColorscheme(config, project);
    await writeThing("colors", rendered, config.name, project.projectUrl);
  }

  if (projectConfig.airline) {
    for (const config of projectConfig.airline) {
      const rendered = renderStatus(config, project, "airline");
      await writeThing(
        paths.airline,
        rendered,
        config.name,
        project.projectUrl,
      );
    }
  }

  if (projectConfig.lightline) {
    for (const config of projectConfig.lightline) {
      const rendered = renderStatus(config, project, "lightline");
      await writeThing(
        paths.lightline,
        rendered,
        config.name,
        project.projectUrl,
      );
    }
  }

  console.log("%c✓  Done, your theme is ready\n", "color: green");
}

export async function writeThing(
  folder: string,
  txt: string,
  name: string,
  projectPath: string,
) {
  const folderPath = resolve(projectPath, folder);
  const filepath = resolve(folderPath, name + ".vim");
  await ensureDir(folderPath);
  await Deno.writeTextFile(filepath, txt);
}
