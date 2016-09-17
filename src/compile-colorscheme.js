'use strict'

const hexterm = require('hexterm')
const isHexColor = require('./is-hex-color.js')
const uis = new Set(['u', 'b', 'r', 'i', 'c', 's'])

const uiValues = {
  u: 'underline',
  b: 'bold',
  i: 'italic',
  r: 'reverse',
  c: 'undercurl',
  s: 'standout'
}

function parseui (raw, hiName) {
  const l = raw.length
  const out = []
  let i = 0
  while (i < l) {
    let c = raw.charAt(i++)
    let str = uiValues[c]
    if (!str) throw new Error('wrong ui in ' + hiName)
    out.push(str)
  }
  return out.join(',')
}

function getColorCode (color, palette, part, hiName) {
  // return false if empty color
  if (color === '.') return false
  // return false if color is `NONE`
  if (!color || color === '-') return ['NONE', 'NONE']
  // return custom color if colorname is in palette
  const c = palette[color]
  if (c) return c
  // return direct hex color
  if (isHexColor(color)) {
    return [color, hexterm(color)]
  }
  // not valid color
  throw new Error('wrong ' + part + ' in ' + hiName)
}

function getUI (ui, hiName) {
  // no defined gui
  if (!ui || ui === '.') return false
  // bad formatted gui
  if (typeof ui !== 'string') {
    throw new Error('wrong ui in ' + hiName)
  }
  // 'NONE' or empty value
  if (ui === 'NONE') return 'NONE'
  // formatted gui, just check for valid value
  let len = ui.length
  while (len) {
    let res = ui.charAt(--len)
    if (!uis.has(res)) {
      throw new Error('wrong ui in ' + hiName)
    }
  }
  return parseui(ui, hiName)
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

  const curlParsed = getColorCode(props[3], palette, 'guisp', name)
  let curlcolor
  if (!curlParsed || curlParsed[0] === 'NONE') {
    curlcolor = false
  } else {
    curlcolor = curlParsed
  }

  return {
    fore: getColorCode(first, palette, 'foreground', name),
    back: getColorCode(props[1], palette, 'background', name),
    ui: getUI(props[2], name),
    guisp: curlcolor
  }
}

// extract hilink definitions from object
// and return a new formatted object

module.exports = function (templates, palette) {
  if (!templates || typeof templates !== 'object') {
    throw new Error('wrong highlights object')
  }
  let links = {}
  Object.keys(templates).forEach(name => {
    const raw = templates[name]
    if (typeof raw !== 'string') {
      throw new Error('bad formatted hilinks:', name)
    }
    links[name] = parseStyleString(raw, palette, name)
  })
  return links
}

// for testing purposes
module.exports.getColorCode = getColorCode
module.exports.getUI = getUI
module.exports.parseStyleString = parseStyleString
