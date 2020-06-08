export type YmlFile = {
  filepath: string
  content: any
}

export interface Palette {
  name: string
  filepath: string
  colors: {
    [index: string]: {
      hex: string
      xterm: number
    }
  }
}

export interface TerminalStyle {
  filepath: string
  styles: {
    [index: string]: string
  }
}

export interface StatusStyle {
  name: string
  filepath: string
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

export interface SyntaxRule {
  filepath: string
  name: string
  rule: string
}

export interface Project {
  config: Config
  projectPath: string
  syntax: SyntaxRule[]
  palettes: Palettes
  terminalStyle?: TerminalStyle
  airlineStyles: Record<string, StatusStyle>
  lightlineStyles: Record<string, StatusStyle>
}
