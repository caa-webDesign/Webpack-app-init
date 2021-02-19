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
    "server": "NODE_ENV=dev webpack serve --mode=development --hot",
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

Site qui explique super bien le fontionnement de Babel : https://blogs.infinitesquare.com/posts/web/javascript-babel

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

- Fichier `.browserlistrc`
```
[production]
  IE 10
  > .5% or last 2 versions

[dev]
  last 1 chrome version
  last 1 firefox version

```

- Fichier `webpack.config.js`(exemple sans les fichiers intermédiaires `.babelrc, .browserlistrc`)

``` JSON
rules: [        
  // JS RULES
  {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      
      /*
          options/presest déplacée dans .babelrc
          options/targets déplacée dans .browserlistrc
      */
      options: {
        presets: [
            [
              '@babel/preset-env',
              {
                  // Ajouter les polifyls dynamiquement  https://babeljs.io/docs/en/babel-preset-env
                  useBuiltIns : 'usage',
                  corejs: { version: "3.8", proposals: true },
                  /* 
                  "targets": {
                    "browsers": [{
                      "android": "4.2",
                      "chrome": "41",
                      "edge": "17",
                      "firefox": "52",
                      "ie": "11",
                      "ios": "9.3",
                      "opera": "56",
                      "safari": "10.1"
                    }] 
                  } 
                  */
                  targets: {
                    browsers: isDev() ? ["chrome 74, last 1 chrome version, last 1 firefox version"] : ['IE 11']
                  },
              },
            ]
        ], 
        
      } // end JS rules

  }, // end JS
]
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

7) `postcss-sort-media-queries` fusion des mediaqueries dans le fichier final

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

8) `css-minimizer-webpack-plugin` minifier et optimiser le css

`npm install css-minimizer-webpack-plugin --save-dev`


9) Resoudre le problème après l'installation du/des plugin les fichiers js ne sont plus minifiés en production.

`npm install terser-webpack-plugin -D`

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

Script situé dans le fichier `package.json`

``` JSON
 "scripts": {
    "start": "SERVE=true webpack serve"
  },
```

#### Exemple de code du fichier webpack.config.js pour la sortie du SCSS en CSS

```JSON
module: {
  ules: [

    // css | scss rules
    {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            // css  dans un fichier séparé
            loader:  MiniCssExtractPlugin.loader,
            options: {
              // This is required for asset imports in CSS, such as url()
              publicPath: ''
            }
          },
          "css-loader", //  Résoud les imports et les urls
          {
            loader : "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  //Fusion des mediaqueries dans le fichier final voir [7]
                  require('postcss-sort-media-queries')({
                    sort: 'mobile-first' // default value
                    //sort: 'desktop-first'
                  }),
                  // Préfix du css selon le fichier de configuraion [.browserslistrc]
                  autoprefixer()
                ]
              }
            }
          },
          "sass-loader", // Compiles Sass en CSS voir : [###Compiler du scss]
        ],
    },
  ]
}
```


## Dev server

`webpack-dev-server` offre un serveur Web et la possibilité d'utiliser le rechargement en direct. 


1) `npm install --save-dev webpack-dev-server`

- Résoudre ERREUR **No Xcode or CLT version detected!**

- https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d

`xcode-select --install`

2) complèter le fichier `webpack.config.js`
  - La résolution du ***hot reload*** passe par la déclaration de la variable target https://www.youtube.com/watch?v=lNkVndKCum8

  - Lors du démarage du serveur à l'aide de la ligne de commande `npm run server`, les parametres de localisation des fichiers sont transmis dans la console. Exemple simple (sans configuration des fichiers de sortie.

```
 ｢wds｣: Project is running at http://localhost:8080/
 ｢wds｣: webpack output is served from /build
```
  - si le fichier de sortie n'est pas le même que celui attendu, modifier la variable `contentBase`

``` JSON
/*
* SERVER WEBPACK
*/
// resolution Hot reload et compilation vebpack mode production
target: ENV === "serv" ? "web" : false,
devServer: {
    // Path des fichiers de distribution exemple './public'
    //contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 8080,
},
// serveur webpack
mode: 'development',
```

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
