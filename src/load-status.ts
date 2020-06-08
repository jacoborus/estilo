import path from 'path'
import { loadYml } from './util'
import { StatusStyle } from './common'

export function loadStatus (filepath: string): StatusStyle {
  const { content } = loadYml(filepath)

  const statusStyle = {
    name: path.basename(filepath, '.yml'),
    filepath: filepath,
    styles: {}
  } as StatusStyle

  Object.keys(content).forEach(name => {
    const txt = content[name].trim()
    statusStyle.styles[name] = txt.split(/\s+/)
  })
  return statusStyle
}
