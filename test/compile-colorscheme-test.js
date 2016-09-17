'use strict'

const test = require('tape')
const compileColorscheme = require('../src/compile-colorscheme.js')
const gcc = compileColorscheme.getColorCode
const getUI = compileColorscheme.getUI
const pss = compileColorscheme.parseStyleString

test('getColorCode:', t => {
  const palette = {
    azul: ['#bbddff', 333]
  }

  t.is(gcc()[0], 'NONE', 'empty')

  t.is(gcc('-')[0], 'NONE', 'ommited (hex)')
  t.is(gcc('-')[1], 'NONE', 'ommited (term)')

  t.is(gcc('.'), false, 'empty dot (.)')

  t.is(gcc('azul', palette)[0], '#bbddff', 'hex from palette')
  t.is(gcc('azul', palette)[1], 333, 'term from palette')

  t.is(gcc('#aabbcc', palette)[0], '#aabbcc', 'hex from hex value')
  t.is(gcc('#aabbcc', palette)[1], 146, 'term from hex value')

  t.throws(
    () => gcc(3, palette, 'part', 'schemaName'),
    /wrong part in schemaName/,
    'throws on not valid color'
  )
  t.end()
})

test('getUI', t => {
  t.is(getUI(), false, 'empty value (undefined)')
  t.is(getUI('.'), false, 'empty value (dot)')
  t.throws(
    () => getUI(1, 'schemaName'),
    /wrong ui in schemaName/,
    'throws on bad type'
  )
  t.is(getUI('NONE'), 'NONE', 'NONE')
  t.is(getUI('br'), 'bold,reverse', 'valid formatted')
  t.is(getUI('bu'), 'bold,underline', 'valid formatted')
  t.is(getUI('uir'), 'underline,italic,reverse', 'valid formatted')
  t.is(getUI('c'), 'undercurl', 'valid formatted')

  t.throws(
    () => getUI('aui', 'schemaName'),
    /wrong ui in schemaName/,
    'throws on bad type'
  )
  t.end()
})

test('parseString:', t => {
  let palette = {
    rojo: ['#ff5555', 203]
  }

  let noValue = pss('     ')
  t.is(Object.keys(noValue).length, 0, 'empty schema')

  let full = pss('#bbddff rojo bi', palette)
  t.is(full.fore[0], '#bbddff', 'full hex foreground')
  t.is(full.fore[1], 153, 'full term foreground')
  t.is(full.back[0], '#ff5555', 'full hex background')
  t.is(full.back[1], 203, 'full term background')
  t.is(full.ui, 'bold,italic', 'full gui')
  t.is(full.guisp, false, 'full guisp')

  let two = pss('- rojo', palette)
  t.is(two.fore[0], 'NONE', 'two hex foreground')
  t.is(two.fore[1], 'NONE', 'two hex foreground')
  t.is(two.back[0], '#ff5555', 'two hex background')
  t.is(two.back[1], 203, 'two hex background')
  t.is(two.ui, false, 'two gui')
  t.is(two.guisp, false, 'two guisp')

  let empty = pss('. . bu', palette)
  t.is(empty.fore, false, 'empty with foreground')
  t.is(empty.back, false, 'empty with background')
  t.is(empty.ui, 'bold,underline', 'empty with gui')

  let linked = pss('@other', palette)
  t.is(linked.link, 'other', 'linked link')
  t.notOk(linked.fore, 'linked foreground')
  t.notOk(linked.back, 'linked background')
  t.notOk(linked.ui, 'linked gui')

  t.end()
})

const palette = {
  azul: '#bbddff'
}

test('compile colorscheme: throws on missing data', t => {
  t.throws(
    () => compileColorscheme(),
    /wrong highlights object/
  )
  t.end()
})

test('compile colorscheme: format hilinks', t => {
  const templates = {
    normal: '#bbddff . birucs'
  }
  const hilinks = compileColorscheme(templates, palette)

  const normal = hilinks.normal
  t.is(normal.fore[0], '#bbddff', 'hex foreground')
  t.is(normal.fore[1], 153, 'term foreground')
  t.is(normal.back, false, 'background')
  t.is(normal.ui, 'bold,italic,reverse,underline,undercurl,standout', 'ui')

  t.end()
})

test('compile colorscheme: link styles', t => {
  const templates = {
    normal: '@other'
  }
  const hilinks = compileColorscheme(templates, palette)

  const normal = hilinks.normal
  t.is(normal.link, 'other')
  t.notOk(normal.fore, 'no fore')
  t.notOk(normal.back, 'no back')
  t.notOk(normal.ui, 'no ui')

  t.end()
})
