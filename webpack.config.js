// recupération des variable d'environement depuis package.jeson
const ENV = process.env.NODE_ENV
console.log('NODE_ENV : ' + ENV)

// const serv = process.env.NODE_ENV === 'serv'
// console.log('NODE_ENV serv : ' + serv)

// absolut path
const path = require('path')
/**
*  css ........
*/ 
//  prefixe du css
const autoprefixer = require('autoprefixer')
// fichier css séparé du dom
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// minification du css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// Fusion des mediaqueries dans le fichier final
const PostcssSortMediaQueries = require('postcss-sort-media-queries')
// Optimisation des images
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

/**
*  JS
*/
// minifier
const terserWebpackPlugin = require('terser-webpack-plugin')

// JS Directory path.
const JS_DIR = path.resolve( __dirname, 'src/js' )
const IMG_DIR = path.resolve( __dirname, 'src/imgages' )
const BUILD_DIR = path.resolve( __dirname, 'build' )


/**
* JS Input entries
*/
let entry = {

   // Point d'entrée JS
   script: "./src/index",

   //main: JS_DIR + '/main.js',
   //single: JS_DIR + '/single.js',
}

/**
* JS Output
*/
const output = {
   path: BUILD_DIR,
   filename: 'js/[name].js',
   
   /**
    * {live server} Fichier de sortie
    * 
    * commande npm run server
    * 
    *    http://localhost:8080/build/
    */
   publicPath: "/build"

   /**
    * A utiliser avec webpack 5 :(
    *    Malheureusement on ne peux pas dessider les dossiers de sortie 
    *    Tester plus tard à nouveau
    */
   // assetModuleFilename: '../images/[name][ext]'
}



// Options css dev | production
let cssOptions = [
   autoprefixer(),
]

let pluginsOptions = [
   // css dans fichier séparé
   new MiniCssExtractPlugin({
      filename : 'css/style.css',
   }),
]

/**
 *  IF ENV === production
 */
if( ENV === "prod" ){

   // polyfill pour IE11 qui résoud les fonction asyn await et fetch
   entry.fetch_polyfill = JS_DIR + '/fetchPolyfill'

   // Options css dev | production
   cssOptions.push(

      /**
       *  Fusion des mediaqueries dans le fichier final
      */
      PostcssSortMediaQueries({
         sort: 'mobile-first' // default value
         //sort: 'desktop-first'
         // sort: function(a, b) {
         //     // custom sorting function
         // }
      }),
   )
   
   /**
    * Optimization des images
    */
   pluginsOptions.push(
      // optimisation des images
      new ImageMinimizerPlugin({

         minimizerOptions: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
               ['gifsicle', { interlaced: true }],
               ['jpegtran', { progressive: true }],
               ['optipng', { optimizationLevel: 5 }],
               [
                  'svgo',
                  {
                     plugins: [
                        {
                           removeViewBox: false,
                        },
                     ],
                  },
               ],
            ],
         },
      })
   )
}



/** 
* Puisque vous devrez peut-être lever l'ambiguïté dans votre webpack.config.js entre les versions de développement et de production, 
* vous pouvez exporter une fonction à partir de la configuration de votre webpack au lieu d'exporter un objet 
* 
* @param {string} environnement env (voir le options d'environnement Documentation CLI pour des exemples de syntaxe. https://webpack.js.org/api/cli/#environment-options) 

* @param argv options map (Ceci décrit les options transmises à webpack, avec des clés telles que output-filename et optimiser-minimiser) 
* @return {{output: *, devtool: string, entry: *, optimization: {minimizer: [*, *]}, plugins: *, module: {rules: *}, externals: {jquery: string}}}
* 
* @see https://webpack.js.org/configuration/configuration-types/#exporting-a-function 
*/
module.exports = ( env, argv ) => {
   
   function isDev(){
      return argv.mode === 'development'
   }
   
   configuration = {
      
      // const entry
      entry: entry,
      
      // const output
      output: output,
      
      
      /** 
      * Un SourceMap complet est émis sous forme de fichier séparé (par exemple main.js.map) 
      * Il ajoute un commentaire de référence au bundle pour que les outils de développement sachent où le trouver. 
      * 
      * https://webpack.js.org/configuration/devtool/
      * 
      * définissez ceci sur false si vous n'en avez pas besoin 
      */
      devtool: isDev() ? 'source-map' : false, 
      //devtool: 'inline-source-map',


      /**
      * SERVER WEBPACK
      */
      // resolution Hot reload 
      target: ENV === "serv" ? "web" : false,
      devServer: {
         
         // Path des fichiers de distribution exemple './public'
         //contentBase: path.join(__dirname, '/'),
         compress: true,
         port: 8080,
         
         // reload auto
         // enable HMR
         //hot: true,

         overlay: true,
         compress: true,

         // CORS
         headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
         }
      },

      // serveur webpack
      mode: isDev() ? 'development': 'production',

      /**
       * end server
       */


      plugins : pluginsOptions,
      /*
      plugins: [

        // css dans fichier séparé
         new MiniCssExtractPlugin({
            filename : 'css/style.css',
         }),


         // optimisation des images
         new ImageMinimizerPlugin({
            minimizerOptions: {
               // Lossless optimization with custom option
               // Feel free to experiment with options for better result for you
               plugins: [
                  ['gifsicle', { interlaced: true }],
                  ['jpegtran', { progressive: true }],
                  ['optipng', { optimizationLevel: 5 }],
                  [
                     'svgo',
                     {
                        plugins: [
                           {
                              removeViewBox: false,
                           },
                        ],
                     },
                  ],
               ],
            },
         }),


      ], // end plugins
      */
      
      module: {
         rules: [
            
            // JS RULES
            {
               test: /\.(js|jsx)$/,
               exclude: /(node_modules|bower_components)/,
               loader: 'babel-loader',
               
               // options/presest déplacée dans .babelrc
               // options/targets déplacée dans .babelrc
               /* options: {
                  presets: [
                     [
                        '@babel/preset-env',
                        {
                           // Ajouter les polifyls dynamiquement  https://babeljs.io/docs/en/babel-preset-env
                           useBuiltIns : 'usage',
                           corejs: { version: "3.8", proposals: true },

                           targets: {
                              browsers: isDev() ? ["chrome 74, last 1 chrome version, last 1 firefox version"] : ['IE 11'],

                           },
                           
                        },
                     ]

                  ], 
                  
               }
               */
            }, // end JS

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
                  "css-loader", //    Résoud les imports et les urls
                  {
                     loader : "postcss-loader",
                     options: {
                        postcssOptions: {

                           plugins: cssOptions
                        }
                     }
                  },
                  "sass-loader", // Compiles Sass to CSS
               ],

            },


            // file loader
            {
               test: /\.(png|svg|jpe?g|gif)$/i,
               exclude: /fonts/,
               dependency: { not: ['url'] },
               use: [
                  {
                     loader: "file-loader", 
                     options: {
                        name: '[name].[ext]',
                        outputPath: "images",
                        publicPath : '../images'
                     }
                  }
               ],
               type: 'javascript/auto'
            },
            
            {
               test: /\.(eot|woff|woff2|ttf)$/,
               exclude: /images/,
               dependency: { not: ['url'] },
               use: [
                  {
                     loader: "file-loader", 
                     options: {
                        name: '[name].[ext]',
                        outputPath: "fonts",
                        publicPath : '../fonts'
                     }
                  }
               ],
               type: 'javascript/auto'
            },
            // ASSETS DEFAULT WEBPACK 5 DO NOT USE BECAUSE IT IS IMPOSSIBLE TO EXPORT THE ASSETS IN DIFFERENT FOLDERS
            // {
            //    test: /\.(png|jpe?g|gif|svg)$/i,
            //    /**
            //     * The `type` setting replaces the need for "url-loader"
            //     * and "file-loader" in Webpack 5.
            //     *
            //     * setting `type` to "asset" will automatically pick between
            //     * outputing images to a file, or inlining them in the bundle as base64
            //     * with a default max inline size of 8kb
            //     */
            //    // type: "asset",
            //    type: 'asset/resource'

            //    /**
            //     * If you want to inline larger images, you can set
            //     * a custom `maxSize` for inline like so:
            //     */
            //    // parser: {
            //    //   dataUrlCondition: {
            //    //     maxSize: 30 * 1024,
            //    //   },
            //    // },
            // },
            // {
            //    test: /\.(woff|woff2|eot|ttf|otf)$/i,
            //    type: 'asset/resource',
            // },
            
         ],

         
      }, // AND MODULES


      optimization: {

         minimize: isDev() ? false : true,

         minimizer: [

            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,

            // CssMinimizerPlugin  https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
            new CssMinimizerPlugin({
               parallel: 4,
               // sourceMap: true,
            }),

            // minifier le js (plugin webpack par défaut)
            // new terserWebpackPlugin({
            //    parallel: 4,
            // }),
         ],
      }
      
   }
   
   
   return configuration
}