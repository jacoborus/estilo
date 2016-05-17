'use strict'

const mkdirp = require('mkdirp')
const { resolve, basename } = require('path')
const fs = require('fs')
const renderScheme = require('./print-scheme.js')
const yaml = require('js-yaml')
const renderLightline = require('./render-lightline.js')

/**
 * check if file exists
 *
 * @param {string} filepath
 * @returns {boolean}
 */
function exists (filepath) {
  let res = true
  try {
    fs.statSync(filepath)
  } catch (e) {
    res = false
  }
  return res
}

/**
 * getTemplateFiles
 *
 * @param {string} folderPath path to folder with yml templates
 * @returns {array} list of template paths inside folder
 */
function getTemplateFiles (folderPath) {
  if (!exists(folderPath)) return []
  return fs.readdirSync(folderPath)
    // filter .yml files
    .filter(i => basename(i) !== basename(i, '.yml'))
    .map(i => resolve(folderPath, i))
}

function hasContent (tmpl) {
  return Object.keys(tmpl).find(k => tmpl[k])
}

/**
 * convert
 *
 * read all templates in `folder` and its subfolders,
 * then generate color schemes for vim and lightline
 *
 * @param {string} folder template folder path
 */
module.exports = function (folder) {
  const pkg = require(resolve(folder, 'package.json'))

  const colorsFolder = resolve(folder, 'colors')
  const estiloFolder = resolve(folder, 'estilo')
  const pluginsFolder = resolve(folder, 'plugin')
  const lightlinePath = resolve(estiloFolder, 'addons/lightline.yml')
  const lighlineTmpl = exists(lightlinePath) ? yaml.safeLoad(fs.readFileSync(lightlinePath)) : false

  let templatePaths = [
    estiloFolder + '/ui-base.yml',
    estiloFolder + '/syntax-base.yml'
  ]
  templatePaths.push(...getTemplateFiles(estiloFolder + '/syntax'))
  templatePaths.push(...getTemplateFiles(estiloFolder + '/plugins'))

  // load info and colors
  let info = yaml.safeLoad(fs.readFileSync(estiloFolder + '/info.yml'))
  Object.assign(info, pkg)

  // load all templates from disk
  let templates = {}
  templatePaths.forEach(templatePath => {
    const raw = fs.readFileSync(templatePath)
    const obj = yaml.safeLoad(raw)
    Object.keys(obj).forEach(k => {
      templates[k] = obj[k]
    })
  })

  // render template
  let scheme = renderScheme({ info, templates })

  // write template to disk
  mkdirp.sync(colorsFolder)
  fs.writeFileSync(`${colorsFolder}/${pkg.name}.vim`, scheme)

  // render lightline theme if possible
  if (lighlineTmpl && hasContent(lighlineTmpl)) {
    const llTheme = renderLightline(pkg.name, lighlineTmpl, info.colors)
    mkdirp.sync(pluginsFolder)
    fs.writeFileSync(`${pluginsFolder}/${pkg.name}-lightline.vim`, llTheme)
  }

  console.log('Done!')
}
