'use strict'

const isHexColor = require('./is-hex-color.js')
const hexterm = require('hexterm')

module.exports = function (colors, paletteName) {
  const palette = {}
  Object.keys(colors).forEach(c => {
    const str = colors[c].trim()

    let props = str.split(' ').reduce((arr, el) => {
      el = el.trim()
      if (el) return arr.concat(el)
      return arr
    }, [])

    if (!props[0] || !isHexColor(props[0])) {
      throw new Error(`color ${c} is invalid. Palette: ` + paletteName)
    }
    palette[c] = [props[0], props[1] || hexterm.default(props[0])]
  })
  return palette
}

