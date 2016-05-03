'use strict'

const fs = require('fs-extra')
const path = require('path')

function exists (filePath) {
  let x = true
  try {
    fs.statSync(filePath)
  } catch (e) {
    x = false
  }
  return x
}

function init () {
  let schemeFolder = path.resolve('..', '..')
  let estiloFolder = schemeFolder + '/estilo'
  let pkgPath = schemeFolder + '/package.json'
  // check for package.json
  if (!exists(pkgPath)) {
    throw new Error('Estilo requires a package.json')
  }
  if (exists(estiloFolder)) {
    console.log('estilo folder already created. Skipping...')
  } else {
    fs.mkdirSync(estiloFolder)
    const basePath = path.resolve('base')
    console.log('Installing base template...')
    fs.copySync(basePath, estiloFolder)
  }
  addScripts(pkgPath)
  console.log('ok postinstall')
}

function addScripts (pkgPath) {
  let pkg = require(pkgPath)
  pkg.scripts = pkg.scripts || {}
  pkg.scripts.estilo = 'estilo'
  fs.writeJsonSync(pkgPath, pkg)
}

init()
