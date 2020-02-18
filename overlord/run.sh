#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)

if [[ "$1" == *dev* ]]
then
    "$rootPath"/"$2" npm run dev
fi

if [[ "$1" == *service* ]]
then
    docker-compose -f "$rootPath"/overlord/docker/"$2"-compose -p ucs up -d
fi

if [[ "$1" == *compile* ]]
then
    docker run -it -v $(git rev-parse --show-toplevel):/home/project compilemanager npm run compile --prefix "$2"
fi
