import path from 'path'
import { loadYml } from './load-yml'
import { TerminalStyle } from './common'

export function loadTerminal (folderPath: string): TerminalStyle {
  const filepath = path.resolve(folderPath, 'addons', 'nvim-term.yml')
  const { content } = loadYml(filepath)

  const terminalStyle = {
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
