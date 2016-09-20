#!/usr/bin/env node

'use strict'

const resolve = require('path').resolve
const loadProject = require('../load-project.js')
const renderProject = require('../render-project.js')
const argv = require('minimist')(process.argv.slice(2))
const selectSyntax = require('./select-syntax.js')
const init = require('./init.js')
const path = require('path')
const installAirline = require('./install-airline.js')
const installLightline = require('./install-lightline.js')
const projectPath = resolve('.')

const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

const help = `
  Usage: estilo [command]

  Commands:

    init                initialize an estilo project in current folder
    render              render all the colorschemes and themes
    add-syntax          open dialog: add more syntax templates
    add-airline         open dialog: add a new Airline style
    add-lightline       open dialog: add a new Lightline style
    version             output version number
    help                show this help
`

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
}).notify()

const command = argv._[0]

if (!command || command === 'help') {
  console.log(help)
} else if (command === 'render') {
  loadProject(projectPath, renderProject)
} else if (command === 'add-syntax') {
  selectSyntax(projectPath)
} else if (command === 'init') {
  init(path.resolve(argv._[1] || '.'), argv.y)
} else if (command === 'add-airline') {
  installAirline(projectPath)
} else if (command === 'add-lightline') {
  installLightline(projectPath)
} else if (command === 'version' || argv.v) {
  console.log(pkg.version)
} else {
  console.log('Command not found')
  console.log(help)
}
