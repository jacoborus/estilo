import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { YmlFile } from './common'

export function loadYml (folderPath: string, filename: string): YmlFile {
  const filepath = path.resolve(folderPath, filename)
  const content = yaml.parse(fs.readFileSync(filepath, 'utf8'))

  if (typeof content !== 'object') {
    throw new Error(`Content of file (${filepath}) is not an object`)
  }

  return {
    filepath,
    content
  }
}
