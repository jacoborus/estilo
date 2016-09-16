#!/usr/bin/node


'use strict'

const { resolve } = require('path')
const convert = require('../convert.js')
const argv = require('minimist')(process.argv.slice(2))
const selectSyntax = require('./select-syntax.js')
const init = require('./init.js')
const path = require('path')
const installAirline = require('./install-airline.js')
const installLightline = require('./install-lightline.js')
const projectPath = resolve('.')

const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
}).notify()

const command = argv._[0]

if (!command || command === 'help') {
  showHelp()
} else if (command === 'render') {
  convert(projectPath)
} else if (command === 'add-syntax') {
  selectSyntax(projectPath)
} else if (command === 'init') {
  init(path.resolve(argv._[1] || '.'), argv.y)
} else if (command === 'add-airline') {
  installAirline(projectPath)
} else if (command === 'add-lightline') {
  installLightline(projectPath)
} else {
  console.log('Command not found')
  showHelp()
}

function showHelp () {
  console.log(`
  Usage: estilo [command]

  Commands:

    init                Initialize an estilo project in current folder
    render              Render all the colorschemes and themes
    add-syntax          Opens dialog for adding more syntax templates
    add-airline         Opens dialog for adding a new Airline style
    add-lightline       Opens dialog for adding a new Lightline style
    help                Show this help
`)
}

