'use strict'

function getVimCode (colorscheme) {
  return `let g:colors_name="${colorscheme.name}"
hi clear
if exists("syntax_on")
  syntax reset
endif
if has("gui_running")
  set background=${colorscheme.background}
endif\n\n`
}

const props = new Set(['description', 'homepage'])
const defs = new Set(['author', 'license'])

module.exports = function (info, colorscheme) {
  let out = `"\n" ${colorscheme.name}`
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
  out += getVimCode(colorscheme)
  return out
}
