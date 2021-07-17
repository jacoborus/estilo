export type List = Record<string, string>;

export type YmlFile = {
  filepath: string;
  content: unknown;
};

export interface ColorObj {
  hex: string;
  xterm: string;
}

export interface Palette {
  name: string;
  filepath: string;
  colors: Record<string, ColorObj>;
}

export interface TerminalSyntax {
  [index: string]: string;
}

export type StatusBrand = "airline" | "lightline";
export type DataRenderStatus = Record<
  string,
  {
    fg: ColorObj;
    bg: ColorObj;
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
export type PaletteConfig = Record<string, List>;

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
  commonPalette?: List;
  colorschemes: SchemeConfig[];
  airline: StatusConfig[];
  lightline: StatusConfig[];
}

export type ListFile = Record<string, List>;

export interface Project {
  projectUrl: string;
  config: ProjectConfig;
  palettes: Palettes;
  syntax: SyntaxRule[];
  terminalSyntax: TerminalSyntax;
  airlineStyles: StatusStyles;
  lightlineStyles: StatusStyles;
}

export interface SyntaxRule {
  filepath: string;
  name: string;
  rule: string;
}
