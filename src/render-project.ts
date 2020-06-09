import { Project } from './common'
import {
  writeScheme,
  writeStatus
} from './writers'
import { renderColorscheme } from './render-colorscheme'
import { renderStatus } from './render-status'

export function renderProject (project: Project): void {
  const { config } = project
  config.colorschemes.forEach(config => {
    const rendered = renderColorscheme(config, project, 'airline')
    writeScheme(rendered, config.name, project.folderPath)
  })

  config.airlines.forEach(config => {
    const rendered = renderStatus(config, project, 'airline')
    writeStatus('airline', rendered, config.name, project.folderPath)
  })

  config.lightlines.forEach(config => {
    const rendered = renderStatus(config, project, 'lightline')
    writeStatus('lightline', rendered, config.name, project.folderPath)
  })
}
