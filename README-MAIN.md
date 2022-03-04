# Drag & Drop APP create in Typescript and separate with NAMESPACES

# Instructions for name-space branch:
1. Create same namespace for all files example: namespace App{}
2. Export all functions from namespace App{}
3. Import all files in app.ts with command ///<reference path="filename.ts"/>
4. At tsconfig.json allow option 
    "outFile": "./dist/bundle.js", 
    and change option
    "module": "amd",
    remove dist file and compile from start
5. At index.html change  
    <script src = "dist/bundle.js" defer></script>

# Instructions for ES-Modules branch:
1. Export all functions from files
2. Import all files  with command - import { var } from 'file.js';
3. At tsconfig.json allow option 
   at modules don't  comment this -  "outFile": "./dist/bundle.js", 
    and change option
    "module": "es2015",  
    remove dist file and compile from start
4. At index.html change  
    <script type="module" src = "dist/app.js" ></script>
5. Modules Import and export Features:
    - export Default
    - import * as SomeName