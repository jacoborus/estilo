'use strict'

const parser = require('./src/parser.js')
const yaml = require('yaml')
const fs = require('fs')
const { basename, dirname } = require('path')

function generateFile (origin, destination) {
  // add extension to origin if it hasn't
  if (basename(origin) === basename(origin, '.yaml')) {
    origin = origin + '.yaml'
  }
  if (!destination) {
    // destination with same name and path as origin, but with '.vim' extension
    destination = dirname(origin) + '/' + basename(origin, '.yaml') + '.vim'
  } else if (basename(destination) === basename(destination, '.vim')) {
    // add extension to destination if it hasn't
    destination = destination + '.vim'
  }
  const template = yaml.eval(fs.readFileSync(origin, 'utf8'))
  const out = parser(template)
  fs.writeFileSync(destination, out)
}

function generateFolder () {}

module.exports = {
  generateFile,
  generateFolder
}
