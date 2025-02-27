# Airline themes

## Creating styles

Before creating an airline theme, you need at least one color palette in the
`estilos/palettes` directory. Then create your airline style as a `.yml` file
inside the `estilos/airline` folder, and paste this content:

```yml
normal1: ""
normal2: ""
normal3: ""
inactive1: ""
inactive2: ""
inactive3: ""
insert1: ""
insert2: ""
insert3: ""
replace1: ""
replace2: ""
replace3: ""
visual1: ""
visual2: ""
visual3: ""
ctrlp1: "" # optional
ctrlp2: "" # optional
ctrlp3: "" # optional
```

Every property in the template is composed of a name and a number, which
represent how a part of the status line will look in a particular Vim mode. The
first line defines the style of part 1 of the bar in normal mode, and so on.

Part 1 represents the first and last blocks of the status bar, part 2 the second
and fourth blocks, and part 3 is for the center block (the third one).

![airline blocks](https://cloud.githubusercontent.com/assets/829859/16402004/55f3682c-3ce9-11e6-8bd9-eaafbaaccb2e.png)

Go to the first definition and fill in its value inside the quotes (`''`). Write
the foreground and background color names separated by a space (these should be
in your color template). It should look something like this:

```yml
normal1: "myblue mydark"
```

## Add theme to `estilo.yml`

Open the `estilo.yml` file and add an object for each theme with its parameters
inside the `airline` list. Each theme has 3 parameters:

- name: the name of the airline theme (should not have spaces)
- palette: the name of the color palette (same as the file inside the `palettes`
  folder without the `.yml` extension)
- style: same as the file inside the `airline` folder without the `.yml`
  extension

Example:

```yml
airline:
  - name: "awesome-night"
    palette: "awesome"
    style: "night"
  - name: "awesome-day"
    palette: "awesome"
    style: "day"
```

## Render

From the command line in the project folder:

```sh
estilo render
```

Rendered files will be in the `plugins` folder of your project.

## Activating the theme

Open your Vim config file and add these lines:

```vim
let g:PKG_NAME_airline = 1
let g:airline_theme = 'MY_THEME_NAME'
```

Replace `PKG_NAME` with the name of your project (the name from `estilo.yml`),
and `MY_THEME_NAME` with the name of the Airline theme you want to activate.

Remember to add instructions to the `README` of your project before publishing
it.
