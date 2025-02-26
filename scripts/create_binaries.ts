import $ from "@david/dax";
import denojson from "../deno.json" with { type: "json" };

const prefix = `estilo-${denojson.version}-`;

const archs = [
  ["x86_64-unknown-linux-gnu", "linux-x86"],
  ["aarch64-unknown-linux-gnu", "linux-arm"],
  ["x86_64-pc-windows-msvc", "windows-x86", ".exe"],
  ["x86_64-apple-darwin", "apple-x86"],
  ["aarch64-apple-darwin", "apple-arm"],
] as const;

await $`rm -rf bin`;

for await (const arch of archs) {
  await releaseArch(arch);
}

console.log("Done!");

async function releaseArch(arch: (typeof archs)[number]) {
  const folder = "release/" + prefix + arch[1];
  await $`mkdir ${folder} -p`;
  await $`rm -rf ${folder}/*.*`;
  const filepath = folder + "/estilo" + (arch[2] ? arch[2] : "");
  await $`deno compile --allow-read --allow-write --target ${
    arch[0]
  } -o ${filepath} estilo.ts`;
  await $`zip -r -j ${folder}.zip ${filepath}`;
  await $`rm -rf ${folder}`;
}
