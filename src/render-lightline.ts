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

/* Convert all string values from a given
 * object (`template`) to arrays with hex colors */
export function renderLightline (config: StatusLineConfig, project: Project): string {
  const palette = project.palettes[config.palette]
  if (!palette) {
    throw new Error(`Airline ${config.name} palette (${config.palette}) doesn't exist`)
  }
  const syntaxFile = project.airlineStyles[config.name]
  if (!syntaxFile) {
    throw new Error(`Airline ${config.name} style (${config.style}) doesn't exist`)
  }
  const syntax = syntaxFile.syntax
  const c = parseStatusColors(syntax, palette)
  return printLightline(c, config, project)
}

export function printLightline (c: DataRenderStatus, theme: StatusLineConfig, pkg: Project): string {
  return `" ============================================================
" ${theme.name}
" ${theme.description}
" URL: ${pkg.config.url}
" Author: ${pkg.config.author}
" License: ${pkg.config.license}
" ============================================================

let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {} }

let s:p.normal.left = [[["${c.normal1.fg.hex}", ${c.normal1.fg.xterm}], ["${c.normal1.bg.hex}", ${c.normal1.bg.xterm}]], [["${c.normal2.fg.hex}", ${c.normal2.fg.xterm}], ["${c.normal2.bg.hex}", ${c.normal2.bg.xterm}]]]
let s:p.normal.middle = [[["${c.normal3.fg.hex}", ${c.normal3.fg.xterm}], ["${c.normal3.bg.hex}", ${c.normal3.bg.xterm}]]]
let s:p.normal.right = [[["${c.normal4.fg.hex}", ${c.normal4.fg.xterm}], ["${c.normal4.bg.hex}", ${c.normal4.bg.xterm}]], [["${c.normal5.fg.hex}", ${c.normal5.fg.xterm}], ["${c.normal5.bg.hex}", ${c.normal5.bg.xterm}]]]
let s:p.normal.error = [[["${c.normalError.fg.hex}", ${c.normalError.fg.xterm}], ["${c.normalError.bg.hex}", ${c.normalError.bg.xterm}]]]
let s:p.normal.warning = [[["${c.normalWarning.fg.hex}", ${c.normalWarning.fg.xterm}], ["${c.normalWarning.bg.hex}", ${c.normalWarning.bg.xterm}]]]

let s:p.inactive.left = [[["${c.inactive1.fg.hex}", ${c.inactive1.fg.xterm}], ["${c.inactive1.bg.hex}", ${c.inactive1.bg.xterm}]], [["${c.inactive2.fg.hex}", ${c.inactive2.fg.xterm}], ["${c.inactive2.bg.hex}", ${c.inactive2.bg.xterm}]]]
let s:p.inactive.middle = [[["${c.inactive3.fg.hex}", ${c.inactive3.fg.xterm}], ["${c.inactive3.bg.hex}", ${c.inactive3.bg.xterm}]]]
let s:p.inactive.right = [[["${c.inactive4.fg.hex}", ${c.inactive4.fg.xterm}], ["${c.inactive4.bg.hex}", ${c.inactive4.bg.xterm}]], [["${c.inactive5.fg.hex}", ${c.inactive5.fg.xterm}], ["${c.inactive5.bg.hex}", ${c.inactive5.bg.xterm}]]]

let s:p.insert.left = [[["${c.insert1.fg.hex}", ${c.insert1.fg.xterm}], ["${c.insert1.bg.hex}", ${c.insert1.bg.xterm}]], [["${c.insert2.fg.hex}", ${c.insert2.fg.xterm}], ["${c.insert2.bg.hex}", ${c.insert2.bg.xterm}]]]
let s:p.insert.middle = [[["${c.insert3.fg.hex}", ${c.insert3.fg.xterm}], ["${c.insert3.bg.hex}", ${c.insert3.bg.xterm}]]]
let s:p.insert.right = [[["${c.insert4.fg.hex}", ${c.insert4.fg.xterm}], ["${c.insert4.bg.hex}", ${c.insert4.bg.xterm}]], [["${c.insert5.fg.hex}", ${c.insert5.fg.xterm}], ["${c.insert5.bg.hex}", ${c.insert5.bg.xterm}]]]

let s:p.replace.left = [[["${c.replace1.fg.hex}", ${c.replace1.fg.xterm}], ["${c.replace1.bg.hex}", ${c.replace1.bg.xterm}]], [["${c.replace2.fg.hex}", ${c.replace2.fg.xterm}], ["${c.replace2.bg.hex}", ${c.replace2.bg.xterm}]]]
let s:p.replace.middle = [[["${c.replace3.fg.hex}", ${c.replace3.fg.xterm}], ["${c.replace3.bg.hex}", ${c.replace3.bg.xterm}]]]
let s:p.replace.right = [[["${c.replace4.fg.hex}", ${c.replace4.fg.xterm}], ["${c.replace4.bg.hex}", ${c.replace4.bg.xterm}]], [["${c.replace5.fg.hex}", ${c.replace5.fg.xterm}], ["${c.replace5.bg.hex}", ${c.replace5.bg.xterm}]]]

let s:p.visual.left = [[["${c.visual1.fg.hex}", ${c.visual1.fg.xterm}], ["${c.visual1.bg.hex}", ${c.visual1.bg.xterm}]], [["${c.visual2.fg.hex}", ${c.visual2.fg.xterm}], ["${c.visual2.bg.hex}", ${c.visual2.bg.xterm}]]]
let s:p.visual.middle = [[["${c.visual3.fg.hex}", ${c.visual3.fg.xterm}], ["${c.visual3.bg.hex}", ${c.visual3.bg.xterm}]]]
let s:p.visual.right = [[["${c.visual4.fg.hex}", ${c.visual4.fg.xterm}], ["${c.visual4.bg.hex}", ${c.visual4.bg.xterm}]], [["${c.visual5.fg.hex}", ${c.visual5.fg.xterm}], ["${c.visual5.bg.hex}", ${c.visual5.bg.xterm}]]]

let s:p.tabline.left = [[["${c.tablineLeft.fg.hex}", ${c.tablineLeft.fg.xterm}], ["${c.tablineLeft.bg.hex}", ${c.tablineLeft.bg.xterm}]]]
let s:p.tabline.tabsel = [[["${c.tablineSelected.fg.hex}", ${c.tablineSelected.fg.xterm}], ["${c.tablineSelected.bg.hex}", ${c.tablineSelected.bg.xterm}]]]
let s:p.tabline.middle = [[["${c.tablineMiddle.fg.hex}", ${c.tablineMiddle.fg.xterm}], ["${c.tablineMiddle.bg.hex}", ${c.tablineMiddle.bg.xterm}]]]
let s:p.tabline.right = [[["${c.tablineRight.fg.hex}", ${c.tablineRight.fg.xterm}], ["${c.tablineRight.bg.hex}", ${c.tablineRight.bg.xterm}]]]

let g:lightline#colorscheme#${theme.name}#palette = lightline#colorscheme#flatten(s:p)

" Generated by Estilo ${pkg.estiloVersion} (https://github.com/jacoborus/estilo)
`
}
