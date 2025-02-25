import { build, emptyDir } from "@deno/dnt";
import denojson from "../deno.json" with { type: "json" };

const version = denojson.version;
await emptyDir("./npm");

await build({
  typeCheck: "single",
  test: false,
  declaration: "inline",
  scriptModule: false,
  shims: {
    deno: true,
  },
  entryPoints: [{
    kind: "bin",
    name: "estilo", // command name
    path: "./estilo.ts",
  }],
  outDir: "./npm",

  package: {
    name: "estilo",
    version: version as string,
    description: "Create color schemes for Vim, Airline and Lightline",
    main: "esm/estilo.js",
    license: "MIT",
    author: "Jacobo Tabernero Rey - http://jacobo.codes",
    homepage: "https://github.com/jacoborus/estilo",
    keywords: [
      "vim",
      "color",
      "scheme",
      "schemes",
      "themes",
      "generator",
    ],
    repository: {
      "type": "git",
      "url": "git@github.com:jacoborus/hexterm.git",
    },
    bugs: {
      "url": "https://github.com/jacoborus/hexterm/issues",
    },
  },

  postBuild() {
    Deno.copyFileSync("LICENSE", "./npm/LICENSE");
    Deno.copyFileSync("README.md", "./npm/README.md");
  },
});
