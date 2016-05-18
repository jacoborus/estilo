'use strict'

const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('./super-fs')
const renderScheme = require('./print-scheme.js')
const yaml = require('js-yaml')
const renderLightline = require('./render-lightline.js')

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

function hasContent (tmpl) {
  return Object.keys(tmpl).find(k => tmpl[k])
}

function getTemplatePaths (estiloFolder) {
  return Promise.all([
    getYmlsInsideFolder(estiloFolder + '/syntax'),
    getYmlsInsideFolder(estiloFolder + '/plugins')
  ])
}

// load info and colors
function getInfo (estiloFolder, schema) {
  return new Promise((resolve, reject) => {
    fs.readFile(estiloFolder + '/info.yml', 'utf8', (err, data) => {
      if (err) reject('Error loading info.yml')
      else {
        schema.info = yaml.safeLoad(data)
        resolve(schema)
      }
    })
  })
}

// load all templates from disk
function loadTemplates (paths) {
  return Promise.all(paths.map(p => loadTemplate(p)))
}

function loadTemplate (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject('Error loading template:', path)
      else resolve(yaml.safeLoad(data))
    })
  })
}

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
  const pluginsFolder = path.resolve(folder, 'plugin')
  const lightlinePath = path.resolve(estiloFolder, 'addons/lightline.yml')
  const lighlineTmpl = fs.existsSync(lightlinePath)
    ? yaml.safeLoad(fs.readFileSync(lightlinePath))
    : false

  getTemplatePaths(estiloFolder)
  .then(arr => {
    return [
      estiloFolder + '/ui-base.yml',
      estiloFolder + '/syntax-base.yml'
    ].concat(arr[0]).concat(arr[1])
  })
  // load template files
  .then(loadTemplates)
  // create schema with templates and empty info
  .then(templates => ({ templates, info: {} }))
  // add info to schema
  .then(schema => getInfo(estiloFolder, schema))
  // add pkg to info
  .then(schema => {
    Object.assign(schema.info, pkg)
    return schema
  })
  // render scheme
  .then(schema => {
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
    schema.scheme = renderScheme(schema)
    return schema
  })
  // save scheme to disk
  .then(schema => {
    mkdirp.sync(colorsFolder)
    fs.writeFileSync(`${colorsFolder}/${pkg.name}.vim`, schema.scheme)
    return schema
  })
  // render lightline theme
  .then(schema => {
    // render lightline theme if possible
    if (lighlineTmpl && hasContent(lighlineTmpl)) {
      const llTheme = renderLightline(pkg.name, lighlineTmpl, schema.info.colors)
      // save lightline theme to disk
      mkdirp.sync(pluginsFolder)
      fs.writeFileSync(`${pluginsFolder}/${pkg.name}-lightline.vim`, llTheme)
    }
    return schema
  })
  // success message
  .then(() => console.log('Done!'))
  .then(cb)
  .catch(err => {
    console.log(err)
    throw err
  })
}
