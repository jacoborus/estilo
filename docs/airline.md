# Airline themes

Before creating the airline theme you need at least one color template in `estilo/themes` folder. Then proceed to add the blank airline template from the command line:

```sh
npm run add-template -- addons/airline
```

This command will create `airline.yml` file in `estilo/addons` directory of your project. Open it, it will look like this:

```yml
normal1: ''
normal2: ''
normal3: ''
inactive1: ''
inactive2: ''
inactive3: ''
insert1: ''
insert2: ''
insert3: ''
replace1: ''
replace2: ''
replace3: ''
visual1: ''
visual2: ''
visual3: ''
```

Every property in the template is composed by a name and a number, they represents how a part of the status line will look in a particular vim mode. That means the first line defines the style of the part 1 of the bar in normal mode, and so on.

Part 1 represents the first and the last block of the status bar, part 2 the second and fourth, and the part 3 is for the center block (the third one).

![airline blocks](https://cloud.githubusercontent.com/assets/829859/16402004/55f3682c-3ce9-11e6-8bd9-eaafbaaccb2e.png)

Go to the first definition and fill its value inside the quotes (`''`), write the foreground and the background color names separated by a space (these ones should be in your color template). It should look something like this:

```yml
normal1: 'myblue mydark'
```

Then set the rest of the properties. When you are done, you can render your color scheme as usually (`npm run build`), and **Estilo** will create so many airline themes as color templates you created in `estilo/themes`.

## Activating the theme

Open your vim config file and add the next lines:

```vim
let g:PKG_NAME_airline = 1
let g:airline_theme = 'MY_COLOR_SCHEME_NAME'
```

Replace `PKG_NAME` with the name of your package (the name from `package.json`), and `MY_COLOR_SCHEME_NAME` with the name of the colorscheme you want to activate.

Remember to add instructions to the `README` of your project before you publish it.
