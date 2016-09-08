'use strict'

const isHexColor = require('./is-hex-color.js')

module.exports = function (palette) {
  Object.keys(palette.colors).forEach(c => {
    const color = palette.colors[c]
    if (!color || !isHexColor(color)) {
      throw new Error(`color ${color} is invalid. Palette: ` + palette.name)
    }
  })
}

