import {
  loadYml,
  ymlsInFolder
} from './util'
import {
  loadStatus,
  loadSyntax,
  loadTerminal,
  loadPalette
} from './loaders'

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
