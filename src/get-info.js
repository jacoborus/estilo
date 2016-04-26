'use strict'

const props = new Set(['author', 'scheme', 'description', 'url', 'background', 'license', 'version'])

module.exports = function (data) {
  if (!data) return {}
  if (typeof data !== 'object') {
    throw new Error('wrong info format')
  }
  const info = {}
  props.forEach(p => {
    const value = data[p]
    if (!value) return
    if (typeof value !== 'string') {
      throw new Error('wrong value at info ' + p)
    }
    info[p] = value
  })
  if (!info.scheme) {
    throw new Error('schemes requires a scheme value at info')
  }
  return info
}
