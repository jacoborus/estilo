import path from 'path'
import fs from 'fs'

const pkgpath = path.resolve(__dirname, '../package.json')
const raw = fs.readFileSync(pkgpath, 'utf8')
export const pkg = JSON.parse(raw)
export const estiloVersion = pkg.version
