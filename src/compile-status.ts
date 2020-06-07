import path from 'path'
import { StatusStyle, YmlFile } from './common'

/*
 * Convert all string values from a given
 * object (`template`) to arrays with hex colors
 */
export default function (file: YmlFile): StatusStyle {
  const { content, filepath } = file
  if (typeof content !== 'object') {
    throw new Error(`Content of palette (${filepath}) is not an object`)
  }

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
