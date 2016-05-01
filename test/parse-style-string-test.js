'use strict'

const test = require('tape')
const pss = require('../src/parse-style-string.js')

let colors = {
  rojo: '#ff5555'
}

test('parseString:', t => {
  let empty = pss('     ')
  t.is(Object.keys(empty).length, 0, 'empty schema')

  let full = pss('#bbddff rojo bi', colors)
  console.log(full)
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

  let simpleComment = pss('* hola adios', colors)
  t.is(simpleComment.comment, 'hola adios', 'comment simple')
  t.notOk(simpleComment.link, 'comment simple no link')
  t.notOk(simpleComment.fore, 'comment simple no foreground')
  t.notOk(simpleComment.back, 'comment simple no background')
  t.notOk(simpleComment.ui, 'comment simple no gui')

  let comment = pss('#bbddff rojo bi * hola', colors)
  t.is(comment.comment, 'hola', 'comment')
  t.notOk(comment.link, 'comment no link')
  t.is(comment.fore, '#bbddff', 'comment foreground')
  t.is(comment.back, '#ff5555', 'comment background')
  t.is(comment.ui, 'bi', 'comment gui')

  let foreComment = pss('#bbddff * hola', colors)
  t.is(foreComment.comment, 'hola', 'foreComment')
  t.notOk(foreComment.link, 'foreComment no link')
  t.is(foreComment.fore, '#bbddff', 'foreComment foreground')
  t.is(foreComment.back, false, 'foreComment background')
  t.is(foreComment.ui, false, 'foreComment gui')

  t.end()
})
