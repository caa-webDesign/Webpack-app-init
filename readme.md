# Configurer Webpack pour démarer un projet web

## Conditions préalables

1) nodejs installé sur le système. 
2) nodejs est préinstallé avec npm
  - verifier environement à l'aide de la commande `npm --v`

## Créez le fichier package.json et installez webpack

`cd projectname`

`npm init --yes // crée package.json`


## Puis mettre à jour `package.json` avec les détails suivants

-------------------
```json
{
  "name": "nom du projet",
  "version": "1.0.0",
  "description": "description du projet",
  "main": "index.js",
  "scripts": {
    "prod": "webpack --mode=production --progress",
    "dev": "NODE_ENV=dev webpack --mode=development --watch",
    "clean": "rm -rf build/*"
  },
  "keywords": [ "wordpress", "themes" ],
  "author": "Nom prénom",
  "license": "MIT",
  "private": true,
}
```


## Instalation webpack et babel et quelques autres chargeurs et plugins en tant que dépendances de développement

-----------------

### webpack - modules bundler [groupeur de modules]

Tel un chef d'orchestre **webapck** prend les fichiers de type `js, css, scss, html, img, etc.` et les transforme pour le font end.
Ces assets sont donc transformés à l'aide de modules/plugins selon la configuration fournie par l'utilisateur dans le fichier `webpack.config.js`.

`npm i -D webpack webpack-cli`

### babel - compileur [transcompilateur de javascript]

Babel est ce que l'on appel un *transcompilateur*. Il à pour but principal de convertir et de rendre compatible le code js **ECMAScript 2015+** en une version rerocompatible pour les moteur Javascripts plus enciens.

`npm install -D babel-loader @babel/core @babel/preset-env webpack`

#### Configuration de babel pour ajouter les polifyls dynamiquement  https://babeljs.io/docs/en/babel-preset-env

`npm install -D core-js@3 --save`

- modifier `webpack.config.js` ou `.babelrc` et ajouter :

```json
{
  "presets": [
    [
       "@babel/preset-env",
       {
          "useBuiltIns" : "usage",
          "corejs": { "version": "3.8", "proposals": true }
        }
    ]
 ]
}
```

#### Liste des navigateurs compatibles selon l'environement [dev | production] 

La gestion des navigateurs retrocompatibles se fait dans le fichier `webpack.config.js` ou dans le fichier séparé `.browserslistrc` selon l'exemple de configuration ci dessous :

```
[production]
  IE 10
  > .5% or last 2 versions

[dev]
  last 1 chrome version
  last 1 firefox version

```



------------

## Compiler du css

Lire et écrire des fichiers css dans un fichier séparer

1) `css-loader` convertir le css en simple chaine de caractères

`npm install --save-dev css-loader`

2) `style-loader` exporte et injecte les styles css dans la balise head du DOM

`npm install --save-dev style-loader`

3) `postcss-loader` permet d'ajouter des comportement au traitement du css exmple autoprefixer le css/scss

`npm install --save-dev postcss-loader postcss`

- Autoprefixer

Commande pour connaitre la liste des navigateurs prefixés `npx browserslist`

  - .browserslistrc | configuration du fichier pour autoprefixer la liste des navigateurs
    - https://github.com/browserslist/browserslist#best-practices
    - https://github.com/postcss/autoprefixer#browsers


  `npm install --save-dev autoprefixer`

4) `mini-css-extract-plugin` exporter le css dans un fichiers séparé

`npm install --save-dev mini-css-extract-plugin`

-------------------
### 5 et 6 plus besoin à partir de webpack 5

Utilisé pour l'instant car impossible de choisir convenablement l'emplacement de sortie des fichiers [fonts|images|etc.]

5) Le `file-loader` résout les `import/ require()` va déplacer le fichier dans le dossier output et créer le bon chemin pour y accéder.

`npm install -D file-loader`

6) `url-loader` agit comme le `file-loader`, à un détail prêt. Si le fichier est suffisamment petit il sera directement inclue dans le CSS sous format d'url base64.

`npm install url-loader --save-dev`

------------------

7) `postcss postcss-sort-media-queries` fusion des mediaqueries dans le fichier final

https://www.npmjs.com/package/postcss-sort-media-queries

`npm install postcss-sort-media-queries --save-dev`

- créer fichier `postcss.config.js` contenant le code suivant ou initialiser dans `webpack.config.js`

  1) `postcss.config.js`
  ``` JSON
  module.exports = {
    plugins: [
      require('postcss-sort-media-queries')({
        // sort: 'mobile-first' default value
        sort: function(a, b) {
        // custom sorting function
       }
      }),
      require('autoprefixer')
    ]
  }
  ```

  2) `webpack.config.js`
  ``` JSON
  postcssOptions: {
    plugins: [
      PostcssSortMediaQueries({
          sort: 'mobile-first' // default value
          //sort: 'desktop-first'
          // sort: function(a, b) {
          //     // custom sorting function
          // }
      }),
      autoprefixer()
    ]
  }
  ```

- `npm install terser-webpack-plugin -D`

Après l'installation du plugin le fichier js ne sont plus minifiés en production.

  ``` JSON
  optimization: {
      minimize: isDev() ? false : true,
      minimizer: [
        // minifier le js (plugin webpack par défaut)
        new terserWebpackPlugin({
            parallel: 4,
        }),
      ],
  }
  ```


## Compiler du scss

Apès l'instalation du `css-loader` et du `style-loader` on peux ajouter un loader pour le scss

1) `sass-loader` Charge et compile un fichier SASS / SCSS

`npm install -D sass-loader sass node-sass`

-------------

## Hérachie du projet dossiers/fichiers

Dossier d'entrée *input* **src**
Dossier de sortie *Output* **build**

```
project

├── package.json    => Point d'entrée de webpack
├── .babelrc        => Configuration de babel
├── .browserlistrc  => liste des navigateurs compatibles selon l'environement [dev | production]
├── readme.md
├── index.html
└── src => dossier source
│    ├── index.js    => Point d'entrée des appels de fichiers (imports [main.js | style.scss])
│    └── fonts
│    └── images
│    └── js
│    └── scss
│
└── build  => dossier de sortie (fichiers compilers)
```
## input
```
└── src => dossier source
    ├── index.js    => Point d'entrée des appels de fichiers (imports [main.js | style.scss])
    └── fonts
    └── images
    └── js
     │  ├── main.js
     │  └── components
     │          └── mycomponents.js
     └── scss
     │    └── style.scss
     └── costom
            └── _mycomponents.scss
```
## Output
```
└── build  => dossier de sortie (fichiers compilers)
    └── js
    │    └── script.js
    └── css
    │    └── style.css
    └── fonts
    │   └── [name].[ext]
    └── images
        └── [name].[ext]
```

