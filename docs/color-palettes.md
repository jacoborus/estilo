# Color palettes

Every project needs a minimum of one color palette in
`yourprojet/estilo/palettes` folder. This files are simple _yaml_ list of the
hexadecimal colors you are going to use in your colorschemes and status lines.

You can write as many palettes as you want. This is a simple example of one:

```yaml
lemon: '#ffcc55'
grass: '#99bb00'
ocean: '#66bbff'
blood: '#ee2244'
text: '#eeeeee'
bg: '#282828'
```

## Common palette

All the palettes extend a common palette, its colors should be described under `common` section in the project config file (`estilo.yml`)

Palettes can also link colors from the common one. This is done prependind the name of the color with an `@`

estilo.yml:

```yaml
version: '1.0.0'
name: 'awesomeproject'
license: 'MIT'
colorschemes:
  - name: 'awesome-dark'
    background: 'dark'
    palette: 'darkone'
common:
  white2: '#eeeeee'
```

estilos/palettes/darkone.yml:

```yaml
almonstWhite: '@white2'
green: '#33dd77'
```

---

**Next: [Colorschemes](colorschemes.md)**
