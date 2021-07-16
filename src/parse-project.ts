import { Project, ProjectFiles } from "./common.ts";
import { parsePalettes } from "./parse-palettes.ts";
import {
  formatStatusStyles,
  formatSyntax,
  formatTerminal,
} from "./format-project.ts";

export function parseProjectData(projectFiles: ProjectFiles): Project {
  const config = projectFiles.config;
  return {
    projectUrl: projectFiles.projectUrl,
    config,
    palettes: parsePalettes(projectFiles.paletteFiles, config.commonPalette),
    syntax: formatSyntax(projectFiles.syntaxFiles),
    terminalSyntax: formatTerminal(projectFiles.terminalFile),
    airlineStyles: formatStatusStyles(projectFiles.airlineFiles, "airline"),
    lightlineStyles: formatStatusStyles(
      projectFiles.lightlineFiles,
      "lightline",
    ),
  };
}
