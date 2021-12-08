// is-deno-bucket
import loadFolder from "./load-folder.ts";
import { resolve } from "https://deno.land/std@0.117.0/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const configs = [
  {
    name: "mustaches",
    folder: "../assets/mustaches",
    options: {
      exts: [".ejs"],
    },
  },
  {
    name: "syntax",
    folder: "../assets/syntax",
    options: {
      exts: [".yml"],
    },
  },
  {
    name: "addons",
    folder: "../assets/addons",
    options: {
      exts: [".yml"],
    },
  },
];

type Bucket = Record<string, string>;
const buckets = {} as Record<string, Bucket>;

configs.forEach((config) => {
  const path = resolve(__dirname, config.folder);
  buckets[config.name] = loadFolder(path, config.options);
});

export default buckets;
