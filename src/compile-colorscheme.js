'use strict'

const parseStyleString = require('./parse-style-string.js')
const uis = {
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
    let str = uis[c]
    if (!str) throw new Error('wrong ui in ' + hiName)
    out.push(str)
  }
  return out.join(',')
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
    let hilink = parseStyleString(raw, palette, name)
    let ui = hilink.ui
    if (ui) {
      hilink.ui = parseui(ui)
    }
    links[name] = hilink
  })
  return links
}
