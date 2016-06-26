'use strict'

const isHexColor = require('./is-hex-color.js')
const getHilinks = require('./get-hilinks.js')
const printHls = require('./print-hls.js')
const printInfo = require('./print-info.js')

function renderThemes (schema) {
  const { info, templates, themes, palette } = schema
  Object.keys(themes).forEach(k => {
    const theme = themes[k]
    const colors = getColors(palette, theme.colors)
    schema.themes[k].colors = colors
    const hilinks = getHilinks(templates, colors)
    schema.themes[k].out = printInfo(info, theme) + printHls(hilinks)
  })
  return schema
}

// prevent bad formatted colors and
// return a new object with valid color codes
function getColors (palette, data) {
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

renderThemes.getColors = getColors
module.exports = renderThemes
