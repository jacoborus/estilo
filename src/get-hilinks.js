'use strict'

const parseStyleString = require('./parse-style-string.js')
const uis = {
  u: 'underline',
  b: 'bold',
  i: 'italic',
  r: 'reverse'
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
module.exports = function (data, colors) {
  if (!data || typeof data !== 'object') {
    throw new Error('wrong highlights object')
  }
  let links = {}
  Object.keys(data).forEach(name => {
    const raw = data[name]
    let hilink
    if (typeof raw === 'string') {
      hilink = parseStyleString(raw, colors, name)
    } else {
      throw new Error('bad formatted hilinks')
    }
    let ui = hilink[2]
    if (ui) {
      hilink[2] = parseui(ui)
    }
    links[name] = hilink
  })
  return links
}
