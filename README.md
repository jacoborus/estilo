# Estilo

**Estilo** makes easy to create and maintain colorschemes for vim, airline and
lightline.

---

:fire: **HEADS UP!** You're currently looking at Estilo 2 branch (alpha
version). If you're looking for Estilo 1,
[please check out `1.0` branch
(`master`)](https://github.com/jacoborus/estilo/tree/master).

---

[![Build Status](https://travis-ci.org/jacoborus/estilo.svg?branch=master)](https://travis-ci.org/jacoborus/estilo)
[![npm version](https://badge.fury.io/js/estilo.svg)](https://www.npmjs.com/package/estilo)
![npm dependencies](https://david-dm.org/jacoborus/estilo.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

![estilo-demo](https://cloud.githubusercontent.com/assets/829859/18419822/ea729490-7863-11e6-8d04-ddb327da68cd.gif)

## Installation

TODO

## Quick start

Initialize your project and follow the instructions:

```sh
mkdir myproject && cd myproject && estilo create
```

Next: [Color palettes](docs/color-palettes.md)

## CLI

Usage: `estilo [command]`

Commands:

- **`create [folder]`**: Create an estilo project in [folder] or current folder
- **`render [folder]`**: Render project in [folder] or current folder
- **`add-syntax`**: Add more syntax templates
- **`add-airline [styleName]`**: Add a new Airline style
- **`add-lightline [styleName]`**: Add a new Lightline style
- **`help [command]`**: Show this help or the help of a sub-command.
- **`--version`**: Show the version number.

## Documentation

- [Color palettes](docs/color-palettes.md)
- [Colorschemes](docs/colorschemes.md)
- [Airline themes](docs/airline.md)
- [Lightline themes](docs/lightline.md)


## Upgrading from v1.x

Estilo v2.x uses a different folder structure than previous versions. Rename your
`estilo` folder to `estilos` and move `nvim-term.yml` from `addons` subfolder to `estilos` folder

```sh
mv estilo estilos && mv estilos/addons/nvim-term.yml estilos
```

## Colorschemes created with Estilo

- [Tender](https://github.com/jacoborus/tender.vim) by
  [@jacoborus](https://github.com/jacoborus)
- [Oceanic Next](https://github.com/mhartington/oceanic-next) by
  [@mhartington](https://github.com/mhartington)
- [Falcon](https://github.com/fenetikm/falcon) by
  [@fenetikm](https://github.com/fenetikm)
- [Github](https://github.com/albertorestifo/github.vim) by
  [@albertorestifo](https://github.com/albertorestifo)
- [vim-framer-syntax](https://github.com/balanceiskey/vim-framer-syntax) by
  [@balanceiskey](https://github.com/balanceiskey)
- [add yours](https://github.com/jacoborus/estilo/issues/new)

## Development

Estilo is written in pure Typescript, so you need
[deno.js 1.7](https://deno.land/) or higher installed in your computer

## TODO

- [x] Migrate cli to deno
- [x] Migrate old render to deno
- [x] Move terminal.yml down to estilo folder (remove addons folder)
- [x] Render estilo.yml from a .hbs
- [x] Group assets in assets folder
- [x] Check if folder contains a Estilo project
- [x] Rename estilo folder
- [x] Add upgrade instructions
- [ ] Automatic theme upgrader
- [x] Do not print terminal colors if terminal template has no colors
- [ ] Palettes can import colors from a main palette
- [ ] Add update notifier
- [ ] Update documentation
- [ ] Build scripts:
  - [ ] Linux bin
  - [ ] OSX bin
  - [ ] Win bin
  - [ ] .deb
  - [ ] .rpm
  - [ ] .dmg
  - [ ] .whatever windows uses
- [ ] Add install instructions
- [ ] Refactor and clean code

<br>

---

© 2016-2021 [Jacobo Tabernero Rey](http://jacoborus.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
