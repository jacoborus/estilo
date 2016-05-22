'use strict'

const getColors = require('./get-colors.js')
const getHilinks = require('./get-hilinks.js')
const printHls = require('./print-hls.js')
const printInfo = require('./print-info.js')

module.exports = function (schema) {
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
