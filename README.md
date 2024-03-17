# Easy toggle sidebars 

New: double left click on leaf tab header to toggle pin. you can toggle it in options.
  
With RightMouseButton or MiddleMouseButton :
- double click to toggle both sidebars
- click and move toward the sideBar you want to toggle
- AutoHide to automatically hide sidebars when clicking on the editor (icon in the ribbon)
- minimal editor width, after it will reduce/close sidebars. (first try to reduce then close) 

- from the ribbon (useful in canvas...): 
  - left dbl click (on empty zone) → toggle left sidebar (the most useful)
  - click + vertical moves or horizontal to the right 
  - right double click → both sidebars

- tab header: double left click on leaf tab header to toggle pin

-from the sidebar:
  - triple left click to go to explorer tab, triple click again to get back to previous tab 

- Command "toggle both sidebars" added.

![demo](fix_right_click.gif)


## developpement
(do "npm start" at first or a npm i)
-   `npm start` = npm install + npm run dev
-   `npm run bacp` = npm run build + git add + commit (prompt to enter message) + push
-   `npm run acp` = git add + commit (prompt to enter message) + push
-   `npm run version` = prompt to ask what version (patch(1), minor(2), major(3) or manual entering a version e.g 1.2.0 ). git add commit push on manifest, package, versions
-   `npm run release`= publish a release on github with the actual version and prompt for the release message (multiline inserting some \n). you can overwrite an existing release (after confirmation)
-   `npm run test` = npm run build and then export main.js manifest & styles.css(optional) to a target vault. so you can directly test your plugin on another vault as with Brat.Prompts are guiding you. overwritting files if exists in target.

-   Function **"Console"** with a capital C. All Console.log/debug are automatically switched OFF on production after a npm run build, and ON on developpement after a npm start or run dev