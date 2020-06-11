import handlebars from 'handlebars'
import hexterm from 'hexterm'
import { crack } from './crack'
import { isHexColor } from './util'
import {
  ColorSchemeConfig,
  Project,
  Palette,
  SyntaxRule,
  ColorCode
} from './common'

export function renderColorscheme (config: ColorSchemeConfig, project: Project): string {
  const palette = project.palettes[config.palette]
  if (!palette) {
    crack('Colorscheme palette does not exist', {
      colorscheme: config.name,
      palette: config.palette
    })
  }
  const syntax = project.syntax
  const c = parseSyntaxColors(syntax, palette)
  const render = handlebars.compile(project.mustaches.colorscheme)
  return render({ c, theme: config, pkg: project })
}

type SyntaxValues = Record<string, SyntaxValue>
interface SyntaxValue {
    fore: false | ColorCode
    back: false | ColorCode
    ui: false | string
    guisp: boolean | ColorCode
}

function parseSyntaxColors (syntax: SyntaxRule[], palette: Palette): SyntaxValues {
  const values = {} as SyntaxValues
  syntax.forEach(rule => {
    const [fgColor, bgColor, ui, curlColor] = rule.rule.split(/\s+/)
    const filepath = rule.filepath
    if (fgColor.startsWith('@')) {
      return {
        link: fgColor.slice(1)
      }
    }
    values[rule.name] = {
      fore: getColorCode(fgColor, palette, filepath),
      back: getColorCode(bgColor, palette, filepath),
      ui: getUI(ui),
      guisp: getCurlColor(curlColor, palette, filepath)
    }
  })
  return values
}

function getColorCode (color: string, palette: Palette, filepath: string): false | ColorCode {
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
      xterm: hexterm(color).toString()
    }
  }
  // not valid color
  crack('Color does not exist', { filepath, color })
}

function getUI (ui: string): false | string {
  // no defined gui
  if (ui === '.') return false
  if (!ui) return 'NONE'
  // 'NONE' or empty value
  if (ui === 'NONE') return 'NONE'
  return ui
}

function getCurlColor (cColor: string, palette: Palette, filepath: string): boolean | ColorCode {
  const curlParsed = getColorCode(cColor, palette, filepath)
  let curlColor
  if (!curlParsed || curlParsed.hex === 'NONE') {
    curlColor = false
  } else {
    curlColor = curlParsed
  }
  return curlColor
}
