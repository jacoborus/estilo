# Color palettes

Every project needs a minimum of one color palette in the
`yourproject/estilo/palettes` folder. These files are simple _yaml_ lists of the
hexadecimal colors you are going to use in your colorschemes and status lines.

You can write as many palettes as you want. Here is a simple example:

```yaml
lemon: "#ffcc55"
grass: "#99bb00"
ocean: "#66bbff"
blood: "#ee2244"
text: "#eeeeee"
bg: "#282828"
```

## Common palette

All the palettes extend a common palette, its colors should be described under
`common` section in the project config file (`estilo.yml`)

Palettes can also link colors from the common one. This is done by prepending
the name of the color with an `@`.

estilo.yml:

```yaml
version: "1.0.0"
name: "awesomeproject"
license: "MIT"
colorschemes:
  - name: "awesome-dark"
    background: "dark"
    palette: "darkone"
common:
  white2: "#eeeeee"
```

estilos/palettes/darkone.yml:

```yaml
almostWhite: "@white2"
green: "#33dd77"
```

---

**Next: [Colorschemes](colorschemes.md)**
