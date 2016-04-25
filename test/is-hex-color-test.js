'use strict'

const test = require('tape')
const isHex = require('../src/is-hex-color.js')

test('3 characters color codes', t => {
  t.ok(isHex('#333'))
  t.ok(isHex('#abc'))
  t.notOk(isHex('333'))
  t.notOk(isHex('#abc#'))
  t.notOk(isHex('ab'))
  t.notOk(isHex('abcd'))
  t.end()
})

test('6 characters color codes', t => {
  t.ok(isHex('#333def'))
  t.ok(isHex('#abc123'))
  t.notOk(isHex('abc123'))
  t.notOk(isHex('#abc#88'))
  t.end()
})
