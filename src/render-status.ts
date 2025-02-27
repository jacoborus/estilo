import { Eta } from "@eta-dev/eta";
import denojson from "../deno.json" with { type: "json" };
import assets from "./assets.ts";
import { crash } from "./util.ts";

import type {
  DataRenderStatus,
  Palette,
  Project,
  StatusBrand,
  StatusConfig,
  StatusSyntax,
} from "./types.ts";

const eta = new Eta();
const version = denojson.version;

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

export function renderStatus(
  config: StatusConfig,
  project: Project,
  brand: StatusBrand,
): string {
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
    version: project.config.version,
    estiloVersion: version,
  };

  const context = Object.assign(ctx, { info });
  return eta.renderString(assets.mustaches[brand] as string, context) as string;
}
