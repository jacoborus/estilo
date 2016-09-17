'use strict'

const test = require('tape')
const compileColorscheme = require('../src/compile-colorscheme.js')
const palette = {
  azul: '#bbddff'
}

test('compile colorscheme: throws on missing data', t => {
  t.throws(
    () => compileColorscheme(),
    /wrong highlights object/
  )
  t.end()
})

test('compile colorscheme: format hilinks', t => {
  const templates = {
    normal: '#bbddff . birucs'
  }
  const hilinks = compileColorscheme(templates, palette)

  const normal = hilinks.normal
  t.is(normal.fore[0], '#bbddff', 'hex foreground')
  t.is(normal.fore[1], 153, 'term foreground')
  t.is(normal.back, false, 'background')
  t.is(normal.ui, 'bold,italic,reverse,underline,undercurl,standout', 'ui')

  t.end()
})

test('compile colorscheme: link styles', t => {
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
