'use strict'

const test = require('tape')
const parseInfo = require('../src/parse-info.js')

const expected = `"
" schemeTest v2.1.0
" description d
" url u
" author: author a
" license: MIT
" background: dark
"
" This file was generated by vim-styler
" https://github.com/jacoborus/vim-styler

let colors_name="schemeTest"
hi clear
if exists("syntax_on")
  syntax reset
endif
if has("gui_running")
  set background=dark
endif\n\n`

test('parseInfo: with watermark', t => {
  let data = {
    author: 'author a',
    scheme: 'schemeTest',
    background: 'dark',
    description: 'description d',
    license: 'MIT',
    url: 'url u',
    version: '2.1.0'
  }
  t.is(parseInfo(data), expected)
  t.end()
})
