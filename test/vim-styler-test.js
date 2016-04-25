'use strict'

const test = require('tape')
const styler = require('../vim-styler.js')
const fs = require('fs')

const testStr = `hi hitest guifg=#bbddff ctermfg=153 guibg=#ffffff ctermbg=15 gui=NONE cterm=NONE
hi other guifg=#ff0000 ctermfg=9 guibg=NONE ctermbg=NONE gui=bold,underline,italic cterm=bold,underline,italic\n`

test('styler', t => {
  styler('./test/sample.yaml')
  const str = fs.readFileSync('./sample.vim', 'utf-8')
  t.is(str, testStr)
  fs.unlink('./sample.vim', () => {
    t.end()
  })
})
