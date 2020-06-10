import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { YmlFile } from './common'
import { crack } from './crack'

export function isHexColor (color: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
}

export function loadYml (folderPath: string, filename?: string): YmlFile {
  const filepath = path.resolve(folderPath, filename || '')
  const content = yaml.parse(fs.readFileSync(filepath, 'utf8'))

  if (typeof content !== 'object') {
    crack('Content of file is not an object', { filepath })
  }

  Object.keys(content).forEach(name => {
    if (typeof content[name] !== 'string') {
      crack('Wrong type', { name, filepath })
    }
  })

  return { filepath, content }
}

// returns a list of all the `.yml` filepaths contained inside folderpath
export function ymlsInFolder (folderPath: string, folder2?: string): string[] {
  const finalPath = path.resolve(folderPath, folder2 || '')
  if (!fs.existsSync(finalPath)) {
    crack('Folder does not exist', { finalPath })
  }
  return fs.readdirSync(finalPath, 'utf8')
    .filter(filename => filename.endsWith('.yml'))
}
