'use strict'

const fs = require('fs-extra')

function isEmptyDir (dirPath) {
  if (exists(dirPath) === false) {
    return false
  }
  const files = fs.readdirSync(dirPath)
  return files.length > 0
}

function exists (filePath) {
  let x = true
  try {
    fs.statSync(filePath)
  } catch (e) {
    x = false
  }
  return x
}

function isDir (filepath) {
  return fs.statSync(filepath).isDirectory()
}

function init (destination) {
  // check for package.json
  if (!exists(destination + 'package.json')) {
    throw new Error('Estilo requires a package.json')
  }
  if (exists(destination + '/colors')) {
    console.log('estilo folder already created. Skipping...')
    process.exit(0)
  }
  fs.mkdirSync(destination + '/colors')
  // add scripts to package.json
  if (!isDir(destination)) {
    // error on bad folder type
    throw new Error('Wrong folder: ' + destination)
  } else if (!isEmptyDir(destination)) {
    throw new Error('Wrong destination folder: ' + destination)
  }
  const destColors = destination + '/colors'
  const originColors = destination + '/node_modules/estilo/'
  fs.ensureDirSync(destColors)
  fs.copySync('/tmp/mydir', destination + '/colors', function (err) {
    if (err) return console.error(err)
    console.log('success!')
  }) // copies directory, even if it has subdirectories or files
}

module.exports = init
