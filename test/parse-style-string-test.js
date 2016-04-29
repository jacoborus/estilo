'use strict'

const test = require('tape')
const pss = require('../src/parse-style-string.js')

let colors = {
  rojo: '#ff5555'
}

test('parseString: empty schema', t => {
  t.is(pss('   '), false, 'empty schema')

  let full = pss('#bbddff rojo bi', colors)
  t.is(full[0], '#bbddff', 'full foreground')
  t.is(full[1], '#ff5555', 'full background')
  t.is(full[2], 'bi', 'full gui')

  let two = pss('- rojo', colors)
  t.is(two[0], false, 'two foreground')
  t.is(two[1], '#ff5555', 'two background')
  t.is(two[2], false, 'two gui')

  t.end()
})
