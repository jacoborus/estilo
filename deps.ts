import { StatusBrand } from "./src/common.ts";
import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.6";
import { Leaf as LeafMain } from "https://raw.githubusercontent.com/ulthuan/leaf/main/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";
export { default as version } from "./version.ts";

export { basename, resolve } from "https://deno.land/std/path/mod.ts";
export { ensureDirSync, existsSync } from "https://deno.land/std/fs/mod.ts";

export {
  Checkbox,
  Input,
  prompt,
} from "https://deno.land/x/cliffy/prompt/mod.ts";
export {
  Command,
  HelpCommand,
} from "https://deno.land/x/cliffy/command/mod.ts";

export {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from "https://deno.land/std@0.97.0/encoding/yaml.ts";

export { green, red, yellow } from "https://deno.land/std/fmt/colors.ts";

export { hexterm } from "https://raw.githubusercontent.com/jacoborus/hexterm/master/src/hexterm.ts";

export const __dirname = new URL(".", import.meta.url).pathname;
export const Leaf = LeafMain;

export const handlebars = HandlebarsJS as {
  compile: (t: string) => (x: Record<string, unknown>) => string;
};

export const mustaches = {
  project: () =>
    LeafMain.readTextFileSync(resolve(__dirname, "mustaches/project.hbs")),
  colorscheme: () =>
    LeafMain.readTextFileSync(resolve(__dirname, "mustaches/colorscheme.hbs")),
  status: (brand: StatusBrand) =>
    LeafMain.readTextFileSync(resolve(__dirname, `mustaches/${brand}.hbs`)),
};
