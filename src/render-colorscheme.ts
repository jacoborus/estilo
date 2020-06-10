import handlebars from 'handlebars'
import hexterm from 'hexterm'
import { isHexColor } from './util'
import {
  ColorSchemeConfig,
  Project,
  Palette,
  SyntaxRule
} from './common'

export function renderColorscheme (config: ColorSchemeConfig, project: Project): string {
  const palette = project.palettes[config.palette]
  if (!palette) {
    throw new Error(`Palette (${config.palette}) doesn't exist`)
  }
  const syntax = project.syntax
  const c = parseSyntaxColors(syntax, palette)
  const render = handlebars.compile(project.mustaches.colorscheme)
  return render({ c, theme: config, pkg: project })
}

function parseSyntaxColors (syntax: SyntaxRule[], palette: Palette) {
  return syntax.map(rule => {
    const [fgColor, bgColor, ui, curlColor] = rule.rule.split(/\s+/)
    const filepath = rule.filepath
    if (fgColor.startsWith('@')) {
      return {
        link: fgColor.slice(1)
      }
    }
    return {
      fore: getColorCode(fgColor, palette, 'foreground', filepath),
      back: getColorCode(bgColor, palette, 'background', filepath),
      ui: getUI(ui),
      guisp: getCurlColor(curlColor, palette, filepath)
    }
  })
}

function getColorCode (color: string, palette: Palette, part: string, filepath: string) {
  // return false if empty color
  if (color === '.') return false
  // return false if color is `NONE`
  if (!color || color === '-') return { hex: 'NONE', xterm: 'NONE' }
  // return custom color if colorname is in palette
  const colorcodes = palette.colors[color]
  if (colorcodes) return colorcodes
  // return direct hex color
  if (isHexColor(color)) {
    const finalcolor = color.startsWith('#') ? color : color.slice(1)
    return {
      hex: finalcolor,
      xterm: hexterm(color)
    }
  }
  // not valid color
  throw new Error(`${part} color ${color} doesn't exists in ${filepath}`)
}

function getUI (ui: string) {
  // no defined gui
  if (ui === '.') return false
  if (!ui) return 'NONE'
  // 'NONE' or empty value
  if (ui === 'NONE') return 'NONE'
  return ui
}

function getCurlColor (cColor: string, palette: Palette, filepath: string) {
  const curlParsed = getColorCode(cColor, palette, 'guisp', filepath)
  let curlColor
  if (!curlParsed || curlParsed.hex === 'NONE') {
    curlColor = false
  } else {
    curlColor = curlParsed
  }
  return curlColor
}
