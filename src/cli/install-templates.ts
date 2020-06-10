import path from 'path'
import cpFile from 'cp-file'

export function installTemplates (templateNames: string[]) {
  templateNames.forEach(async name => {
    const origin = path.resolve(__dirname, '../..', 'templates/syntax', name)
    const destination = path.resolve('estilo/syntax', name)
    await cpFile(origin, destination)
  })
}
