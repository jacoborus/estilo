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
    out += item.fore
      ? ` guifg=${ item.fore } ctermfg=${ hexterm(item.fore) }`
      : noFore
    out += item.back
      ? ` guibg=${ item.back } ctermbg=${ hexterm(item.back) }`
      : noBack
    out += item.ui
      ? ` gui=${ item.ui } cterm=${ item.ui }`
      : noUi
    out += '\n'
  })
  return out
}
