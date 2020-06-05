'use strict'

const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const installTemplates = require('./install-templates.js')

module.exports = function (projectPath) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, '../..', 'templates/syntax'))
  const installedSyntax = fs.readdirSync(path.resolve(projectPath, 'estilo/syntax'))

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
    if (!answers.templates.length) {
      console.log('0 selected, skipping...')
    } else {
      installTemplates(answers.templates)
    }
  })
}
