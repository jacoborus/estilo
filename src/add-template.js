'use strict'

// const path = require('path')
const fs = require('../src/super-fs')
const path = require('path')

module.exports = function (templateNames) {
  new Promise((resolve, reject) => {
    if (!templateNames.length) reject('0 templates added')
    else resolve(templateNames)
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
}

// create objects for every template:
// - name
// - origin
// - destination
// - data
function createObjects (names) {
  return names.map(n => {
    return {
      name: n,
      origin: path.resolve(__dirname, '..', 'templates/syntax', n + '.yml'),
      destination: path.resolve('estilo/syntax', n + '.yml')
    }
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

function writeFiles (templates) {
  return new Promise((resolve, reject) => {
    Promise.all(templates.map(t => {
      return fs.writeProm(t.destination, t.data)
    }))
    .then(() => resolve(templates))
    .catch(reject)
  })
}

