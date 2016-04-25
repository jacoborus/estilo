'use strict'

const test = require('tape')
const getColors = require('../src/get-colors.js')

test('getColors: get valid colors', t => {
  let colors = {
    azul: '#bbddff',
    rojo: '#ff5555'
  }
  let set = getColors(colors)
  t.is(set.azul, '#bbddff')
  t.is(set.rojo, '#ff5555')
  t.end()
})

test('getColors: throws on empty color', t => {
  let colors = {
    azul: '#bbddff',
    rojo: '#ff5555',
    bad: ''
  }
  t.throws(
    () => getColors(colors),
    /color bad is invalid/
  )
  t.end()
})

test('getColors: throws on wrong color', t => {
  let colors = {
    azul: '#bbddff',
    rojo: '#ff5555',
    worst: 1
  }
  t.throws(
    () => getColors(colors),
    /color worst is invalid/
  )
  t.end()
})
