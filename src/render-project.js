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
    const { palettes, templates, info } = project

    // search for errors in palette
    palettes.forEach(palette => checkPalette(palette))

    // check colorschemes
    if (!info.colorchemes || !info.colorchemes.length) {
      return reject('Nothing to render')
    }

    info.colorchemes.forEach(c => {
      if (!c.name) {
        throw new Error('Error reading estilo.yml, colorschemes needs a name')
      }
      if (c.background) {
        if (c.background !== 'dark' || c.background !== 'light') {
          throw new Error(c.name + ' colorscheme has a wrong background')
        }
      }
      if (!c.palette) {
        throw new Error(c.name + ' colorscheme has not a color palette')
      }
      if (!palettes[c.palette]) {
        throw new Error(c.name + ' colorscheme: ' + c.palette + ' palette doesn\'t exists')
      }
    })

    // render colorschemes
    info.colorchemes.forEach(c => {
      renderColorscheme(info, c, palettes[c.palette], templates)
    })

    // write colorschemes to disk
    mkdirp.sync(path.resolve(project.path, 'colors'))
    info.colorchemes.forEach(c => {
      fs.writeFileSync(path.resolve(project.path, 'colors', c.name + '.vim'), c.rendered)
    })
  })
}
