#! /bin/bash

# Exit at first error.
set -e

# Command line options using Google Bash style guide:
# http://google-styleguide.googlecode.com/svn/trunk/shell.xml#Case_statement

verboseflag='false'
sourcemapfile='false'
modeflag=''
fileflag=''
cssrenameflag='NONE'

while getopts 'm:f:csv' flag; do
  case "${flag}" in
    c) cssrenameflag='CLOSURE' ;;
    f) fileflag="${OPTARG}" ;;
    m) modeflag="${OPTARG}" ;;
    s) sourcemapflag='true' ;;
    v) verboseflag='true' ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

# In verbose mode, print expanded commands before they are executed.
if [[ $verboseflag == "true" ]]; then
  set -x
fi

# Compile SASS files into css, and keep them outside of the public folder.
sass --force --update scss:css

# Compile output CSS files using the Closure Stylesheets compiler.
rename_map_file=public/js/src/renaming_map.js
cssout=public/css/$fileflag.css
java -jar compilers/closure-stylesheets.jar \
  --pretty-print \
  --output-renaming-map-format $cssrenameflag\
  --output-renaming-map $rename_map_file \
  --rename $cssrenameflag \
  css/*.css \
  > $cssout

# It is necessary to "provide" a namespace in the rename map file to include
# during the compilation process. It is specifically required when using
# --only-closure-dependencies.
map_contents=`cat $rename_map_file`
rm $rename_map_file
echo "goog.provide('silently.CssRenameMapping');" > $rename_map_file
echo "$map_contents" >> $rename_map_file

# Build the dependencies using calcdeps.py.
depsout=public/js/deps.js
python public/js/closure-library/closure/bin/build/depswriter.py \
   --root_with_prefix="public/js/src ../../../src" \
   > $depsout

# Compile soy templates.
soyout='public/js/src/templates.js'
java -jar compilers/SoyToJsSrcCompiler.jar --shouldGenerateJsdoc \
  --shouldProvideRequireSoyNamespaces \
  --codeStyle concat \
  --cssHandlingScheme GOOG \
  --outputPathFormat \
  $soyout \
  soy/*.soy

# Compile the source code.
jsout=public/js/$fileflag.js
jsmapout=public/js/$fileflag.map.js
python public/js/closure-library/closure/bin/build/closurebuilder.py \
  --root=public/js/closure-library \
  --root=public/js/src \
  --namespace="silently.Base" \
  --output_mode=$modeflag \
  --compiler_jar=compilers/compiler.jar \
  --compiler_flags="--externs=externs/externs.js" \
  --compiler_flags="--externs=closure-compiler/contrib/externs/google_youtube_iframe.js" \
  --compiler_flags="--externs=closure-compiler/contrib/externs/facebook_javascript_sdk.js" \
  --compiler_flags="--externs=closure-compiler/contrib/externs/google_analytics_api.js" \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--only_closure_dependencies" \
  --compiler_flags="--define=goog.DEBUG=false" \
  --compiler_flags="--closure_entry_point=silently.Base" \
  --compiler_flags="--create_source_map=$jsmapout" \
  > $jsout

>&2 echo "out: $cssout"
>&2 echo "out: $rename_map_file"
>&2 echo "out: $depsout"
>&2 echo "out: $soyout"
>&2 echo "out: $jsout"
>&2 echo "out: $jsmapout"

if [[ $sourcemapflag == "true" ]]; then
    echo "sourceMappingURL=$fileflag.map;" >> $fileflag
fi
