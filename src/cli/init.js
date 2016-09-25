'use strict'

const path = require('path')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const fs = require('fs')
const installTemplates = require('./install-templates.js')
const chalk = require('chalk')

const blankNterm = `color_foreground: ''
color_background: ''
color_0: ''
color_1: ''
color_2: ''
color_3: ''
color_4: ''
color_5: ''
color_6: ''
color_7: ''
color_8: ''
color_9: ''
color_10: ''
color_11: ''
color_12: ''
color_13: ''
color_14: ''
color_15: ''
`
const defaultPalette = 'myblue: \'#99ccff\''

module.exports = function (projectPath, auto) {
  const folderName = path.basename(projectPath)

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: folderName
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: '1.0.0'
    },
    {
      type: 'input',
      name: 'license',
      message: 'License:',
      default: 'MIT'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:'
    },
    {
      type: 'input',
      name: 'url',
      message: 'Project url:'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Short description:'
    }
  ]

  if (auto) {
    createBoilerplate(projectPath, {
      name: folderName,
      author: '',
      version: '1.0.0',
      url: '',
      license: 'MIT',
      airline: true,
      lightline: true,
      description: ''
    })
  } else {
    inquirer.prompt(questions).then(function (answers) {
      createBoilerplate(projectPath, answers)
    })
  }
}

function createBoilerplate (projectPath, options) {
  const addonsFolder = path.resolve(projectPath, 'estilo/addons')
  const ntermPath = path.resolve(addonsFolder, 'nvim-term.yml')
  let estiloStr = `name: '${options.name}'
version: '${options.version || ''}'
license: '${options.license || ''}'
author: '${options.author || ''}'
url: '${options.url || ''}'
description: '${options.description || ''}'
colorschemes:
  - name: ${options.name}
    background: 'dark'
    palette: ${options.name}`

  fs.writeFileSync(path.resolve(projectPath, 'estilo.yml'), estiloStr)
  mkdirp.sync(path.resolve(projectPath, 'estilo'))
  mkdirp.sync(path.resolve(projectPath, 'estilo', 'syntax'))
  mkdirp.sync(path.resolve(projectPath, 'estilo', 'palettes'))
  mkdirp.sync(addonsFolder)
  fs.writeFileSync(path.resolve(projectPath, 'estilo/palettes', options.name + '.yml'), defaultPalette)
  fs.writeFileSync(ntermPath, blankNterm)

  installTemplates(['base.yml'], () => {
    console.log(chalk.green.bold('\nYour project is ready'))
  })
}
