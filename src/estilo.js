#!/usr/bin/env node

'use strict'

const { resolve } = require('path')
const convert = require('../src/convert.js')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

if (!argv._.length) {
  console.log('No command found')
  showHelp()
  process.exit(0)
}

const command = argv._[0]

if (command === 'render') {
  convert(resolve('.'))
}

function showHelp () {
  console.log('Usage: estilo command options')
}
