# Drag & Drop APP create in Typescript and separate with ES MODULES

# Instructions for name-space branch:
1. Export all functions from files
3. Import all files  with command - import { var } from 'file.js';
4. At tsconfig.json allow option 
   at modules don't  comment this -  "outFile": "./dist/bundle.js", 
    and change option
    "module": "es2015",  
    remove dist file and compile from start
5. At index.html change  
    <script type="module" src = "dist/app.js" ></script>
6. Modules Import and export Features:
    - export Default
    - import * as SomeName