import path from 'path'
import { TerminalStyle, YmlFile } from './common'

export default function (file: YmlFile): TerminalStyle {
  const { content, filepath } = file
  if (typeof content !== 'object') {
    throw new Error(`Content of terminal syntax (${filepath}) is not an object`)
  }
  const terminalStyle = {
    name: path.basename(filepath, '.yml'),
    path: filepath,
    styles: {}
  } as TerminalStyle

  Object.keys(content).forEach(prop => {
    const colorname = content[prop]

    if (typeof colorname !== 'string') {
      throw new Error(`Wrong type: ${filepath}: ${prop}`)
    }
    if (!colorname.trim()) return

    terminalStyle.styles[prop] = colorname.trim()
  })
  return terminalStyle
}

// if (!color) throw new Error('color in nvim-terminal, doesn\'t exist: ' + prop)
// if (typeof prop !== 'string') throw new Error('wrong color type in nvim-terminal')
