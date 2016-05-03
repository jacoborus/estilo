'use strict'

const test = require('tape')
const printHls = require('../src/print-hls.js')

test('printHls: regular hilinks', t => {
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
    },
    linked: {
      link: 'other'
    },
    empty: {}
  }
  t.is(
    printHls(hilinks),
    `hi normal guifg=#bbddff ctermfg=153 guibg=#994444 ctermbg=95 gui=bold,reverse cterm=bold,reverse
hi other guifg=#333333 ctermfg=236 guibg=#dddddd ctermbg=253 gui=italic cterm=italic
hi link linked other\n`
  )
  t.end()
})

test('printHls: hilinks with empty values', t => {
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
    printHls(hilinks),
    `hi normal guifg=#bbddff ctermfg=153 guibg=NONE ctermbg=NONE gui=NONE cterm=NONE
hi other guifg=NONE ctermfg=NONE guibg=#dddddd ctermbg=253 gui=italic cterm=italic\n`
  )
  t.end()
})
