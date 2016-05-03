'use strict'

const getColors = require('./get-colors.js')
const getHilinks = require('./get-hilinks.js')
const printHls = require('./print-hls.js')
const printInfo = require('./print-info.js')

function checkInfo (info) {
  if (!info || !info.name || !info.background || !info.colors) {
    throw new Error('wrong scheme info')
  }
}

module.exports = function ({info, templates}) {
  checkInfo(info)
  const colors = getColors(info.colors)
  const hilinks = getHilinks(templates, colors)
  return printInfo(info) + printHls(hilinks)
}
