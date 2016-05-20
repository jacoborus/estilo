Estilo
======

**Estilo** makes easy creating, improving and maintaining colorschemes for vim and its ecosystem.

## Features

- Easy to fill yaml templates
- Convert hex colors to closest xterm values
- Shortcuts for text styles
- Autofill cterm values
- Organized templates
- Empty templates for lots of languages and plugins (see the [list of templates](https://github.com/jacoborus/estilo/tree/master/base))
- Templates indicate the default linked style of highlights through comments

## Requirements

It's written in pure javascript, so you will need nodejs installed in your computer.

## Usage

### tl;dr

Install *Estilo* in a npm package, edit the templates and `npm run build`

### Step by step

Create a npm module and fill package.json data (this data will be used when rendering your scheme)

```sh
mkdir mycolors && cd mycolors && npm init
```

Then install estilo as a dependency. This step will add some scripts to package.json and the base template in `estilo` folder

```sh
npm install --save estilo
```

Edit the colors in `estilo/info.yml`. Use hex colors and **Estilo** will find the closest Xterm values.

Example:

```yaml
background: 'dark'
colors:
  sky: '#bdf'
  cherry: '#ffbbcc'
```

Now you can set the highlight styles in the remaining .yml files in `estilo` folder with some rules:

- first value is foreground
- second value is background
- third value is text style, and just accept first letter of every style (b: bold, r: reverse, u: underline, i: italic)
- a hyphen or an ommited value will be rendered as `NONE`
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

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `npm run add-template -- group/template-name` on your terminal. 

Example: add go, ruby and fugitive templates

```sh
npm run add-template -- syntax/go syntax/ruby plugins/fugitive
```

See [full list of templates](https://github.com/jacoborus/estilo/tree/master/base) inside `syntax` and `plugins` folders


Estilo can create your lighline theme too. Open lightline template (`your-scheme/estilo/addons/lighline.yml`) and follow the instructions in the comments

Render the color scheme with

```sh
npm run build
```

Your scheme is almost ready, just remember to add `node_modules` to `.gitignore` file before publishing

```sh
echo 'node_modules' >> .gitignore
```

## Useful resources

- `:so $VIMRUNTIME/syntax/hitest.vim`: display all highlight group names with their own color. (See `:help hitest.vim`)
- Trace syntax highlight of the word under the cursor: [vim-HiLinkTrace](https://github.com/gerw/vim-HiLinkTrace)
- Preview colors inline: [vim-css-color](https://github.com/skammer/vim-css-color)
- [yaml language elements](https://en.wikipedia.org/wiki/YAML#Language_elements<Paste>)

<br><br>

---

© 2016 [Jacobo Tabernero](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
