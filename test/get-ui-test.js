'use strict'

const test = require('tape')
const getUI = require('../src/get-ui.js')

test('getUI', t => {
  t.is(getUI(''), false, 'empty value')
  t.is(getUI(false), false, 'false value')
  t.throws(
    () => getUI(1, 'schemaName'),
    /wrong ui in schemaName/,
    'throws on bad type'
  )
  t.is(getUI('NONE'), 'NONE', 'NONE')
  t.is(getUI('br'), 'br', 'valid formatted')
  t.is(getUI('bu'), 'bu', 'valid formatted')
  t.is(getUI('uir'), 'uir', 'valid formatted')
  t.is(getUI('ubri'), 'ubri', 'valid formatted')
  t.throws(
    () => getUI('aui', 'schemaName'),
    /wrong ui in schemaName/,
    'throws on bad type'
  )
  t.end()
})
