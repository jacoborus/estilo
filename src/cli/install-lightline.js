'use strict'

const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const mkdirp = require('mkdirp')
const chalk = require('chalk')
const { log } = console

const emptyTemplate = `normal1: ''
normal2: ''
normal3: ''
normal4: ''
normal5: ''
normalError: ''
normalWarning: ''
inactive1: ''
inactive2: ''
inactive3: ''
inactive4: ''
inactive5: ''
insert1: ''
insert2: ''
insert3: ''
insert4: ''
insert5: ''
replace1: ''
replace2: ''
replace3: ''
replace4: ''
replace5: ''
visual1: ''
visual2: ''
visual3: ''
visual4: ''
visual5: ''
tablineLeft: ''
tablineSelected: ''
tablineMiddle: ''
tablineRight: ''
`

module.exports = function (projectPath, callback) {
  const lightlinePath = path.resolve(projectPath, 'estilo/lightline')
  mkdirp.sync(lightlinePath)
  const installedStyles = fs.readdirSync(lightlinePath).map(n => {
    n.slice(0, -4)
  })

  const questions = [
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Do you want to add a Lightline style?',
      default: false
    },
    {
      type: 'input',
      message: 'Enter style name:',
      name: 'stylename',
      validate: input => {
        if (!input.trim()) return 'That\'s not a name'
        if (installedStyles.indexOf(input.trim()) > -1) {
          return 'That style already exists'
        } else {
          return true
        }
      },
      when: answers => answers.proceed
    }
  ]

  inquirer.prompt(questions).then(function (answers) {
    const filepath = path.resolve(lightlinePath, answers.stylename + '.yml')
    if (answers.proceed) {
      fs.writeFile(filepath, emptyTemplate, err => {
        if (err) {
          log(chalk.red.bold('Error writing ' + filepath))
        } else {
          log(chalk.green('New Lightline style: ') + chalk.cyan(answers.stylename))
        }
        if (callback) callback()
      })
    } else {
      log(chalk.yellow('skipping...'))
      callback()
    }
  })
}
