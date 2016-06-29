# Create color schemes

## Define colors

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


## Add more syntax highlighting templates

Estilo bundles a pack of templates for common language syntaxes and plugins, you can add this templates by running `npm run add-template -- folder/template-name` on your terminal.

Example: add go, ruby and fugitive templates

```sh
npm run add-template -- syntax/go syntax/ruby plugins/fugitive
```

See [full list of templates](https://github.com/jacoborus/estilo/tree/master/base) inside `syntax` and `plugins` folders



## Color palette

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


## Render

Render the color schemes from your terminal:

```sh
npm run build
```

