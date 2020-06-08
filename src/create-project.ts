import path from 'path'

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
  StatusStyles,
  Config
} from './common'

export function createProject (folderPath: string): Project {
  return {
    folderPath,
    config: getConfig(folderPath),
    palettes: loadPalettes(folderPath),
    syntax: ymlsInFolder(folderPath, 'syntax').flatMap(loadSyntax),
    terminalStyle: loadTerminal(folderPath),
    airlineStyles: loadAllStatus(folderPath, 'airline'),
    lightlineStyles: loadAllStatus(folderPath, 'lightline')
  }
}

function getConfig (folderPath: string): Config {
  const estiloVersion = require(path.resolve(__dirname, '../package.json')).version
  const fileData = loadYml(folderPath, 'estilo.yml').content
  return Object.assign({}, fileData, { estiloVersion })
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

function loadAllStatus (folderPath: string, kind: string): StatusStyles {
  const filepaths = ymlsInFolder(folderPath, kind)
  const statusStyle = {} as StatusStyles
  filepaths.forEach(filepath => {
    const style = loadStatus(filepath)
    statusStyle[style.name] = style
  })
  return statusStyle
}
