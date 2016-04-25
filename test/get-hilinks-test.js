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
    normal: 'sch',
    other: ['#bbddff']
  }
  const schemas = {
    sch: '99'
  }
  const hilinks = getHilinks(data, schemas, colors)
  const normal = hilinks.normal
  t.is(normal, '99', 'from string')

  const other = hilinks.other
  t.is(other[0], '#bbddff', 'from array')
  t.is(other[1], false, 'from array')
  t.is(other[2], false, 'from array')

  t.end()
})
