#!/usr/bin/env node

'use strict'

const { resolve } = require('path')
const convert = require('../convert.js')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
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

if (!argv._.length) {
  console.log('No command found')
  showHelp()
  process.exit(0)
}

const command = argv._[0]

if (command === 'render') {
  convert(projectPath)
} else if (command === 'add-syntax') {
  selectSyntax(projectPath)
} else if (command === 'init') {
  init(path.resolve(argv._[1] || '.'), argv.y)
} else if (command === 'add-airline') {
  installAirline(projectPath)
} else if (command === 'add-lightline') {
  installLightline(projectPath)
}

function showHelp () {
  console.log('Usage: estilo command options')
}
