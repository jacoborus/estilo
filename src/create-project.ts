import path from 'path'

import {
  loadYml,
  ymlsInFolder,
  estiloVersion
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
  StatusStyles,
  StatusBrand
} from './common'

export function createProject (folderPath: string): Project {
  return {
    folderPath,
    estiloVersion,
    config: loadYml(folderPath, 'estilo.yml').content,
    palettes: loadPalettes(folderPath),
    syntax: ymlsInFolder(folderPath, 'estilo/syntax').flatMap(loadSyntax),
    terminalStyle: loadTerminal(folderPath),
    airlineStyles: loadAllStatus(folderPath, 'airline'),
    lightlineStyles: loadAllStatus(folderPath, 'lightline'),
    mustaches: loadMustaches()
  }
}

function loadPalettes (folderPath: string): Palettes {
  const filepaths = ymlsInFolder(folderPath, 'estilo/palettes')
  const palettes = {} as Palettes
  filepaths.forEach(file => {
    const palette = loadPalette(file)
    palettes[palette.name] = palette
  })
  return palettes
}

function loadAllStatus (folderPath: string, brand: StatusBrand): StatusStyles {
  const brandpath = path.resolve(folderPath, 'estilo')
  const filepaths = ymlsInFolder(brandpath, brand)
  const statusStyle = {} as StatusStyles
  filepaths.forEach(filepath => {
    const style = loadStatus(filepath, brand)
    statusStyle[style.name] = style
  })
  return statusStyle
}
