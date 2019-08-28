#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)

if [[ "$1" == *dev* ]]
then
    "$rootPath"/"$2" npm run dev
fi
