# maybe-chromium-bug
repro case of bug happening when trying to access property of a big object created with JSON.parse from a .json file

to repro :
- yarn
- yarn start
- click on the button 'Click Me' and search for the file `big.json` located in public\

you should get an exception on chrome, nothing on firefox
