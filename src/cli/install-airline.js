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
inactive1: ''
inactive2: ''
inactive3: ''
insert1: ''
insert2: ''
insert3: ''
replace1: ''
replace2: ''
replace3: ''
visual1: ''
visual2: ''
visual3: ''`

module.exports = function (projectPath, callback) {
  const airlinePath = path.resolve(projectPath, 'estilo/airline')
  mkdirp.sync(airlinePath)
  const installedStyles = fs.readdirSync(airlinePath).map(n => {
    n.slice(0, -4)
  })

  const questions = [
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Do you want to add an Airline theme style?',
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
    const filepath = path.resolve(airlinePath, answers.stylename + '.yml')
    if (answers.proceed) {
      fs.writeFile(filepath, emptyTemplate, err => {
        if (err) {
          log(chalk.red.bold('Error writing ' + filepath))
        } else {
          log(chalk.green('New Airline style: ') + chalk.cyan(answers.stylename))
        }
        if (callback) callback()
      })
    } else {
      log(chalk.yellow('skipping...'))
      callback()
    }
  })
}
