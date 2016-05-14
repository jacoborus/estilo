'use strict'

const test = require('tape')
const render = require('../src/render-lightline.js')

const result = `if exists('g:testing_lightline') && g:testing_lightline
  let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {}}
  let s:p.normal.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.normal.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.normal.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.normal.error = [[["#555555", 240], ["#999999", 246]]]
  let s:p.normal.warning = [[["#555555", 240], ["#999999", 246]]]
  let s:p.inactive.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.inactive.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.inactive.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.insert.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.insert.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.insert.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.replace.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.replace.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.replace.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.visual.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.visual.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.visual.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.left = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.tabsel = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.right = [[["#555555", 240], ["#999999", 246]]]
  let g:lightline#colorscheme#testing#palette = lightline#colorscheme#flatten(s:p)
endif
`

const tmpl = {
  'normal.left': 'one five nine one',
  'normal.right': 'one five nine one',
  'normal.middle': 'five nine',
  'normal.error': 'five nine',
  'normal.warning': 'five nine',
  'inactive.left': 'one five nine one',
  'inactive.right': 'one five nine one',
  'inactive.middle': 'five nine',
  'insert.left': 'one five nine one',
  'insert.right': 'one five nine one',
  'insert.middle': 'five nine',
  'replace.left': 'one five nine one',
  'replace.right': 'one five nine one',
  'replace.middle': 'five nine',
  'visual.left': 'one five nine one',
  'visual.right': 'one five nine one',
  'visual.middle': 'five nine',
  'tabline.left': 'five nine',
  'tabline.tabsel': 'five nine',
  'tabline.middle': 'five nine',
  'tabline.right': 'five nine'
}

const colors = {
  one: '#111111',
  five: '#555555',
  nine: '#999999'
}

test('printLightline', t => {
  const rendered = render('testing', tmpl, colors)
  t.is(rendered, result)
  t.end()
})
