Estilo
======

Generate full vim colorschemes from yaml templates with node.js


## Install

```sh
npm install -g estilo
```

## Usage

```sh
estilo mytemplate.yaml
# will generate mytemplate.vim
```

## Template format

**estilo** templates has 3 objects:

### colors

`colors` object has shortcuts for hexadecimal color codes that you can use in schemas and hilinks.

Example:

```yaml
colors:
  sky: '#bbddff'
  blood: '#660000'
```


### schemas

`schemas` are shortcuts for highlight definitions you can use in hilinks

Example:

```yaml
schemas:
  blueish: 'sky #bbddff'
  blood: []
```
