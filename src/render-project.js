'use strict'

const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

const renderColorscheme = require('./render-colorscheme.js')
const checkPalette = require('./check-palette.js')
// const renderLightline = require('./render-lightline.js')
// const renderAirline = require('./render-airline.js')

module.exports = function (project) {
  return new Promise((resolve, reject) => {
    const { palettes, info } = project

    // search for errors in color palettes
    Object.keys(palettes).forEach(k => checkPalette(palettes[k], k))

    // check colorschemes to render
    if (!info.colorschemes || !info.colorschemes.length) {
      return reject('Nothing to render')
    }

    info.colorschemes.forEach(c => {
      if (!c.name) {
        throw new Error('Error reading estilo.yml, colorschemes needs a name')
      }
      if (c.background) {
        if (c.background !== 'dark' && c.background !== 'light') {
          throw new Error(c.name + ' colorscheme has a wrong background')
        }
      }
      if (!c.palette) {
        throw new Error(c.name + ' colorscheme has not a color palette')
      }
      if (!palettes[c.palette]) {
        console.log(palettes)
        throw new Error('Colorscheme: ' + c.name + ' palette doesn\'t exists: ' + c.palette)
      }
    })

    // render colorschemes
    info.colorschemes.forEach(c => {
      c.rendered = renderColorscheme(info, c, palettes[c.palette], project.syntax)
    })

    // write colorschemes to disk
    mkdirp.sync(path.resolve(project.path, 'colors'))
    info.colorschemes.forEach(c => {
      fs.writeFileSync(path.resolve(project.path, 'colors', c.name + '.vim'), c.rendered)
    })
  })
}
