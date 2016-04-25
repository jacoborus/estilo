'use strict'

const test = require('tape')
const gcc = require('../src/get-color-code.js')

const colors = {
  azul: '#bbddff'
}

test('getColorCode empty', t => {
  t.is(gcc(''), false)
  t.is(gcc('-'), false)
  t.end()
})

test('getColorCode from colors archive', t => {
  t.is(gcc('azul', colors), '#bbddff')
  t.end()
})

test('getColorCode: real hexadecimal color', t => {
  t.is('#aabbcc', '#aabbcc')
  t.end()
})

test('getColorCode: throws on not valid color', t => {
  t.throws(
    () => gcc(3, colors, 'part', 'schemaName'),
    /wrong part in schemaName/,
    'wrong part in schemaName'
  )
  t.end()
})
