import { WalkOptions, walkSync } from "https://deno.land/std@0.117.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.117.0/path/mod.ts";

export interface BucketOptions {
  maxDepth?: number;
  exts?: string[];
  match?: RegExp[];
  skip?: RegExp[];
  trimExtensions?: boolean;
  decoder?: <T>(data: Uint8Array) => T;
}

export default function loadFolder<T = string>(
  path: string,
  options = {} as BucketOptions,
): Record<string, T> {
  const bucket = {} as Record<string, unknown>;
  const walkConf = getWalkConf(options);
  const folderPath = resolve(path);
  for (const e of walkSync(folderPath, walkConf)) {
    const propName = getPropPath(folderPath, e.path);
    const finalPropName = removeExtension(propName, options);
    bucket[finalPropName] = options.decoder
      ? options.decoder<T>(Deno.readFileSync(e.path))
      : Deno.readTextFileSync(e.path) as string;
  }
  return bucket as Record<string, T>;
}

function getWalkConf(bucketConf: BucketOptions): WalkOptions {
  const conf = {
    includeDirs: false,
  } as WalkOptions;
  if ("maxDepth" in bucketConf) conf.maxDepth = bucketConf.maxDepth;
  if ("exts" in bucketConf) conf.exts = bucketConf.exts;
  if ("match" in bucketConf) conf.match = bucketConf.match;
  if ("skip" in bucketConf) conf.skip = bucketConf.skip;
  return conf;
}

function getPropPath(folder: string, file: string): string {
  const len = folder.length - file.length + 1;
  return file.slice(len);
}

function removeExtension(name: string, conf: BucketOptions): string {
  if (!conf.trimExtensions || !conf.exts || !conf.exts.length) return name;
  const extension = conf.exts.find((ext) => name.endsWith(ext)) as string;
  const len = extension.length;
  return name.slice(0, name.length - len);
}
