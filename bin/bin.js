#!/usr/bin/env node

'use strict'

const estilo = require('../estilo.js')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

const help = `
  estilo <input template> <output scheme>

  Example:
    estilo  mytemplate.yaml mycolorscheme.vim

`
let cmds = argv._

if (!cmds.length) {
  console.log(help)
  process.exit(0)
}

let origin = path.resolve(cmds[0])
let destination = false
if (1 in cmds) {
  destination = path.resolve(cmds[1])
}
estilo(origin, destination)

