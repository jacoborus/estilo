export type YmlFile = {
  filepath: string
  content: any
}

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

export interface TerminalStyle {
  path: string
  styles: {
    [index: string]: string
  }
}

export interface StatusStyle {
  name: string
  path: string
  styles: {
    [index: string]: string[]
  }
}

export type Palettes = Record<string, Palette>

interface ColorSchemeConfig {
  name: string
  background: string
  palette: string
  description?: string
}

interface StatusLineConfig {
  name: string
  palette: string
  style: string
  description?: string
}

interface Config {
  version?: string
  author?: string
  name?: string
  url?: string
  license?: string
  description?: string
  colorschemes?: ColorSchemeConfig[]
  airline?: StatusLineConfig[]
  lightline?: StatusLineConfig[]
}

interface SyntaxFile {
  filepath: string
  definitions: {
    [index: string]: [string, string, string]
  }
}

export interface Project {
  config: Config
  projectPath: string
  syntax: SyntaxFile[]
  palettes: Palettes
  terminalStyle?: TerminalStyle
  airlineStyles: Record<string, StatusStyle>
  lightlineStyles: Record<string, StatusStyle>
}
