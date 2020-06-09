import { Project } from './common'

import {
  writeScheme,
  writeStatus
} from './writers'
import { renderColorscheme } from './render-colorscheme'
import { renderAirline } from './render-airline'
import { renderLightline } from './render-lightline'

export function renderProject (project: Project): void {
  const { config } = project
  config.colorschemes.forEach(config => {
    const rendered = renderColorscheme(config, project)
    writeScheme(rendered, config.name, project.folderPath)
  })

  config.airlines.forEach(config => {
    const rendered = renderAirline(config, project)
    writeStatus('airline', rendered, config.name, project.folderPath)
  })

  config.lightlines.forEach(config => {
    const rendered = renderLightline(config, project)
    writeStatus('lightline', rendered, config.name, project.folderPath)
  })
}
