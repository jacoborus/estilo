import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'
import mkdirp from 'mkdirp'
import chalk from 'chalk'
import { StatusBrand } from '../common'
const log = console.log

export function installStatus (projectPath: string, brand: StatusBrand) {
  const statusFolderPath = path.resolve(projectPath, paths[brand])
  mkdirp.sync(statusFolderPath)
  const installedStyles = fs.readdirSync(statusFolderPath)
    .map(n => n.slice(0, -4))

  const questions = [
    {
      type: 'input',
      message: 'Enter style name:',
      name: 'stylename',
      validate: (input: string) => {
        if (!input.trim()) return 'That\'s not a name'
        if (installedStyles.indexOf(input.trim()) > -1) {
          return 'That style already exists'
        } else {
          return true
        }
      }
    }
  ]

  inquirer.prompt(questions).then(function (answers) {
    const filepath = path.resolve(statusFolderPath, answers.stylename + '.yml')
    fs.writeFileSync(filepath, templates[brand])
    log(chalk.green(`New ${brand} style: ${(answers.stylename as string).trim()}`))
  })
}

const paths = {
  airline: 'estilo/airline',
  lightline: 'estilo/lightline'
}

const templates = {
  airline: `normal1: ''
normal2: ''
normal3: ''
inactive1: ''
inactive2: ''
inactive3: ''
insert1: ''
insert2: ''
insert3: ''
replace1: ''
replace2: ''
replace3: ''
visual1: ''
visual2: ''
visual3: ''
ctrlp1: ''
ctrlp2: ''
ctrlp3: ''`,
  lightline: `normal1: ''
normal2: ''
normal3: ''
normal4: ''
normal5: ''
normalError: ''
normalWarning: ''
inactive1: ''
inactive2: ''
inactive3: ''
inactive4: ''
inactive5: ''
insert1: ''
insert2: ''
insert3: ''
insert4: ''
insert5: ''
replace1: ''
replace2: ''
replace3: ''
replace4: ''
replace5: ''
visual1: ''
visual2: ''
visual3: ''
visual4: ''
visual5: ''
tablineLeft: ''
tablineSelected: ''
tablineMiddle: ''
tablineRight: ''
`
}
