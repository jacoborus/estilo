'use strict'

const test = require('tape')
const exec = require('child_process').exec
const fs = require('fs')

const testStr = `hi hitest guifg=#bbddff ctermfg=153 guibg=#ffffff ctermbg=15 gui=NONE cterm=NONE
hi other guifg=#ff0000 ctermfg=9 guibg=NONE ctermbg=NONE gui=bold,underline,italic cterm=bold,underline,italic\n`

test('bin', t => {
  exec('node bin/vim-styler test/bin.yaml', err => {
    if (err) throw err
    const str = fs.readFileSync('./bin.vim', 'utf-8')
    t.is(str, testStr)
    fs.unlink('./bin.vim', () => {
      t.end()
    })
  })
})
