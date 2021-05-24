export default {
  key: "estilo-key",
  entry: "./estilo.ts",
  buckets: [
    {
      name: "mustaches",
      folder: "assets/mustaches",
      exts: [".hbs"],
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
  output: "estilo.bundle.js",
};
