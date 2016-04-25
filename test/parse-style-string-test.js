'use strict'

const test = require('tape')
const pss = require('../src/parse-style-string.js')

let schemas = {
  uno: 99
}
let colors = {
  rojo: '#ff5555'
}

test('getSchemas: empty schema', t => {
  t.is(pss('   '), false, 'empty schema')
  t.is(pss(' uno  ', schemas), 99, 'link schema')
  t.throws(
    () => pss(' dos  ', schemas, {}),
    /can't find schema: dos/,
    'throws on broken link to schema'
  )

  let full = pss('#bbddff rojo bi', schemas, colors)
  t.is(full[0], '#bbddff', 'full foreground')
  t.is(full[1], '#ff5555', 'full background')
  t.is(full[2], 'bi', 'full gui')

  let two = pss('- rojo', schemas, colors)
  t.is(two[0], false, 'two foreground')
  t.is(two[1], '#ff5555', 'two background')
  t.is(two[2], false, 'two gui')

  t.throws(
    () => pss('dfs fs fsd sfd', schemas, colors, 'test'),
    /wrong formatted schema: test/,
    'throws on bad string format'
  )
  t.end()
})
