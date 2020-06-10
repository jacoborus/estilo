#!/usr/bin/env node

import path from 'path'
import minimist from 'minimist'
import updateNotifier from 'update-notifier'
import { createProject } from '../create-project'
import { renderProject } from '../render-project'
import { selectSyntax } from './select-syntax.js'
import { init } from './init'
import { installStatus } from './install-status'
import { pkg } from '../util'

const argv = minimist(process.argv.slice(2))
const projectPath = path.resolve('.')
const help = `
  Usage: estilo [command]

  Commands:

    init                initialize an estilo project in current folder
    render              render all the colorschemes and themes
    add-syntax          open dialog: add more syntax templates
    add-airline         open dialog: add a new Airline style
    add-lightline       open dialog: add a new Lightline style
    version             output version number
    help                show this help
`

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
}).notify()

const [command, destination] = argv._
const noQuestions = argv.y

const actions = {
  help: () => console.log(help),
  version: () => console.log(pkg.version),
  init: () => init(path.resolve(destination || '.'), noQuestions),
  render: () => renderProject(createProject(projectPath)),
  'add-syntax': () => selectSyntax(projectPath),
  'add-airline': () => installStatus(projectPath, 'airline'),
  'add-lightline': () => installStatus(projectPath, 'lightline')
} as Record<string, () => void>

if (!command) actions.help()
else {
  const action = actions[command]
  if (action) action()
  else {
    console.log('Command not found')
    console.log(help)
  }
}
