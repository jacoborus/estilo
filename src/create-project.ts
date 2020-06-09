import pkg from '../package.json'

import {
  loadYml,
  ymlsInFolder
} from './util'

import {
  loadStatus,
  loadSyntax,
  loadTerminal,
  loadPalette,
  loadMustaches
} from './loaders'

import {
  Palettes,
  Project,
  StatusStyles
} from './common'

export function createProject (folderPath: string): Project {
  return {
    folderPath,
    estiloVersion: pkg.version,
    config: loadYml(folderPath, 'estilo.yml').content,
    palettes: loadPalettes(folderPath),
    syntax: ymlsInFolder(folderPath, 'syntax').flatMap(loadSyntax),
    terminalStyle: loadTerminal(folderPath),
    airlineStyles: loadAllStatus(folderPath, 'airline'),
    lightlineStyles: loadAllStatus(folderPath, 'lightline'),
    mustaches: loadMustaches()
  }
}

function loadPalettes (folderPath: string): Palettes {
  const filepaths = ymlsInFolder(folderPath, 'palettes')
  const palettes = {} as Palettes
  filepaths.forEach(file => {
    const palette = loadPalette(file)
    palettes[palette.name] = palette
  })
  return palettes
}

function loadAllStatus (folderPath: string, kind: 'airline' | 'lightline'): StatusStyles {
  const filepaths = ymlsInFolder(folderPath, kind)
  const statusStyle = {} as StatusStyles
  filepaths.forEach(filepath => {
    const style = loadStatus(filepath, kind)
    statusStyle[style.name] = style
  })
  return statusStyle
}
