'use strict'

const hexterm = require('hexterm')

const noFore = ' guifg=NONE ctermfg=NONE'
const noBack = ' guibg=NONE ctermbg=NONE'
const noUi = ' gui=NONE cterm=NONE'

module.exports = function (hilinks) {
  let keys = Object.keys(hilinks)
  let out = ''
  keys.forEach(k => {
    let item = hilinks[k]
    if (!item) return
    out += `hi ${ k }`
    out += item[0]
      ? ` guifg=${ item[0] } ctermfg=${ hexterm(item[0].slice(1)) }`
      : noFore
    out += item[1]
      ? ` guibg=${ item[1] } ctermbg=${ hexterm(item[1].slice(1)) }`
      : noBack
    out += item[2]
      ? ` gui=${ item[2] } cterm=${ item[2] }`
      : noUi
    out += '\n'
  })
  return out
}
