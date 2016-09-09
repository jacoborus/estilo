# Lightline themes

## Creating styles

Before creating any lightline theme you need at least one color palette in `estilo/palettes` folder. Then proceed to add the blank lightline template from the command line (use your own `STYLE_NAME`s):

```sh
estilo add-lightline STYLE_NAME
```

This command will create `STYLE_NAME.yml` file in `estilo/lightline` directory of your project. Open it, it will look like this:

```yml
normal1: ''
normal2: ''
normal3: ''
normal4: ''
normal5: ''
normalError: ''
normalWarning: ''
inactive1: ''
inactive2: ''
inactive3: ''
inactive4: ''
inactive5: ''
insert1: ''
insert2: ''
insert3: ''
insert4: ''
insert5: ''
replace1: ''
replace2: ''
replace3: ''
replace4: ''
replace5: ''
visual1: ''
visual2: ''
visual3: ''
visual4: ''
visual5: ''
tablineLeft: ''
tablineSelected: ''
tablineMiddle: ''
tablineRight: ''
```

Every property in the template is composed by a name and a number, they represents how a part of the status line will look in a particular vim mode. That means the first line defines the style of the part 1 of the bar in normal mode.

Part 1 represents the first block of the status bar, part 2 the second and so on. The `normalError` and `normalWarning` properties affect to block3 in those states.

![lightline blocks](https://cloud.githubusercontent.com/assets/829859/16469975/033f95f8-3e54-11e6-8ac5-0bd398d64d47.png)

The last four lines define the tabline style:

![lightline tabs blocks](https://cloud.githubusercontent.com/assets/829859/16470183/02cd2f9e-3e55-11e6-9889-bd6123f8bf1e.png)

Go to the first definition and fill its value inside the quotes (`''`), write the foreground and the background color names separated by a space (these ones should be in your color template). It should look something like this:

```yml
normal1: 'myblue mydark'
```


## Add theme to `estilo.yml`

Open `estilo.yml` file and add an object for each theme with its parameters inside `lightline` list. Every one has 3 parameters:

- name: the name of the lightline theme. Should have not spaces or dashes (`-`)
- palette: the name of the color palette. It's the same as the file inside `palettes` folder without the `.yml` extension
- style: It's the same as the file inside `lightline` folder without the `.yml` extension

Example:

```yml
lightline:
  - name: 'awesome-night'
    palette: 'awesome'
    style: 'night'
  - name: 'awesome-day'
    palette: 'awesome'
    style: 'day'
```


## Render

With the command line in the project folder:

```sh
estilo render
```

Rendered files are in `plugins` folder of your project


## Activating the theme

Open your vim config file and add the next lines:

```vim
" enable lighline theme
let g:PKG_NAME_lightline = 1
" set lighline theme (in yor lightline config)
let g:lightline = { 'colorscheme': 'MY_THEME_NAME' }
```

Replace `PKG_NAME` with the name of your project (the name from `estilo.yml`), and `MY_THEME_NAME` with the name of the Lightline theme you want to activate.

Remember to add instructions to the `README` of your project before publishing it.


---

**Next: [Command line interface overview](cli.md)**
