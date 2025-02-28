# Estilo

Create and maintain colorschemes for vim, airline and lightline.

[![JSR](https://jsr.io/badges/@jacoborus/estilo)](https://jsr.io/@jacoborus/estilo)
[![NPM](https://img.shields.io/npm/v/estilo)](https://www.npmjs.com/package/estilo)

![estilo-demo](https://cloud.githubusercontent.com/assets/829859/18419822/ea729490-7863-11e6-8d04-ddb327da68cd.gif)

## Installation

### Deno

```sh
deno install -n estilo -g -W -R jsr:@jacoborus/estilo
```

### Node.js

```sh
npm install -g estilo
```

### Other plaforms

[Download the binary for your OS](https://github.com/jacoborus/estilo/releases)

## CLI

Usage: `estilo [command]`

Commands:

- **`create [folder]`**: Create an estilo project in [folder] or current folder
- **`render [folder]`**: Render project in [folder] or current folder

## Guide

- [Color palettes](docs/color-palettes.md)
- [Colorschemes](docs/colorschemes.md)
- [Airline themes](docs/airline.md)
- [Lightline themes](docs/lightline.md)

## Upgrading from v1.x

Estilo v2.x uses a different folder structure than previous versions. Rename
your `estilo` folder to `estilos` and move `nvim-term.yml` from `addons`
subfolder to `estilos` folder as `terminal.yml`

Git repo:

```sh
git mv estilo estilos && git mv estilos/addons/nvim-term.yml estilos/terminal.yml
```

Simple:

```sh
mv estilo estilos && mv estilos/addons/nvim-term.yml estilos/terminal.yml
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
- [Ullswater](https://github.com/logicmonkey/Ullswater) by
  [@logicmonkey](https://github.com/logicmonkey)
- [nour2](https://github.com/ibash/nour2) by [@ibash](https://github.com/ibash)
- [Ullswater](https://github.com/logicmonkey/Ullswater) by
  [@logicmonkey](https://github.com/logicmonkey)
- [add yours](https://github.com/jacoborus/estilo/issues/new)

## Development

Estilo is written in pure Typescript, you'll need [deno.js](https://deno.land/)
installed in your computer

<br>

---

© 2016-2023 [Jacobo Tabernero Rey](http://jacobo.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
