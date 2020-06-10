import path from 'path'
import cpFile from 'cp-file'

export function installTemplates (templateNames: string[]) {
  if (!templateNames.length) {
    console.log('0 templates added')
    process.exit(0)
  }
  templateNames.forEach(async name => {
    const origin = path.resolve(__dirname, '../..', 'templates/syntax', name)
    const destination = path.resolve('estilo/syntax', name)
    await cpFile(origin, destination)
  })
}
