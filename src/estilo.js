#!/usr/bin/env node

'use strict'

const { resolve } = require('path')
const convert = require('../src/convert.js')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const addTemplate = require('./add-template.js')
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
} else if (command === 'add-template') {
  argv._.shift()
  addTemplate(argv._)
} else if (command === 'init') {
  init(path.resolve(argv._[1] || '.'), argv.y)
}

function showHelp () {
  console.log('Usage: estilo command options')
}
