import { resolve } from "https://deno.land/std/path/mod.ts";
import { Handlebars } from "https://deno.land/x/handlebars/mod.ts";

export {
  Input,
  Checkbox,
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
export { resolve, basename } from "https://deno.land/std/path/mod.ts";
export { ensureDirSync, existsSync } from "https://deno.land/std/fs/mod.ts";
export { green, yellow, red } from "https://deno.land/std/fmt/colors.ts";

export { hexterm } from "https://raw.githubusercontent.com/jacoborus/hexterm/master/src/hexterm.ts";

export const handlebars = new Handlebars();

export const __dirname = new URL(".", import.meta.url).pathname;
export const version = Deno.readTextFileSync(
  resolve(__dirname, "version")
).trim();

export const mustaches = {
  colorscheme: resolve(__dirname, "mustaches/colorscheme.hbs"),
  airline: resolve(__dirname, "mustaches/airline.hbs"),
  lightline: resolve(__dirname, "mustaches/lightline.hbs"),
};
