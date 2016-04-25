'use strict'

const parser = require('./src/parser.js')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

module.exports = function (templatePath) {
  const template = yaml.eval(fs.readFileSync(templatePath, 'utf8'))
  const out = parser(template)
  const basename = path.basename(templatePath, '.yaml')
  fs.writeFileSync(basename + '.vim', out)
}
