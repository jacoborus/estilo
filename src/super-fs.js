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
    callback(err ? false : true)
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

fs.rmrf = rmrf
fs.existsSync = existsSync
fs.exists = exists

module.exports = fs
