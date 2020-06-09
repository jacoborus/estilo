import handlebars from 'handlebars'
import {
  StatusLineConfig,
  Project,
  StatusSyntax,
  Palette,
  DataRenderStatus
} from './common'

function parseStatusColors (syntax: StatusSyntax, palette: Palette): DataRenderStatus {
  const out = {} as DataRenderStatus
  Object.keys(syntax).forEach(partName => {
    const [fgName, bgName] = syntax[partName]
    const fg = palette.colors[fgName]
    const bg = palette.colors[bgName]
    if (!fg) throw new Error(`Missing color (${fgName}) in palette ${palette.name}`)
    if (!bg) throw new Error(`Missing color (${bgName}) in palette ${palette.name}`)
    out[partName] = { fg, bg }
  })
  return out
}

export function renderStatus (config: StatusLineConfig, project: Project, kind: 'airline' | 'lightline'): string {
  const palette = project.palettes[config.palette]
  if (!palette) {
    throw new Error(`${kind} ${config.name} palette (${config.palette}) doesn't exist`)
  }
  const syntaxFile = project.airlineStyles[config.name]
  if (!syntaxFile) {
    throw new Error(`${kind} ${config.name} style (${config.style}) doesn't exist`)
  }
  const syntax = syntaxFile.syntax
  const c = parseStatusColors(syntax, palette)
  const render = handlebars.compile(project.mustaches[kind])
  return render({ c, theme: config, pkg: project })
}
