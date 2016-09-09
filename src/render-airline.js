'use strict'

const h = require('hexterm')
const compileStatus = require('./compile-status.js')

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
  let c = compileStatus(template, colors)
  return `if exists('g:${pkgName}_airline') && g:${pkgName}_airline
  let g:airline#themes#${schemeName}#palette = {}

  let s:normal1 = [ "${c.normal1[0]}", "${c.normal1[1]}", ${h(c.normal1[0])}, ${h(c.normal1[1])} ]
  let s:normal2 = [ "${c.normal2[0]}", "${c.normal2[1]}", ${h(c.normal2[0])}, ${h(c.normal2[1])} ]
  let s:normal3 = [ "${c.normal3[0]}", "${c.normal3[1]}", ${h(c.normal3[0])}, ${h(c.normal3[1])} ]
  let g:airline#themes#${schemeName}#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)

  let s:insert1 = [ "${c.insert1[0]}", "${c.insert1[1]}", ${h(c.insert1[0])}, ${h(c.insert1[1])} ]
  let s:insert2 = [ "${c.insert2[0]}", "${c.insert2[1]}", ${h(c.insert2[0])}, ${h(c.insert2[1])} ]
  let s:insert3 = [ "${c.insert3[0]}", "${c.insert3[1]}", ${h(c.insert3[0])}, ${h(c.insert3[1])} ]
  let g:airline#themes#${schemeName}#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)

  let s:replace1 = [ "${c.replace1[0]}", "${c.replace1[1]}", ${h(c.replace1[0])}, ${h(c.replace1[1])} ]
  let s:replace2 = [ "${c.replace2[0]}", "${c.replace2[1]}", ${h(c.replace2[0])}, ${h(c.replace2[1])} ]
  let s:replace3 = [ "${c.replace3[0]}", "${c.replace3[1]}", ${h(c.replace3[0])}, ${h(c.replace3[1])} ]
  let g:airline#themes#${schemeName}#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)

  let s:visual1 = [ "${c.visual1[0]}", "${c.visual1[1]}", ${h(c.visual1[0])}, ${h(c.visual1[1])} ]
  let s:visual2 = [ "${c.visual2[0]}", "${c.visual2[1]}", ${h(c.visual2[0])}, ${h(c.visual2[1])} ]
  let s:visual3 = [ "${c.visual3[0]}", "${c.visual3[1]}", ${h(c.visual3[0])}, ${h(c.visual3[1])} ]
  let g:airline#themes#${schemeName}#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)

  let s:inactive1 = [ "${c.inactive1[0]}", "${c.inactive1[1]}", ${h(c.inactive1[0])}, ${h(c.inactive1[1])} ]
  let s:inactive2 = [ "${c.inactive2[0]}", "${c.inactive2[1]}", ${h(c.inactive2[0])}, ${h(c.inactive2[1])} ]
  let s:inactive3 = [ "${c.inactive3[0]}", "${c.inactive3[1]}", ${h(c.inactive3[0])}, ${h(c.inactive3[1])} ]
  let g:airline#themes#${schemeName}#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)
endif`
}
