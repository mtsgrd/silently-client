silently-client
===============

This sample application is implements ordr.in's API for ordering take-out food.

Using this code requires a backend application: [silently-backend](https://github.com/mtsgrd/silently-backend). The best way of running the two together is to symlink the public folder into the static path of the frontend flask app.

**Compiling**
```
$> ./build.sh -s -m script -f dev
...
out: public/css/dev.css
out: public/js/src/renaming_map.js
out: public/js/deps.js
out: public/js/src/templates.js
out: public/js/dev.js
out: public/js/dev.map.js
```
*Flags*

* css renaming: -c [**closure** | NONE]
* file: -f [basename of output files]
* js mode: -m [compiled | script]
* source map: -s (bool)
* verbose: -v (bool)
