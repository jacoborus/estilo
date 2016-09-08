'use strict'

const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('./super-fs')
const renderThemes = require('./render-themes.js')
const yaml = require('js-yaml')
// const renderLightline = require('./render-lightline.js')
// const renderAirline = require('./render-airline.js')

/**
 * convert
 *
 * read all templates in `folder` and its subfolders,
 * then generate color schemes for vim and lightline
 *
 * @param {string} folder template folder path
 */
module.exports = function (folder, cb) {
  const pkg = yaml.safeLoad(fs.readFileSync(path.resolve(folder, 'estilo.yml')))
  const colorsFolder = path.resolve(folder, 'colors')
  const estiloFolder = path.resolve(folder, 'estilo')
  const pluginsFolder = path.resolve(folder, 'plugin')
  const palettesFolder = path.resolve(estiloFolder, 'palettes')

  // const lightlinePath = path.resolve(estiloFolder, 'addons/lightline.yml')
  // const airlinePath = path.resolve(estiloFolder, 'addons/airline.yml')
  // const lighlineTmpl = fs.existsSync(lightlinePath)
  //   ? yaml.safeLoad(fs.readFileSync(lightlinePath))
  //   : false
  // const airlineTmpl = fs.existsSync(airlinePath)
  //   ? yaml.safeLoad(fs.readFileSync(airlinePath))
  //   : false

  getYmlsInsideFolder(estiloFolder + '/syntax')
  // load template files
  .then((paths) => Promise.all(paths.map(p => loadTemplate(p))))
  // create schema with templates and empty info
  .then(templates => ({
    templates,
    // add pkg to info
    info: pkg,
    palettesFolder,
    colorsFolder,
    // lighlineTmpl,
    // airlineTmpl,
    pluginsFolder
  }))
  .then(joinTemplates)
  // add path of themes to schema
  .then(addPalettePaths)
  // load themes
  .then(loadPalettes)
  // render schemes
  .then(renderThemes)
  // save scheme to disk
  .then(writeSchemes)
  // // render lightline theme
  // .then(renderLlThemes)
  // // render airline theme
  // .then(renderAirlineThemes)
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
    if (!fs.existsSync(folderPath)) reject('Cant\' find syntax templates folder: ' + folderPath)
    else {
      fs.readdir(folderPath, (err, data) => {
        if (err) reject('Error reading syntax templates folder: ' + folderPath)
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

function loadTemplate (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject('Error loading template: ' + path)
      else resolve(yaml.safeLoad(data))
    })
  })
}

function joinTemplates (schema) {
  const syntax = {}
  schema.templates.forEach(template => {
    Object.keys(template).forEach(k => {
      let hi = template[k]
      if (hi) {
        syntax[k] = hi
      }
    })
  })
  schema.syntax = syntax
  return schema
}

function addPalettePaths (schema) {
  const palettesFolder = schema.palettesFolder
  return new Promise((resolve, reject) => {
    fs.readdir(palettesFolder, (err, names) => {
      if (err) reject('Error loading themes folder')
      else {
        schema.palettePaths = names.map(n => path.resolve(palettesFolder, n))
        resolve(schema)
      }
    })
  })
}

function loadPalettes (schema) {
  return new Promise((resolve, reject) => {
    Promise.all(schema.palettePaths.map(p => fs.readProm(p)))
    .then(datas => {
      schema.palettes = {}
      datas.forEach(r => {
        const data = yaml.safeLoad(r.data)
        schema.palettes[data.name] = data
      })
      resolve(schema)
    })
    .catch(err => reject(err))
  })
}

// function hasContent (tmpl) {
//   return Object.keys(tmpl).find(k => tmpl[k])
// }

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

// function renderLlThemes (schema) {
//   const { lighlineTmpl, themes, info } = schema
//   // render lightline theme if possible
//   if (lighlineTmpl && hasContent(lighlineTmpl)) {
//     mkdirp.sync(schema.pluginsFolder)
//     Object.keys(themes).forEach(k => {
//       const theme = themes[k]
//       const llTheme = renderLightline(info.name, theme.name, lighlineTmpl, theme.colors)
//       // save lightline theme to disk
//       fs.writeFileSync(`${schema.pluginsFolder}/${theme.name}-lightline.vim`, llTheme)
//     })
//   }
//   return schema
// }

// function renderAirlineThemes (schema) {
//   const { airlineTmpl, themes, info } = schema
//   // render airline theme if possible
//   if (airlineTmpl && hasContent(airlineTmpl)) {
//     mkdirp.sync(schema.pluginsFolder)
//     Object.keys(themes).forEach(k => {
//       const theme = themes[k]
//       const airlineTheme = renderAirline(info.name, theme.name, airlineTmpl, theme.colors)
//       // save airline theme to disk
//       fs.writeFileSync(`${schema.pluginsFolder}/${theme.name}-airline.vim`, airlineTheme)
//     })
//   }
//   return schema
// }
