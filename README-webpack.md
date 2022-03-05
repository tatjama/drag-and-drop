# Drag & Drop APP create in Typescript and separate with ES MODULES

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
6. Remove all .js extensions in all imports 
7. To use webpack in package.json add the following
    "start": "webpack-dev-server",
    "build": "webpack"
     in "scripts"
8. At index.html change  
    <script type="module" src = "dist/bundle.js" ></script>
9. Modules Import and export Features:
    - export Default
    - import * as SomeName

# Dependencies
1. webpack 5.53.0
2. webpack-dev-server
3. webpack-cli
4. typescript
5. ts-loader