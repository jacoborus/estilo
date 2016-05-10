'use strict'

const hexterm = require('hexterm')

const noFore = ' guifg=NONE ctermfg=NONE'
const noBack = ' guibg=NONE ctermbg=NONE'
const noUi = ' gui=NONE cterm=NONE'

function printForeground (fore) {
  if (!fore) {
    return noFore
  }
  if (fore === '.') {
    return ''
  }
  return ` guifg=${ fore } ctermfg=${ hexterm(fore) }`
}

function printBackground (back) {
  if (!back) {
    return noBack
  }
  if (back === '.') {
    return ''
  }
  return ` guibg=${ back } ctermbg=${ hexterm(back) }`
}

function printUi (ui) {
  if (!ui) {
    return noUi
  }
  if (ui === '.') {
    return ''
  }
  return ` gui=${ ui } cterm=${ ui }`
}

module.exports = function (hilinks) {
  let keys = Object.keys(hilinks)
  let out = ''
  keys.forEach(k => {
    let hi = hilinks[k]
    if (!hi) return
    if (hi.link) {
      out += `hi link ${ k } ${ hi.link }\n`
    } else if (hi.fore || hi.back || hi.ui) {
      out += `hi ${ k }`
      out += printForeground(hi.fore)
      out += printBackground(hi.back)
      out += printUi(hi.ui)
      out += '\n'
    }
  })
  return out
}
