'use strict'

const hexterm = require('hexterm')
const compile = require('./compile-status.js')

/**
 * exports
 *
 * @param {String} pkgName name of the package
 * @param {String} schemeName name of the airline theme
 * @param {Object} template the airline template
 * @param {Object} colors Dictionary with color names and their hex values
 * @returns {String} The rendered airline theme
 */
module.exports = function (pkgName, schemeName, template, colors) {
  let model = compile(template, colors)
  return renderTheme(pkgName, schemeName, model)
}

/**
 * renderTheme
 *
 * @param {String} pkgName name of the package
 * @param {String} schemeName name of the airline theme
 * @param {Object} compiled airline theme ready for rendering
 * @returns {String} The rendered airline theme
 */
function renderTheme (pkgName, schemeName, compiled) {
  return `if exists('g:${pkgName}_airline') && g:${pkgName}_airline
  let g:airline#themes#${schemeName}#palette = {}

  let s:normal1 = [ "${compiled.normal1[0]}", "${compiled.normal1[1]}", ${hexterm(compiled.normal1[0])}, ${hexterm(compiled.normal1[1])} ]
  let s:normal2 = [ "${compiled.normal2[0]}", "${compiled.normal2[1]}", ${hexterm(compiled.normal2[0])}, ${hexterm(compiled.normal2[1])} ]
  let s:normal3 = [ "${compiled.normal3[0]}", "${compiled.normal3[1]}", ${hexterm(compiled.normal3[0])}, ${hexterm(compiled.normal3[1])} ]
  let g:airline#themes#${schemeName}#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)

  let s:insert1 = [ "${compiled.insert1[0]}", "${compiled.insert1[1]}", ${hexterm(compiled.insert1[0])}, ${hexterm(compiled.insert1[1])} ]
  let s:insert2 = [ "${compiled.insert2[0]}", "${compiled.insert2[1]}", ${hexterm(compiled.insert2[0])}, ${hexterm(compiled.insert2[1])} ]
  let s:insert3 = [ "${compiled.insert3[0]}", "${compiled.insert3[1]}", ${hexterm(compiled.insert3[0])}, ${hexterm(compiled.insert3[1])} ]
  let g:airline#themes#${schemeName}#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)

  let s:replace1 = [ "${compiled.replace1[0]}", "${compiled.replace1[1]}", ${hexterm(compiled.replace1[0])}, ${hexterm(compiled.replace1[1])} ]
  let s:replace2 = [ "${compiled.replace2[0]}", "${compiled.replace2[1]}", ${hexterm(compiled.replace2[0])}, ${hexterm(compiled.replace2[1])} ]
  let s:replace3 = [ "${compiled.replace3[0]}", "${compiled.replace3[1]}", ${hexterm(compiled.replace3[0])}, ${hexterm(compiled.replace3[1])} ]
  let g:airline#themes#${schemeName}#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)

  let s:visual1 = [ "${compiled.visual1[0]}", "${compiled.visual1[1]}", ${hexterm(compiled.visual1[0])}, ${hexterm(compiled.visual1[1])} ]
  let s:visual2 = [ "${compiled.visual2[0]}", "${compiled.visual2[1]}", ${hexterm(compiled.visual2[0])}, ${hexterm(compiled.visual2[1])} ]
  let s:visual3 = [ "${compiled.visual3[0]}", "${compiled.visual3[1]}", ${hexterm(compiled.visual3[0])}, ${hexterm(compiled.visual3[1])} ]
  let g:airline#themes#${schemeName}#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)

  let s:inactive1 = [ "${compiled.inactive1[0]}", "${compiled.inactive1[1]}", ${hexterm(compiled.inactive1[0])}, ${hexterm(compiled.inactive1[1])} ]
  let s:inactive2 = [ "${compiled.inactive2[0]}", "${compiled.inactive2[1]}", ${hexterm(compiled.inactive2[0])}, ${hexterm(compiled.inactive2[1])} ]
  let s:inactive3 = [ "${compiled.inactive3[0]}", "${compiled.inactive3[1]}", ${hexterm(compiled.inactive3[0])}, ${hexterm(compiled.inactive3[1])} ]
  let g:airline#themes#${schemeName}#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)
endif`
}
