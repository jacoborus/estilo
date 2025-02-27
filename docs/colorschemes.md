# Colorschemes

## Define syntax highlighting

Open `estilos/syntax/base.yml` (and then the other templates inside the folder)
with Vim and fill in its definitions using these rules:

- The first value is for the foreground color (`guifg`)
- The second value is for the background color (`guibg`)
- The third value is for text styles, which can be written either:
  - As full names separated by commas (bold,reverse,underline,italic)
  - Or as single letters (b: **b**old, r: **r**everse, u: **u**nderline, i:
    **i**talic, c: under**c**url)
- The fourth value is for the undercurl color (`guisp`, only for gVim)
- A hyphen (`-`) or an omitted value will be rendered as `NONE`
- A dot (`.`) will prevent rendering of that foreground/background/style

![syntax-help](https://cloud.githubusercontent.com/assets/829859/18372714/f7bb7f44-763e-11e6-93e0-5d240244b108.png)

Examples (template → result):

Omitting values:

```yaml
Comment: "sky"
```

```vim
hi Comment guifg=#bbddff ctermfg=153 guibg=NONE ctermbg=NONE gui=NONE cterm=NONE
```

Using dashes for omitted values:

```yaml
Title: "- cherry bu"
```

```vim
hi Title guifg=NONE ctermfg=NONE guibg=ffbbcc ctermbg=218 gui=bold,underline cterm=bold,underline
```

Using dots to prevent style rendering:

```yaml
Other: ". . ri"
```

```vim
hi Other gui=reverse,italic cterm=reverse,italic
```

Linking to another definition:

```yaml
WarningMsg: "@Title"
```

```vim
hi link WarningMsg Title
```

## Add more syntax highlighting templates

Estilo includes a pack of templates for common language syntaxes and plugins.
You can add them to the `estilos/syntax` folder of your project.

See the
[list of available syntax templates](https://github.com/jacoborus/estilo/tree/master/syntax)

## Add colors to terminal

Open `estilos/terminal.yml` and fill in each value with a color from your
palette.

## Add colorschemes to `estilo.yml`

Open the `estilo.yml` file and add an object for each colorscheme with its
parameters inside the `colorschemes` list. Each colorscheme has 4 parameters:

- name: the name of the colorscheme (should not contain spaces)
- background: 'dark' or 'light' ('dark' by default)
- palette: the name of the color palette (same as the file inside the `palettes`
  folder without the `.yml` extension)
- neovim_legacy_compat: whether to use the old Vim theme as the base when using
  the theme on Neovim ('false' by default)

Example:

```yml
colorschemes:
  - name: "awesome-night"
    background: "dark"
    palette: "night"
  - name: "awesome-day"
    background: "light"
    palette: "day"
```

## Render

From the command line in the project folder:

```sh
estilo render
```

Rendered files will be in the `colors` folder of your project.

---

**Next: [Airline themes](airline.md)**
