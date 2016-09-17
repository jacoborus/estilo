'use strict'

const isHexColor = require('./is-hex-color.js')
const hexterm = require('hexterm')

/**
 * Convert all string values from a given
 * object (`template`) to arrays with hex colors
 *
 * @param {Object} template raw airline template
 * @returns {Object} transformed airline template
 */
module.exports = function (template, colors, statusName) {
  const out = {}
  Object.keys(template).forEach(k => {
    let arr = template[k].split(' ').filter(x => x.trim())
    out[k] = arr.map(c => {
      if (isHexColor(c)) return [c, hexterm(c)]
      let code = colors[c]
      if (!code) throw new Error(`Wrong color in ${statusName} template: ${c}`)
      return code
    })
  })
  return out
}
