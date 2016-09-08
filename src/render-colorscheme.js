'use strict'

const compileColorscheme = require('./compile-colorscheme.js')
const printColorscheme = require('./print-compiled-colorscheme.js')
const printInfo = require('./print-info.js')

function renderColorscheme (info, colorscheme, palette, templates) {
  const compiled = compileColorscheme(templates, palette)
  return printInfo(info, colorscheme) + printColorscheme(compiled)
}

module.exports = renderColorscheme
