'use strict'

const test = require('tape')
const compileColorscheme = require('../src/compile-colorscheme.js')
const palette = {
  azul: '#bbddff'
}

test('getHilinks: throws on missing data', t => {
  t.throws(
    () => compileColorscheme(),
    /wrong highlights object/
  )
  t.end()
})

test('getHilinks: format hilinks', t => {
  const templates = {
    normal: '#bbddff . biru'
  }
  const hilinks = compileColorscheme(templates, palette)

  const normal = hilinks.normal
  t.is(normal.fore, '#bbddff', 'foreground')
  t.is(normal.back, '.', 'background')
  t.is(normal.ui, 'bold,italic,reverse,underline', 'ui')

  t.end()
})

test('getHilinks: link styles', t => {
  const templates = {
    normal: '@other'
  }
  const hilinks = compileColorscheme(templates, palette)

  const normal = hilinks.normal
  t.is(normal.link, 'other')
  t.notOk(normal.fore, 'no fore')
  t.notOk(normal.back, 'no back')
  t.notOk(normal.ui, 'no ui')

  t.end()
})
