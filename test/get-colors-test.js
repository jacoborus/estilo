'use strict'

const test = require('tape')
const getColors = require('../src/render-themes.js').getColors

const palette = {
  azul: '#bbddff',
  rojo: '#ff5555'
}

test('getColors: get valid colors', t => {
  let colors = {
    blue: '@azul',
    red: '#ff0000'
  }
  let set = getColors(palette, colors)
  t.is(set.blue, '#bbddff')
  t.is(set.red, '#ff0000')
  t.end()
})

test('getColors: throws on empty color', t => {
  let colors = {
    azul: '#bbddff',
    rojo: '#ff5555',
    bad: ''
  }
  t.throws(
    () => getColors({}, colors),
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
    () => getColors(palette, colors),
    /color worst is invalid/
  )
  t.end()
})
