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
    const colorname = content[prop].trim()
    if (!colorname) return
    terminalStyle.styles[prop] = colorname
  })

  return terminalStyle
}
