# Installation

Create a new npm module and fill its package.json data, this data will be used later

```sh
mkdir mycolors && cd mycolors && npm init
```

Install estilo as a dependency. This step will add some scripts to `package.json` and create `estilo` folder, which contains your templates and colour palette.

```sh
npm install --save estilo
```

Add `node_modules` to `.gitignore` file

```sh
echo 'node_modules' >> .gitignore
```
