import { render } from "./deps.ts";
import { version } from "./common.ts";
import assets from "./assets.ts";
import { crash } from "./crash.ts";

import {
  DataRenderStatus,
  Palette,
  Project,
  StatusBrand,
  StatusConfig,
  StatusSyntax,
} from "./types.ts";

function parseStatusColors(
  syntax: StatusSyntax,
  palette: Palette,
): DataRenderStatus {
  const out = {} as DataRenderStatus;

  Object.keys(syntax).forEach((partName) => {
    const [fgName, bgName] = syntax[partName];
    const fg = palette.colors[fgName];
    const bg = palette.colors[bgName];

    if (!fg) {
      crash("Missing foreground color", {
        palette: palette.filepath,
        color: fgName,
      });
    }

    if (!bg) {
      crash("Missing background color", {
        palette: palette.filepath,
        color: bgName,
      });
    }

    out[partName] = { fg, bg };
  });

  return out;
}

export async function renderStatus(
  config: StatusConfig,
  project: Project,
  brand: StatusBrand,
): Promise<string> {
  const palette = project.palettes[config.palette];

  if (!palette) {
    crash("Palette does not exist", {
      palette: config.palette,
      brand,
      style: config.style,
    });
  }

  const brandStyles = {
    airline: project.airlineStyles,
    lightline: project.lightlineStyles,
  };

  const syntaxFile = brandStyles[brand][config.style];

  if (!syntaxFile) {
    crash("Cannot find status style file", { name: config.name });
  }

  const syntax = syntaxFile.syntax;
  const ctx = parseStatusColors(syntax, palette);

  const info = {
    name: config.name,
    description: config.description,
    url: project.config.url,
    author: project.config.author,
    license: project.config.license,
    estiloVersion: version,
  };

  const context = Object.assign(ctx, { info });
  return (await render(assets.mustaches[brand] as string, context)) as string;
}
