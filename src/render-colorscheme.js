'use strict'

const compileColorscheme = require('./compile-colorscheme.js')
const printColorscheme = require('./print-compiled-colorscheme.js')

function renderColorscheme (info, colorscheme, palette, templates) {
  const compiled = compileColorscheme(templates, palette)
  return printColorscheme(info, colorscheme, compiled)
}

module.exports = renderColorscheme
