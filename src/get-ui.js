'use strict'

const uis = new Set(['u', 'b', 'r', 'i'])

module.exports = function (ui, schemaName) {
  // no defined gui
  if (!ui) return false
  // bad formatted gui
  if (typeof ui !== 'string') {
    throw new Error('wrong ui in ' + schemaName)
  }
  // 'NONE' as value
  if (ui === 'NONE') return ui
  // formatted gui, just check for valid value
  let len = ui.length
  while (len) {
    let res = ui.charAt(--len)
    if (!uis.has(res)) {
      throw new Error('wrong ui in ' + schemaName)
    }
  }
  return ui
}
