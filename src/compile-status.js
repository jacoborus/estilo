'use strict'

const isHexColor = require('./is-hex-color.js')

/**
 * Convert all string values from a given
 * object (`template`) to arrays with hex colors
 *
 * @param {Object} template raw airline template
 * @returns {Object} transformed airline template
 */
module.exports = function (template, colors) {
  const out = {}
  Object.keys(template).forEach(k => {
    let arr = template[k].split(' ').filter(x => x.trim())
    out[k] = useHexColors(arr, colors)
  })
  return out
}

/**
 * useHexColors
 *
 * @param {Array} codes list of two color names
 * @param {Object} colors dictionary with colors
 * @returns {Array} colors transformed to hex values
 */
function useHexColors (codes, colors) {
  return codes.map(c => {
    if (isHexColor(c)) return c
    let code = colors[c]
    if (!code) throw new Error(`Wrong color in lightline template: ${c}`)
    return code
  })
}
