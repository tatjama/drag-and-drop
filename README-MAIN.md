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