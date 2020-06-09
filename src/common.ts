export type YmlFile = {
  filepath: string
  content: any
}

export interface ColorCode {
  hex: string
  xterm: number
}

export interface Palette {
  name: string
  filepath: string
  colors: {
    [index: string]: ColorCode
  }
}

export interface TerminalStyle {
  filepath: string
  styles: {
    [index: string]: string
  }
}

export type DataRenderStatus = Record<string, {
  fg: ColorCode,
  bg: ColorCode
}>

export type StatusStyles = Record<string, StatusStyle>
export interface StatusSyntax {
    [index: string]: [string, string]
}
export interface StatusStyle {
  name: string
  filepath: string
  syntax: StatusSyntax
}

export type Palettes = Record<string, Palette>

interface ColorSchemeConfig {
  name: string
  background: string
  palette: string
  description?: string
}

export interface StatusLineConfig {
  name: string
  palette: string
  style: string
  description?: string
}

export interface ProjectConfig {
  version?: string
  author?: string
  name?: string
  url?: string
  license?: string
  description?: string
  colorschemes: ColorSchemeConfig[]
  airlines: StatusLineConfig[]
  lightlines: StatusLineConfig[]
}

export interface SyntaxRule {
  filepath: string
  name: string
  rule: string
}

export interface Project {
  config: ProjectConfig
  estiloVersion: string
  folderPath: string
  syntax: SyntaxRule[]
  palettes: Palettes
  terminalStyle?: TerminalStyle
  airlineStyles: Record<string, StatusStyle>
  lightlineStyles: Record<string, StatusStyle>
}
