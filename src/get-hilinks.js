'use strict'

const getUI = require('./get-ui.js')
const getColorCode = require('./get-color-code.js')
const parseStyleString = require('./parse-style-string.js')

// extract hilink definitions from object and return a new formatted object
module.exports = function (data, schemas, colors) {
  if (!data || typeof data !== 'object') {
    throw new Error('wrong highlights object')
  }
  let links = {}
  Object.keys(data).forEach(name => {
    const raw = data[name]
    if (typeof raw === 'string') {
      links[name] = parseStyleString(raw, schemas, colors, name)
    } else if (Array.isArray(raw)) {
      links[name] = [
        getColorCode(raw[0], name, 'foreground', colors),
        getColorCode(raw[1], name, 'background', colors),
        getUI(raw[2], name)
      ]
    } else {
      throw new Error('bad formatted hilinks')
    }
  })
  return links
}
