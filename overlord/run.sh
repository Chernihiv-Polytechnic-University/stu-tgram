#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)

if [[ "$1" == *build* ]]
then
    docker-compose -f "$rootPath"/overlord/docker/"$1" -p ucs up --build
else
    docker-compose -f "$rootPath"/overlord/docker/"$1" -p ucs up -d
fi

