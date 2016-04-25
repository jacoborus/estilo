'use strict'

const test = require('tape')
const getSchemas = require('../src/get-schemas.js')

const colors = {
  azul: '#bbddff'
}

test('getSchemas: from array', t => {
  const data = {
    uno: [false, '#ff5555']
  }
  const schemas = getSchemas(data, colors)
  const uno = schemas.uno
  t.is(uno[0], false)
  t.is(uno[1], '#ff5555')
  t.is(uno[2], false)
  t.end()
})

test('getSchemas: from string', t => {
  const data = {
    uno: '- #ff5555 bu'
  }
  const schemas = getSchemas(data, colors)
  const uno = schemas.uno
  t.is(uno[0], false)
  t.is(uno[1], '#ff5555')
  t.is(uno[2], 'bu')
  t.end()
})

test('getSchemas: throws on bad format', t => {
  const data = {
    uno: false
  }
  t.throws(
    () => getSchemas(data, colors),
    /wrong format in schema: uno/
  )
  t.end()
})
