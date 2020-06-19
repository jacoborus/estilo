import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'
import cpFile from 'cp-file'
import mkdirp from 'mkdirp'
import kleur from 'kleur'
import { StatusBrand } from '../common'

const originPaths = {
  airline: 'templates/status/airline.yml',
  lightline: 'templates/status/lightline.yml'
}

export function installStatus (projectPath: string, brand: StatusBrand) {
  const statusFolderPath = path.resolve(projectPath, 'estilo', brand)
  mkdirp.sync(statusFolderPath)
  const installedStyles = fs.readdirSync(statusFolderPath)
    .map(n => n.slice(0, -4))

  const questions = [
    {
      type: 'input',
      message: 'Enter style name:',
      name: 'stylename',
      validate: (input: string) => {
        const stylename = input.trim()
        if (!stylename) return 'That\'s not a name'
        if (installedStyles.includes(stylename)) {
          return 'That style already exists'
        } else {
          return true
        }
      }
    }
  ]

  inquirer.prompt(questions).then(async function (answers) {
    const templatePath = path.resolve(__dirname, '../..', originPaths[brand])
    const filepath = path.resolve(statusFolderPath, answers.stylename + '.yml')
    await cpFile(templatePath, filepath)
    const stylename = (answers.stylename as string).trim()
    console.log(kleur.green(`New ${brand} style: ${stylename}`))
    console.log(`==> ${filepath}`)
  })
}
