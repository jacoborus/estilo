// is-deno-bucket
import { basename, extname, resolve } from "../deps.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const syntax = loadFolder(resolve(__dirname, "../assets/syntax"));
const addons = loadFolder(resolve(__dirname, "../assets/addons"));
const mustaches = loadFolder(resolve(__dirname, "../assets/mustaches"));

export default { syntax, mustaches, addons };

function loadFolder(folderPath: string): Record<string, string> {
  const files = Array.from(Deno.readDirSync(folderPath))
    .filter(({ isFile, isSymlink }) => isFile && !isSymlink)
    .map(({ name }) => name);
  return Object.fromEntries(
    files.map((file) => {
      const fullPath = resolve(folderPath, file);
      return [removeExt(file), Deno.readTextFileSync(fullPath)];
    }),
  );
}

function removeExt(path: string): string {
  const filename = basename(path);
  const extension = extname(filename);
  return filename.slice(0, -extension.length);
}
