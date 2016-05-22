'use strict'

const isHexColor = require('./is-hex-color.js')

// prevent bad formatted colors and
// return a new object with valid color codes
module.exports = function (palette, data) {
  const colors = {}
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(name => {
      let code = data[name]
      if (typeof code !== 'string') {
        throw new Error(`color ${name} is invalid`)
      }
      if (code.startsWith('@')) {
        code = palette[code.slice(1)]
      }
      if (!code || !isHexColor(code)) {
        throw new Error(`color ${name} is invalid`)
      }
      colors[name] = code
    })
  }
  return colors
}
