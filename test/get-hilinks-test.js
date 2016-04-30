'use strict'

const test = require('tape')
const getHilinks = require('../src/get-hilinks.js')
const colors = {
  azul: '#bbddff'
}

test('getHilinks: throws on missing data', t => {
  t.throws(
    () => getHilinks(),
    /wrong highlights object/
  )
  t.end()
})

test('getHilinks: format hilinks', t => {
  const data = {
    normal: '#bbddff #ff5555 biru'
  }
  const hilinks = getHilinks(data, colors)

  const normal = hilinks.normal
  t.is(normal.fore, '#bbddff', 'from array')
  t.is(normal.back, '#ff5555', 'from array')
  t.is(normal.ui, 'bold,italic,reverse,underline', 'from array')

  t.end()
})
