'use strict'

const isHexColor = require('./is-hex-color.js')
const getUI = require('./get-ui.js')

// for testing purposes
parseStyleString.getColorCode = getColorCode

module.exports = parseStyleString

function getColorCode (color, colors, part, hiName) {
  // return false if empty color
  if (!color || color === '-') return false
  // return custom color
  const c = colors[color]
  if (c) return c
  // return direct hex color
  if (isHexColor(color)) {
    return color
  }
  console.log(color)
  // not valid color
  throw new Error('wrong ' + part + ' in ' + hiName)
}

function parseStyleString (str, colors, name) {
  str = str.trim()
  let props = str.split(' ').reduce((arr, el) => {
    el = el.trim()
    if (el) return arr.concat(el)
    return arr
  }, [])

  let len = props.length
  if (!len) return {}

  let indexComment = props.indexOf('*')
  let comment = ''
  if (indexComment > -1) {
    comment = props.splice(indexComment).splice(1).join(' ')
  }

  if (!props.length) return { comment }
  // whether is link to other hilink
  let first = props[0]
  if (first.startsWith('@')) {
    return {
      link: first.slice(1),
      comment
    }
  }

  return {
    fore: getColorCode(first, colors, 'foreground', name),
    back: getColorCode(props[1], colors, 'background', name),
    ui: getUI(props[2], name),
    comment
  }
}
