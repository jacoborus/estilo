import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.6";

export { default as version } from "./version.ts";

export { basename, resolve } from "https://deno.land/std@0.101.0/path/mod.ts";
export {
  ensureDirSync,
  existsSync,
} from "https://deno.land/std@0.101.0/fs/mod.ts";

export type { ValidateResult } from "https://deno.land/x/cliffy@v0.19.3/prompt/mod.ts";

export {
  Checkbox,
  Input,
  prompt,
} from "https://deno.land/x/cliffy@v0.19.3/prompt/mod.ts";

export {
  Command,
  HelpCommand,
} from "https://deno.land/x/cliffy@v0.19.3/command/mod.ts";

export {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from "https://deno.land/std@0.97.0/encoding/yaml.ts";

export {
  green,
  red,
  yellow,
} from "https://deno.land/std@0.101.0/fmt/colors.ts";

export { hexterm } from "https://raw.githubusercontent.com/jacoborus/hexterm/master/src/hexterm.ts";

export const handlebars = HandlebarsJS as {
  compile: (t: string) => (x: Record<string, unknown>) => string;
};
