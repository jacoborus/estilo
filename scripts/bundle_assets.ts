import { basename, extname, resolve } from "@std/path";

const projectFolder = resolve(import.meta.dirname as string, "..");
const srcFolder = resolve(projectFolder, "src");

const syntax = loadFolder(resolve(srcFolder, "./assets/syntax"));
const mustaches = loadFolder(resolve(srcFolder, "./assets/mustaches"));

const assets = { syntax, mustaches };

Deno.writeTextFileSync(
  resolve(srcFolder, "./assets.ts"),
  "export default " + JSON.stringify(assets, null, 2),
);

function loadFolder(folderPath: string): Record<string, string> {
  const fileNames = Array.from(Deno.readDirSync(folderPath))
    .filter(({ isFile, isSymlink }) => isFile && !isSymlink)
    .map(({ name }) => name);

  const files: Record<string, string> = {};
  fileNames.forEach((file) => {
    const fullPath = resolve(folderPath, file);
    const name = removeExt(file);
    const content = Deno.readTextFileSync(fullPath);
    files[name] = content;
  });
  return files;
}

function removeExt(path: string): string {
  const filename = basename(path);
  const extension = extname(filename);
  return filename.slice(0, -extension.length);
}
