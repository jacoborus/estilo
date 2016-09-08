'use strict'

const isHexColor = require('./is-hex-color.js')
const uis = new Set(['u', 'b', 'r', 'i'])

function getColorCode (color, colors, part, hiName) {
  // return false if color is `NONE`
  if (!color || color === '-') return false
  // return dot if empty color
  if (color === '.') return color
  // return custom color if colorname is in palette
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
  // 'NONE' or empty value
  if (ui === 'NONE' || ui === '.') return ui
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

function parseStyleString (str, palette, name) {
  str = str.trim()
  let props = str.split(' ').reduce((arr, el) => {
    el = el.trim()
    if (el) return arr.concat(el)
    return arr
  }, [])

  let len = props.length
  if (!len) return {}

  // whether is link to other hilink
  let first = props[0]
  if (first.startsWith('@')) {
    return {
      link: first.slice(1)
    }
  }

  return {
    fore: getColorCode(first, palette.colors, 'foreground', name),
    back: getColorCode(props[1], palette.colors, 'background', name),
    ui: getUI(props[2], name)
  }
}

// for testing purposes
parseStyleString.getColorCode = getColorCode
parseStyleString.getUI = getUI

module.exports = parseStyleString
