<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WEBPACK PROJECT</title>

    <link rel="stylesheet" href="http://localhost:8080/build/css/style.css">

</head>
<body>

    <h1>Projet webpack</h1>

    <script>
        // First we transpile code above:  https://babeljs.io/repl/  
        /* After that we have to include 3 polyfills but before code is executed. So beside annoying code regenerator 
            which is required for async await to work, we also need promise and fetch polyfill. 
                https://cdn.jsdelivr.net/npm/babel-regenerator-runtime@6.5.0/runtime.js:
                https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js: 
                https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js:
            That's all it's needed  :) 
        */
    </script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/babel-regenerator-runtime@6.5.0/runtime.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"></script>


    <script src="http://localhost:8080/build/js/script.js"></script>
    
</body>
</html>