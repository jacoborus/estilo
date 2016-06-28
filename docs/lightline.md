# Lightline themes

Before creating the Lightline theme you need at least one color template in `estilo/themes` folder. Then proceed to add the blank template from the command line:

```sh
npm run add-template -- addons/lightline
```

This command will create `lightline.yml` file in `estilo/addons` directory of your project. Open it, it will look like this:

```yml
" TODO
```

Every property in the template is composed by a name and a number, they represents how a part of the status line will look in a particular vim mode. That means the first line defines the style of the part 1 of the bar in normal mode.

Part 1 represents the first block of the status bar, part 2 the second and so on

**TODO:** add screenshot

Go to the first definition and fill its value inside the quotes (`''`), write the foreground and the background color names separated by a space (these ones should be in your color template). It should look something like this:

```yml
normal1: 'myblue mydark'
```

Then set the rest of the properties. When you are done, you can render your color scheme as usually (`npm run build`), and **Estilo** will create so many lightline themes as color templates you created in `estilo/themes`.

### Activating the theme

Open your vim config file and add the next lines:

```vim
" enable lighline theme
let g:PKG_NAME_lightline = 1
" set lighline theme (in yor lightline config)
let g:lightline = { 'colorscheme': 'MY_COLOR_SCHEME_NAME' }
```

Replace `PKG_NAME` with the name of your package (the name from `package.json`), and `MY_COLOR_SCHEME_NAME` with the name of the colorscheme you want to activate.

Remember to add instructions to the `README` of your project before publishing it.
