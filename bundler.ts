import { bundle } from "https://deno.land/x/buckets@v0.4.0/mod.ts";

const content = await bundle("./estilo.ts");
Deno.writeTextFileSync("dist/estilo.js", content);
