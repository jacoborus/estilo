import path from 'path'
import { loadYml } from './load-yml'
import { StatusStyle } from './common'

/*
 * Convert all string values from a given
 * object (`template`) to arrays with hex colors
 */
export function loadStatus (filepath: string): StatusStyle {
  const { content } = loadYml(filepath)

  const statusStyle = {
    name: path.basename(filepath, '.yml'),
    path: filepath,
    styles: {}
  } as StatusStyle

  Object.keys(content).forEach(name => {
    const txt = content[name]

    if (typeof txt !== 'string') {
      throw new Error(`Wrong type: ${filepath}: ${name}`)
    }

    statusStyle.styles[name] = txt.split(/\s+/)
  })
  return statusStyle
}
