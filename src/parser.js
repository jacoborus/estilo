'use strict'

const getInfo = require('./get-info.js')
const getColors = require('./get-colors.js')
const getHilinks = require('./get-hilinks.js')
const scheme = require('./scheme.js')
const parseInfo = require('./parse-info.js')

module.exports = function (src) {
  const info = getInfo(src.info)
  const colors = getColors(src.colors)
  return parseInfo(info) + scheme(getHilinks(src.hilinks, colors))
}
