'use strict'

const isHexColor = require('./is-hex-color.js')

// get an associative array with color list for the template
module.exports = function (data) {
  const colors = {}
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(name => {
      let code = data[name]
      if (!code || !isHexColor(code)) {
        throw new Error('color ' + name + ' is invalid')
      }
      colors[name] = code
    })
  }
  return colors
}
