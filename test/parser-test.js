'use strict'

const test = require('tape')
const parser = require('../src/parser')

const testStr = `hi hitest guifg=#bbddff ctermfg=153 guibg=#ffffff ctermbg=15 gui=NONE cterm=NONE
hi other guifg=#ff0000 ctermfg=9 guibg=NONE ctermbg=NONE gui=bold,underline,italic cterm=bold,underline,italic\n`

test('parser', t => {
  const src = {
    colors: {
      blue: '#bbddff'
    },
    schemas: {
      one: 'blue #ffffff '
    },
    hilinks: {
      hitest: 'one',
      other: ['#ff0000', false, 'bui']
    }
  }
  let parsed = parser(src)
  t.is(parsed, testStr)
  t.end()
})
