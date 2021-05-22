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
interface HH {
  compile: (t: string) => (x: Record<string, unknown>) => string;
}
export const handlebars = HandlebarsJS as HH;

export const mustaches = {
  colorscheme: LeafMain.readTextFileSync(
    resolve(__dirname, "mustaches/colorscheme.hbs")
  ),
  airline: LeafMain.readTextFileSync(
    resolve(__dirname, "mustaches/airline.hbs")
  ),
  lightline: LeafMain.readTextFileSync(
    resolve(__dirname, "mustaches/lightline.hbs")
  ),
};
export const Leaf = LeafMain;
