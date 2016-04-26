'use strict'

const test = require('tape')
const getInfo = require('../src/get-info.js')

test('getInfo: get regular info for scheme', t => {
  let data = {
    author: 'author a',
    scheme: 'scheme s',
    background: 'dark',
    description: 'description d',
    license: 'MIT',
    url: 'url u',
    version: 'version u'
  }
  let info = getInfo(data)
  t.is(info.author, 'author a')
  t.is(info.scheme, 'scheme s')
  t.is(info.background, 'dark')
  t.is(info.description, 'description d')
  t.is(info.license, 'MIT')
  t.is(info.url, 'url u')
  t.is(info.version, 'version u')
  t.end()
})

test('getInfo: throws on bad info format', t => {
  let data = 99
  t.throws(
    () => getInfo(data),
    /wrong info format/
  )
  t.end()
})

test('getInfo: throws on wrong value format', t => {
  let data = {
    author: 99,
    scheme: 'scheme s',
    background: 'dark',
    description: 'description d',
    license: 'MIT',
    url: 'url u'
  }
  t.throws(
    () => getInfo(data),
    /wrong value at info author/
  )
  t.end()
})
'schemes requires a scheme value at info'
test('getInfo: requires a scheme name', t => {
  let data = {
    license: 'MIT',
    url: 'url u'
  }
  t.throws(
    () => getInfo(data),
    /schemes requires a scheme value at info/
  )
  t.end()
})
