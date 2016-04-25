'use strict'

const getUI = require('./get-ui.js')
const getColorCode = require('./get-color-code.js')
const parseStyleString = require('./parse-style-string.js')

module.exports = function (data, colors) {
  const schemas = {}
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(name => {
      let raw = data[name]
      if (Array.isArray(raw)) {
        schemas[name] = [
          getColorCode(raw[0], name, 'foreground', colors),
          getColorCode(raw[1], name, 'background', colors),
          getUI(raw[2], name)
        ]
      } else if (typeof raw === 'string') {
        schemas[name] = parseStyleString(raw, {}, colors, name)
      } else {
        throw new Error('wrong format in schema: ' + name)
      }
    })
  }
  return schemas
}
