import path from 'path'
import hexterm from 'hexterm'
import { Palette } from './common'
import { loadYml, isHexColor } from './util'

export function loadPalette (filepath: string): Palette {
  const { content } = loadYml(filepath)

  const palette = {
    filepath,
    name: path.basename(filepath, '.yml'),
    colors: {}
  } as Palette

  Object.keys(content).forEach(name => {
    const value = content[name]

    const hexcolor = value.trim()
    if (!isHexColor(hexcolor)) {
      throw new Error(`Wrong color: ${filepath}: ${name}`)
    }

    palette.colors[name] = {
      hex: hexcolor.startsWith('#') ? hexcolor : '#' + hexcolor,
      xterm: hexterm(hexcolor)
    }
  })
  return palette
}
