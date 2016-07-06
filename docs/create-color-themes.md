# Create color schemes

Estilo can render a single color scheme or multiple variants, you will need to create a yaml file for every one in `estilo/themes` folder.

A colorscheme template has the following structure:

- name: the colorscheme name
- background: 'dark' or 'light'
- colors: an object containing the colors you are going to use in this variant. Use hex colors, and closest xterm values will be added automatically on render time

Example:

`my-scheme.yml`:

```yaml
name: 'my-scheme'
background: 'dark'
colors:
  sky: '#bdf'
  cherry: '#ffbbcc'
```

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


**Estilo** bundles a bunch of templates besides the base one, visit [Extending colorschemes](extending-colorschemes) to know how to use them.



## Color palette

Color schemes usually share some colors, you can add them to `estilo/palette.yml` file and link them from the color themes by using `@` prefix.

Example:

`estilo/palette.yml`:

```yaml
sky: '#abd9ec'
ocean: '#66afce'
night: '#3c6f85'
```

`estilo/themes/my-dark-theme.yml`

```yaml
name: 'my_dark_theme'
background: 'dark'
colors:
  bg: '@night'
  text: '@sky'
  blue: '@ocean'
```

```yaml
name: 'my_light_theme'
background: 'light'
colors:
  bg: '@sky'
  text: '@night'
  blue: '@ocean'
```


## Render

Render the color schemes from your terminal:

```sh
npm run build
```

