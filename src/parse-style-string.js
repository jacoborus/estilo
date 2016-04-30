'use strict'

const getColorCode = require('./get-color-code.js')
const getUI = require('./get-ui.js')

module.exports = function (str, colors, name) {
  str = str.trim()
  let props = str.split(' ').reduce((arr, el) => {
    el = el.trim()
    if (el) return arr.concat(el)
    return arr
  }, [])

  let len = props.length
  if (!len) {
    // empty schema
    return false
  }

  // whether is link to other hilink
  let first = props[0]
  if (first.startsWith('@')) {
    return {
      link: first.slice(1)
    }
  }

  return {
    fore: getColorCode(first, colors, 'foreground', name),
    back: getColorCode(props[1], colors, 'background', name),
    ui: getUI(props[2], name)
  }
}
