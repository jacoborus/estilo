'use strict'

const isHexColor = require('./is-hex-color.js')
const uis = new Set(['u', 'b', 'r', 'i'])

// for testing purposes
parseStyleString.getColorCode = getColorCode
parseStyleString.getUI = getUI

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
  // not valid color
  throw new Error('wrong ' + part + ' in ' + hiName)
}

function getUI (ui, schemaName) {
  // no defined gui
  if (!ui) return false
  // bad formatted gui
  if (typeof ui !== 'string') {
    throw new Error('wrong ui in ' + schemaName)
  }
  // 'NONE' as value
  if (ui === 'NONE') return ui
  // formatted gui, just check for valid value
  let len = ui.length
  while (len) {
    let res = ui.charAt(--len)
    if (!uis.has(res)) {
      throw new Error('wrong ui in ' + schemaName)
    }
  }
  return ui
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
