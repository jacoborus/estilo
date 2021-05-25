export type YmlFile = {
  filepath: string;
  content: unknown;
};

export interface ColorCode {
  hex: string;
  xterm: string;
}

export interface Palette {
  name: string;
  filepath: string;
  colors: {
    [index: string]: ColorCode;
  };
}

export interface TerminalSyntax {
  [index: string]: string;
}

export type StatusBrand = "airline" | "lightline";
export type DataRenderStatus = Record<
  string,
  {
    fg: ColorCode;
    bg: ColorCode;
  }
>;

export type StatusStyles = Record<string, StatusStyle>;
export interface StatusSyntax {
  [index: string]: [string, string];
}
export interface StatusStyle {
  name: string;
  filepath: string;
  syntax: StatusSyntax;
}

export type Palettes = Record<string, Palette>;

export interface SchemeConfig {
  name: string;
  background: string;
  palette: string;
  description?: string;
}

export interface StatusConfig {
  name: string;
  palette: string;
  style: string;
  description?: string;
}

export interface ProjectConfig {
  version?: string;
  author?: string;
  name?: string;
  url?: string;
  license?: string;
  description?: string;
  common?: Record<string, string>;
  colorschemes: SchemeConfig[];
  airline: StatusConfig[];
  lightline: StatusConfig[];
}

export interface SyntaxRule {
  filepath: string;
  name: string;
  rule: string;
}

export interface Project {
  config: ProjectConfig;
  estiloVersion: string;
  folderPath: string;
  syntax: SyntaxRule[];
  palettes: Palettes;
  terminalSyntax: TerminalSyntax;
  airlineStyles: StatusStyles;
  lightlineStyles: StatusStyles;
}
