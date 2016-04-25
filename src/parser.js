'use strict'

const getColors = require('./get-colors.js')
const getSchemas = require('./get-schemas.js')
const getHilinks = require('./get-hilinks.js')
const scheme = require('./scheme.js')

module.exports = function (src) {
  const colors = getColors(src.colors)
  const schemas = getSchemas(src.schemas, colors)
  return scheme(getHilinks(src.hilinks, schemas, colors))
}
