#!/usr/bin/env node

'use strict'

const { resolve } = require('path')
const convert = require('../convert.js')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const selectSyntax = require('./select-syntax.js')
const init = require('./init.js')
const path = require('path')

if (!argv._.length) {
  console.log('No command found')
  showHelp()
  process.exit(0)
}

const command = argv._[0]

if (command === 'render') {
  convert(resolve('.'))
} else if (command === 'add-syntax') {
  selectSyntax(path.resolve('.'))
} else if (command === 'init') {
  init(path.resolve(argv._[1] || '.'), argv.y)
}

function showHelp () {
  console.log('Usage: estilo command options')
}
