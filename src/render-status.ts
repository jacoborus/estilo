import handlebars from 'handlebars'
import { crack } from './crack'
import {
  StatusConfig,
  Project,
  StatusSyntax,
  Palette,
  DataRenderStatus,
  StatusBrand
} from './common'

function parseStatusColors (syntax: StatusSyntax, palette: Palette): DataRenderStatus {
  const out = {} as DataRenderStatus
  Object.keys(syntax).forEach(partName => {
    const [fgName, bgName] = syntax[partName]
    const fg = palette.colors[fgName]
    const bg = palette.colors[bgName]
    if (!fg) crack('Missing foreground color', { palette: palette.filepath, color: fgName })
    if (!bg) crack('Missing background color', { palette: palette.filepath, color: bgName })
    out[partName] = { fg, bg }
  })
  return out
}

export function renderStatus (config: StatusConfig, project: Project, brand: StatusBrand): string {
  const palette = project.palettes[config.palette]
  if (!palette) {
    crack('Palette does not exist', { palette: config.palette, brand, style: config.style })
  }
  const syntaxFile = project.airlineStyles[config.style]
  if (!syntaxFile) crack('Cannot find status style file', { name: config.name })
  const syntax = syntaxFile.syntax
  const c = parseStatusColors(syntax, palette)
  const render = handlebars.compile(project.mustaches[brand])
  return render({ c, theme: config, pkg: project })
}
