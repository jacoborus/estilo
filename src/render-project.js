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
const compileNterm = require('./compile-nvim-terminal.js')
const dateFormat = require('date-format')
const now = dateFormat('yyyy/MM/dd hh:mm', new Date())
const estiloVersion = require(path.resolve(__dirname, '../package.json')).version

const paths = {
  airline: 'autoload/airline/themes',
  lightline: 'autoload/lightline/colorscheme'
}

module.exports = function (project) {
  const info = project.info
  const rawPalettes = project.rawPalettes
  const colorschemes = info.colorschemes

  // compile color palettes
  const palettes = project.palettes = {}
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
      throw new Error('Missing palette: ' + c.name + ' - ' + c.palette)
    }
  })

  let render = handlebars.compile(mustaches.colorscheme)
  mkdirp.sync(path.resolve(project.path, 'colors'))
  // compile colorschemes
  colorschemes.forEach(c => {
    const palette = palettes[c.palette]
    const nterm = project.nterm ? compileNterm(project.nterm, palette) : {}
    const data = {
      c: compileColorscheme(project.syntax, palette),
      date: now,
      theme: c,
      pkg: project.info,
      estiloVersion: estiloVersion,
      nterm: nterm
    }

    const rendered = render(data)
    // write colorschemes to disk
    const fileName = c.name + '.vim'
    fs.writeFileSync(path.resolve(project.path, 'colors', fileName), rendered)
    log('colorscheme:', chalk.cyan(fileName), '...', chalk.green.bold('OK'))
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
      throw new Error('Missing palette: ' + statusName + ' - ' + t.name)
    }
  })

  // render
  let render = handlebars.compile(project.mustaches[statusName])
  mkdirp.sync(path.resolve(project.path, paths[statusName]))
  themes.forEach(t => {
    const palette = palettes[t.palette]
    const compiledData = compileStatus(styles[t.style], palette, statusName)
    const data = Object.assign(compiledData, {
      date: now,
      theme: t,
      pkg: project.info,
      estiloVersion: estiloVersion
    })
    const rendered = render(data)
    // write themes to disk
    const fileName = t.name + '.vim'
    const filePath = path.resolve(project.path, paths[statusName], fileName)
    fs.writeFileSync(filePath, rendered)
    log(statusName, chalk.cyan(fileName), '...', chalk.green.bold('OK'))
  })
}
