'use strict'

const mkdirp = require('mkdirp')
const fs = require('../src/super-fs.js')
const path = require('path')
const ncp = require('ncp')

function init () {
  let schemeFolder = path.resolve('..', '..')
  let estiloFolder = schemeFolder + '/estilo'
  let pkgPath = schemeFolder + '/package.json'
  // check for package.json
  if (!fs.existsSync(pkgPath)) {
    throw new Error('Estilo requires a package.json')
  }
  if (fs.existsSync(estiloFolder)) {
    console.log('estilo folder already created. Skipping...')
    addScripts(pkgPath)
    console.log('ok postinstall')
  } else {
    mkdirp.sync(estiloFolder)
    const basePath = path.resolve('base')
    console.log('Installing base template...')
    ncp(basePath, estiloFolder, err => {
      if (err) throw err
      addScripts(pkgPath)
      console.log('ok postinstall')
    })
  }
}

function addScripts (pkgPath) {
  let pkg = require(pkgPath)
  pkg.scripts = pkg.scripts || {}
  pkg.scripts.build = 'node node_modules/estilo/scripts/build.js'
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, '  '))
}

init()
