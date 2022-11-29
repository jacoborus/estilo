export const version = "2.0.0-beta-5";

export { render } from "https://deno.land/x/eta@v1.12.3/mod.ts";

export { basename, resolve } from "https://deno.land/std@0.166.0/path/mod.ts";

export type { WalkOptions } from "https://deno.land/std@0.166.0/fs/mod.ts";
export {
  ensureDirSync,
  existsSync,
  walkSync,
} from "https://deno.land/std@0.166.0/fs/mod.ts";

export type { ValidateResult } from "https://deno.land/x/cliffy@v0.25.4/prompt/mod.ts";

export {
  Checkbox,
  Input,
  prompt,
} from "https://deno.land/x/cliffy@v0.25.4/prompt/mod.ts";

export {
  Command,
  HelpCommand,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

export {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from "https://deno.land/std@0.166.0/encoding/yaml.ts";

export {
  green,
  red,
  yellow,
} from "https://deno.land/std@0.166.0/fmt/colors.ts";

export { hexterm } from "https://raw.githubusercontent.com/jacoborus/hexterm/master/src/hexterm.ts";
