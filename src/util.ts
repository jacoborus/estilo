import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { YmlFile } from './common'

export function isHexColor (color: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
}

export function loadYml (folderPath: string, filename?: string): YmlFile {
  const filepath = filename ? path.resolve(folderPath, filename) : folderPath
  const content = yaml.parse(fs.readFileSync(filepath, 'utf8'))

  if (typeof content !== 'object') {
    throw new Error(`Content of file (${filepath}) is not an object`)
  }

  Object.keys(content).forEach(name => {
    const value = content[name]

    if (typeof value !== 'string') {
      throw new Error(`Wrong type: ${filepath}: ${name}`)
    }
  })

  return {
    filepath,
    content
  }
}

export function ymlsInFolder (folderPath: string, folder2?: string): string[] {
  const finalPath = folder2
    ? path.resolve(folderPath, folder2)
    : folderPath
  if (!fs.existsSync(finalPath)) {
    throw new Error('folder doesn\'t exists: ' + finalPath)
  }
  return fs.readdirSync(finalPath, 'utf8')
    .filter(filename => filename.endsWith('.yml'))
}
