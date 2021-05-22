import { Leaf, __dirname, resolve } from "./deps.ts";

Leaf.compile({
  modulePath: "./estilo.ts",
  contentFolders: [resolve(__dirname, "mustaches")],
  flags: ["--allow-write"],
});
