'use strict'

const hexterm = require('hexterm')
const isHexColor = require('./is-hex-color.js')
const outBegin = `let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {}}\n`

function string2array (obj) {
  const out = {}
  Object.keys(obj).forEach(k => {
    out[k] = obj[k].split(' ').filter(x => x.trim())
  })
  return out
}

function transformColors (codes, colors) {
  let out = codes.map(c => {
    if (isHexColor(c)) return c
    let code = colors[c]
    if (!code) throw new Error('Wrong color in lightline template: ' + c)
    return code
  })
  return out
}

function transform (prop, codes, colors) {
  let d = transformColors(codes, colors)
  let out = `let s:p.${ prop } = [`
  out += `[["${d[0]}", ${hexterm(d[0])}], ["${d[1]}", ${hexterm(d[1])}]]`
  if (d.length > 2) {
    out += `, [["${d[2]}", ${hexterm(d[2])}], ["${d[3]}", ${hexterm(d[3])}]]`
  }
  out += ']\n'
  return out
}

module.exports = function (themeName, tmpl, colors) {
  let obj = string2array(tmpl)
  let out = outBegin
  Object.keys(obj).forEach(k => {
    if (obj[k] && obj[k].length) {
      out += transform(k, obj[k], colors)
    }
  })
  out += `let g:lightline#colorscheme#${ themeName }#palette = lightline#colorscheme#flatten(s:p)\n`
  return out
}
