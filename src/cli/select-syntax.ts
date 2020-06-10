import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'
import { installTemplates } from './install-templates'

export function selectSyntax (projectPath: string) {
  const syntaxFolder = path.resolve(__dirname, '../..', 'templates/syntax')
  const syntaxDestFolder = path.resolve(projectPath, 'estilo/syntax')
  const templateFiles = fs.readdirSync(syntaxFolder)
  const installedSyntax = fs.readdirSync(syntaxDestFolder)

  const templateChoices = templateFiles.map(f => {
    const isDisabled = installedSyntax.indexOf(f) > -1
    let tName = f.slice(0, -4)
    if (isDisabled) {
      tName += ' (already installed)'
    }

    return {
      name: tName,
      value: f,
      disabled: isDisabled
    }
  })

  const questions = [
    {
      type: 'checkbox',
      message: 'Select some extra syntax templates',
      name: 'templates',
      choices: templateChoices
    }
  ]

  inquirer.prompt(questions).then(function (answers) {
    installTemplates(answers.templates as string[])
  })
}
