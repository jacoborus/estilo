import { loadBuckets } from "https://deno.land/x/buckets@0.2.0/mod.ts";
import bucketsConf from "./conf.ts";

export const buckets = loadBuckets(bucketsConf);
