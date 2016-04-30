'use strict'

const test = require('tape')
const scheme = require('../src/scheme.js')

test('scheme: regular hilinks', t => {
  let hilinks = {
    normal: {
      fore: '#bbddff',
      back: '#994444',
      ui: 'bold,reverse'
    },
    other: {
      fore: '#333333',
      back: '#dddddd',
      ui: 'italic'
    }
  }
  t.is(
    scheme(hilinks),
    `hi normal guifg=#bbddff ctermfg=153 guibg=#994444 ctermbg=95 gui=bold,reverse cterm=bold,reverse
hi other guifg=#333333 ctermfg=236 guibg=#dddddd ctermbg=253 gui=italic cterm=italic\n`
  )
  t.end()
})

test('scheme: hilinks with empty values', t => {
  let hilinks = {
    normal: {
      fore: '#bbddff'
    },
    other: {
      fore: false,
      back: '#dddddd',
      ui: 'italic'
    }
  }
  t.is(
    scheme(hilinks),
    `hi normal guifg=#bbddff ctermfg=153 guibg=NONE ctermbg=NONE gui=NONE cterm=NONE
hi other guifg=NONE ctermfg=NONE guibg=#dddddd ctermbg=253 gui=italic cterm=italic\n`
  )
  t.end()
})
