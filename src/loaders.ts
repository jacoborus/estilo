import path from 'path'
import hexterm from 'hexterm'
import { loadYml, isHexColor } from './util'
import {
  Palette,
  SyntaxRule,
  StatusStyle,
  TerminalStyle
} from './common'

export function loadPalette (filepath: string): Palette {
  const { content } = loadYml(filepath)

  const palette = {
    filepath,
    name: path.basename(filepath, '.yml'),
    colors: {}
  } as Palette

  Object.keys(content).forEach(name => {
    const value = content[name]

    const hexcolor = value.trim()
    if (!isHexColor(hexcolor)) {
      throw new Error(`Wrong color: ${filepath}: ${name}`)
    }

    palette.colors[name] = {
      hex: hexcolor.startsWith('#') ? hexcolor : '#' + hexcolor,
      xterm: hexterm(hexcolor)
    }
  })
  return palette
}

export function loadSyntax (filepath: string): SyntaxRule[] {
  const { content } = loadYml(filepath)

  return Object.keys(content)
    .map(name => {
      const rule = content[name].trim()
      return { filepath, name, rule }
    })
    .filter(rule => rule.rule)
}

export function loadStatus (filepath: string): StatusStyle {
  const { content } = loadYml(filepath)

  const statusStyle = {
    name: path.basename(filepath, '.yml'),
    filepath: filepath,
    styles: {}
  } as StatusStyle

  Object.keys(content).forEach(name => {
    const txt = content[name].trim()
    statusStyle.styles[name] = txt.split(/\s+/)
  })
  return statusStyle
}

export function loadTerminal (folderPath: string): TerminalStyle {
  const filepath = path.resolve(folderPath, 'addons', 'nvim-term.yml')
  const { content } = loadYml(filepath)

  const terminalStyle = {
    filepath: filepath,
    styles: {}
  } as TerminalStyle

  Object.keys(content).forEach(prop => {
    const colorname = content[prop].trim()
    if (!colorname) return
    terminalStyle.styles[prop] = colorname
  })

  return terminalStyle
}
