'use strict'

// const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('../src/super-fs')
const path = require('path')
const schemeFolder = path.resolve(__dirname, '../../..')
const estiloFolder = schemeFolder + '/estilo'
const baseFolder = path.resolve(__dirname, '../base')

function readFiles (templates) {
  return new Promise((resolve, reject) => {
    Promise.all(templates.map(t => {
      return fs.readProm(t.origin)
    }))
    .then(datas => {
      datas.forEach((d, i) => {
        templates[i].data = d.data
      })
      resolve(templates)
    })
    .catch(reject)
  })
}

function checkFiles (templates) {
  return new Promise((resolve, reject) => {
    Promise.all(templates.map(t => {
      return fs.existsProm(t.origin)
    }))
    .then(() => resolve(templates))
    .catch(reject)
  })
}

function writeFiles (templates) {
  return new Promise((resolve, reject) => {
    Promise.all(templates.map(t => {
      return fs.writeProm(t.destination, t.data)
    }))
    .then(() => resolve(templates))
    .catch(reject)
  })
}

// create objects for every template:
// - name
// - origin
// - destination
// - data
function createObjects (names) {
  return names.map(n => {
    if (!n.endsWith('.yml')) n = n + '.yml'
    const shortName = n.substr(0, n.length - 4)
    return {
      name: shortName,
      origin: path.resolve(baseFolder, n),
      destination: path.resolve(estiloFolder, n)
    }
  })
}

new Promise((resolve, reject) => {
  let names = argv._
  if (!names.length) reject('0 templates added')
  else resolve(names)
})
// create objects for every template:
.then(createObjects)
// check if origins exist
.then(checkFiles)
// read files data
.then(readFiles)
// write files
.then(writeFiles)
// success message
.then(templates => {
  console.log('Added templates:\n')
  templates.forEach(t => console.log(t.name))
})
.catch(err => {
  console.log('Aborting due an error while adding templates')
  console.log(err)
  process.exit(1)
})
