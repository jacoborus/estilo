'use strict'

const fs = require('fs')
const path = require('path')

function rmrf (dir) {
  if (existsSync(dir)) {
    const list = fs.readdirSync(dir)
    list.forEach(i => {
      const filename = path.join(dir, i)

      if (fs.statSync(filename).isDirectory()) {
        rmrf(filename)
      } else {
        fs.unlinkSync(filename)
      }
    })
    fs.rmdirSync(dir)
  }
}

/**
 * check if file exists
 *
 * @param {string} filepath
 * @returns {boolean}
 */
function exists (filepath, callback) {
  fs.stat(filepath, err => {
    if (err) callback(false)
    else callback(true)
  })
}

function existsProm (filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, err => {
      if (err) reject('File not exists: ' + filepath)
      else resolve(filepath)
    })
  })
}

function readProm (origin) {
  return new Promise((resolve, reject) => {
    fs.readFile(origin, (err, data) => {
      if (err) reject('Error reading ' + origin)
      else resolve({ origin, data })
    })
  })
}

function writeProm (destination, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(destination, data, (err, data) => {
      if (err) reject('Error writing ' + destination)
      else resolve({ destination, data })
    })
  })
}

/**
 * check if file exists
 *
 * @param {string} filepath
 * @returns {boolean}
 */
function existsSync (filepath) {
  let res = true
  try {
    fs.statSync(filepath)
  } catch (e) {
    res = false
  }
  return res
}

Object.assign(fs, {
  rmrf,
  exists,
  existsSync,
  existsProm,
  readProm,
  writeProm
})

module.exports = fs
