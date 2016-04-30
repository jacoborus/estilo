'use strict'

const hexterm = require('hexterm')

const noFore = ' guifg=NONE ctermfg=NONE'
const noBack = ' guibg=NONE ctermbg=NONE'
const noUi = ' gui=NONE cterm=NONE'

module.exports = function (hilinks) {
  let keys = Object.keys(hilinks)
  let out = ''
  keys.forEach(k => {
    let hi = hilinks[k]
    if (!hi) return
    if (hi.link) {
      out += `hi link ${ k } ${ hi.link }\n`
    } else {
      out += `hi ${ k }`
      out += hi.fore
        ? ` guifg=${ hi.fore } ctermfg=${ hexterm(hi.fore) }`
        : noFore
      out += hi.back
        ? ` guibg=${ hi.back } ctermbg=${ hexterm(hi.back) }`
        : noBack
      out += hi.ui
        ? ` gui=${ hi.ui } cterm=${ hi.ui }`
        : noUi
      out += '\n'
    }
  })
  return out
}
