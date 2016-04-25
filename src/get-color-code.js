'use strict'

const isHexColor = require('./is-hex-color.js')

module.exports = function (color, colors, part, schemaName) {
  // return false if empty color
  if (!color || color === '-') return false
  // return custom color
  const c = colors[color]
  if (c) return c
  // return direct hex color
  if (isHexColor(color)) {
    return color
  }
  // not valid color
  throw new Error('wrong ' + part + ' in ' + schemaName)
}
