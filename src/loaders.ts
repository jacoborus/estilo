import path from 'path'
import fs from 'fs'
import { hexterm } from 'hexterm'
import { loadYml, isHexColor } from './util'
import { crash } from './crash'
import kleur from 'kleur'
import {
  Palette,
  SyntaxRule,
  StatusStyle,
  TerminalSyntax,
  Mustaches,
  StatusBrand
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
    if (!isHexColor(hexcolor)) crash('Wrong color', { filepath, name })
    palette.colors[name] = {
      hex: hexcolor.startsWith('#') ? hexcolor : '#' + hexcolor,
      xterm: hexterm(hexcolor).toString()
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

function getTerminalTemplatePath (folderPath: string) {
  const addonsPath = path.resolve(folderPath, 'estilo/addons')
  const legacyPath = path.resolve(addonsPath, 'nvim-term.yml')
  const newPath = path.resolve(addonsPath, 'terminal.yml')
  if (fs.existsSync(legacyPath) && !fs.existsSync(newPath)) {
    console.log(kleur.yellow().bold('⚠  Warning: Legacy terminal config path'))
    console.log(kleur.yellow(`Please rename ${legacyPath} to ${newPath}\n`))
    return legacyPath
  } else {
    return path.resolve(addonsPath, 'terminal.yml')
  }
}

export function loadTerminal (folderPath: string): TerminalSyntax {
  const filepath = getTerminalTemplatePath(folderPath)
  const { content } = loadYml(filepath)
  const terminalSyntax = {} as TerminalSyntax
  Object.keys(content).forEach(prop => {
    const colorname = content[prop].trim()
    if (!colorname) return
    terminalSyntax[prop] = colorname
  })
  return terminalSyntax
}

export function loadMustaches (): Mustaches {
  const folder = path.resolve(__dirname, '../mustaches')
  const filenames = ['colorscheme', 'airline', 'lightline']
  const mustaches = {} as Mustaches

  filenames.forEach(filename => {
    const filepath = path.resolve(folder, filename + '.hbs')
    const txt = fs.readFileSync(filepath, 'utf8')
    mustaches[filename] = txt
  })
  return mustaches
}

export function loadStatus (filepath: string, brand: StatusBrand): StatusStyle {
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

  statusParts[brand].forEach(part => {
    const block = statusStyle.syntax[part]
    if (!block) crash('Missing block in status', { filepath, block: part })
    if (!block[0]) {
      crash('Missing foreground in status block', { filepath, block: part })
    }
    if (!block[1]) {
      crash('Missing background in status block', { filepath, block: part })
    }
  })
  return statusStyle
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
    'normal4',
    'normal5',
    'normalError',
    'normalWarning',
    'inactive1',
    'inactive2',
    'inactive3',
    'inactive4',
    'inactive5',
    'insert1',
    'insert2',
    'insert3',
    'insert4',
    'insert5',
    'replace1',
    'replace2',
    'replace3',
    'replace4',
    'replace5',
    'visual1',
    'visual2',
    'visual3',
    'visual4',
    'visual5',
    'tablineLeft',
    'tablineSelected',
    'tablineMiddle',
    'tablineRight'
  ]
} // , ctrlp
