import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

const paths = {
  airline: 'autoload/airline/themes',
  lightline: 'autoload/lightline/colorscheme'
}

export function writeScheme (txt: string, name: string, projectPath: string) {
  const folderPath = path.resolve(projectPath, '..', 'colors')
  const filepath = path.resolve(folderPath, name + '.yml')
  mkdirp(folderPath)
  fs.writeFileSync(txt, filepath)
}

export function writeStatus (kind: 'airline' | 'lightline', txt: string, name: string, projectPath: string) {
  const folderPath = path.resolve(projectPath, '..', paths[kind])
  const filepath = path.resolve(folderPath, name + '.yml')
  mkdirp(folderPath)
  fs.writeFileSync(txt, filepath)
}
