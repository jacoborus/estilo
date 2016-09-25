Colorschemes
============


## Define syntax highlighting

Open `estilo/syntax/base.yml` (and then the other templates inside the folder) with vim and fill its definitions with these rules:

- first value is the foreground (`guifg`)
- second value is the background (`guibg`)
- the third value is for text styles, and you should write just the key letter of every style (b: **b**old, r: **r**everse, u: **u**nderline, i: **i**talic, c: under**c**url)
- fourth value is the undercurl color (`guisp`, only for gVim)
- a hyphen (`-`) or an ommited value will be rendered as `NONE`
- a dot (`.`) will not render this foreground/background/style

![syntax-help](https://cloud.githubusercontent.com/assets/829859/18372714/f7bb7f44-763e-11e6-93e0-5d240244b108.png)

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


## Add more syntax highlighting templates

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `estilo add-syntax` on your terminal.


See [list of available syntax templates](https://github.com/jacoborus/estilo/tree/master/templates/syntax)


## Add colors to neovim terminal

Open `estilo/addons/nvim-term.yml` and fill each value with a color from your palette.


## Add colorschemes to `estilo.yml`

Open `estilo.yml` file and add an object for each colorcheme with its parameters inside `colorschemes` list. Every one has 3 parameters:

- name: the name of the colorscheme (should have not spaces)
- background: 'dark' or 'light' ('dark' by default)
- palette: the name of the color palette. It's the same as the file inside `palettes` folder without the `.yml` extension

Example:

```yml
colorschemes:
  - name: 'awesome-night'
    background: 'dark'
    palette: 'night'
  - name: 'awesome-day'
    background: 'light'
    palette: 'day'
```


## Render

With the command line in the project folder:

```sh
estilo render
```

Rendered files are in `colors` folder of your project


---

**Next: [Airline themes](airline.md)**
