'use strict'

const getColorCode = require('./get-color-code.js')
const getUI = require('./get-ui.js')

module.exports = function (str, schemas, colors, name) {
  str = str.trim()
  let schema = []
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

  if (len === 1) {
    // is link to a schema
    let temp = schemas[props[0]]
    if (!temp) throw new Error('can\'t find schema: ' + props[0])
    schema = temp
  } else if (len === 3) {
    schema = [
      getColorCode(props[0], colors, 'foreground', name),
      getColorCode(props[1], colors, 'background', name),
      getUI(props[2], name)
    ]
  } else if (len === 2) {
    schema = [
      getColorCode(props[0], colors, 'foreground', name),
      getColorCode(props[1], colors, 'background', name),
      false
    ]
  } else {
    throw new Error('wrong formatted schema: ' + name)
  }
  return schema
}
