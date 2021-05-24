export default {
  key: "estilo-key",
  entry: "./estilo.ts",
  buckets: [
    {
      name: "mustaches",
      folder: "mustaches",
      exts: [".hbs"],
    },
    {
      name: "syntax",
      folder: "templates/syntax",
      exts: [".yml"],
    },
    {
      name: "status",
      folder: "templates/status",
      exts: [".yml"],
    },
    {
      name: "terminal",
      folder: "templates",
      exts: [".yml"],
      maxDepth: 1,
    },
  ],
  output: "estilo.bundle.js",
};
