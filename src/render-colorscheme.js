'use strict'

const compileColorscheme = require('./compile-colorscheme.js')
const printColorscheme = require('./print-compiled-colorscheme.js')

function renderColorscheme (schema, templates) {
  const hilinks = compileColorscheme(templates, schema)
  return printColorscheme(schema, hilinks)
}

module.exports = renderColorscheme
