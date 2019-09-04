#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)
componentPath="$rootPath"/"$1"
targetDir="$componentPath"/node_modules/libs
libsPath="$rootPath"/libs

mkdir -p $targetDir

IFS=' ' read -r -a neededLibsList <<< "$*"
for libPath in $libsPath/*; do
  libName=$(basename $libPath)
  for element in "${neededLibsList[@]}"; do
    if [[ $element == $libName || $element == "all" ]]; then
      npm run compile --prefix $libPath
      cp $libPath/dist $targetDir/$libName -r
    fi
  done
done
