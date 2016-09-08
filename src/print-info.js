'use strict'

function getVimCode (schema) {
  return `let g:colors_name="${schema.name}"
hi clear
if exists("syntax_on")
  syntax reset
endif
if has("gui_running")
  set background=${schema.background}
endif\n\n`
}

const props = new Set(['description', 'homepage'])
const defs = new Set(['author', 'license'])

module.exports = function (schema) {
  const { info } = schema
  let out = `"\n" ${schema.name}`
  if (info.version) {
    out += ` v${info.version}`
  }
  out += '\n'
  props.forEach(p => {
    if (p in info) {
      out += `" ${info[p]}\n`
    }
  })
  defs.forEach(d => {
    if (d in info) {
      out += `" ${d}: ${info[d]}\n`
    }
  })
  out += getVimCode(schema)
  return out
}
