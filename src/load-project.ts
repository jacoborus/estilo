import fs from 'fs'
import path from 'path'
import { loadYml } from './load-yml'
import { loadStatus } from './load-status'
import { loadTerminal } from './load-terminal'
import { loadPalette } from './load-palette'
import {
  Palettes,
  Project,
  SyntaxFile,
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

function ymlsInFolder (folderPath: string, secondFolder?: string): string[] {
  const finalPath = secondFolder
    ? path.resolve(folderPath, secondFolder)
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

function loadAllSyntax (folderPath: string): SyntaxFile[] {
  const filepaths = ymlsInFolder(folderPath)
  return filepaths.map(loadSyntax)
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
