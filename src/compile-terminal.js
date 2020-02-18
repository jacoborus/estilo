'use strict'

module.exports = function (template, palette) {
  const data = {}
  Object.keys(template).forEach(k => {
    const colorname = template[k]
    if (!colorname) return
    const color = palette[colorname]
    if (!color) throw new Error('color in nvim-terminal, doesn\'t exist: ' + k)
    if (typeof k !== 'string') throw new Error('wrong color type in nvim-terminal')
    data[k] = color[0]
  })
  return data
}
