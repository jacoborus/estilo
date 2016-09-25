'use strict'

module.exports = function (template, palette) {
  const data = {}
  console.log(template)
  Object.keys(template).forEach(k => {
    const color = palette[template[k]]
    if (!color) throw new Error('color in nvim-terminal, doesn\'t exist: ' + k)
    if (typeof k !== 'string') throw new Error('wrong color type in nvim-terminal')
    data[k] = color[0]
  })
  return data
}
