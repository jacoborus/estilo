'use strict'

const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('./super-fs')
const renderThemes = require('./render-themes.js')
const yaml = require('js-yaml')
const renderLightline = require('./render-lightline.js')

/**
 * convert
 *
 * read all templates in `folder` and its subfolders,
 * then generate color schemes for vim and lightline
 *
 * @param {string} folder template folder path
 */
module.exports = function (folder, cb) {
  const pkg = require(path.resolve(folder, 'package.json'))

  const colorsFolder = path.resolve(folder, 'colors')
  const estiloFolder = path.resolve(folder, 'estilo')
  const palettePath = path.resolve(estiloFolder, 'palette.yml')
  const pluginsFolder = path.resolve(folder, 'plugin')
  const themesFolder = path.resolve(estiloFolder, 'themes')
  const lightlinePath = path.resolve(estiloFolder, 'addons/lightline.yml')
  const lighlineTmpl = fs.existsSync(lightlinePath)
    ? yaml.safeLoad(fs.readFileSync(lightlinePath))
    : false

  getTemplatePaths(estiloFolder)
  .then(arr => {
    return [
      estiloFolder + '/base.yml'
    ].concat(arr[0]).concat(arr[1])
  })
  // load template files
  .then(loadTemplates)
  // create schema with templates and empty info
  .then(templates => ({
    templates,
    info: {},
    themesFolder,
    colorsFolder,
    pluginsFolder,
    lighlineTmpl
  }))
  // add info to schema
  .then(schema => getPalette(palettePath, schema))
  // add pkg to info
  .then(schema => {
    schema.info = pkg
    return schema
  })
  // add path of themes to schema
  .then(addThemePaths)
  // load themes
  .then(getThemes)
  .then(splitThemesInfo)
  // render schemes
  .then(joinTemplates)
  .then(renderThemes)
  // save scheme to disk
  .then(writeSchemes)
  // render lightline theme
  .then(renderLlThemes)
  // success message
  .then(() => console.log('Done!'))
  .then(cb)
  .catch(err => {
    console.log(err)
    throw err
  })
}

/**
 * getYmlsInsideFolder
 *
 * @param {string} folderPath path to folder with yml templates
 * @returns {array} list of template paths inside folder
 */
function getYmlsInsideFolder (folderPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath)) resolve([])
    else {
      fs.readdir(folderPath, (err, data) => {
        if (err) reject('Error reading', folderPath)
        else {
          resolve(
            data
              .filter(i => path.basename(i) !== path.basename(i, '.yml'))
              .map(i => path.resolve(folderPath, i))
          )
        }
      })
    }
  })
}

function getTemplatePaths (estiloFolder) {
  return Promise.all([
    getYmlsInsideFolder(estiloFolder + '/syntax'),
    getYmlsInsideFolder(estiloFolder + '/plugins')
  ])
}

function loadTemplate (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject('Error loading template: ' + path)
      else resolve(yaml.safeLoad(data))
    })
  })
}
// load all templates from disk
function loadTemplates (paths) {
  return Promise.all(paths.map(p => loadTemplate(p)))
}

// load info and colors
function getPalette (palettePath, schema) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(palettePath)) {
      schema.palette = {}
      return resolve(schema)
    }
    fs.readFile(palettePath, 'utf8', (err, data) => {
      if (err) reject('Error loading palette')
      else {
        schema.palette = yaml.safeLoad(data)
        resolve(schema)
      }
    })
  })
}

function addThemePaths (schema) {
  const themesFolder = schema.themesFolder
  return new Promise((resolve, reject) => {
    fs.readdir(themesFolder, (err, names) => {
      if (err) reject('Error loading themes folder')
      else {
        schema.themePaths = names.map(n => path.resolve(themesFolder, n))
        resolve(schema)
      }
    })
  })
}

function getThemes (schema) {
  return new Promise((resolve, reject) => {
    Promise.all(schema.themePaths.map(p => fs.readProm(p)))
    .then(datas => {
      schema.rawThemes = datas
      resolve(schema)
    })
    .catch(err => reject(err))
  })
}

function splitThemesInfo (schema) {
  const raw = schema.rawThemes
  schema.themes = {}
  raw.forEach(r => {
    const data = yaml.safeLoad(r.data)
    schema.themes[data.name] = data
  })
  return schema
}

function joinTemplates (schema) {
  const precompiled = {}
  Object.keys(schema.templates).forEach(t => {
    const template = schema.templates[t]
    Object.keys(template).forEach(k => {
      let hi = template[k]
      if (hi) {
        precompiled[k] = hi
      }
    })
  })
  schema.templates = precompiled
  return schema
}

function hasContent (tmpl) {
  return Object.keys(tmpl).find(k => tmpl[k])
}

function writeSchemes (schema) {
  const colorsFolder = schema.colorsFolder
  mkdirp.sync(colorsFolder)
  const { themes } = schema
  Object.keys(themes).forEach(t => {
    const theme = themes[t]
    fs.writeFileSync(`${colorsFolder}/${theme.name}.vim`, theme.out)
  })
  return schema
}

function renderLlThemes (schema) {
  const { lighlineTmpl, themes, info } = schema
  // render lightline theme if possible
  if (lighlineTmpl && hasContent(lighlineTmpl)) {
    mkdirp.sync(schema.pluginsFolder)
    Object.keys(themes).forEach(k => {
      const theme = themes[k]
      const llTheme = renderLightline(info.name, lighlineTmpl, theme)
        // save lightline theme to disk
      fs.writeFileSync(`${schema.pluginsFolder}/${theme.name}-lightline.vim`, llTheme)
    })
  }
  return schema
}
