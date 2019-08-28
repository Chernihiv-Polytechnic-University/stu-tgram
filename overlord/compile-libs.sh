#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)
componentPath="$rootPath"/"$1"
targetDir="$componentPath"/node_modules/libs
libsPath="$rootPath"/libs

mkdir $targetDir

for libPath in $libsPath/*; do
  npm run compile --prefix $libPath
  libName=$(basename $libPath)
  cp $libPath/dist $targetDir/$libName -r
done
