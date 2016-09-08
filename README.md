Estilo
======

**Estilo** makes easy creating, maintaining and versioning colorschemes for vim and its ecosystem.

**This project is under active development, API may change**

[![Build Status](https://travis-ci.org/jacoborus/estilo.svg?branch=master)](https://travis-ci.org/jacoborus/estilo) [![npm version](https://badge.fury.io/js/estilo.svg)](https://www.npmjs.com/package/estilo) ![npm dependencies](https://david-dm.org/jacoborus/estilo.svg) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

- [Features](#features)
- [Installation](#installation)
- [Create color schemes](#create-color-schemes)
  - [Define color palettes](#define-color-palettes)
  - [Define syntax highlighting](#define-syntax-highlighting)
  - [Add more syntax highlighting definitions](#add-more-syntax-highlighting-definitions)
  - [Rendering](#renderng)
- [Publishing](#publishing)
- [Created with Estilo](#created-with-estilo)
- [Useful resources](#useful-resources)


<a name="installation"></a>
## Installation

It's written in pure javascript, so you will need [node.js](https://nodejs.org) installed in your computer, then install with [npm](https://www.npmjs.com/package/estilo):

```sh
npm install -g estilo
```


<a name="create-color-schemes"></a>
## Create color schemes


<a name="define-colors"></a>
### Define colors

Estilo can render a single color scheme or multiple variants, you will need to create a yaml file for every one in `estilo/themes` folder.

A colorscheme template has the following structure:

- name: the colorscheme name
- background: 'dark' or 'light'
- colors: an object containing the colors you are going to use in this variant. Use hex colors, and closest xterm values will be added automatically

Example:

`my-scheme.yml`:

```yaml
name: 'my-scheme'
background: 'dark'
colors:
  sky: '#bdf'
  cherry: '#ffbbcc'
```

<a name="define-syntax-highlighting"></a>
## Define syntax highlighting

Then define your syntax highlighting, open `estilo/base.yml` and fill definitions with some rules:

- first value is foreground
- second value is background
- the third value is for text styles, and you should write just the first letter of every style (b: bold, r: reverse, u: underline, i: italic)
- a hyphen (`-`) or an ommited value will be rendered as `NONE`
- a dot (`.`) will not render this foreground/background/style

Examples (template - result):

Omitting values:

```yaml
Comment: 'sky'
```

```vim
hi Comment guifg=#bbddff ctermfg=153 guibg=NONE ctermbg=NONE gui=NONE cterm=NONE
```

Omitting values with dashes:

```yaml
Title: '- cherry bu'
```

```vim
hi Title guifg=NONE ctermfg=NONE guibg=ffbbcc ctermbg=218 gui=bold,underline cterm=bold,underline
```

Prevent to print style with dots

```yaml
Other: '. . ri'
```

```vim
hi Other gui=reverse,italic cterm=reverse,italic
```

Link to other definition:

```yaml
WarningMsg: 'link Title'
```

```vim
hi link WarningMsg Title
```


<a name="add-more-syntax-highlighting-definitions"></a>
### Add more syntax highlighting templates

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `npm run add-template -- folder/template-name` on your terminal.

Example: add go, ruby and fugitive templates

```sh
npm run add-template -- syntax/go syntax/ruby plugins/fugitive
```

See [full list of templates](https://github.com/jacoborus/estilo/tree/master/base) inside `syntax` and `plugins` folders



<a name="color-palette"></a>
### Color palette

Color schemes usually share some colors, you can add them to `estilo/palette.yml` file and link them from the templates by using `@` prefix.

Example:

`estilo/palette.yml`:

```yaml
sky: '#abd9ec'
ocean: '#66afce'
night: '#3c6f85'
```

`estilo/themes/my-dark-theme.yml`

```yaml
name: 'my-dark-theme'
background: 'dark'
colors:
  blue1: '@sky'
  blue2: '@ocean'
```


<a name="render-colorschemes"></a>
### Render

Render the color schemes from your terminal:

```sh
npm run build
```

<a name="lightline-theme"></a>
### Lightline theme

Estilo can create your lighline theme too. Open lightline template (`your-scheme/estilo/addons/lighline.yml`) and follow the instructions in the comments


<a name="publishing"></a>
## Publishing

Your scheme is almost ready, just remember to add `node_modules` to `.gitignore` file before publishing

```sh
echo 'node_modules' >> .gitignore
```

<a name="created-with-estilo"></a>
## Created with Estilo

- [Tender](https://github.com/jacoborus/tender.vim)
- [add yours](https://github.com/jacoborus/estilo/compare)



<a name="useful-resources"></a>
## Useful resources

- `:so $VIMRUNTIME/syntax/hitest.vim`: display all highlight group names with their own color. (See `:help hitest.vim`)
- Trace syntax highlight of the word under the cursor: [vim-HiLinkTrace](https://github.com/gerw/vim-HiLinkTrace)
- Preview colors inline: [vim-css-color](https://github.com/skammer/vim-css-color)
- [yaml language elements](https://en.wikipedia.org/wiki/YAML#Language_elements<Paste>)


<br><br>

---

© 2016 [Jacobo Tabernero](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
