# Drag & Drop APP create in Typescript and separate with ES MODULES

[Official Webpack Docs:](https://webpack.js.org/)
# Instructions:
1. Export all functions from files
3. Import all files  with command - import { var } from 'file.js';
4. At tsconfig.json allow option 
   at modules don't  comment this -  "outFile": "./dist/bundle.js", 
    and change option
    "target": "es5", or "target": "es6",
    "module": "es2015",  
    "outDir": "./dist",  
    "sourceMap": true, 
    comment:
    "rootDir": "./src",     
    remove dist file and compile from start
5. Create webpack.config.js 
    and configure
    modules.exports - to export in node.js environment
    - mode: 'development',
    - output.filename : "bundle.js" can be "bundle.[contenthash].js" - dynamic create unique file for every build
    - output.path -has to be absolute path
    - output.publicPath: 'dist'
    - module  - for compilation
    - resolve - for resolving compilation
    - devtool: "inline-source-map",
    add on top of page 
    const path = require('path'); 
6. Remove all .js extensions in all imports 
7. To use webpack in package.json add the following
    - DEVELOPMENT
    "start": "webpack-dev-server",
    "build": "webpack"
     in "scripts"
     - PRODUCTION
     change
     "build": "webpack --config webpack.config.prod.js"
8. At index.html change  
    <script type="module" src = "dist/bundle.js" ></script>
9. PRODUCTION mode:
    - Create webpack.config.prod.js file
    - Copy all webpack.config.js content
    - Change:
    mode: 'production',
    devtool: false,
    - Remove:
    publicPath: '/dist/',
    - Add:
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]
    on top of page
    const CleanPlugin = require('clean-webpack-plugin');    
9. Modules Import and export Features:
    - export Default
    - import * as SomeName

# Dependencies
1. webpack 5.53.0
2. webpack-dev-server
3. webpack-cli
4. typescript
5. ts-loader
PRODUCTION:
6. clean-webpack-plugin
    for cleaning dist folder, and serve always newest version