Estilo
======

**Estilo** is a tool for creating, improving and maintaining colorschemes for vim and its ecosystem.

Generate full vim colorschemes from yaml templates with node.js

Estilo is a vim color scheme preprocessor

## Usage

### tl:dr

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
- ommited values will be rendered as `NONE`
- a hyphen means to ommit the value

Example:

```yaml
Comment: 'sky'
Title: '- cherry bu'
WarningMsg: 'link Title'
```

Will render:

```vim
hi Comment guifg=#bbddff ctermfg=153 guibg=NONE ctermbg=NONE gui=NONE cterm=NONE
hi Title guifg=NONE ctermfg=NONE guibg=ffbbcc ctermbg=218 gui=bold,underline cterm=bold,underline
hi link WarningMsg Title
```

Render the color scheme with

```sh
npm run build
```

Your scheme is almost ready, just remember to add `node_modules` to `.gitignore` file before publishing

```sh
echo 'node_modules' >> .gitignore
```



<br><br>

---

© 2016 [Jacobo Tabernero](https://github.com/jacoborus) - Released under [MIT License](https://raw.github.com/jacoborus/estilo/master/LICENSE)
