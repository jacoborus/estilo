import path from 'path'
import { loadYml } from './load-yml'
import { StatusStyle } from './common'

export function loadStatus (filepath: string): StatusStyle {
  const { content } = loadYml(filepath)

  const statusStyle = {
    name: path.basename(filepath, '.yml'),
    path: filepath,
    styles: {}
  } as StatusStyle

  Object.keys(content).forEach(name => {
    const txt = content[name].trim()

    statusStyle.styles[name] = txt.split(/\s+/)
  })
  return statusStyle
}
