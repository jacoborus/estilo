#!/usr/bin/env node

'use strict'

const estilo = require('../estilo.js')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')

const args = argv._

if (!args.length) {
  console.log(help)
  process.exit(0)
}

const help = `
  estilo command <input template> <output scheme>

  Example:
    estilo generate mytemplate.yaml mycolorscheme.vim

`
const commands = {
  g: generate,
  generate,
  i: init,
  init
}

const command = args.shift()

commands[command]()

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
  if (!exists(filepath)) {
    return false
  }
  return fs.statSync(filepath).isDirectory()
}

function generate () {
  let origin = path.resolve(args[0])
  if (!exists(origin)) throw new Error(`${ origin } doesn't exists`)
  if (!isDir(origin)) {
    let destination = false
    if (1 in args) {
      destination = path.resolve(args[1])
    }
    estilo(origin, destination)
  }
}

function init () {
}
