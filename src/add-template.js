'use strict'

const fs = require('../src/super-fs')
const path = require('path')
const chalk = require('chalk')
const { log } = console

module.exports = function (templateNames) {
  new Promise((resolve, reject) => {
    if (!templateNames.length) reject('0 templates added')
    else resolve(templateNames)
  })
  // create objects for every template:
  .then(function (names) {
    return names.map(n => {
      return {
        name: n,
        origin: path.resolve(__dirname, '..', 'templates/syntax', n),
        destination: path.resolve('estilo/syntax', n)
      }
    })
  })
  // check if origins exist
  .then(function (templates) {
    return new Promise((resolve, reject) => {
      Promise.all(templates.map(t => fs.existsProm(t.origin)))
      .then(() => resolve(templates))
      .catch(reject)
    })
  })
  // read files data
  .then(function (templates) {
    return new Promise((resolve, reject) => {
      Promise.all(templates.map(t => fs.readProm(t.origin)))
      .then(datas => {
        datas.forEach((d, i) => { templates[i].data = d.data })
        resolve(templates)
      })
      .catch(reject)
    })
  })
  // write files
  .then(function (templates) {
    return new Promise((resolve, reject) => {
      Promise.all(templates.map(t => fs.writeProm(t.destination, t.data)))
      .then(() => resolve(templates))
      .catch(reject)
    })
  })
  // success message
  .then(templates => {
    log(chalk.blue.bold('\nNew syntax templates:'))
    templates.forEach(t => log(chalk.green(t.name)))
  })
  .catch(err => {
    log(chalk.red.bold('Aborting due an error while adding templates'))
    log(err)
  })
}
