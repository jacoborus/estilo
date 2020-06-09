import path from 'path'
import fs from 'fs'
import hexterm from 'hexterm'
import { loadYml, isHexColor } from './util'
import {
  Palette,
  SyntaxRule,
  StatusStyle,
  TerminalStyle,
  Mustaches
} from './common'

export function loadPalette (filepath: string): Palette {
  const { content } = loadYml(filepath)

  const palette = {
    filepath,
    name: path.basename(filepath, '.yml'),
    colors: {}
  } as Palette

  Object.keys(content).forEach(name => {
    const hexcolor = content[name].trim()

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
    .map(name => ({
      filepath,
      name,
      rule: content[name].trim()
    }))
    .filter(rule => rule.rule)
}

const statusParts = {
  airline: [
    'normal1',
    'normal2',
    'normal3',
    'insert1',
    'insert2',
    'insert3',
    'replace1',
    'replace2',
    'replace3',
    'visual1',
    'visual2',
    'visual3',
    'inactive1',
    'inactive2',
    'inactive3'
  ],
  lightline: [
    'normal1',
    'normal2',
    'normal3',
    'insert1',
    'insert2',
    'insert3',
    'replace1',
    'replace2',
    'replace3',
    'visual1',
    'visual2',
    'visual3',
    'inactive1',
    'inactive2',
    'inactive3'
  ]
} // , ctrlp

export function loadStatus (filepath: string, kind: 'airline' | 'lightline'): StatusStyle {
  const { content } = loadYml(filepath)

  const statusStyle = {
    name: path.basename(filepath, '.yml'),
    filepath: filepath,
    syntax: {}
  } as StatusStyle

  Object.keys(content).forEach(name => {
    const txt = content[name].trim()
    statusStyle.syntax[name] = txt.split(/\s+/)
  })
  // validate
  statusParts[kind].forEach(part => {
    const block = statusStyle.syntax[part]
    if (!block) throw new Error(`Missing ${kind} block: ${[part]} in ${filepath}`)
    if (!block[0]) throw new Error(`Missing foreground ${part} in ${filepath}`)
    if (!block[1]) throw new Error(`Missing background ${part} in ${filepath}`)
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

export function loadMustaches (): Mustaches {
  const folder = path.resolve(__dirname, '../templates/mustaches')
  const filenames = ['colorscheme', 'airline', 'lightline']
  const mustaches = {} as Mustaches
  filenames.forEach(filename => {
    const filepath = path.resolve(folder, filename + '.hbs')
    const txt = fs.readFileSync(filepath, 'utf8')
    mustaches[filename] = txt
  })
  return mustaches
}
