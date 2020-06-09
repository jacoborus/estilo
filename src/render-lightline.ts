import {
  StatusLineConfig,
  Project,
  StatusSyntax,
  Palette,
  ColorCode
} from './common'

type DataRenderAirline = Record<string, [ColorCode, ColorCode]>

function parseStatusColors (syntax: StatusSyntax, palette: Palette): DataRenderAirline {
  const out = {} as DataRenderAirline
  Object.keys(syntax).forEach(partName => {
    const [fgName, bgName] = syntax[partName]
    const fg = palette.colors[fgName]
    const bg = palette.colors[bgName]
    if (!fg) throw new Error(`Missing color (${fgName}) in palette ${palette.name}`)
    if (!bg) throw new Error(`Missing color (${bgName}) in palette ${palette.name}`)
    out[partName] = [fg, bg]
  })
  return out
}

/* Convert all string values from a given
 * object (`template`) to arrays with hex colors */
export function renderLighline (config: StatusLineConfig, project: Project): string {
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

export function printLightline (c: DataRenderAirline, theme: StatusLineConfig, pkg: Project): string {
  return `" ============================================================
" ${theme.name}
" ${theme.description}
" URL: ${pkg.config.url}
" Author: ${pkg.config.author}
" License: ${pkg.config.license}
" ============================================================

let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {} }

let s:p.normal.left = [[["${c.normal1[0].hex}", ${c.normal1[0].xterm}], ["${c.normal1[1].hex}", ${c.normal1[1].xterm}]], [["${c.normal2[0].hex}", ${c.normal2[0].xterm}], ["${c.normal2[1].hex}", ${c.normal2[1].xterm}]]]
let s:p.normal.middle = [[["${c.normal3[0].hex}", ${c.normal3[0].xterm}], ["${c.normal3[1].hex}", ${c.normal3[1].xterm}]]]
let s:p.normal.right = [[["${c.normal4[0].hex}", ${c.normal4[0].xterm}], ["${c.normal4[1].hex}", ${c.normal4[1].xterm}]], [["${c.normal5[0].hex}", ${c.normal5[0].xterm}], ["${c.normal5[1].hex}", ${c.normal5[1].xterm}]]]
let s:p.normal.error = [[["${c.normalError[0].hex}", ${c.normalError[0].xterm}], ["${c.normalError[1].hex}", ${c.normalError[1].xterm}]]]
let s:p.normal.warning = [[["${c.normalWarning[0].hex}", ${c.normalWarning[0].xterm}], ["${c.normalWarning[1].hex}", ${c.normalWarning[1].xterm}]]]

let s:p.inactive.left = [[["${c.inactive1[0].hex}", ${c.inactive1[0].xterm}], ["${c.inactive1[1].hex}", ${c.inactive1[1].xterm}]], [["${c.inactive2[0].hex}", ${c.inactive2[0].xterm}], ["${c.inactive2[1].hex}", ${c.inactive2[1].xterm}]]]
let s:p.inactive.middle = [[["${c.inactive3[0].hex}", ${c.inactive3[0].xterm}], ["${c.inactive3[1].hex}", ${c.inactive3[1].xterm}]]]
let s:p.inactive.right = [[["${c.inactive4[0].hex}", ${c.inactive4[0].xterm}], ["${c.inactive4[1].hex}", ${c.inactive4[1].xterm}]], [["${c.inactive5[0].hex}", ${c.inactive5[0].xterm}], ["${c.inactive5[1].hex}", ${c.inactive5[1].xterm}]]]

let s:p.insert.left = [[["${c.insert1[0].hex}", ${c.insert1[0].xterm}], ["${c.insert1[1].hex}", ${c.insert1[1].xterm}]], [["${c.insert2[0].hex}", ${c.insert2[0].xterm}], ["${c.insert2[1].hex}", ${c.insert2[1].xterm}]]]
let s:p.insert.middle = [[["${c.insert3[0].hex}", ${c.insert3[0].xterm}], ["${c.insert3[1].hex}", ${c.insert3[1].xterm}]]]
let s:p.insert.right = [[["${c.insert4[0].hex}", ${c.insert4[0].xterm}], ["${c.insert4[1].hex}", ${c.insert4[1].xterm}]], [["${c.insert5[0].hex}", ${c.insert5[0].xterm}], ["${c.insert5[1].hex}", ${c.insert5[1].xterm}]]]

let s:p.replace.left = [[["${c.replace1[0].hex}", ${c.replace1[0].xterm}], ["${c.replace1[1].hex}", ${c.replace1[1].xterm}]], [["${c.replace2[0].hex}", ${c.replace2[0].xterm}], ["${c.replace2[1].hex}", ${c.replace2[1].xterm}]]]
let s:p.replace.middle = [[["${c.replace3[0].hex}", ${c.replace3[0].xterm}], ["${c.replace3[1].hex}", ${c.replace3[1].xterm}]]]
let s:p.replace.right = [[["${c.replace4[0].hex}", ${c.replace4[0].xterm}], ["${c.replace4[1].hex}", ${c.replace4[1].xterm}]], [["${c.replace5[0].hex}", ${c.replace5[0].xterm}], ["${c.replace5[1].hex}", ${c.replace5[1].xterm}]]]

let s:p.visual.left = [[["${c.visual1[0].hex}", ${c.visual1[0].xterm}], ["${c.visual1[1].hex}", ${c.visual1[1].xterm}]], [["${c.visual2[0].hex}", ${c.visual2[0].xterm}], ["${c.visual2[1].hex}", ${c.visual2[1].xterm}]]]
let s:p.visual.middle = [[["${c.visual3[0].hex}", ${c.visual3[0].xterm}], ["${c.visual3[1].hex}", ${c.visual3[1].xterm}]]]
let s:p.visual.right = [[["${c.visual4[0].hex}", ${c.visual4[0].xterm}], ["${c.visual4[1].hex}", ${c.visual4[1].xterm}]], [["${c.visual5[0].hex}", ${c.visual5[0].xterm}], ["${c.visual5[1].hex}", ${c.visual5[1].xterm}]]]

let s:p.tabline.left = [[["${c.tablineLeft[0].hex}", ${c.tablineLeft[0].xterm}], ["${c.tablineLeft[1].hex}", ${c.tablineLeft[1].xterm}]]]
let s:p.tabline.tabsel = [[["${c.tablineSelected[0].hex}", ${c.tablineSelected[0].xterm}], ["${c.tablineSelected[1].hex}", ${c.tablineSelected[1].xterm}]]]
let s:p.tabline.middle = [[["${c.tablineMiddle[0].hex}", ${c.tablineMiddle[0].xterm}], ["${c.tablineMiddle[1].hex}", ${c.tablineMiddle[1].xterm}]]]
let s:p.tabline.right = [[["${c.tablineRight[0].hex}", ${c.tablineRight[0].xterm}], ["${c.tablineRight[1].hex}", ${c.tablineRight[1].xterm}]]]

let g:lightline#colorscheme#${theme.name}#palette = lightline#colorscheme#flatten(s:p)

" Generated by Estilo ${pkg.estiloVersion} (https://github.com/jacoborus/estilo)
`
}
