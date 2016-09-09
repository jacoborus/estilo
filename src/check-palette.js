'use strict'

const isHexColor = require('./is-hex-color.js')

module.exports = function (colors, paletteName) {
  Object.keys(colors).forEach(c => {
    const color = colors[c]
    if (!color || !isHexColor(color)) {
      throw new Error(`color ${color} is invalid. Palette: ` + paletteName)
    }
  })
}

