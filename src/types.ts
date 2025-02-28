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

export interface SchemeConfig {
  name: string;
  background: string;
  palette: string;
  description?: string;
  neovim_legacy_compat?: boolean;
}

export interface ProjectConfig {
  version?: string;
  author?: string;
  name?: string;
  url?: string;
  license?: string;
  description?: string;
  common?: List;
  colorschemes: SchemeConfig[];
  airline: StatusConfig[];
  lightline: StatusConfig[];
}

export interface Project {
  projectUrl: string;
  config: ProjectConfig;
  palettes: Record<string, Palette>;
  baseSyntax: SyntaxRule[];
  syntax: SyntaxRule[];
  terminalSyntax: List;
  airlineStyles: Record<string, StatusStyle>;
  lightlineStyles: Record<string, StatusStyle>;
}

export interface SyntaxRule {
  filepath: string;
  name: string;
  rule: string;
}

export type StatusBrand = "airline" | "lightline";
export type DataRenderStatus = Record<
  string,
  {
    fg: ColorObj;
    bg: ColorObj;
  }
>;

export interface StatusStyle {
  name: string;
  filepath: string;
  syntax: StatusSyntax;
}
export type StatusSyntax = Record<string, [string, string]>;

export interface StatusConfig {
  name: string;
  palette: string;
  style: string;
  description?: string;
}
