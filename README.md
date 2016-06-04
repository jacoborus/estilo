Estilo
======

**Estilo** makes easy creating, improving and maintaining colorschemes for vim and its ecosystem.


- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Create boilerplate](#create-boilerplate)
    - [Create npm module](#create-npm-module)
    - [Install Estilo](#install-estilo)
  - [Create color themes](#create-color-themes)
    - [Themes](#themes)
    - [Color palette](#color-palette)
  - [Define syntax highlighting](#define-syntax-highlighting)
  - [Add more syntax highlighting definitions](#add-more-syntax-highlighting-definitions)
  - [Generate colorschemes](#generate-colorschemes)
  - [Lightline theme](#lightline-theme)
- [Publishing](#publishing)
- [Useful resources](#useful-resources)
- [Created with Estilo](#colors-schemes)


<a name="features"></a>
## Features

- Easy to fill yaml templates
- Convert hex colors to closest xterm values
- Shortcuts for text styles
- Autofill cterm values
- Organized templates
- Empty templates for lots of languages and plugins (see the [list of templates](https://github.com/jacoborus/estilo/tree/master/base))
- Templates indicate the default linked style of highlights through comments

<a name="requirements"></a>
## Requirements

It's written in pure javascript, so you will need nodejs installed in your computer.

<a name="usage"></a>
## Usage

<a name="create-boilerplate"></a>
### Create boilerplate

<a name="create-npm-module"></a>
#### Create a npm module


First of all you will need to create a new npm module and fill its package.json data, this data will be used in your scheme

```sh
mkdir mycolors && cd mycolors && npm init
```

<a name="install-estilo"></a>
#### Install Estilo

Install estilo as a dependency. This step will add some scripts to package.json and create `estilo` folder, which contains your templates and palette.

```sh
npm install --save estilo
```

<a name="create-color-themes"></a>
### Create color themes

<a name="themes"></a>
#### Themes

Estilo can render a single color scheme or multiple variations (themes). You will need to create a yaml file for every theme in `estilo/themes` folder. 

A theme has the following structure:

- name: the theme name
- background: dark or light
- colors: a object containing the colors you are going to use in this variant. Use hex colors, and closest xterm values will be added automatically

Example:

```yaml
name: 'my-scheme'
background: 'dark'
colors:
  sky: '#bdf'
  cherry: '#ffbbcc'
```

<a name="color-palette"></a>
#### Color palette

Themes usually share some colors, you can add these colors to `estilo/palette.yml` file and link them from the themes by using `@` prefix.

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


`estilo/themes/my-light-theme.yml`

```yaml
name: 'my-light-theme'
background: 'light'
colors:
  blue1: '@ocean'
  blue2: '@night'
```

<a name="define-syntax-highlighting"></a>
### Define syntax highlighting

Open `estilo/base.yml` and fill definitions with some rules:

- first value is foreground
- second value is background
- third value is text style, and just accept first letter of every style (b: bold, r: reverse, u: underline, i: italic)
- a hyphen (`-`)or an ommited value will be rendered as `NONE`
- a dot (`.`) will not render this foreground/background/style

Examples:

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
#### Add more syntax highlighting templates

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `npm run add-template -- group/template-name` on your terminal. 

Example: add go, ruby and fugitive templates

```sh
npm run add-template -- syntax/go syntax/ruby plugins/fugitive
```

See [full list of templates](https://github.com/jacoborus/estilo/tree/master/base) inside `syntax` and `plugins` folders


<a name="generate-colorschemes"></a>
#### Generate colorschemes

Render the color schemes from your terminal:

```sh
npm run build
```

<a name="lightline-theme"></a>
#### Lightline theme

Estilo can create your lighline theme too. Open lightline template (`your-scheme/estilo/addons/lighline.yml`) and follow the instructions in the comments


<a name="publishing"></a>
## Publishing

Your scheme is almost ready, just remember to add `node_modules` to `.gitignore` file before publishing

```sh
echo 'node_modules' >> .gitignore
```

<a name="useful-resources"></a>
## Useful resources

- `:so $VIMRUNTIME/syntax/hitest.vim`: display all highlight group names with their own color. (See `:help hitest.vim`)
- Trace syntax highlight of the word under the cursor: [vim-HiLinkTrace](https://github.com/gerw/vim-HiLinkTrace)
- Preview colors inline: [vim-css-color](https://github.com/skammer/vim-css-color)
- [yaml language elements](https://en.wikipedia.org/wiki/YAML#Language_elements<Paste>)


<a name="colors-schemes"></a>
## Created with Estilo

- [Tender](https://github.com/jacoborus/tender.vim)
- [add yours](https://github.com/jacoborus/estilo/compare)



<br><br>

---

© 2016 [Jacobo Tabernero](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
