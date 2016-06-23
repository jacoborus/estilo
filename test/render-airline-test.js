'use strict'

const test = require('tape')
const render = require('../src/render-airline.js')

const result = `if exists('g:testing_airline') && g:testing_airline
  let g:airline#themes#testing#palette = {}

  let s:normal1 = [ "#111111", "#555555", 233, 240 ]
  let s:normal2 = [ "#555555", "#111111", 240, 233 ]
  let s:normal3 = [ "#999999", "#555555", 246, 240 ]
  let g:airline#themes#testing#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)

  let s:insert1 = [ "#111111", "#555555", 233, 240 ]
  let s:insert2 = [ "#555555", "#111111", 240, 233 ]
  let s:insert3 = [ "#999999", "#555555", 246, 240 ]
  let g:airline#themes#testing#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)

  let s:replace1 = [ "#111111", "#555555", 233, 240 ]
  let s:replace2 = [ "#555555", "#111111", 240, 233 ]
  let s:replace3 = [ "#999999", "#555555", 246, 240 ]
  let g:airline#themes#testing#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)

  let s:visual1 = [ "#111111", "#555555", 233, 240 ]
  let s:visual2 = [ "#555555", "#111111", 240, 233 ]
  let s:visual3 = [ "#999999", "#555555", 246, 240 ]
  let g:airline#themes#testing#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)

  let s:inactive1 = [ "#111111", "#555555", 233, 240 ]
  let s:inactive2 = [ "#555555", "#111111", 240, 233 ]
  let s:inactive3 = [ "#999999", "#555555", 246, 240 ]
  let g:airline#themes#testing#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)
endif`

const tmpl = {
  normal1: 'one five',
  normal2: 'five one',
  normal3: 'nine five',
  inactive1: 'one five',
  inactive2: 'five one',
  inactive3: 'nine five',
  insert1: 'one five',
  insert2: 'five one',
  insert3: 'nine five',
  replace1: 'one five',
  replace2: 'five one',
  replace3: 'nine five',
  visual1: 'one five',
  visual2: 'five one',
  visual3: 'nine five'
}

const colors = {
  one: '#111111',
  five: '#555555',
  nine: '#999999'
}

const theme = {
  colors: colors,
  name: 'testing'
}

test('render airline theme', t => {
  const rendered = render('testing', tmpl, theme)
  t.is(rendered, result)
  t.end()
})
