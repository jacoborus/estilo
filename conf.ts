export default {
  key: "estilo-key",
  entry: "./estilo.ts",
  optionsUrl: import.meta.url,
  buckets: [
    {
      name: "mustaches",
      folder: "assets/mustaches",
      exts: [".ejs"],
    },
    {
      name: "syntax",
      folder: "assets/syntax",
      exts: [".yml"],
    },
    {
      name: "addons",
      folder: "assets/addons",
      exts: [".yml"],
    },
  ],
  output: "dist/estilo.js",
};
