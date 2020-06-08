import fs from 'fs'
import path from 'path'
import { loadYml } from './util'
import { loadStatus } from './load-status'
import { loadSyntax } from './load-syntax'
import { loadTerminal } from './load-terminal'
import { loadPalette } from './load-palette'
import {
  Palettes,
  Project,
  SyntaxRule,
  StatusStyle
} from './common'

export function createProject (folderPath: string): Project {
  return {
    config: loadYml(folderPath, 'estilo.yml').content,
    projectPath: folderPath,
    palettes: loadPalettes(folderPath),
    syntax: loadAllSyntax(folderPath),
    terminalStyle: loadTerminal(folderPath),
    airlineStyles: loadAllStatusStyles(folderPath, 'airline'),
    lightlineStyles: loadAllStatusStyles(folderPath, 'lightline')
  }
}

function ymlsInFolder (folderPath: string, folder2?: string): string[] {
  const finalPath = folder2
    ? path.resolve(folderPath, folder2)
    : folderPath
  if (!fs.existsSync(finalPath)) {
    throw new Error('folder doesn\'t exists: ' + finalPath)
  }
  return fs.readdirSync(finalPath, 'utf8')
    .filter(filename => filename.endsWith('.yml'))
}

function loadPalettes (folderPath: string): Palettes {
  const filepaths = ymlsInFolder(folderPath)
  const palettes = {} as Palettes
  filepaths.forEach(file => {
    const palette = loadPalette(file)
    palettes[palette.name] = palette
  })
  return palettes
}

function loadAllSyntax (folderPath: string): SyntaxRule[] {
  const filepaths = ymlsInFolder(folderPath)
  return filepaths.flatMap(loadSyntax)
}

type StatusStyles = Record<string, StatusStyle>

function loadAllStatusStyles (folderPath: string, kind: string): StatusStyles {
  const filepaths = ymlsInFolder(folderPath, kind)
  const statusStyle = {} as StatusStyles
  filepaths.forEach(filepath => {
    const style = loadStatus(filepath)
    statusStyle[style.name] = style
  })
  return statusStyle
}
