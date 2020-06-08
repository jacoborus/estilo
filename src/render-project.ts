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
  config.colorschemes.forEach(scheme => {
    const rendered = renderColorscheme(scheme, project)
    writeScheme(rendered, scheme.name, project)
  })

  config.airlines.forEach(status => {
    const rendered = renderAirline(status, project)
    writeStatus('airline', rendered, status.name, project.folderPath)
  })

  config.lightlines.forEach(status => {
    const rendered = renderLightline(status, project)
    writeStatus('lightline', rendered, status.name, project.folderPath)
  })
}
