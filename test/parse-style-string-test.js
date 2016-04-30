'use strict'

const test = require('tape')
const pss = require('../src/parse-style-string.js')

let colors = {
  rojo: '#ff5555'
}

test('parseString:', t => {
  t.is(pss('   '), false, 'empty schema')

  let full = pss('#bbddff rojo bi', colors)
  t.is(full.fore, '#bbddff', 'full foreground')
  t.is(full.back, '#ff5555', 'full background')
  t.is(full.ui, 'bi', 'full gui')

  let two = pss('- rojo', colors)
  t.is(two.fore, false, 'two foreground')
  t.is(two.back, '#ff5555', 'two background')
  t.is(two.ui, false, 'two gui')

  let linked = pss('@other', colors)
  t.is(linked.link, 'other', 'linked link')
  t.notOk(linked.fore, 'linked foreground')
  t.notOk(linked.back, 'linked background')
  t.notOk(linked.ui, 'linked gui')

  t.end()
})
