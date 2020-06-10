import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'
import cpFile from 'cp-file'
import mkdirp from 'mkdirp'
import chalk from 'chalk'
import { StatusBrand } from '../common'
const log = console.log

const templatePaths = {
  airline: 'templates/status/airline.yml',
  lightline: 'templates/status/lightline.yml'
}

export function installStatus (projectPath: string, brand: StatusBrand) {
  const statusFolderPath = path.resolve(projectPath, paths[brand])
  mkdirp.sync(statusFolderPath)
  const installedStyles = fs.readdirSync(statusFolderPath)
    .map(n => n.slice(0, -4))

  const questions = [
    {
      type: 'input',
      message: 'Enter style name:',
      name: 'stylename',
      validate: (input: string) => {
        if (!input.trim()) return 'That\'s not a name'
        if (installedStyles.indexOf(input.trim()) > -1) {
          return 'That style already exists'
        } else {
          return true
        }
      }
    }
  ]

  inquirer.prompt(questions).then(async function (answers) {
    const templatePath = path.resolve(__dirname, '..', templatePaths[brand])
    const filepath = path.resolve(statusFolderPath, answers.stylename + '.yml')
    await cpFile(templatePath, filepath)
    log(chalk.green(`New ${brand} style: ${(answers.stylename as string).trim()}`))
  })
}

const paths = {
  airline: 'estilo/airline',
  lightline: 'estilo/lightline'
}
