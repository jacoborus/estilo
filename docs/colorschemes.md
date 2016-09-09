Colorschemes
============


## Define syntax highlighting

Open `estilo/syntax/base.yml` (and then the other templates inside the folder) with vim and fill its definitions with these rules:

- first value is the foreground
- second value is the background
- the third value is for text styles, and you should write just the first letter of every style (b: bold, r: reverse, u: underline, i: italic)
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


### Add more syntax highlighting templates

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `estilo add-template` on your terminal.


See [full list of syntax templates](https://github.com/jacoborus/estilo/tree/master/templates/syntax)

---

**Next: [Airline themes](airline.md)**
