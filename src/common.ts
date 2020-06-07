export interface Palette {
  name: string
  path: string
  colors: {
    [index: string]: {
      hex: string
      xterm: number
    }
  }
}

export interface StatusStyle {
  name: string
  path: string
  styles: {
    [index: string]: string[]
  }
}

export type YmlFile = {
  filepath: string
  content: any
}

export type Palettes = Record<string, Palette>
