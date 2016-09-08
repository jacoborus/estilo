'use strict'

const path = require('path')
const fs = require('./super-fs')
const renderProject = require('./render-project.js')
const yaml = require('js-yaml')

/**
 * convert
 *
 * read all templates in `folder` and its subfolders,
 * then generate color schemes for vim and lightline
 *
 * @param {string} folder template folder path
 */
module.exports = function (folder, cb) {
  const infoPath = path.resolve(folder, 'estilo.yml')
  if (!fs.existsSync(infoPath)) {
    throw new Error('Estilo config filo doesn\'t exists: ' + infoPath)
  }
  const pkg = yaml.safeLoad(fs.readFileSync(infoPath))
  const estiloFolder = path.resolve(folder, 'estilo')

  getYmlsInsideFolder(estiloFolder + '/syntax')
  // load template files
  .then((paths) => Promise.all(paths.map(p => loadTemplate(p))))
  // create project with templates and empty info
  .then(templates => ({
    templates,
    path: folder,
    // add pkg to info
    info: pkg
  }))
  .then(joinTemplates)
  // load palettes
  .then(loadPalettes)
  // render schemes
  .then(renderProject)
  // success message
  .then(() => console.log('Done!'))
  .then(cb)
  .catch(err => {
    console.log('Error:\n')
    console.log(err)
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

function joinTemplates (project) {
  const syntax = {}
  project.templates.forEach(template => {
    Object.keys(template).forEach(k => {
      let hi = template[k]
      if (hi) {
        syntax[k] = hi
      }
    })
  })
  project.syntax = syntax
  return project
}

function loadPalettes (project) {
  const palettesFolder = path.resolve(project.path, 'estilo', 'palettes')
  project.palettes = {}
  return new Promise((resolve, reject) => {
    fs.readdir(palettesFolder, (err, names) => {
      if (err) reject('Error loading themes folder')
      else {
        names.forEach(n => {
          const id = path.basename(n, '.yml')
          const raw = fs.readFileSync(path.resolve(palettesFolder, n))
          project.palettes[id] = yaml.safeLoad(raw)
        })
        resolve(project)
      }
    })
  })
}
