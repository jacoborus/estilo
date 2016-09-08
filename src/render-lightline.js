'use strict'

'use strict'

const h = require('hexterm')
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
module.exports = function (pkgName, themeName, template, colors) {
  let d = compile(template, colors)
  return `if exists('g:${pkgName}_lightline') && g:${pkgName}_lightline
  let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {}}
  let s:p.normal.left = [[["${d.normal1[0]}", ${h(d.normal1[0])}], ["${d.normal1[1]}", ${h(d.normal1[1])}]], [["${d.normal2[0]}", ${h(d.normal2[0])}], ["${d.normal2[1]}", ${h(d.normal2[1])}]]]
  let s:p.normal.middle = [[["${d.normal3[0]}", ${h(d.normal3[0])}], ["${d.normal3[1]}", ${h(d.normal3[1])}]]]
  let s:p.normal.right = [[["${d.normal4[0]}", ${h(d.normal4[0])}], ["${d.normal4[1]}", ${h(d.normal4[1])}]], [["${d.normal5[0]}", ${h(d.normal5[0])}], ["${d.normal5[1]}", ${h(d.normal5[1])}]]]
  let s:p.normal.error = [[["${d.normalError[0]}", ${h(d.normalError[0])}], ["${d.normalError[1]}", ${h(d.normalError[1])}]]]
  let s:p.normal.warning = [[["${d.normalWarning[0]}", ${h(d.normalWarning[0])}], ["${d.normalWarning[1]}", ${h(d.normalWarning[1])}]]]
  let s:p.inactive.left = [[["${d.inactive1[0]}", ${h(d.inactive1[0])}], ["${d.inactive1[1]}", ${h(d.inactive1[1])}]], [["${d.inactive2[0]}", ${h(d.inactive2[0])}], ["${d.inactive2[1]}", ${h(d.inactive2[1])}]]]
  let s:p.inactive.middle = [[["${d.inactive3[0]}", ${h(d.inactive3[0])}], ["${d.inactive3[1]}", ${h(d.inactive3[1])}]]]
  let s:p.inactive.right = [[["${d.inactive4[0]}", ${h(d.inactive4[0])}], ["${d.inactive4[1]}", ${h(d.inactive4[1])}]], [["${d.inactive5[0]}", ${h(d.inactive5[0])}], ["${d.inactive5[1]}", ${h(d.inactive5[1])}]]]
  let s:p.insert.left = [[["${d.insert1[0]}", ${h(d.insert1[0])}], ["${d.insert1[1]}", ${h(d.insert1[1])}]], [["${d.insert2[0]}", ${h(d.insert2[0])}], ["${d.insert2[1]}", ${h(d.insert2[1])}]]]
  let s:p.insert.middle = [[["${d.insert3[0]}", ${h(d.insert3[0])}], ["${d.insert3[1]}", ${h(d.insert3[1])}]]]
  let s:p.insert.right = [[["${d.insert4[0]}", ${h(d.insert4[0])}], ["${d.insert4[1]}", ${h(d.insert4[1])}]], [["${d.insert5[0]}", ${h(d.insert5[0])}], ["${d.insert5[1]}", ${h(d.insert5[1])}]]]
  let s:p.replace.left = [[["${d.replace1[0]}", ${h(d.replace1[0])}], ["${d.replace1[1]}", ${h(d.replace1[1])}]], [["${d.replace2[0]}", ${h(d.replace2[0])}], ["${d.replace2[1]}", ${h(d.replace2[1])}]]]
  let s:p.replace.middle = [[["${d.replace3[0]}", ${h(d.replace3[0])}], ["${d.replace3[1]}", ${h(d.replace3[1])}]]]
  let s:p.replace.right = [[["${d.replace4[0]}", ${h(d.replace4[0])}], ["${d.replace4[1]}", ${h(d.replace4[1])}]], [["${d.replace5[0]}", ${h(d.replace5[0])}], ["${d.replace5[1]}", ${h(d.replace5[1])}]]]
  let s:p.visual.left = [[["${d.visual1[0]}", ${h(d.visual1[0])}], ["${d.visual1[1]}", ${h(d.visual1[1])}]], [["${d.visual2[0]}", ${h(d.visual2[0])}], ["${d.visual2[1]}", ${h(d.visual2[1])}]]]
  let s:p.visual.middle = [[["${d.visual3[0]}", ${h(d.visual3[0])}], ["${d.visual3[1]}", ${h(d.visual3[1])}]]]
  let s:p.visual.right = [[["${d.visual4[0]}", ${h(d.visual4[0])}], ["${d.visual4[1]}", ${h(d.visual4[1])}]], [["${d.visual5[0]}", ${h(d.visual5[0])}], ["${d.visual5[1]}", ${h(d.visual5[1])}]]]
  let s:p.tabline.left = [[["${d.tablineLeft[0]}", ${h(d.tablineLeft[0])}], ["${d.tablineLeft[1]}", ${h(d.tablineLeft[1])}]]]
  let s:p.tabline.tabsel = [[["${d.tablineSelected[0]}", ${h(d.tablineSelected[0])}], ["${d.tablineSelected[1]}", ${h(d.tablineSelected[1])}]]]
  let s:p.tabline.middle = [[["${d.tablineMiddle[0]}", ${h(d.tablineMiddle[0])}], ["${d.tablineMiddle[1]}", ${h(d.tablineMiddle[1])}]]]
  let s:p.tabline.right = [[["${d.tablineRight[0]}", ${h(d.tablineRight[0])}], ["${d.tablineRight[1]}", ${h(d.tablineRight[1])}]]]
  let g:lightline#colorscheme#${themeName}#palette = lightline#colorscheme#flatten(s:p)
endif
`
}
