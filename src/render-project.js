'use strict'

const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const log = console.log

const handlebars = require('handlebars')
const chalk = require('chalk')

const compileColorscheme = require('./compile-colorscheme.js')
const compilePalette = require('./compile-palette.js')
const compileStatus = require('./compile-status.js')

module.exports = function (project) {
  return new Promise((resolve, reject) => {
    const info = project.info
    const rawPalettes = project.rawPalettes
    const colorschemes = info.colorschemes

    // compile color palettes
    const palettes = {}
    Object.keys(rawPalettes).forEach(k => {
      palettes[k] = compilePalette(rawPalettes[k], k)
    })

    if (colorschemes && colorschemes.length) {
      renderColorschemes(project)
    }

    if (info.airline && info.airline.length) {
      renderStatusBars(project, 'airline')
    }

    if (info.lightline && info.lightline.length) {
      renderStatusBars(project, 'lightline')
    }

    resolve(project)
  })
}

function renderColorschemes (project) {
  const colorschemes = project.info.colorschemes
  const mustaches = project.mustaches
  const palettes = project.palettes
  // check for errors in colorschemes
  colorschemes.forEach(c => {
    if (!c.name) {
      throw new Error('Error reading estilo.yml, colorschemes need a name')
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
      throw new Error('Colorscheme: ' + c.name + ' missing palette: ' + c.palette)
    }
  })

  let render = handlebars.compile(mustaches.colorscheme)
  mkdirp.sync(path.resolve(project.path, 'colors'))
  // compile colorschemes
  colorschemes.forEach(c => {
    const rendered = render(compileColorscheme(project.syntax, palettes[c.palette]))
    // write colorschemes to disk
    fs.writeFileSync(path.resolve(project.path, 'colors', c.name + '.vim'), rendered)
    log(chalk.cyan(c.name, 'colorscheme'), ' ...', chalk.green.bold('OK'))
  })
}

function renderStatusBars (project, statusName) {
  const themes = project.info[statusName]
  const styles = project.statusStyles[statusName]
  const palettes = project.palettes
  // check colorschemes to render
  themes.forEach(t => {
    if (!t.name) {
      throw new Error(statusName + ' themes need a name')
    }
    if (!t.style) {
      throw new Error(t.name + ' lightline theme has a wrong style')
    }
    if (!styles[t.style]) {
      throw new Error(t.name + 'lightline theme, missing style: ' + t.style)
    }
    if (!t.palette) {
      throw new Error(t.name + ' lightline theme has not a color palette')
    }
    if (!palettes[t.palette]) {
      throw new Error(t.name + 'lightline theme, missing palette: ' + t.palette)
    }
  })

  // render colorschemes
  let render = handlebars.compile(project.mustaches[statusName])
  mkdirp.sync(path.resolve(project.path, 'plugin'))
  themes.forEach(t => {
    const rendered = render(compileStatus(styles[t.style], palettes[t.palette], statusName))
    // write colorschemes to disk
    const filePath = path.resolve(project.path, 'plugin', t.name + '-' + statusName + '.vim')
    fs.writeFileSync(filePath, rendered)
    log(chalk.cyan(t.name, statusName, 'theme'), '...', chalk.green.bold('OK'))
  })
}
