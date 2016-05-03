#!/usr/bin/env node
'use strict'

const { resolve } = require('path')
const convert = require('../src/convert.js')

convert(resolve('.'))
